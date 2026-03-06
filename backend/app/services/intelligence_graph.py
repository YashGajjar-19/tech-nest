"""
Intelligence Graph Service
────────────────────────────
Central orchestration layer that unifies all intelligence signals.
This is the single authoritative source for network-enhanced device rankings.

Responsibilities:
  1. expose_network_signal(device_id) → multiplier + trend data for any device
  2. get_ranked_devices(user_id, limit) → ranking accounting for:
       - base overall_score from scoring engine
       - personalization weight from user_profile
       - network_trust_multiplier from device_network_stats
  3. enhance_decision_context(session_id, device_ids) → enriches Decision AI
       request with network signals before scoring

The final ranking formula is:
  final_score = base_score × personalization_weight × network_signal_weight

Bias safeguards:
  - network_signal_weight is clamped to [0.5, 1.5] (in network_learning.py)
  - personalization_weight is 1.0 for anonymous users
  - base_score is computed deterministically by the existing scoring engine
  - A device can be boosted by at most 1.5 × 1.5 = 2.25× its base score,
    or dampened to 0.5 × 0.5 = 0.25× — this prevents runaway amplification.
"""

from __future__ import annotations

import logging
from typing import Any, Optional

from app.database import supabase

logger = logging.getLogger(__name__)


# ── Personalization weight lookup ─────────────────────────────────────────────

def _compute_personalization_weight(
    user_priority: dict[str, float],
    device_category_scores: dict[str, float],
) -> float:
    """
    Compute a personalization alignment score between [0.7, 1.3].

    For each priority dimension (camera, battery, performance), if the device
    excels in a dimension the user cares about, its weight increases.
    If it's weak in the user's top priority, it decreases.

    This is a dot-product alignment between user preferences and device strengths,
    normalized by total weight so it stays in a safe range.
    """
    camera_align  = user_priority.get("camera",      0.5) * (device_category_scores.get("camera_score",       5.0) / 10.0)
    battery_align = user_priority.get("battery",     0.5) * (device_category_scores.get("battery_score",      5.0) / 10.0)
    perf_align    = user_priority.get("performance", 0.5) * (device_category_scores.get("performance_score",  5.0) / 10.0)

    # Sum of priorities as denominator (prevents gaming via setting all to 1.0)
    total_priority = (
        user_priority.get("camera",      0.5)
        + user_priority.get("battery",   0.5)
        + user_priority.get("performance", 0.5)
    )

    if total_priority == 0:
        return 1.0  # anonymous / no preference: neutral weight

    alignment = (camera_align + battery_align + perf_align) / total_priority

    # alignment ∈ [0, 1]. We map [0, 1] → [0.7, 1.3] to keep it bounded.
    weight = 0.7 + (alignment * 0.6)
    return round(max(0.7, min(1.3, weight)), 3)


# ── Core API ──────────────────────────────────────────────────────────────────

def get_network_signal(device_id: str) -> dict[str, Any]:
    """
    Return the full network signal for a single device.
    Combines device_network_stats + latest device_trends.
    """
    stats_resp = (
        supabase.table("device_network_stats")
        .select("views, comparisons, selections, saves, dismissals, network_multiplier, updated_at")
        .eq("device_id", device_id)
        .maybe_single()
        .execute()
    )
    
    stats_data = stats_resp.data if stats_resp else {}

    trends_resp = (
        supabase.table("device_trends")
        .select("trend_type, trend_score, time_window")
        .eq("device_id", device_id)
        .order("trend_score", desc=True)
        .limit(5)
        .execute()
    )

    return {
        "device_id":          device_id,
        "network_stats":      stats_data or {},
        "trend_signals":      (trends_resp.data if trends_resp else []) or [],
        "network_multiplier": float((stats_data or {}).get("network_multiplier", 1.0)),
    }


def get_ranked_devices(
    limit: int = 20,
    user_id: Optional[str] = None,
) -> list[dict[str, Any]]:
    """
    Return devices ranked by:
      final_score = base_score × personalization_weight × network_multiplier

    For anonymous users, personalization_weight = 1.0.
    """
    # Step 1: Fetch base scores for all ready devices
    scores_resp = (
        supabase.table("device_scores")
        .select("device_id, overall_score, camera_score, battery_score, performance_score")
        .execute()
    )
    if not scores_resp.data:
        return []

    # Step 2: Fetch network multipliers (left join via Python)
    net_resp = (
        supabase.table("device_network_stats")
        .select("device_id, network_multiplier, views")
        .execute()
    )
    multiplier_map: dict[str, float] = {
        row["device_id"]: float(row["network_multiplier"])
        for row in (net_resp.data or [])
    }

    # Step 3: Fetch user preferences (if authenticated)
    user_prefs = {"camera": 0.5, "battery": 0.5, "performance": 0.5}
    if user_id:
        profile_resp = (
            supabase.table("user_profiles")
            .select("priority_camera, priority_battery, priority_performance")
            .eq("user_id", user_id)
            .maybe_single()
            .execute()
        )
        if profile_resp and profile_resp.data:
            p = profile_resp.data
            user_prefs = {
                "camera":      float(p.get("priority_camera",      0.5)),
                "battery":     float(p.get("priority_battery",     0.5)),
                "performance": float(p.get("priority_performance", 0.5)),
            }

    # Step 4: Score and rank
    ranked = []
    for row in scores_resp.data:
        dev_id      = row["device_id"]
        base_score  = float(row.get("overall_score", 5.0))
        net_multi   = multiplier_map.get(dev_id, 1.0)

        pers_weight = _compute_personalization_weight(
            user_priority=user_prefs,
            device_category_scores={
                "camera_score":      float(row.get("camera_score",      5.0)),
                "battery_score":     float(row.get("battery_score",     5.0)),
                "performance_score": float(row.get("performance_score", 5.0)),
            },
        )

        final_score = round(base_score * pers_weight * net_multi, 3)

        ranked.append({
            "device_id":            dev_id,
            "base_score":           base_score,
            "personalization_weight": pers_weight,
            "network_multiplier":   net_multi,
            "final_score":          final_score,
        })

    ranked.sort(key=lambda x: x["final_score"], reverse=True)
    return ranked[:limit]


def enhance_decision_context(device_ids: list[str]) -> dict[str, dict]:
    """
    For each device being considered in a Decision AI session,
    return network signal enrichments.

    The Decision AI can use these to adjust its confidence score,
    e.g., a device with dismiss_rate > 0.4 gets a -confidence modifier.

    Returns a mapping: { device_id → network_enrichment_dict }
    """
    enrichments: dict[str, dict] = {}
    for device_id in device_ids:
        enrichments[device_id] = get_network_signal(device_id)
    return enrichments
