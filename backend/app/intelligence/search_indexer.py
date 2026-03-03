"""
Search Indexer
──────────────
Generates a flat, searchable text representation of a device plus
structured metadata (tiers, keywords) for faceted search.

Design:
  - search_text: a denormalized blob for full-text search (Postgres tsvector / Supabase search)
  - keywords: discrete tags for filter chips in the UI
  - tiers: price_segment, performance_tier, camera_tier for faceted filtering

All data is derived from existing scores + specs — no additional DB reads needed
beyond what the scoring engine already fetched.
"""

from __future__ import annotations
import logging
from typing import List

from app.db.supabase import supabase
from app.intelligence.models import (
    RawDeviceSpecs,
    CategoryScores,
    SearchIndexOutput,
    PriceSegment,
    PerformanceTier,
    CameraTier,
)
from app.intelligence.scoring_engine import (
    classify_price_segment,
    classify_performance_tier,
    classify_camera_tier,
)

logger = logging.getLogger(__name__)


def _build_search_text(device_name: str, specs: RawDeviceSpecs) -> str:
    """
    Constructs a denormalized full-text search blob.
    Includes all human-readable spec values + device name.
    Used with pg_tsvector or ILIKE in Supabase.
    """
    parts = [device_name]

    if specs.chipset:
        parts.append(specs.chipset)
    if specs.ram_gb:
        parts.append(f"{specs.ram_gb}GB RAM")
    if specs.storage_gb:
        parts.append(f"{specs.storage_gb}GB storage")
    if specs.screen_size:
        parts.append(f"{specs.screen_size} inch display")
    if specs.refresh_rate:
        parts.append(f"{specs.refresh_rate}Hz refresh rate")
    if specs.panel_type:
        parts.append(specs.panel_type)
    if specs.main_camera_mp:
        parts.append(f"{specs.main_camera_mp}MP camera")
    if specs.battery_mah:
        parts.append(f"{specs.battery_mah}mAh battery")
    if specs.charging_w:
        parts.append(f"{specs.charging_w}W fast charging")
    if specs.wireless_charging:
        parts.append("wireless charging")
    if specs.has_5g:
        parts.append("5G")
    if specs.nfc:
        parts.append("NFC")
    if specs.price:
        parts.append(f"${int(specs.price)}")

    return " ".join(parts)


def _build_keywords(
    specs: RawDeviceSpecs,
    scores: CategoryScores,
    price_segment: PriceSegment,
    perf_tier: PerformanceTier,
    camera_tier: CameraTier,
) -> List[str]:
    """
    Builds a discrete keyword list for filter & recommendation chips.
    Keywords are lowercase, hyphenated for consistency.
    """
    keywords: List[str] = []

    # Tier keywords
    keywords.append(price_segment.value)
    keywords.append(f"{perf_tier.value}-performance")
    keywords.append(f"{camera_tier.value}-camera")

    # Feature keywords
    if specs.has_5g:
        keywords.append("5g")
    if specs.nfc:
        keywords.append("nfc")
    if specs.wireless_charging:
        keywords.append("wireless-charging")
    if specs.charging_w and specs.charging_w >= 65:
        keywords.append("fast-charging")
    if specs.refresh_rate and specs.refresh_rate >= 120:
        keywords.append("high-refresh-display")
    if specs.panel_type == "oled":
        keywords.append("oled-display")

    # Score-derived keywords
    if scores.battery_score >= 8.0:
        keywords.append("long-battery-life")
    if scores.performance_score >= 8.0:
        keywords.append("flagship-performance")
    if scores.camera_score >= 8.0:
        keywords.append("exceptional-camera")
    if scores.display_score >= 8.0:
        keywords.append("premium-display")

    # Value keyword: high overall score for price
    if specs.price and scores.overall_score >= 7.5 and price_segment in (
        PriceSegment.BUDGET, PriceSegment.MID
    ):
        keywords.append("best-value")

    return list(set(keywords))  # deduplicate


def run_search_indexer(
    device_id: str,
    specs: RawDeviceSpecs,
    scores: CategoryScores,
) -> SearchIndexOutput:
    """
    Generates and persists the search index for a device.
    Idempotent (upsert) — safe to run on re-index.

    Args:
        device_id: Target device UUID.
        specs: Pre-fetched hydrated spec DTO.
        scores: Pre-computed category scores.

    Returns:
        SearchIndexOutput
    """
    logger.info(f"[Search Indexer] Building index for {device_id}")

    price_segment   = classify_price_segment(specs.price)
    perf_tier       = classify_performance_tier(scores.performance_score)
    camera_tier     = classify_camera_tier(scores.camera_score)

    search_text = _build_search_text(specs.name, specs)
    keywords    = _build_keywords(specs, scores, price_segment, perf_tier, camera_tier)

    index = SearchIndexOutput(
        search_text=search_text,
        keywords=keywords,
        price_segment=price_segment,
        performance_tier=perf_tier,
        camera_tier=camera_tier,
    )

    # Persist (upsert — idempotent)
    supabase.table("device_search_index").upsert(
        {
            "device_id": device_id,
            "search_text": index.search_text,
            "keywords": index.keywords,
            "price_segment": index.price_segment.value,
            "performance_tier": index.performance_tier.value,
            "camera_tier": index.camera_tier.value,
        },
        on_conflict="device_id",
    ).execute()

    logger.info(
        f"[Search Indexer] Done for {device_id}: "
        f"price={price_segment}, perf={perf_tier}, camera={camera_tier}, "
        f"keywords={len(keywords)}"
    )
    return index
