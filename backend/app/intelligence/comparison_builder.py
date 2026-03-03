"""
Comparison Builder
──────────────────
Automatically creates competitor relationships between devices
based on price segment, performance tier, and device category similarity.

Logic:
  - Fetch devices in the same price segment AND performance tier
  - Score the "similarity" between devices (price delta, perf delta)
  - Insert COMPETITOR relationships for the top N best matches
  - Skip self-relationships and already-existing relationships
  - Idempotent: uses UPSERT to avoid duplicates
"""

from __future__ import annotations
import logging
import math
from typing import Optional

from app.db.supabase import supabase
from app.intelligence.models import PriceSegment, PerformanceTier
from app.intelligence.scoring_engine import (
    classify_price_segment,
    classify_performance_tier,
)

logger = logging.getLogger(__name__)

MAX_COMPETITORS = 5  # Max relationships to create per device


def _get_device_context(device_id: str) -> Optional[dict]:
    """Fetches price + scores for a device to determine its tiers."""
    dev_resp = (
        supabase.table("devices")
        .select("id, name, price")
        .eq("id", device_id)
        .maybe_single()
        .execute()
    )
    if not dev_resp.data:
        return None

    score_resp = (
        supabase.table("device_scores")
        .select("performance_score, overall_score")
        .eq("device_id", device_id)
        .maybe_single()
        .execute()
    )

    dev = dev_resp.data
    scores = score_resp.data or {}

    return {
        "id": dev["id"],
        "name": dev.get("name"),
        "price": dev.get("price"),
        "performance_score": scores.get("performance_score", 5.0),
        "overall_score": scores.get("overall_score", 5.0),
    }


def _get_existing_relationships(device_id: str) -> set[str]:
    """Returns set of target device IDs already related to source."""
    resp = (
        supabase.table("device_relationships")
        .select("target_device_id")
        .eq("source_device_id", device_id)
        .eq("relationship_type", "COMPETITOR")
        .execute()
    )
    return {row["target_device_id"] for row in (resp.data or [])}


def _compute_similarity_weight(source: dict, candidate: dict) -> float:
    """
    Returns a similarity weight in [0.0, 1.0].
    Higher = more similar → stronger competitor relationship.
    Based on: price proximity + performance proximity.
    """
    src_price = source["price"] or 500
    cand_price = candidate["price"] or 500
    src_perf = source["performance_score"] or 5.0
    cand_perf = candidate["performance_score"] or 5.0

    # Price similarity: max penalty at $300 delta
    price_diff = abs(src_price - cand_price)
    price_sim = max(0.0, 1.0 - (price_diff / 300))

    # Performance similarity: max penalty at 3.0 score delta
    perf_diff = abs(src_perf - cand_perf)
    perf_sim = max(0.0, 1.0 - (perf_diff / 3.0))

    # Equal weighting
    return round((price_sim * 0.5) + (perf_sim * 0.5), 2)


def run_comparison_builder(device_id: str) -> int:
    """
    Builds automatic competitor relationships for a device.

    Steps:
      1. Determine source device's price segment + performance tier
      2. Query all other devices in same segment/tier with scores
      3. Compute similarity weights
      4. Insert top N COMPETITOR relationships (upsert — idempotent)

    Returns:
        Number of competitor relationships created/updated.
    """
    logger.info(f"[Comparison] Building competitors for {device_id}")

    source = _get_device_context(device_id)
    if not source:
        raise ValueError(f"Device {device_id} not found or missing scores")

    price_segment = classify_price_segment(source["price"])
    perf_tier = classify_performance_tier(source["performance_score"])

    logger.info(
        f"[Comparison] Device context: price_segment={price_segment}, "
        f"perf_tier={perf_tier}, price=${source['price']}"
    )

    # Fetch all OTHER devices that have scoring data
    candidates_resp = (
        supabase.table("device_scores")
        .select("device_id, performance_score, overall_score")
        .neq("device_id", device_id)
        .execute()
    )

    if not candidates_resp.data:
        logger.info("[Comparison] No other scored devices found.")
        return 0

    # Enrich candidates with price data
    all_candidate_ids = [r["device_id"] for r in candidates_resp.data]
    prices_resp = (
        supabase.table("devices")
        .select("id, price")
        .in_("id", all_candidate_ids)
        .execute()
    )
    price_map = {d["id"]: d.get("price") for d in (prices_resp.data or [])}

    # Build scored candidates list
    scored_candidates = []
    for row in candidates_resp.data:
        cid = row["device_id"]
        price = price_map.get(cid)
        candidate_price_seg = classify_price_segment(price)
        candidate_perf_tier = classify_performance_tier(row.get("performance_score", 5.0))

        # Filter: same price segment (required) OR adjacent tier (allowed)
        same_price = candidate_price_seg == price_segment
        adjacent_price = abs(
            list(PriceSegment).index(candidate_price_seg)
            - list(PriceSegment).index(price_segment)
        ) <= 1

        if not (same_price or adjacent_price):
            continue

        candidate = {
            "id": cid,
            "price": price,
            "performance_score": row.get("performance_score", 5.0),
            "overall_score": row.get("overall_score", 5.0),
        }
        weight = _compute_similarity_weight(source, candidate)
        scored_candidates.append((candidate, weight))

    # Sort by similarity descending, take top N
    scored_candidates.sort(key=lambda x: x[1], reverse=True)
    top_competitors = scored_candidates[:MAX_COMPETITORS]

    if not top_competitors:
        logger.info("[Comparison] No suitable competitors found.")
        return 0

    existing = _get_existing_relationships(device_id)

    # Insert relationships
    rows_to_insert = []
    for candidate, weight in top_competitors:
        cid = candidate["id"]
        if cid in existing:
            logger.debug(f"[Comparison] Relationship already exists for {device_id} → {cid}")
        rows_to_insert.append({
            "source_device_id": device_id,
            "target_device_id": cid,
            "relationship_type": "COMPETITOR",
            "weight": weight,
        })

    if rows_to_insert:
        supabase.table("device_relationships").upsert(
            rows_to_insert,
            on_conflict="source_device_id,target_device_id,relationship_type",
        ).execute()

    count = len(rows_to_insert)
    logger.info(f"[Comparison] Created/updated {count} competitor relationships for {device_id}")
    return count
