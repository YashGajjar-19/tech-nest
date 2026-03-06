"""
Network Learning Engine
───────────────────────
Incrementally aggregates interaction_events into device_network_stats.

Design principles:
  1. INCREMENTAL: Uses a watermark (last_aggregated_at) per device so we only
     count NEW events since last run — no full table scans.
  2. BAYESIAN DAMPENING: Raw selection/recommendation ratios are smoothed with
     a Laplace prior to prevent low-volume devices from gaming the score.
  3. BIAS-SAFE: The network_multiplier is clamped to [0.5, 1.5]. It can boost
     a high-confidence device by 50% or dampen a dismissed one by 50% — but
     it can never completely bury or infinitely amplify any device.
  4. FLOOR PROTECTION: Devices with fewer than MIN_INTERACTIONS interactions
     receive a protected multiplier = 1.0 (neutral) to give new devices a
     fair chance to accumulate real signal.
  5. DECAY: Trend scores are not stored here — they live in trend_engine.py.
     The multiplier here is based on all-time aggregated ratios, while
     trend_engine captures momentum over time windows.

Called by: background scheduler (APScheduler) every 15 minutes.
Can also be triggered manually via POST /api/v1/network/aggregate.
"""

from __future__ import annotations

import logging
import math
from datetime import datetime, timezone
from typing import Optional

from app.database import supabase

logger = logging.getLogger(__name__)

# Devices with fewer than this many interactions get a neutral multiplier (1.0)
# regardless of their ratio — protects new devices from being buried.
MIN_INTERACTIONS: int = 50

# Laplace smoothing factor (pseudo-count) for Bayesian dampening.
# Higher value → more conservative, requires more evidence to move the score.
LAPLACE_ALPHA: float = 5.0


def _bayesian_score(successes: int, total: int, alpha: float = LAPLACE_ALPHA) -> float:
    """
    Bayesian dampened rate: (successes + alpha) / (total + 2 * alpha).
    Returns a value in (0, 1). At zero evidence it returns 0.5 (neutral).
    """
    return (successes + alpha) / (total + 2 * alpha)


def _compute_network_multiplier(
    views: int,
    comparisons: int,
    recommendations: int,
    selections: int,
    saves: int,
    dismissals: int,
) -> float:
    """
    Compute a composite network trust multiplier in [0.5, 1.5].

    Formula rationale:
      - selection_rate: did users pick this device when recommended? (strongest signal)
      - save_rate: did users save it from the browse context?
      - dismiss_rate: did users explicitly reject it? (negative signal)
      - comparison_rate: being compared = awareness signal (mild positive)

    Weights reflect signal strength. Selection is 2x the weight of a save
    because it represents intent to buy.
    """
    total_interactions = views + comparisons + 1  # +1 avoids div-zero

    if total_interactions < MIN_INTERACTIONS:
        return 1.0  # Floor protection: neutral multiplier for new devices

    # Bayesian dampened ratios
    sel_rate  = _bayesian_score(selections,   max(1, recommendations))
    save_rate = _bayesian_score(saves,        max(1, views))
    dis_rate  = _bayesian_score(dismissals,   max(1, recommendations))
    cmp_rate  = _bayesian_score(comparisons,  max(1, views))

    # Composite score: weighted combination (all weights sum to 1.0)
    # selection_rate: 0.45  | save_rate: 0.25 | dismiss_rate: -0.20 | compare_rate: 0.10
    raw = (
        sel_rate  * 0.45
        + save_rate * 0.25
        - dis_rate  * 0.20
        + cmp_rate  * 0.10
    )

    # At neutral Bayesian prior (all rates = 0.5):
    # raw = 0.225 + 0.125 - 0.10 + 0.05 = 0.30
    # We normalize so that "neutral" maps to multiplier 1.0.
    # neutral_raw ≈ 0.30 → scale to [0.5, 1.5]
    neutral = 0.30
    # Map raw [0, 0.60] → [0.5, 1.5] (linear, clamped)
    multiplier = 0.5 + (raw / 0.60)

    return max(0.5, min(1.5, round(multiplier, 3)))


def run_incremental_aggregation(device_id: Optional[str] = None) -> dict:
    """
    Aggregate interaction_events into device_network_stats.

    If device_id is None, processes ALL devices that have pending events.
    This is the batch mode used by the scheduler.

    If device_id is provided, processes only that device (triggered after
    a specific device's view count update, etc.).

    Returns a summary dict for logging.
    """
    logger.info(f"[NetworkLearning] Starting aggregation | device={device_id or 'ALL'}")

    # Step 1: Identify devices with events since their last aggregation
    if device_id:
        target_devices = [device_id]
    else:
        # Find all devices with events after their last aggregated_at watermark
        # We do this by joining device_network_stats to interaction_events
        # Devices not yet in network_stats need an initial row (last_aggregated_at = epoch)
        resp = supabase.rpc("get_devices_needing_aggregation").execute()
        target_devices = [row["device_id"] for row in (resp.data or [])]

    processed = 0
    skipped = 0

    for dev_id in target_devices:
        try:
            _aggregate_single_device(dev_id)
            processed += 1
        except Exception as exc:
            logger.error(f"[NetworkLearning] Failed to aggregate device {dev_id}: {exc}")
            skipped += 1

    summary = {
        "devices_processed": processed,
        "devices_skipped": skipped,
        "total": processed + skipped,
    }
    logger.info(f"[NetworkLearning] Complete: {summary}")
    return summary


def _aggregate_single_device(device_id: str) -> None:
    """
    Aggregate all interaction_events for one device since last watermark.
    Upserts device_network_stats with incremental delta counts.
    """

    # Fetch current stats (for the watermark and existing counts)
    existing_resp = (
        supabase.table("device_network_stats")
        .select("views, comparisons, recommendations, selections, saves, dismissals, last_aggregated_at")
        .eq("device_id", device_id)
        .maybe_single()
        .execute()
    )

    existing = existing_resp.data or {}
    last_ts = existing.get("last_aggregated_at", "1970-01-01T00:00:00+00:00")

    # Count new events per type since last aggregation
    event_counts: dict[str, int] = {
        "view_device":            0,
        "compare_devices":        0,
        "select_recommendation":  0,
        "save_device":            0,
        "dismiss_recommendation": 0,
    }

    # We'll handle "start_decision" as a recommendations proxy (a recommendation was surfaced)
    # This is the best signal we have for the denominator of selection_rate.
    for etype in event_counts:
        proxy_type = etype
        count_resp = (
            supabase.table("interaction_events")
            .select("id", count="exact")
            .eq("device_id", device_id)
            .eq("event_type", proxy_type)
            .gt("created_at", last_ts)
            .execute()
        )
        event_counts[etype] = count_resp.count or 0

    # Count recommendations (start_decision events for this device)
    rec_resp = (
        supabase.table("interaction_events")
        .select("id", count="exact")
        .eq("device_id", device_id)
        .eq("event_type", "start_decision")
        .gt("created_at", last_ts)
        .execute()
    )
    new_recommendations = rec_resp.count or 0

    # Compute running totals (add deltas to existing counts)
    new_views        = int(existing.get("views",        0)) + event_counts["view_device"]
    new_comparisons  = int(existing.get("comparisons",  0)) + event_counts["compare_devices"]
    new_recs         = int(existing.get("recommendations", 0)) + new_recommendations
    new_selections   = int(existing.get("selections",   0)) + event_counts["select_recommendation"]
    new_saves        = int(existing.get("saves",        0)) + event_counts["save_device"]
    new_dismissals   = int(existing.get("dismissals",   0)) + event_counts["dismiss_recommendation"]

    multiplier = _compute_network_multiplier(
        views=new_views,
        comparisons=new_comparisons,
        recommendations=new_recs,
        selections=new_selections,
        saves=new_saves,
        dismissals=new_dismissals,
    )

    now = datetime.now(timezone.utc).isoformat()

    supabase.table("device_network_stats").upsert(
        {
            "device_id":          device_id,
            "views":              new_views,
            "comparisons":        new_comparisons,
            "recommendations":    new_recs,
            "selections":         new_selections,
            "saves":              new_saves,
            "dismissals":         new_dismissals,
            "network_multiplier": multiplier,
            "last_aggregated_at": now,
            "updated_at":         now,
        },
        on_conflict="device_id",
    ).execute()

    logger.debug(
        f"[NetworkLearning] Device {device_id}: "
        f"views={new_views} sel={new_selections} multiplier={multiplier}"
    )
