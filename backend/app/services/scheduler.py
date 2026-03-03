"""
Background Scheduler — APScheduler Integration
────────────────────────────────────────────────

WHY APScheduler (not Celery/Redis)?

  At current scale and infrastructure:
  - Config.py references REDIS_URL but Redis is not a deployed dependency yet.
  - The intelligence pipeline already uses FastAPI BackgroundTasks successfully.
  - APScheduler runs in-process with zero external infrastructure.
  - All jobs here are read-heavy aggregations (not high-frequency per-request work).
  - Migration to Celery is a single file swap when Redis becomes real infrastructure.

  MIGRATE TO Celery + Redis when:
  - > 100 concurrent users generating events that must be processed within seconds.
  - You need distributed workers across multiple machines.
  - You need durable retry queues or dead-letter queues.

Job schedule:
  - Aggregation job:  every 15 minutes  (incremental network_stats update)
  - Trend engine:     every 60 minutes  (rolling window trend detection)

Startup: attached to FastAPI lifespan events to avoid orphaned schedulers.
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger

from app.services.network_learning import run_incremental_aggregation
from app.services.trend_engine import run_trend_engine

logger = logging.getLogger(__name__)

_scheduler = BackgroundScheduler(timezone="UTC")


def _safe_run_aggregation() -> None:
    """Wrapper that never raises — protects the scheduler thread."""
    try:
        result = run_incremental_aggregation()
        logger.info(f"[Scheduler] Aggregation complete: {result}")
    except Exception as exc:
        logger.error(f"[Scheduler] Aggregation error: {exc}", exc_info=True)


def _safe_run_trend_engine() -> None:
    """Wrapper that never raises — protects the scheduler thread."""
    try:
        result = run_trend_engine()
        logger.info(f"[Scheduler] Trend engine complete: {result}")
    except Exception as exc:
        logger.error(f"[Scheduler] Trend engine error: {exc}", exc_info=True)


def start_scheduler() -> None:
    """
    Register jobs and start the scheduler.
    Called once during FastAPI startup.
    """
    _scheduler.add_job(
        _safe_run_aggregation,
        trigger=IntervalTrigger(minutes=15),
        id="network_aggregation",
        replace_existing=True,
        max_instances=1,       # Prevents overlapping runs
    )

    _scheduler.add_job(
        _safe_run_trend_engine,
        trigger=IntervalTrigger(hours=1),
        id="trend_detection",
        replace_existing=True,
        max_instances=1,
    )

    _scheduler.start()
    logger.info("[Scheduler] APScheduler started: aggregation=15m, trends=1h")


def stop_scheduler() -> None:
    """
    Gracefully stop the scheduler.
    Called during FastAPI shutdown.
    """
    if _scheduler.running:
        _scheduler.shutdown(wait=False)
        logger.info("[Scheduler] APScheduler stopped")


@asynccontextmanager
async def lifespan_with_scheduler(app):
    """
    FastAPI lifespan context manager.
    Usage in main.py:
        app = FastAPI(lifespan=lifespan_with_scheduler)
    """
    start_scheduler()
    yield
    stop_scheduler()
