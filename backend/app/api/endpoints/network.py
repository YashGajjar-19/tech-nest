"""
Network Intelligence API
─────────────────────────
Endpoints:

  GET  /api/v1/network/device/{device_id}  — full network signal for one device
  GET  /api/v1/network/rankings            — ranked device list (personalized if authenticated)
  GET  /api/v1/network/insights            — collective intelligence snapshot (admin)
  POST /api/v1/network/aggregate           — manually trigger aggregation (admin)
  POST /api/v1/network/event               — log an interaction event from frontend
"""

from __future__ import annotations

import logging
from typing import Any, Optional

from fastapi import APIRouter, BackgroundTasks, HTTPException, Query
from pydantic import BaseModel, Field

from app.services.event_logger import log_event, VALID_EVENT_TYPES
from app.services.network_learning import run_incremental_aggregation
from app.services.intelligence_graph import get_network_signal, get_ranked_devices, enhance_decision_context
from app.services.collective_insights import (
    get_popular_upgrade_paths,
    get_brand_affinity_patterns,
    get_emerging_devices,
    get_preference_shift_snapshot,
)

logger = logging.getLogger(__name__)
router = APIRouter()


# ── Schemas ───────────────────────────────────────────────────────────────────

class InteractionEventRequest(BaseModel):
    event_type: str = Field(..., description=f"One of: {', '.join(sorted(VALID_EVENT_TYPES))}")
    device_id:  Optional[str] = None
    user_id:    Optional[str] = None
    metadata:   dict          = Field(default_factory=dict)


class AggregationTriggerRequest(BaseModel):
    device_id: Optional[str] = None   # None = aggregate all


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/event", status_code=202)
async def record_interaction_event(
    payload: InteractionEventRequest,
    background_tasks: BackgroundTasks,
):
    """
    Fire-and-forget event ingestion from any client (Next.js, mobile).
    Returns 202 immediately — the actual DB write happens in background.
    This design keeps frontend interactions sub-5ms from the API's perspective.
    """
    if payload.event_type not in VALID_EVENT_TYPES:
        raise HTTPException(
            status_code=422,
            detail=f"Invalid event_type. Valid types: {sorted(VALID_EVENT_TYPES)}"
        )

    background_tasks.add_task(
        log_event,
        event_type=payload.event_type,
        device_id=payload.device_id,
        user_id=payload.user_id,
        metadata=payload.metadata,
    )

    return {"status": "accepted", "event_type": payload.event_type}


@router.get("/device/{device_id}")
async def get_device_network_signal(device_id: str) -> dict[str, Any]:
    """
    Return the full network intelligence signal for a single device.
    Used by the device detail page to show trend badges, save counts, etc.
    """
    try:
        return get_network_signal(device_id)
    except Exception as exc:
        logger.error(f"[NetworkAPI] get_network_signal failed for {device_id}: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/rankings")
async def get_device_rankings(
    limit: int = Query(default=20, ge=1, le=100),
    user_id: Optional[str] = Query(default=None),
) -> list[dict[str, Any]]:
    """
    Return personalized device rankings.
    final_score = base_score × personalization_weight × network_multiplier
    """
    try:
        return get_ranked_devices(limit=limit, user_id=user_id)
    except Exception as exc:
        logger.error(f"[NetworkAPI] get_ranked_devices failed: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/insights")
async def get_collective_insights() -> dict[str, Any]:
    """
    Admin-grade intelligence snapshot.
    Returns:
      - Top upgrade paths (device A → device B co-occurrence)
      - Brand affinity scores
      - Emerging devices (7d rising momentum)
      - Platform preference shift snapshot
    """
    try:
        return {
            "popular_upgrade_paths":  get_popular_upgrade_paths(limit=10),
            "brand_affinity":         get_brand_affinity_patterns(),
            "emerging_devices":       get_emerging_devices(limit=10),
            "preference_shift":       get_preference_shift_snapshot(),
        }
    except Exception as exc:
        logger.error(f"[NetworkAPI] get_collective_insights failed: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


@router.post("/aggregate", status_code=202)
async def trigger_aggregation(
    payload: AggregationTriggerRequest,
    background_tasks: BackgroundTasks,
):
    """
    Manually trigger the incremental network aggregation job.
    In production, this is restricted to admin roles via middleware.
    Useful for immediate post-launch data correctness verification.
    """
    background_tasks.add_task(run_incremental_aggregation, payload.device_id)
    return {
        "status": "aggregation_triggered",
        "device_id": payload.device_id or "ALL",
    }
