"""
Platform: Device Intelligence API
───────────────────────────────────
Public endpoint: GET /platform/v1/devices/{device_id}/score

Returns sanitized device intelligence for external developers.

Security boundary:
  - Returns only PUBLIC intelligence: scores, verdict, category breakdown.
  - Never returns: raw specs, embedding vectors, competitor relationship weights,
    user behavioral data, or network_multiplier internals.
  - The capability_embedding (pgvector 1536d) is never exposed externally.

Response shape is stable across versions — additive changes only.
Breaking changes increment the version in the URL.
"""

from __future__ import annotations

import logging
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from app.api.platform_deps import get_platform_client
from app.models.platform import AuthenticatedClient
from app.db.supabase import supabase
from app.services.intelligence_graph import get_network_signal

logger = logging.getLogger(__name__)
router = APIRouter()


# ── Public response schemas (stable contract) ─────────────────────────────────

class DeviceScorePublic(BaseModel):
    device_id:         str
    name:              str
    brand:             str
    tech_nest_score:   float              # Overall score 0.0–10.0
    category_scores: dict[str, float]    # display, performance, camera, battery, design, software
    verdict:           str               # FLAGSHIP | HIGH | MID | ENTRY
    trend_momentum:    Optional[str]     # "rising" | "declining" | "stable" | None
    price_usd:         Optional[float]


class DeviceListPublic(BaseModel):
    devices: list[DeviceScorePublic]
    total:   int
    page:    int
    limit:   int


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.get("/{device_id}/score", response_model=DeviceScorePublic)
async def get_device_score(
    device_id: str,
    client: AuthenticatedClient = Depends(get_platform_client),
):
    """
    Retrieve the full intelligence score for a device.

    Returns Tech Nest's deterministic multi-dimensional scoring breakdown.
    Use this to power comparison widgets, recommendation engines, or
    device detail pages in your application.
    """
    # Fetch device core data
    dev_resp = (
        supabase.table("devices")
        .select("id, name, brand, price")
        .eq("id", device_id)
        .maybe_single()
        .execute()
    )
    if not dev_resp.data:
        raise HTTPException(status_code=404, detail=f"Device '{device_id}' not found.")

    dev = dev_resp.data

    # Fetch scores
    score_resp = (
        supabase.table("device_scores")
        .select("overall_score, display_score, performance_score, camera_score, battery_score, design_score, software_score")
        .eq("device_id", device_id)
        .maybe_single()
        .execute()
    )

    if not score_resp.data:
        raise HTTPException(
            status_code=404,
            detail="Intelligence scores not yet computed for this device."
        )

    s = score_resp.data
    overall = float(s.get("overall_score", 0.0))

    # Derive public verdict from overall score
    if overall >= 8.5:
        verdict = "FLAGSHIP"
    elif overall >= 7.0:
        verdict = "HIGH"
    elif overall >= 5.5:
        verdict = "MID"
    else:
        verdict = "ENTRY"

    # Fetch network trend (sanitized — only surface rising/declining, not raw multiplier)
    trend_momentum: Optional[str] = None
    try:
        signal = get_network_signal(device_id)
        trend_signals = signal.get("trend_signals", [])
        if trend_signals:
            top_trend = trend_signals[0].get("trend_type", "")
            if "rising" in top_trend:
                trend_momentum = "rising"
            elif "declining" in top_trend:
                trend_momentum = "declining"
            else:
                trend_momentum = "stable"
    except Exception:
        pass  # Trend data is non-critical for the public API

    return DeviceScorePublic(
        device_id=device_id,
        name=dev.get("name", ""),
        brand=dev.get("brand", ""),
        tech_nest_score=overall,
        category_scores={
            "display":     float(s.get("display_score",     0.0)),
            "performance": float(s.get("performance_score", 0.0)),
            "camera":      float(s.get("camera_score",      0.0)),
            "battery":     float(s.get("battery_score",     0.0)),
            "design":      float(s.get("design_score",      0.0)),
            "software":    float(s.get("software_score",    0.0)),
        },
        verdict=verdict,
        trend_momentum=trend_momentum,
        price_usd=float(dev["price"]) if dev.get("price") else None,
    )


@router.get("/", response_model=DeviceListPublic)
async def list_devices(
    page:  int   = Query(default=1, ge=1),
    limit: int   = Query(default=20, ge=1, le=100),
    brand: Optional[str] = Query(default=None),
    min_score: Optional[float] = Query(default=None, ge=0.0, le=10.0),
    client: AuthenticatedClient = Depends(get_platform_client),
):
    """
    List devices scored by Tech Nest Intelligence Engine.
    Supports pagination, brand filtering, and minimum score filtering.
    Results are sorted by tech_nest_score descending.
    """
    offset = (page - 1) * limit

    # Build query — starts from device_scores, joins devices
    query = (
        supabase.table("device_scores")
        .select("device_id, overall_score, display_score, performance_score, camera_score, battery_score, design_score, software_score, devices(id, name, brand, price)")
        .order("overall_score", desc=True)
        .range(offset, offset + limit - 1)
    )

    if min_score is not None:
        query = query.gte("overall_score", min_score)

    resp = query.execute()
    rows = resp.data or []

    # Filter by brand after join (Supabase JS SDK allows this natively; Python SDK requires post-filter)
    if brand:
        brand_lower = brand.lower()
        rows = [r for r in rows if (r.get("devices") or {}).get("brand", "").lower() == brand_lower]

    devices_out = []
    for row in rows:
        dev = row.get("devices") or {}
        overall = float(row.get("overall_score", 0.0))
        verdict = "FLAGSHIP" if overall >= 8.5 else "HIGH" if overall >= 7.0 else "MID" if overall >= 5.5 else "ENTRY"

        devices_out.append(DeviceScorePublic(
            device_id=row["device_id"],
            name=dev.get("name", ""),
            brand=dev.get("brand", ""),
            tech_nest_score=overall,
            category_scores={
                "display":     float(row.get("display_score",     0.0)),
                "performance": float(row.get("performance_score", 0.0)),
                "camera":      float(row.get("camera_score",      0.0)),
                "battery":     float(row.get("battery_score",     0.0)),
                "design":      float(row.get("design_score",      0.0)),
                "software":    float(row.get("software_score",    0.0)),
            },
            verdict=verdict,
            trend_momentum=None,  # Not fetched for list endpoint (performance)
            price_usd=float(dev["price"]) if dev.get("price") else None,
        ))

    return DeviceListPublic(devices=devices_out, total=len(devices_out), page=page, limit=limit)
