"""
Usage Logging Service
──────────────────────
Records API usage events to api_usage_logs asynchronously.

Design:
  - Called exclusively via FastAPI BackgroundTasks — NEVER on the request path.
  - Failure to log NEVER fails the originating request.
  - Uses the same supabase singleton as all other services.
  - Records latency_ms, status_code, endpoint, and client_id for billing.
"""

from __future__ import annotations

import logging
from typing import Optional

from app.db.supabase import supabase

logger = logging.getLogger(__name__)


def log_api_usage(
    client_id: str,
    endpoint: str,
    method: str,
    status_code: int,
    latency_ms: Optional[int] = None,
    request_meta: Optional[dict] = None,
) -> None:
    """
    Insert a single usage log row.
    This function MUST NOT raise — it's called from BackgroundTasks.
    """
    try:
        supabase.table("api_usage_logs").insert({
            "client_id":    client_id,
            "endpoint":     endpoint,
            "method":       method,
            "status_code":  status_code,
            "latency_ms":   latency_ms,
            "request_meta": request_meta or {},
        }).execute()
    except Exception as exc:
        logger.warning(f"[UsageLogger] Failed to log usage for client {client_id}: {exc}")


def get_client_usage_summary(client_id: str, days: int = 1) -> dict:
    """
    Return a usage summary for a client over the last N days.
    Used by: self-service dashboard and admin billing views.
    """
    try:
        resp = (
            supabase.table("api_usage_logs")
            .select("endpoint, status_code, latency_ms, timestamp")
            .eq("client_id", client_id)
            .gte("timestamp", f"now() - interval '{days} days'")
            .execute()
        )

        rows = resp.data or []
        total = len(rows)
        endpoints = list({r["endpoint"] for r in rows})
        avg_latency = (
            sum(r["latency_ms"] for r in rows if r.get("latency_ms")) / max(total, 1)
        )

        return {
            "client_id":      client_id,
            "period_days":    days,
            "total_requests": total,
            "endpoints_used": endpoints,
            "avg_latency_ms": round(avg_latency, 1) if total > 0 else None,
        }

    except Exception as exc:
        logger.error(f"[UsageLogger] get_client_usage_summary failed: {exc}")
        return {"client_id": client_id, "error": "Could not retrieve usage"}
