"""
Spec Normalization Helpers
─────────────────────────
Converts raw key-value spec strings into typed, comparable numeric values.
All helpers are pure functions — no DB I/O, no side effects.
Designed to generalize across device categories, not hardcode per device.
"""

from __future__ import annotations
import re
from typing import Optional


# ── Generic parsers ────────────────────────────────────────────────────────────

def parse_float(value: Optional[str]) -> Optional[float]:
    """Extract first float from a string like '6.7 inches' → 6.7"""
    if not value:
        return None
    match = re.search(r"[-+]?\d*\.?\d+", str(value).replace(",", ""))
    return float(match.group()) if match else None


def parse_int(value: Optional[str]) -> Optional[int]:
    result = parse_float(value)
    return int(result) if result is not None else None


def parse_bool(value: Optional[str]) -> Optional[bool]:
    """Handles 'yes', '1', 'true', 'no', '0', 'false' (case-insensitive)"""
    if not value:
        return None
    v = str(value).strip().lower()
    if v in ("yes", "true", "1", "supported", "available"):
        return True
    if v in ("no", "false", "0", "none", "not available", "n/a"):
        return False
    return None


# ── Display normalizers ────────────────────────────────────────────────────────

def normalize_refresh_rate(value: Optional[str]) -> Optional[int]:
    """
    '120Hz', '90 Hz', '120' → 120
    Handles adaptive phrases like '1-120Hz' → picks max
    """
    if not value:
        return None
    nums = [int(x) for x in re.findall(r"\d+", str(value))]
    valid = [n for n in nums if 24 <= n <= 999]  # sane Hz range
    return max(valid) if valid else None


def normalize_resolution(value: Optional[str]) -> Optional[int]:
    """
    'FHD+', '1080x2400', '2K', '4K', 'QHD+' → total pixel count
    Returns pixel-row count (height) for comparison.
    """
    if not value:
        return None
    v = str(value).upper()
    # Named mappings first
    named = {
        "4K": 2160, "UHD": 2160,
        "QHD": 1440, "QHD+": 1600, "WQHD": 1440,
        "2K": 1440,
        "FHD": 1080, "FHD+": 1080, "FULL HD": 1080,
        "HD+": 900, "HD": 720,
        "LTPO": 1080,  # common AMOLED descriptor, assume FHD
    }
    for key, px in named.items():
        if key in v:
            return px
    # Try numeric patterns: WxH
    pairs = re.findall(r"(\d{3,4})\s*[x×]\s*(\d{3,4})", v)
    if pairs:
        w, h = int(pairs[0][0]), int(pairs[0][1])
        return max(w, h)
    return None


def normalize_panel_type(value: Optional[str]) -> str:
    """Map panel type to a quality tier string."""
    if not value:
        return "unknown"
    v = str(value).upper()
    if any(k in v for k in ("LTPO", "DYNAMIC AMOLED", "SUPER AMOLED", "OLED")):
        return "oled"
    if "IPS" in v or "LCD" in v:
        return "lcd"
    if "TFT" in v:
        return "tft"
    return "unknown"


# ── Performance normalizers ────────────────────────────────────────────────────

# Chipset performance tier map (higher = better).
# Covers major SoC lines as of 2024-2025.
# Add new chipsets here without changing scoring logic.
CHIPSET_PERFORMANCE_MAP: dict[str, int] = {
    # Apple
    "a18 pro": 100, "a18": 95, "a17 pro": 93, "a16 bionic": 88,
    "a15 bionic": 84, "a14 bionic": 79, "m4": 100, "m3": 97,
    # Qualcomm
    "snapdragon 8 elite": 98, "snapdragon 8 gen 3": 94,
    "snapdragon 8 gen 2": 90, "snapdragon 8 gen 1": 83,
    "snapdragon 888": 78, "snapdragon 870": 70, "snapdragon 860": 65,
    "snapdragon 7s gen 3": 72, "snapdragon 7 gen 3": 74,
    "snapdragon 7 gen 1": 65, "snapdragon 6 gen 1": 55,
    "snapdragon 695": 52, "snapdragon 680": 45, "snapdragon 665": 40,
    # Mediatek
    "dimensity 9400": 97, "dimensity 9300": 93, "dimensity 9200": 88,
    "dimensity 9000": 83, "dimensity 8300": 78, "dimensity 8200": 72,
    "dimensity 8050": 68, "dimensity 7300": 60, "dimensity 7200": 58,
    "dimensity 6300": 48, "dimensity 6100+": 44, "helio g99": 55,
    "helio g96": 48, "helio g85": 40, "helio g37": 30,
    # Samsung Exynos
    "exynos 2500": 94, "exynos 2400": 90, "exynos 2200": 80,
    "exynos 1480": 68, "exynos 1380": 62,
    # Google
    "tensor g4": 86, "tensor g3": 81, "tensor g2": 74,
}


def normalize_chipset(value: Optional[str]) -> int:
    """
    Returns a performance index 0–100.
    Fuzzy matches chipset name against known map.
    Defaults to 50 (mid-range placeholder) to avoid penalizing missing data.
    """
    if not value:
        return 50
    v = str(value).lower().strip()
    # Exact match first
    if v in CHIPSET_PERFORMANCE_MAP:
        return CHIPSET_PERFORMANCE_MAP[v]
    # Partial match: find the longest key that is a substring of value
    best_score = 50
    best_len = 0
    for key, score in CHIPSET_PERFORMANCE_MAP.items():
        if key in v and len(key) > best_len:
            best_score, best_len = score, len(key)
    return best_score


# ── Camera normalizers ─────────────────────────────────────────────────────────

def normalize_video_resolution(value: Optional[str]) -> int:
    """
    '8K video recording', '4K@60fps', '1080p' → resolution index (0-100)
    """
    if not value:
        return 0
    v = str(value).upper()
    if "8K" in v:
        return 100
    if "4K" in v:
        fps = re.search(r"@(\d+)\s*FPS", v)
        if fps and int(fps.group(1)) >= 120:
            return 90
        if fps and int(fps.group(1)) >= 60:
            return 80
        return 70
    if "1080" in v or "FHD" in v:
        return 50
    if "720" in v or "HD" in v:
        return 30
    return 20


# ── Battery normalizers ────────────────────────────────────────────────────────

def normalize_battery_endurance(mah: Optional[int], screen_size: Optional[float]) -> int:
    """
    Estimates battery endurance score (0–100) based on capacity and screen size.
    Larger screen drains more, so we normalize by expected draw.

    Endurance heuristic:
      - Base = mAh / 3000 * 50  (normalized to ~6000mAh = 100)
      - Apply screen penalty for larger screens
    """
    if not mah:
        return 0
    base = min((mah / 6000) * 100, 100)
    # Larger screens drain faster: penalty scaled per inch above 6.0
    if screen_size and screen_size > 6.0:
        penalty = (screen_size - 6.0) * 3.0  # e.g. 6.7" → -2.1
        base = max(base - penalty, 0)
    return round(base)


def normalize_charging_speed(watts: Optional[int]) -> int:
    """
    Charging wattage → score 0–100.
    65W = fast, 100W+ = flagship-fast.
    """
    if not watts or watts <= 0:
        return 0
    if watts >= 120:
        return 100
    if watts >= 100:
        return 92
    if watts >= 65:
        return 80
    if watts >= 45:
        return 68
    if watts >= 33:
        return 58
    if watts >= 25:
        return 48
    if watts >= 18:
        return 38
    return 20  # 10W or less (standard USB)
