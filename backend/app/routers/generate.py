"""
Intelligence API Router
────────────────────────
Endpoints for triggering and monitoring the intelligence pipeline.

POST /intelligence/generate/{device_id}
  - Admin-only
  - Marks device as pending
  - Enqueues background job
  - Returns immediately (job runs async)

GET /intelligence/status/{device_id}
  - Returns current intelligence_status + scores if ready

POST /intelligence/regenerate/{device_id}
  - Admin-only
  - Force re-runs all steps including AI insight (force=True)
"""

from __future__ import annotations
from typing import Optional, List

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from pydantic import BaseModel

from app.routers.deps import require_admin
from app.database import supabase
from app.workers.intelligence_worker import intelligence_background_job

router = APIRouter()


# ── Response models ────────────────────────────────────────────────────────────

class GenerateResponse(BaseModel):
    device_id: str
    message: str
    intelligence_status: str


class IntelligenceStatusResponse(BaseModel):
    device_id: str
    device_name: str
    intelligence_status: str
    overall_score: Optional[float] = None
    display_score: Optional[float] = None
    performance_score: Optional[float] = None
    camera_score: Optional[float] = None
    battery_score: Optional[float] = None
    design_score: Optional[float] = None
    software_score: Optional[float] = None
    has_insights: bool = False
    has_search_index: bool = False
    competitors_linked: int = 0


class BulkGenerateRequest(BaseModel):
    device_ids: List[str]
    force: bool = False


class BulkGenerateResponse(BaseModel):
    enqueued: List[str]
    message: str


# ── Helpers ────────────────────────────────────────────────────────────────────

def _get_device_or_404(device_id: str) -> dict:
    resp = (
        supabase.table("devices")
        .select("id, name, intelligence_status, is_published")
        .eq("id", device_id)
        .maybe_single()
        .execute()
    )
    if resp is None or not resp.data:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Device {device_id} not found.",
        )
    return resp.data


def _mark_pending(device_id: str) -> None:
    supabase.table("devices").update(
        {"intelligence_status": "pending"}
    ).eq("id", device_id).execute()


# ── Endpoints ─────────────────────────────────────────────────────────────────

@router.post("/generate/{device_id}", response_model=GenerateResponse)
async def trigger_intelligence_generation(
    device_id: str,
    background_tasks: BackgroundTasks,
    _: dict = Depends(require_admin),
) -> GenerateResponse:
    """
    Triggers intelligence pipeline for a device.
    Returns immediately — pipeline runs in background.

    Called automatically by publishDeviceAction on the frontend.
    Can also be called manually from the Admin Engine page.
    """
    device = _get_device_or_404(device_id)

    # Guard: don't enqueue if already processing
    if device.get("intelligence_status") == "processing":
        return GenerateResponse(
            device_id=device_id,
            message="Intelligence pipeline already in progress.",
            intelligence_status="processing",
        )

    # Mark pending synchronously before returning
    _mark_pending(device_id)

    # Schedule background execution (non-blocking)
    background_tasks.add_task(intelligence_background_job, device_id, False)

    return GenerateResponse(
        device_id=device_id,
        message=f"Intelligence pipeline enqueued for '{device['name']}'.",
        intelligence_status="pending",
    )


@router.post("/regenerate/{device_id}", response_model=GenerateResponse)
async def force_regenerate_intelligence(
    device_id: str,
    background_tasks: BackgroundTasks,
    _: dict = Depends(require_admin),
) -> GenerateResponse:
    """
    Force re-runs all intelligence steps, including AI insight regeneration.
    Use when: specs have changed, scoring weights updated, or insights quality improved.
    """
    device = _get_device_or_404(device_id)

    _mark_pending(device_id)
    background_tasks.add_task(intelligence_background_job, device_id, True)  # force=True

    return GenerateResponse(
        device_id=device_id,
        message=f"Force regeneration enqueued for '{device['name']}'.",
        intelligence_status="pending",
    )


@router.get("/status/{device_id}", response_model=IntelligenceStatusResponse)
async def get_intelligence_status(device_id: str) -> IntelligenceStatusResponse:
    """
    Returns full intelligence status for a device.
    Includes scores, insight availability, and competitor count.
    Public endpoint — no auth required (data is already public).
    """
    device = _get_device_or_404(device_id)

    # Fetch scores
    scores_resp = (
        supabase.table("device_scores")
        .select("*")
        .eq("device_id", device_id)
        .maybe_single()
        .execute()
    )
    scores = (scores_resp.data if scores_resp else None) or {}

    # Check insights exist
    insights_resp = (
        supabase.table("device_ai_insights")
        .select("device_id")
        .eq("device_id", device_id)
        .maybe_single()
        .execute()
    )

    # Check search index exists
    index_resp = (
        supabase.table("device_search_index")
        .select("device_id")
        .eq("device_id", device_id)
        .maybe_single()
        .execute()
    )

    # Count competitors
    comp_resp = (
        supabase.table("device_relationships")
        .select("id", count="exact")
        .eq("source_device_id", device_id)
        .eq("relationship_type", "COMPETITOR")
        .execute()
    )

    return IntelligenceStatusResponse(
        device_id=device_id,
        device_name=device.get("name", ""),
        intelligence_status=device.get("intelligence_status", "pending"),
        overall_score=scores.get("overall_score"),
        display_score=scores.get("display_score"),
        performance_score=scores.get("performance_score"),
        camera_score=scores.get("camera_score"),
        battery_score=scores.get("battery_score"),
        design_score=scores.get("design_score"),
        software_score=scores.get("software_score"),
        has_insights=(insights_resp is not None and insights_resp.data is not None),
        has_search_index=(index_resp is not None and index_resp.data is not None),
        competitors_linked=comp_resp.count or 0,
    )


@router.post("/bulk-generate", response_model=BulkGenerateResponse)
async def bulk_trigger_intelligence(
    payload: BulkGenerateRequest,
    background_tasks: BackgroundTasks,
    _: dict = Depends(require_admin),
) -> BulkGenerateResponse:
    """
    Bulk-trigger intelligence for multiple devices.
    Useful for bootstrapping the system with existing published devices.
    Max 100 devices per request to avoid overloading the worker pool.
    """
    if len(payload.device_ids) > 100:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum 100 device IDs per bulk request.",
        )

    enqueued = []
    for device_id in payload.device_ids:
        try:
            _mark_pending(device_id)
            background_tasks.add_task(
                intelligence_background_job, device_id, payload.force
            )
            enqueued.append(device_id)
        except Exception:
            pass  # Skip invalid IDs silently; log in background

    return BulkGenerateResponse(
        enqueued=enqueued,
        message=f"{len(enqueued)} intelligence jobs enqueued.",
    )
