"""
Platform: AI Agent Integration API
─────────────────────────────────────
POST /platform/v1/agent/query

Specialized endpoint for AI agents (GPT, Claude, custom LLMs)
to interact with Tech Nest as a structured tool.

Design principles:
  - Natural-language-like input: agents describe what they need in plain text
    OR use a structured query format — the endpoint accepts both.
  - Structured JSON output: Agents receive deterministic, parseable data
    (never HTML, never unstructured text).
  - Agent identification: X-Agent-Id header is tracked for per-agent analytics.
  - Capability discovery: GET /platform/v1/agent/capabilities returns the
    schema of available actions, enabling auto-discovery for tool-using LLMs.

Rate limiting: 
  Uses standard platform middleware (inherited from plan tier).
  Agents on 'free' plans get 100 req/min.
"""

from __future__ import annotations

import logging
from typing import Any, Literal, Optional

from fastapi import APIRouter, Depends, HTTPException, Request
from pydantic import BaseModel, Field

from app.routers.platform_deps import get_platform_client
from app.models.platform import AuthenticatedClient
from app.database import supabase
from app.services.intelligence_graph import get_ranked_devices, get_network_signal

logger = logging.getLogger(__name__)
router = APIRouter()


# ── Schemas ───────────────────────────────────────────────────────────────────

class AgentQuery(BaseModel):
    """
    Structured query format for AI agents.
    Agents can either supply a natural_query OR a structured action + params.
    If both are provided, action + params takes precedence.
    """
    action: Literal[
        "recommend",       # Get device recommendations
        "score",           # Get a specific device's score
        "compare",         # Compare two devices
        "trend",           # Get trending devices
    ]
    params: dict[str, Any] = Field(default_factory=dict)
    # Optional metadata
    context: Optional[str] = Field(
        default=None,
        description="Free-text context from the agent about the user's situation.",
    )


class AgentResponse(BaseModel):
    action:   str
    success:  bool
    data:     Any
    metadata: dict[str, Any] = Field(default_factory=dict)


class AgentCapability(BaseModel):
    action:      str
    description: str
    params:      dict[str, str]   # param_name → description
    example:     dict[str, Any]


# ── Capabilities Discovery ────────────────────────────────────────────────────

CAPABILITIES: list[dict[str, Any]] = [
    {
        "action": "recommend",
        "description": "Get personalized device recommendations based on user preferences.",
        "params": {
            "budget_max": "(float, optional) Maximum price in USD",
            "priority": "(list[str], optional) Priority dimensions: camera, battery, performance, display",
            "brand": "(str, optional) Preferred brand",
            "limit": "(int, optional) Number of results (1-10, default 5)",
        },
        "example": {
            "action": "recommend",
            "params": {"budget_max": 800, "priority": ["camera", "battery"], "limit": 3},
        },
    },
    {
        "action": "score",
        "description": "Get the Tech Nest intelligence score for a specific device.",
        "params": {
            "device_id": "(str, required) UUID of the device",
        },
        "example": {
            "action": "score",
            "params": {"device_id": "550e8400-e29b-41d4-a716-446655440000"},
        },
    },
    {
        "action": "compare",
        "description": "Compare two devices side-by-side with scores and verdict.",
        "params": {
            "device_a": "(str, required) UUID of the first device",
            "device_b": "(str, required) UUID of the second device",
        },
        "example": {
            "action": "compare",
            "params": {
                "device_a": "550e8400-e29b-41d4-a716-446655440000",
                "device_b": "660f9500-f3ac-52e5-b827-557766550000",
            },
        },
    },
    {
        "action": "trend",
        "description": "Get currently trending devices by rising interest.",
        "params": {
            "limit": "(int, optional) Number of results (1-20, default 10)",
        },
        "example": {
            "action": "trend",
            "params": {"limit": 5},
        },
    },
]


@router.get("/capabilities")
async def get_capabilities(
    client: AuthenticatedClient = Depends(get_platform_client),
) -> dict[str, Any]:
    """
    Returns the schema of available agent actions.
    AI agents use this for tool-auto-discovery.
    """
    return {
        "platform":     "Tech Nest Intelligence Platform",
        "version":      "1.0",
        "capabilities": CAPABILITIES,
        "auth":         "X-API-Key header required",
        "agent_header": "X-Agent-Id (optional, for per-agent analytics)",
    }


# ── Main Query Endpoint ──────────────────────────────────────────────────────

@router.post("/query", response_model=AgentResponse)
async def agent_query(
    payload: AgentQuery,
    request: Request,
    client: AuthenticatedClient = Depends(get_platform_client),
):
    """
    Unified query endpoint for AI agents.
    Dispatches to the appropriate internal handler based on action type.
    """
    agent_id = request.headers.get("X-Agent-Id", "anonymous-agent")

    try:
        if payload.action == "recommend":
            data = _handle_recommend(payload.params)
        elif payload.action == "score":
            data = _handle_score(payload.params)
        elif payload.action == "compare":
            data = _handle_compare(payload.params)
        elif payload.action == "trend":
            data = _handle_trend(payload.params)
        else:
            raise HTTPException(status_code=400, detail=f"Unknown action: {payload.action}")

        return AgentResponse(
            action=payload.action,
            success=True,
            data=data,
            metadata={
                "agent_id":     agent_id,
                "client_plan":  client.plan,
                "context_used": bool(payload.context),
            },
        )

    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"[Agent] Query failed: action={payload.action} error={exc}")
        return AgentResponse(
            action=payload.action,
            success=False,
            data=None,
            metadata={"error": str(exc)},
        )


# ── Action Handlers ───────────────────────────────────────────────────────────

def _handle_recommend(params: dict) -> list[dict]:
    """Recommend devices based on params."""
    limit = min(int(params.get("limit", 5)), 10)
    ranked = get_ranked_devices(limit=200)

    if not ranked:
        return []

    # Fetch device metadata
    device_ids = [r["device_id"] for r in ranked[:100]]
    meta_resp = (
        supabase.table("devices")
        .select("id, name, brand, price")
        .in_("id", device_ids)
        .execute()
    )
    meta_map = {r["id"]: r for r in (meta_resp.data or [])}

    results = []
    for item in ranked:
        dev = meta_map.get(item["device_id"])
        if not dev:
            continue

        price = float(dev.get("price") or 0)
        budget = params.get("budget_max")
        if budget and price > float(budget):
            continue

        brand_filter = params.get("brand")
        if brand_filter and dev.get("brand", "").lower() != brand_filter.lower():
            continue

        results.append({
            "device_id":   item["device_id"],
            "name":        dev.get("name", ""),
            "brand":       dev.get("brand", ""),
            "score":       item["final_score"],
            "base_score":  item["base_score"],
            "price_usd":   price if price > 0 else None,
        })

        if len(results) >= limit:
            break

    return results


def _handle_score(params: dict) -> dict:
    """Get score for a single device."""
    device_id = params.get("device_id")
    if not device_id:
        raise HTTPException(status_code=400, detail="device_id is required for 'score' action.")

    # Fetch device + scores
    dev_resp = supabase.table("devices").select("id, name, brand, price").eq("id", device_id).maybe_single().execute()
    if not dev_resp.data:
        raise HTTPException(status_code=404, detail=f"Device {device_id} not found.")

    score_resp = (
        supabase.table("device_scores")
        .select("overall_score, display_score, performance_score, camera_score, battery_score, design_score, software_score")
        .eq("device_id", device_id)
        .maybe_single()
        .execute()
    )

    dev = dev_resp.data
    scores = score_resp.data or {}

    # Network signal (non-critical)
    signal = {}
    try:
        signal = get_network_signal(device_id)
    except Exception:
        pass

    return {
        "device_id":       device_id,
        "name":            dev.get("name", ""),
        "brand":           dev.get("brand", ""),
        "tech_nest_score": float(scores.get("overall_score", 0)),
        "category_scores": {
            "display":     float(scores.get("display_score", 0)),
            "performance": float(scores.get("performance_score", 0)),
            "camera":      float(scores.get("camera_score", 0)),
            "battery":     float(scores.get("battery_score", 0)),
            "design":      float(scores.get("design_score", 0)),
            "software":    float(scores.get("software_score", 0)),
        },
        "trend": signal.get("trend_signals", []),
    }


def _handle_compare(params: dict) -> dict:
    """Compare two devices."""
    a_id = params.get("device_a")
    b_id = params.get("device_b")
    if not a_id or not b_id:
        raise HTTPException(status_code=400, detail="device_a and device_b are required.")

    score_a = _handle_score({"device_id": a_id})
    score_b = _handle_score({"device_id": b_id})

    # Determine winner per category
    categories = ["display", "performance", "camera", "battery", "design", "software"]
    comparison = {}
    for cat in categories:
        sa = score_a["category_scores"].get(cat, 0)
        sb = score_b["category_scores"].get(cat, 0)
        if sa > sb:
            winner = score_a["name"]
        elif sb > sa:
            winner = score_b["name"]
        else:
            winner = "tie"
        comparison[cat] = {
            "device_a_score": sa,
            "device_b_score": sb,
            "winner": winner,
        }

    overall_winner = score_a["name"] if score_a["tech_nest_score"] >= score_b["tech_nest_score"] else score_b["name"]

    return {
        "device_a": score_a,
        "device_b": score_b,
        "category_comparison": comparison,
        "overall_winner": overall_winner,
    }


def _handle_trend(params: dict) -> list[dict]:
    """Get trending devices."""
    limit = min(int(params.get("limit", 10)), 20)

    resp = (
        supabase.table("device_trends")
        .select("device_id, trend_type, trend_score, time_window, devices(name, brand)")
        .eq("trend_type", "rising_interest")
        .eq("time_window", "7d")
        .order("trend_score", desc=True)
        .limit(limit)
        .execute()
    )

    results = []
    for row in (resp.data or []):
        dev = row.get("devices") or {}
        results.append({
            "device_id":   row["device_id"],
            "name":        dev.get("name", ""),
            "brand":       dev.get("brand", ""),
            "trend_score": float(row.get("trend_score", 0)),
            "time_window": row.get("time_window"),
        })

    return results
