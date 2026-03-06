"""
Platform: Public Decision API
───────────────────────────────
POST /platform/v1/decision/recommend

Allows external developers and AI agents to request device recommendations
using Tech Nest's Decision Intelligence Engine.

Design constraints:
  - NO raw device_ids required. Developers describe the user's needs in JSON.
  - The API internally resolves the best matching devices and returns verdicts.
  - Responses never expose internal session IDs, user_ids, or network weights.
  - AI agents can pass X-Agent-Id header for agent-specific rate limit tracking.

Rate limiting:
  - Decision endpoints consume 5 tokens (vs 1 for read endpoints) because
    they trigger the most compute. This is enforced by the middleware's
    rate_limit configuration — no special logic needed here.
    (Future: implement weighted token consumption in rate limiter.)
"""

from __future__ import annotations

import logging
from typing import Any, Literal, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.routers.platform_deps import get_platform_client, require_plan
from app.models.platform import AuthenticatedClient
from app.database import supabase
from app.services.intelligence_graph import get_ranked_devices

logger = logging.getLogger(__name__)
router = APIRouter()


# ── Request / Response schemas ─────────────────────────────────────────────────

class DevicePreference(BaseModel):
    """User preference vector for the recommendation request."""
    budget_usd:    Optional[float]  = Field(default=None, description="Max price in USD")
    priority:      list[Literal["camera", "battery", "performance", "display", "value"]] = []
    brand:         Optional[str]    = None
    use_case:      Optional[str]    = Field(default=None, description="e.g., 'photography', 'gaming', 'business'")


class RecommendationRequest(BaseModel):
    preferences:   DevicePreference
    limit:         int = Field(default=5, ge=1, le=10)
    explain:       bool = Field(default=False, description="Include human-readable explanations")


class DeviceRecommendation(BaseModel):
    device_id:    str
    name:         str
    brand:        str
    score:        float
    verdict:      str
    match_reasons: list[str]    # Why it matches the user's preferences
    price_usd:    Optional[float]


class RecommendationResponse(BaseModel):
    recommendations: list[DeviceRecommendation]
    total_considered: int
    methodology:      str


# ── Endpoint ──────────────────────────────────────────────────────────────────

@router.post("/recommend", response_model=RecommendationResponse)
async def get_recommendations(
    payload: RecommendationRequest,
    client: AuthenticatedClient = Depends(get_platform_client),
):
    """
    Request personalized device recommendations for a user.

    Supply a `preferences` object describing what matters to the user:
    - budget, priority dimensions, brand preference, use case.

    Tech Nest scores all available devices against the preference vector
    and returns the best matches with plain-language explanations.

    AI agents: Include `X-Agent-Id` header for agent-scoped analytics.
    """
    prefs = payload.preferences

    # Step 1: Resolve all scored devices
    # We use the intelligence graph's ranking, then post-filter
    ranked = get_ranked_devices(limit=200)  # Fetch broad set to filter from

    if not ranked:
        raise HTTPException(status_code=503, detail="Device ranking unavailable.")

    # Step 2: Fetch device metadata for filtering
    device_ids = [r["device_id"] for r in ranked]
    meta_resp = (
        supabase.table("devices")
        .select("id, name, brand, price")
        .in_("id", device_ids[:100])   # Supabase IN limit safety
        .execute()
    )
    meta_map: dict[str, dict] = {r["id"]: r for r in (meta_resp.data or [])}

    # Step 3: Build scoring context from preferences
    priority_score_map: dict[str, str] = {
        "camera":      "camera_score",
        "battery":     "battery_score",
        "performance": "performance_score",
        "display":     "display_score",
    }

    # Fetch full category scores for prioritized weighting
    cat_resp = (
        supabase.table("device_scores")
        .select("device_id, display_score, performance_score, camera_score, battery_score, overall_score")
        .in_("device_id", device_ids[:100])
        .execute()
    )
    cat_map: dict[str, dict] = {r["device_id"]: r for r in (cat_resp.data or [])}

    # Step 4: Apply filters and score
    candidates = []
    for ranked_device in ranked:
        dev_id  = ranked_device["device_id"]
        meta    = meta_map.get(dev_id)
        if not meta:
            continue

        # Budget filter
        price = float(meta.get("price") or 0)
        if prefs.budget_usd and price > prefs.budget_usd:
            continue

        # Brand filter
        if prefs.brand and meta.get("brand", "").lower() != prefs.brand.lower():
            continue

        # Compute preference-adjusted score
        cat = cat_map.get(dev_id, {})
        base = ranked_device["final_score"]
        pref_boost = 0.0
        for pref_dim in (prefs.priority or []):
            score_key = priority_score_map.get(pref_dim)
            if score_key:
                dim_score = float(cat.get(score_key, 5.0))
                pref_boost += dim_score * 0.1   # 10% per priority dimension

        adjusted = round(base + pref_boost, 3)

        # Build match reasons
        match_reasons: list[str] = []
        if payload.explain:
            overall = float(cat.get("overall_score", 0.0))
            if "camera" in prefs.priority:
                cam = float(cat.get("camera_score", 0.0))
                if cam >= 8.0:
                    match_reasons.append(f"Exceptional camera score ({cam}/10)")
            if "battery" in prefs.priority:
                bat = float(cat.get("battery_score", 0.0))
                if bat >= 7.5:
                    match_reasons.append(f"Strong battery score ({bat}/10)")
            if "performance" in prefs.priority:
                perf = float(cat.get("performance_score", 0.0))
                if perf >= 8.0:
                    match_reasons.append(f"Flagship performance score ({perf}/10)")
            if prefs.budget_usd and price > 0:
                match_reasons.append(f"Within your ${prefs.budget_usd:.0f} budget at ${price:.0f}")

        verdict = (
            "FLAGSHIP" if float(cat.get("overall_score", 0)) >= 8.5 else
            "HIGH"     if float(cat.get("overall_score", 0)) >= 7.0 else
            "MID"      if float(cat.get("overall_score", 0)) >= 5.5 else
            "ENTRY"
        )

        candidates.append((adjusted, DeviceRecommendation(
            device_id=dev_id,
            name=meta.get("name", ""),
            brand=meta.get("brand", ""),
            score=round(float(cat.get("overall_score", base)), 1),
            verdict=verdict,
            match_reasons=match_reasons,
            price_usd=price if price > 0 else None,
        )))

    # Step 5: Sort and return top-N
    candidates.sort(key=lambda x: x[0], reverse=True)
    top = [item[1] for item in candidates[:payload.limit]]

    return RecommendationResponse(
        recommendations=top,
        total_considered=len(candidates),
        methodology=(
            "Scores computed via Tech Nest Intelligence Engine — deterministic, spec-based, "
            "network-signal adjusted. See https://docs.technest.app/platform/methodology."
        ),
    )
