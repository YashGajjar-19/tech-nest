"""
Intelligence Pipeline Orchestrator
────────────────────────────────────
Coordinates the full intelligence generation sequence for a single device.
This is the only module that knows the pipeline order.

Pipeline steps (in order):
  1. Mark device: processing
  2. Fetch + normalize specs (scoring engine)
  3. Run scoring engine → device_scores
  4. Generate AI insights → device_ai_insights
  5. Build competitor relationships → device_relationships
  6. Build search index → device_search_index
  7. Mark device: ready

On any step failure:
  - Mark device: failed
  - Log structured error
  - Re-raise to caller (background worker handles retry policy)

Idempotency guarantee:
  - Each step uses upsert semantics
  - Re-running the pipeline on a "ready" device is safe
  - Use force=True on trigger to bypass idempotency guards (admin re-generate)
"""

from __future__ import annotations
import logging
from datetime import datetime, timezone

from app.database import supabase
from app.services.scoring_engine import run_scoring_engine, fetch_device_specs
from app.services.ai_insight_service import run_ai_insight_service
from app.services.comparison_builder import run_comparison_builder
from app.services.search_indexer import run_search_indexer
from app.models.decision import IntelligencePipelineResult, IntelligenceStatus

logger = logging.getLogger(__name__)


def _set_device_status(device_id: str, status: IntelligenceStatus) -> None:
    supabase.table("devices").update(
        {"intelligence_status": status.value}
    ).eq("id", device_id).execute()


def run_intelligence_pipeline(device_id: str, force: bool = False) -> IntelligencePipelineResult:
    """
    Full intelligence pipeline for a single device.
    Each step is isolated — if step N fails, steps 1-N-1 are already persisted.
    The caller (background worker) decides whether to retry on failure.

    Args:
        device_id: Target device UUID.
        force: If True, bypass AI insight idempotency guard (re-generate).
    """
    logger.info(f"[Pipeline] Starting intelligence pipeline for {device_id}")

    # ── Step 1: Mark processing ─────────────────────────────────────────────
    _set_device_status(device_id, IntelligenceStatus.PROCESSING)

    try:
        # ── Step 2: Fetch + normalize specs ────────────────────────────────
        logger.info(f"[Pipeline] Step 2: Fetching specs for {device_id}")
        specs = fetch_device_specs(device_id)

        # ── Step 3: Scoring engine ──────────────────────────────────────────
        logger.info(f"[Pipeline] Step 3: Running scoring engine")
        scores = run_scoring_engine(device_id)

        # ── Step 4: AI Insight generation ───────────────────────────────────
        logger.info(f"[Pipeline] Step 4: Generating AI insights")
        insights = run_ai_insight_service(device_id, specs, scores, force=force)

        # ── Step 5: Comparison builder ──────────────────────────────────────
        logger.info(f"[Pipeline] Step 5: Building competitor relationships")
        competitors_linked = run_comparison_builder(device_id)

        # ── Step 6: Search index ────────────────────────────────────────────
        logger.info(f"[Pipeline] Step 6: Building search index")
        search_index = run_search_indexer(device_id, specs, scores)

        # ── Step 7: Mark ready ──────────────────────────────────────────────
        _set_device_status(device_id, IntelligenceStatus.READY)
        logger.info(f"[Pipeline] ✓ COMPLETE for {device_id}")

        return IntelligencePipelineResult(
            device_id=device_id,
            status=IntelligenceStatus.READY,
            scores=scores,
            insights=insights,
            search_index=search_index,
            competitors_linked=competitors_linked,
            completed_at=datetime.now(timezone.utc),
        )

    except Exception as exc:
        logger.exception(f"[Pipeline] ✗ FAILED for {device_id}: {exc}")
        _set_device_status(device_id, IntelligenceStatus.FAILED)

        return IntelligencePipelineResult(
            device_id=device_id,
            status=IntelligenceStatus.FAILED,
            error=str(exc),
            completed_at=datetime.now(timezone.utc),
        )
