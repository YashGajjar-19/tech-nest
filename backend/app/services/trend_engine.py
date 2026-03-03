"""
Trend Detection Engine
───────────────────────
Detects statistical momentum changes in device interaction volume
across rolling time windows: 24h, 7d, 30d.

Design principles:
  DECAY-AWARE: We compare two consecutive windows of the same length.
    If a device had 100 views in the 7 days BEFORE this window and 300 in THIS
    window, that's a 3x surge. If reversed, it's a decline.
    This catches momentum without being fooled by a single viral day.

  BIAS-SAFE: Volume floor guards prevent devices with 5 views from scoring
    "maximum momentum" simply because they went from 0 to 5.
    MIN_VOLUME_THRESHOLD must be met for a trend to be recorded.

  IDEMPOTENT: All writes use UPSERT on (device_id, trend_type, time_window).

  NO AI: Pure math. Rolling window comparison with log-dampened ratio.

Trend types emitted:
  rising_interest    — current window significantly > prior window
  declining_interest — current window significantly < prior window
  upgrade_wave       — high selection rate (select_recommendation events) spiking
  market_shift       — brand-level aggregate shift (computed in collective_insights)

Called by: APScheduler every hour.
"""

from __future__ import annotations

import logging
import math
from datetime import datetime, timedelta, timezone
from typing import Literal

from app.db.supabase import supabase

logger = logging.getLogger(__name__)

# Minimum interactions in the CURRENT window to record any trend
MIN_VOLUME_THRESHOLD: int = 10

# Ratio thresholds for labeling trend direction:
# current/prior ratio > RISE_THRESHOLD → rising_interest
# current/prior ratio < DECLINE_THRESHOLD → declining_interest
RISE_THRESHOLD: float    = 1.5   # 50% growth week-over-week
DECLINE_THRESHOLD: float = 0.67  # 33% decline week-over-week

# Threshold for upgrade_wave: selection events must be >= this % of views
UPGRADE_WAVE_SELECTION_RATE: float = 0.08  # 8% of views result in a recommendation selection

TimeWindow = Literal["24h", "7d", "30d"]

_WINDOW_HOURS: dict[TimeWindow, int] = {
    "24h": 24,
    "7d":  24 * 7,
    "30d": 24 * 30,
}


def _count_events(device_id: str, event_type: str, since: datetime, until: datetime) -> int:
    """Count interaction_events for a device between two timestamps."""
    resp = (
        supabase.table("interaction_events")
        .select("id", count="exact")
        .eq("device_id", device_id)
        .eq("event_type", event_type)
        .gte("created_at", since.isoformat())
        .lt("created_at", until.isoformat())
        .execute()
    )
    return resp.count or 0


def _log_momentum(current: int, prior: int) -> float:
    """
    Log-ratio momentum score, normalized to [-1, +1].

    log(current+1) - log(prior+1) measures growth magnitude while
    dampening the difference between 0→5 versus 1000→5000.
    We normalize by log(MAX_EXPECTED_RATIO=10) to keep it in [-1, 1].
    """
    raw = math.log(current + 1) - math.log(prior + 1)
    normalized = raw / math.log(10)  # log(10) ≈ 2.3
    return max(-1.0, min(1.0, round(normalized, 4)))


def detect_trends_for_device(device_id: str) -> list[dict]:
    """
    Run all time window comparisons for a single device.
    Returns a list of trend records to upsert.
    """
    now = datetime.now(timezone.utc)
    results: list[dict] = []

    for window in ("24h", "7d", "30d"):
        window_hours = _WINDOW_HOURS[window]
        current_start = now - timedelta(hours=window_hours)
        prior_start   = now - timedelta(hours=window_hours * 2)
        prior_end     = current_start   # prior window ends where current begins

        current_views = _count_events(device_id, "view_device",   current_start, now)
        prior_views   = _count_events(device_id, "view_device",   prior_start,   prior_end)
        current_sel   = _count_events(device_id, "select_recommendation", current_start, now)

        # Skip devices with insufficient volume — they'd generate noise
        if current_views < MIN_VOLUME_THRESHOLD:
            continue

        momentum = _log_momentum(current_views, prior_views)

        # Determine trend type from momentum magnitude
        if prior_views == 0 or (current_views / max(prior_views, 1)) >= RISE_THRESHOLD:
            trend_type  = "rising_interest"
            trend_score = max(0.0, float(momentum))

        elif (current_views / max(prior_views, 1)) <= DECLINE_THRESHOLD:
            trend_type  = "declining_interest"
            trend_score = max(0.0, float(-momentum))   # positive score for decline magnitude

        else:
            # Flat zone — skip to avoid polluting the trend table with noise
            continue

        results.append({
            "device_id":    device_id,
            "trend_type":   trend_type,
            "trend_score":  round(trend_score, 4),
            "time_window":  window,
            "calculated_at": now.isoformat(),
        })

        # Upgrade wave detection: check selection spike regardless of window above
        if window == "7d" and current_views > 0:
            selection_rate = current_sel / current_views
            if selection_rate >= UPGRADE_WAVE_SELECTION_RATE:
                wave_score = min(1.0, round(selection_rate / 0.20, 4))  # normalize: 20% = score 1.0
                results.append({
                    "device_id":    device_id,
                    "trend_type":   "upgrade_wave",
                    "trend_score":  wave_score,
                    "time_window":  "7d",
                    "calculated_at": now.isoformat(),
                })

    return results


def run_trend_engine() -> dict:
    """
    Batch run: fetch all devices, detect trends, upsert results.
    Called by the APScheduler every hour.
    """
    logger.info("[TrendEngine] Starting trend detection run")

    # Fetch all device IDs that have been seen in the last 30d (not the whole DB)
    active_resp = (
        supabase.table("interaction_events")
        .select("device_id")
        .gte("created_at", (datetime.now(timezone.utc) - timedelta(days=30)).isoformat())
        .not_.is_("device_id", "null")
        .execute()
    )

    # Deduplicate device IDs
    device_ids: set[str] = {row["device_id"] for row in (active_resp.data or [])}
    logger.info(f"[TrendEngine] Processing {len(device_ids)} active devices")

    inserted = 0
    for device_id in device_ids:
        try:
            trends = detect_trends_for_device(device_id)
            for trend in trends:
                supabase.table("device_trends").upsert(
                    trend,
                    on_conflict="device_id,trend_type,time_window",
                ).execute()
                inserted += 1
        except Exception as exc:
            logger.error(f"[TrendEngine] Error for device {device_id}: {exc}")

    summary = {"device_ids_processed": len(device_ids), "trend_records_upserted": inserted}
    logger.info(f"[TrendEngine] Done: {summary}")
    return summary
