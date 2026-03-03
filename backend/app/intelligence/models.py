"""
Pydantic models for Intelligence Engine data contracts.
These are internal DTOs — not DB models.
"""

from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class IntelligenceStatus(str, Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    READY = "ready"
    FAILED = "failed"


class PriceSegment(str, Enum):
    BUDGET = "budget"          # < $300
    MID = "mid"                # $300–$699
    PREMIUM = "premium"        # $700–$999
    ULTRA = "ultra"            # $1000+


class PerformanceTier(str, Enum):
    ENTRY = "entry"
    MID = "mid"
    HIGH = "high"
    FLAGSHIP = "flagship"


class CameraTier(str, Enum):
    BASIC = "basic"
    GOOD = "good"
    GREAT = "great"
    EXCEPTIONAL = "exceptional"


# ── Raw device data fetched from DB ──────────────────────────────────────────

class RawDeviceSpecs(BaseModel):
    device_id: str
    name: str
    price: Optional[float] = None
    specs: Dict[str, str] = Field(default_factory=dict)
    # Parsed numeric values (populated by normalizer)
    screen_size: Optional[float] = None
    refresh_rate: Optional[int] = None
    panel_type: Optional[str] = None
    resolution: Optional[str] = None
    chipset: Optional[str] = None
    ram_gb: Optional[int] = None
    storage_gb: Optional[int] = None
    main_camera_mp: Optional[int] = None
    front_camera_mp: Optional[int] = None
    video_recording: Optional[str] = None
    battery_mah: Optional[int] = None
    charging_w: Optional[int] = None
    wireless_charging: Optional[bool] = None
    has_5g: Optional[bool] = None
    wifi: Optional[str] = None
    nfc: Optional[bool] = None


# ── Scoring output ────────────────────────────────────────────────────────────

class CategoryScores(BaseModel):
    display_score: float = 0.0
    performance_score: float = 0.0
    camera_score: float = 0.0
    battery_score: float = 0.0
    design_score: float = 0.0
    software_score: float = 0.0
    overall_score: float = 0.0


# ── AI Insight output ─────────────────────────────────────────────────────────

class AIInsightOutput(BaseModel):
    summary: str
    pros: List[str]
    cons: List[str]
    best_for: List[str]
    avoid_if: List[str]


# ── Search index output ───────────────────────────────────────────────────────

class SearchIndexOutput(BaseModel):
    search_text: str
    keywords: List[str]
    price_segment: PriceSegment
    performance_tier: PerformanceTier
    camera_tier: CameraTier


# ── Pipeline result ────────────────────────────────────────────────────────────

class IntelligencePipelineResult(BaseModel):
    device_id: str
    status: IntelligenceStatus
    scores: Optional[CategoryScores] = None
    insights: Optional[AIInsightOutput] = None
    search_index: Optional[SearchIndexOutput] = None
    competitors_linked: int = 0
    error: Optional[str] = None
    completed_at: Optional[datetime] = None
