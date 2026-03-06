"""
Event Logger
─────────────
Fire-and-forget interaction event recorder.

Design principles:
  - Synchronous Supabase client insert (non-blocking from caller's POV via BackgroundTasks)
  - Tolerant to failure: logs warning and returns False, never raises to caller
  - Callable from ANY endpoint via: background_tasks.add_task(log_event, ...)
  - Minimal latency: single INSERT, no reads, no joins
  - Validates event_type against an allowlist to prevent data pollution

Event types:
  view_device | compare_devices | start_decision | select_recommendation
  save_device | dismiss_recommendation

Usage in an endpoint:
    background_tasks.add_task(
        log_event,
        event_type="view_device",
        device_id=device_id,
        user_id=current_user_id,   # optional
        metadata={"source": "search"},
    )
"""

from __future__ import annotations

import logging
from typing import Optional


from app.database import supabase

logger = logging.getLogger(__name__)

# Allowlist — prevents arbitrary event pollution of the event log
VALID_EVENT_TYPES: frozenset[str] = frozenset({
    "view_device",
    "compare_devices",
    "start_decision",
    "select_recommendation",
    "save_device",
    "dismiss_recommendation",
})


def log_event(
    event_type: str,
    device_id: Optional[str] = None,
    user_id: Optional[str] = None,
    metadata: Optional[dict] = None,
) -> bool:
    """
    Insert a single interaction event into interaction_events.

    Returns True on success, False on any failure.
    This function MUST NOT raise — it is designed to be called as a
    BackgroundTask where exceptions are silently swallowed by FastAPI.
    """
    if event_type not in VALID_EVENT_TYPES:
        logger.warning(f"[EventLogger] Invalid event_type '{event_type}' — skipped.")
        return False

    payload: dict = {
        "event_type": event_type,
        "metadata": metadata or {},
    }
    if device_id:
        payload["device_id"] = device_id
    if user_id:
        payload["user_id"] = user_id

    try:
        supabase.table("interaction_events").insert(payload).execute()
        logger.debug(f"[EventLogger] Logged '{event_type}' for device={device_id} user={user_id}")
        return True

    except Exception as exc:
        # A logging failure must NEVER crash the parent request.
        # We log and return — the caller moves on.
        logger.warning(f"[EventLogger] Failed to log event '{event_type}': {exc}")
        return False
