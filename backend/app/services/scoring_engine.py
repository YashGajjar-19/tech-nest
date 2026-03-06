"""
Tech Nest Scoring Engine
─────────────────────────
Deterministic, weight-based scoring with no AI involvement.
Each category is scored 0.0–10.0.
Overall score is a weighted average of category scores.

Design principles:
  - All weights live in SCORING_WEIGHTS (single source of truth)
  - Each scorer returns a float in [0, 10], never outside
  - Logic is additive — start at 0, earn points (no penalties that go below 0)
  - Missing specs reduce the achievable max, never crash the pipeline
  - Adding a new spec = add normalizer + add to the relevant scorer
"""

from __future__ import annotations
import logging
from typing import Optional

from app.database import supabase
from app.models.decision import (
    RawDeviceSpecs,
    CategoryScores,
    PerformanceTier,
    CameraTier,
    PriceSegment,
)
from app.utils.normalization import (
    parse_float, parse_int, parse_bool,
    normalize_refresh_rate, normalize_resolution, normalize_panel_type,
    normalize_chipset, normalize_video_resolution,
    normalize_battery_endurance, normalize_charging_speed,
)

logger = logging.getLogger(__name__)

# ── Scoring weights ───────────────────────────────────────────────────────────
# Weights MUST sum to 1.0. Adjust here to change platform priorities.

SCORING_WEIGHTS: dict[str, float] = {
    "display": 0.20,
    "performance": 0.25,
    "camera": 0.20,
    "battery": 0.18,
    "design": 0.07,   # Proxy: screen-to-body, wireless charging, 5G
    "software": 0.10,  # Proxy: connectivity quality, NFC, OS signals
}

assert abs(sum(SCORING_WEIGHTS.values()) - 1.0) < 1e-9, "Scoring weights must sum to 1.0"


def _clamp(value: float, lo: float = 0.0, hi: float = 10.0) -> float:
    return max(lo, min(hi, value))


# ── Data fetcher ──────────────────────────────────────────────────────────────

def fetch_device_specs(device_id: str) -> RawDeviceSpecs:
    """
    Fetches device core data + all key-value specs from device_specs table.
    Returns a hydrated RawDeviceSpecs DTO.
    """
    # Core device data
    dev_resp = (
        supabase.table("devices")
        .select("id, name, price")
        .eq("id", device_id)
        .single()
        .execute()
    )
    if not dev_resp.data:
        raise ValueError(f"Device {device_id} not found")

    dev = dev_resp.data

    # All spec key-values
    spec_resp = (
        supabase.table("device_specs")
        .select("spec_key, spec_value")
        .eq("device_id", device_id)
        .neq("spec_key", "variants")
        .execute()
    )
    specs: dict[str, str] = {}
    for row in (spec_resp.data or []):
        if row.get("spec_key") and row.get("spec_value") is not None:
            specs[row["spec_key"]] = str(row["spec_value"])

    # Hydrate typed fields
    raw = RawDeviceSpecs(
        device_id=device_id,
        name=dev.get("name", ""),
        price=dev.get("price"),
        specs=specs,
        screen_size=parse_float(specs.get("screen_size")),
        refresh_rate=normalize_refresh_rate(specs.get("refresh_rate")),
        panel_type=normalize_panel_type(specs.get("panel_type")),
        resolution=specs.get("resolution"),
        chipset=specs.get("chipset"),
        ram_gb=parse_int(specs.get("ram_gb")),
        storage_gb=parse_int(specs.get("storage_gb")),
        main_camera_mp=parse_int(specs.get("main_camera_mp")),
        front_camera_mp=parse_int(specs.get("front_camera_mp")),
        video_recording=specs.get("video_recording"),
        battery_mah=parse_int(specs.get("battery_mah")),
        charging_w=parse_int(specs.get("charging_w")),
        wireless_charging=parse_bool(specs.get("wireless_charging")),
        has_5g=parse_bool(specs.get("5g")),
        wifi=specs.get("wifi"),
        nfc=parse_bool(specs.get("nfc")),
    )
    return raw


# ── Category scorers ─────────────────────────────────────────────────────────

def score_display(specs: RawDeviceSpecs) -> float:
    """
    Evaluates: refresh rate, resolution, panel quality, screen size.
    Max base = 10.0
    """
    score = 0.0

    # Refresh rate (max 3.0 pts)
    rr = specs.refresh_rate or 60
    if rr >= 144:
        score += 3.0
    elif rr >= 120:
        score += 2.7
    elif rr >= 90:
        score += 2.0
    elif rr >= 60:
        score += 1.2

    # Panel type (max 3.0 pts)
    panel = specs.panel_type or "unknown"
    if panel == "oled":
        score += 3.0
    elif panel == "lcd":
        score += 1.5
    elif panel == "tft":
        score += 0.5

    # Resolution (max 2.5 pts)
    res_str = specs.resolution or ""
    res_px = normalize_resolution(res_str)
    if res_px:
        if res_px >= 1440:
            score += 2.5
        elif res_px >= 1080:
            score += 1.8
        elif res_px >= 900:
            score += 1.0
        elif res_px >= 720:
            score += 0.5

    # Screen size sweet spot (max 1.5 pts)
    size = specs.screen_size
    if size:
        if 6.1 <= size <= 6.8:
            score += 1.5  # optimal zone
        elif 5.8 <= size < 6.1 or 6.8 < size <= 7.2:
            score += 1.0
        else:
            score += 0.5

    return _clamp(score)


def score_performance(specs: RawDeviceSpecs) -> float:
    """
    Evaluates: chipset tier, RAM, storage generosity.
    Max base = 10.0
    """
    score = 0.0

    # Chipset (max 5.5 pts)
    chipset_index = normalize_chipset(specs.chipset)
    score += (chipset_index / 100) * 5.5

    # RAM (max 2.5 pts)
    ram = specs.ram_gb or 0
    if ram >= 16:
        score += 2.5
    elif ram >= 12:
        score += 2.0
    elif ram >= 8:
        score += 1.5
    elif ram >= 6:
        score += 1.0
    elif ram >= 4:
        score += 0.5

    # Storage (max 2.0 pts)
    storage = specs.storage_gb or 0
    if storage >= 512:
        score += 2.0
    elif storage >= 256:
        score += 1.5
    elif storage >= 128:
        score += 1.0
    elif storage >= 64:
        score += 0.5

    return _clamp(score)


def score_camera(specs: RawDeviceSpecs) -> float:
    """
    Evaluates: main MP, front MP, video capability.
    NOTE: MP is a proxy, not ground truth. High MP ≠ better photo.
    We cap MP benefit at a reasonable ceiling to avoid inflation.
    """
    score = 0.0

    # Main camera (max 4.5 pts)
    mp = specs.main_camera_mp or 0
    if mp >= 200:
        score += 4.5
    elif mp >= 108:
        score += 4.0
    elif mp >= 64:
        score += 3.3
    elif mp >= 50:
        score += 3.0
    elif mp >= 48:
        score += 2.7
    elif mp >= 32:
        score += 2.2
    elif mp >= 16:
        score += 1.5
    elif mp > 0:
        score += 0.8

    # Front camera (max 2.0 pts)
    fmp = specs.front_camera_mp or 0
    if fmp >= 32:
        score += 2.0
    elif fmp >= 20:
        score += 1.5
    elif fmp >= 12:
        score += 1.2
    elif fmp >= 8:
        score += 0.8
    elif fmp > 0:
        score += 0.4

    # Video capability (max 3.5 pts)
    video_score = normalize_video_resolution(specs.video_recording)
    score += (video_score / 100) * 3.5

    return _clamp(score)


def score_battery(specs: RawDeviceSpecs) -> float:
    """
    Evaluates: capacity with screen-size endurance estimate,
    fast charging speed, wireless charging bonus.
    """
    score = 0.0

    # Battery endurance (max 5.5 pts)
    endurance = normalize_battery_endurance(specs.battery_mah, specs.screen_size)
    score += (endurance / 100) * 5.5

    # Charging speed (max 3.0 pts)
    charging_index = normalize_charging_speed(specs.charging_w)
    score += (charging_index / 100) * 3.0

    # Wireless charging bonus (max 1.5 pts)
    if specs.wireless_charging is True:
        score += 1.5

    return _clamp(score)


def score_design(specs: RawDeviceSpecs) -> float:
    """
    Proxy metrics for build quality/design tier:
    5G support, NFC, wireless charging as signals of a premium build.
    Real design score would require image analysis (Phase 2 AI feature).
    """
    score = 5.0  # Base: assume average design

    if specs.has_5g is True:
        score += 2.0
    elif specs.has_5g is False:
        score -= 1.5

    if specs.nfc is True:
        score += 1.5

    if specs.wireless_charging is True:
        score += 1.5

    return _clamp(score)


def score_software(specs: RawDeviceSpecs) -> float:
    """
    Proxy metrics for software/ecosystem quality:
    WiFi generation, Bluetooth presence, 5G (also a software/modem proxy).
    Real software score would factor in OS update policy (Phase 2 data).
    """
    score = 4.0  # Base: assume standard software

    wifi = (specs.wifi or "").upper()
    if "7" in wifi or "WI-FI 7" in wifi:
        score += 3.0
    elif "6E" in wifi or "WI-FI 6E" in wifi:
        score += 2.5
    elif "6" in wifi or "WI-FI 6" in wifi:
        score += 2.0
    elif "5" in wifi or "AC" in wifi:
        score += 1.2
    elif wifi:
        score += 0.5

    if specs.nfc is True:
        score += 1.0

    if specs.has_5g is True:
        score += 2.0

    return _clamp(score)


# ── Overall ────────────────────────────────────────────────────────────────────

def compute_overall_score(
    display: float,
    performance: float,
    camera: float,
    battery: float,
    design: float,
    software: float,
) -> float:
    """Weighted average of all category scores, rounded to 1 decimal."""
    weighted = (
        display * SCORING_WEIGHTS["display"]
        + performance * SCORING_WEIGHTS["performance"]
        + camera * SCORING_WEIGHTS["camera"]
        + battery * SCORING_WEIGHTS["battery"]
        + design * SCORING_WEIGHTS["design"]
        + software * SCORING_WEIGHTS["software"]
    )
    return round(_clamp(weighted), 1)


# ── Tier classifiers ──────────────────────────────────────────────────────────

def classify_performance_tier(perf_score: float) -> PerformanceTier:
    if perf_score >= 8.0:
        return PerformanceTier.FLAGSHIP
    if perf_score >= 6.5:
        return PerformanceTier.HIGH
    if perf_score >= 4.5:
        return PerformanceTier.MID
    return PerformanceTier.ENTRY


def classify_camera_tier(camera_score: float) -> CameraTier:
    if camera_score >= 8.0:
        return CameraTier.EXCEPTIONAL
    if camera_score >= 6.5:
        return CameraTier.GREAT
    if camera_score >= 4.5:
        return CameraTier.GOOD
    return CameraTier.BASIC


def classify_price_segment(price: Optional[float]) -> PriceSegment:
    if price is None:
        return PriceSegment.MID  # safe default
    if price >= 1000:
        return PriceSegment.ULTRA
    if price >= 700:
        return PriceSegment.PREMIUM
    if price >= 300:
        return PriceSegment.MID
    return PriceSegment.BUDGET


# ── Main entry point ──────────────────────────────────────────────────────────

def run_scoring_engine(device_id: str) -> CategoryScores:
    """
    Full scoring pipeline for a single device.
    1. Fetch specs from DB
    2. Run all category scorers
    3. Persist to device_scores (upsert — idempotent)
    4. Return structured CategoryScores DTO
    """
    logger.info(f"[Scoring] Starting for device {device_id}")

    specs = fetch_device_specs(device_id)

    display   = score_display(specs)
    perf      = score_performance(specs)
    camera    = score_camera(specs)
    battery   = score_battery(specs)
    design    = score_design(specs)
    software  = score_software(specs)
    overall   = compute_overall_score(display, perf, camera, battery, design, software)

    scores = CategoryScores(
        display_score=int(round(display)),
        performance_score=int(round(perf)),
        camera_score=int(round(camera)),
        battery_score=int(round(battery)),
        design_score=int(round(design)),
        software_score=int(round(software)),
        overall_score=int(round(overall)),
    )

    # Persist (upsert — safe to run multiple times)
    supabase.table("device_scores").upsert(
        {
            "device_id": device_id,
            "display_score": scores.display_score,
            "performance_score": scores.performance_score,
            "camera_score": scores.camera_score,
            "battery_score": scores.battery_score,
            "design_score": scores.design_score,
            "software_score": scores.software_score,
            "overall_score": scores.overall_score,
        },
        on_conflict="device_id",
    ).execute()

    logger.info(f"[Scoring] Done for {device_id} → overall={overall}")
    return scores
