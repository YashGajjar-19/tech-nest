"""
Collective Intelligence Service
────────────────────────────────
Derives aggregate behavioral insights from the interaction log —
without AI hallucination. Pure statistical extraction.

Insights generated:
  1. Popular upgrade paths: Which device does users upgrade FROM → TO based on
     ownership→decision co-occurrence in the same user.
  2. Brand affinity patterns: Which brands are disproportionately saved vs dismissed.
  3. Emerging device momentum: Devices rising fastest in the 7-day trend window.
  4. User preference shifts: Aggregate priority_camera / priority_battery / priority_performance
     direction from user_profiles — tracks if the platform's user base is shifting tastes.

Design:
  - All queries run against already-aggregated tables (device_network_stats, device_trends,
    user_profiles) — NOT against raw interaction_events — to keep this service fast.
  - Results are not persisted to a table; this is an on-demand queryable intelligence layer
    consumed by the Intelligence Graph and the Advisor Feed.
  - Called by: GET /api/v1/network/insights (admin), and intelligence_graph.py.
"""

from __future__ import annotations

import logging
from collections import defaultdict
from datetime import datetime, timedelta, timezone
from typing import Any

from app.database import supabase

logger = logging.getLogger(__name__)


def get_popular_upgrade_paths(limit: int = 10) -> list[dict]:
    """
    Find the most common device pairs where:
      - User had device A as 'previous'
      - User made a decision choosing device B
    The co-occurrence of (A → B) is an upgrade path signal.
    """
    # Fetch users who have at least one 'previous' device
    prev_resp = (
        supabase.table("user_devices")
        .select("user_id, device_id")
        .eq("ownership_status", "previous")
        .execute()
    )

    # Fetch all decisions with chosen_device_id
    dec_resp = (
        supabase.table("user_decisions")
        .select("user_id, chosen_device_id")
        .execute()
    )

    # Build user → previous_devices map
    user_prev: dict[str, list[str]] = defaultdict(list)
    for row in (prev_resp.data or []):
        user_prev[row["user_id"]].append(row["device_id"])

    # Count (from_device, to_device) pairs
    path_counts: dict[tuple[str, str], int] = defaultdict(int)
    for row in (dec_resp.data or []):
        uid = row["user_id"]
        to_dev = row["chosen_device_id"]
        for from_dev in user_prev.get(uid, []):
            if from_dev != to_dev:
                path_counts[(from_dev, to_dev)] += 1

    # Sort by frequency, return top-N
    sorted_paths = sorted(path_counts.items(), key=lambda x: x[1], reverse=True)[:limit]

    results = []
    for (from_dev, to_dev), count in sorted_paths:
        results.append({
            "from_device_id": from_dev,
            "to_device_id":   to_dev,
            "frequency":      count,
        })

    return results


def get_brand_affinity_patterns() -> list[dict]:
    """
    Compare save_rate vs dismiss_rate per brand to surface brand affinity signals.
    A brand with saves >> dismissals has user affinity.
    """
    # Fetch device → brand mapping
    brands_resp = supabase.table("devices").select("id, brand").execute()
    device_brand: dict[str, str] = {r["id"]: r["brand"] for r in (brands_resp.data or [])}

    # Fetch network stats
    stats_resp = (
        supabase.table("device_network_stats")
        .select("device_id, saves, dismissals, views")
        .execute()
    )

    brand_saves: dict[str, int]      = defaultdict(int)
    brand_dismissals: dict[str, int] = defaultdict(int)
    brand_views: dict[str, int]      = defaultdict(int)

    for row in (stats_resp.data or []):
        brand = device_brand.get(row["device_id"])
        if brand:
            brand_saves[brand]      += int(row.get("saves",      0))
            brand_dismissals[brand] += int(row.get("dismissals", 0))
            brand_views[brand]      += int(row.get("views",      0))

    results = []
    for brand in set(list(brand_saves.keys()) + list(brand_dismissals.keys())):
        v = brand_views.get(brand, 0)
        s = brand_saves.get(brand, 0)
        d = brand_dismissals.get(brand, 0)
        if v < 20:
            continue  # insufficient data

        affinity_score = round((s - d) / max(v, 1), 4)
        results.append({
            "brand":          brand,
            "saves":          s,
            "dismissals":     d,
            "total_views":    v,
            "affinity_score": affinity_score,  # positive = users like, negative = users reject
        })

    results.sort(key=lambda x: x["affinity_score"], reverse=True)
    return results


def get_emerging_devices(limit: int = 10) -> list[dict]:
    """
    Return devices with the highest rising_interest trend score in the 7-day window.
    These are the devices gaining momentum right now.
    """
    resp = (
        supabase.table("device_trends")
        .select("device_id, trend_score, calculated_at, devices(name, brand)")
        .eq("trend_type", "rising_interest")
        .eq("time_window", "7d")
        .order("trend_score", desc=True)
        .limit(limit)
        .execute()
    )
    return resp.data or []


def get_preference_shift_snapshot() -> dict[str, Any]:
    """
    Compute the platform's aggregate user preference vector.
    Tracks whether the user base is shifting toward camera, battery, or performance.
    Useful for editorial + AI weighting decisions.
    """
    resp = (
        supabase.table("user_profiles")
        .select("priority_camera, priority_battery, priority_performance")
        .execute()
    )
    rows = resp.data or []
    if not rows:
        return {"camera": 0.5, "battery": 0.5, "performance": 0.5, "sample_size": 0}

    n = len(rows)
    avg_camera  = sum(float(r.get("priority_camera",      0.5)) for r in rows) / n
    avg_battery = sum(float(r.get("priority_battery",     0.5)) for r in rows) / n
    avg_perf    = sum(float(r.get("priority_performance", 0.5)) for r in rows) / n

    return {
        "camera":      round(avg_camera,  3),
        "battery":     round(avg_battery, 3),
        "performance": round(avg_perf,    3),
        "sample_size": n,
    }
