"""
Background Worker: Intelligence Pipeline
─────────────────────────────────────────
Runs the intelligence pipeline asynchronously using FastAPI BackgroundTasks.

WHY FastAPI BackgroundTasks (not Celery/Redis)?

  At current scale (< 10,000 devices):
  - No external infrastructure required (no Redis, no broker, no workers to deploy)
  - Runs in the same process as the API server
  - Device intelligence generation is infrequent (publish event, not per-request)
  - Each pipeline takes ~5–15 seconds — acceptable for background execution

  MIGRATE TO Celery + Redis when:
  - Concurrent pipeline execution becomes a bottleneck (> 50 publishes/hour)
  - You need retry queues, dead-letter queues, or cross-machine workers
  - Resource isolation from the API process becomes necessary

  The pipeline module is already isolated — swapping the executor is a 1-line change.

Worker responsibilities:
  - Accept device_id from the trigger endpoint
  - Run the pipeline in the background (non-blocking to HTTP caller)
  - Log structured output for observability
"""

from __future__ import annotations
import logging

from app.services.pipeline import run_intelligence_pipeline

logger = logging.getLogger(__name__)


def intelligence_background_job(device_id: str, force: bool = False) -> None:
    """
    Background worker function.
    Called by FastAPI BackgroundTasks — runs in a thread pool after HTTP response is sent.

    This function MUST NOT raise — any exception must be caught and logged
    to prevent crashing the background thread pool.
    """
    try:
        logger.info(f"[Worker] Starting intelligence job for device {device_id}")
        result = run_intelligence_pipeline(device_id, force=force)

        if result.status.value == "ready":
            logger.info(
                f"[Worker] ✓ Intelligence complete for {device_id} | "
                f"overall_score={result.scores.overall_score if result.scores else 'N/A'} | "
                f"competitors={result.competitors_linked}"
            )
        else:
            logger.error(
                f"[Worker] ✗ Intelligence failed for {device_id}: {result.error}"
            )

    except Exception as exc:
        # Catch-all: this should never be reached if pipeline.py handles it correctly,
        # but we guard defensively here since a crash in a background task
        # produces silent failures in FastAPI.
        logger.critical(
            f"[Worker] CRITICAL unhandled error for device {device_id}: {exc}",
            exc_info=True,
        )
