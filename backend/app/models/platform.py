"""
Platform API Key Models
────────────────────────
Pydantic schemas for the API client registry and usage logs.
All schemas use strict field definitions — no Optional fields without defaults.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Literal, Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field


# ── Plan definitions ─────────────────────────────────────────────────────────

PlanType = Literal["free", "starter", "growth", "enterprise"]

PLAN_RATE_LIMITS: dict[str, int] = {
    "free":       100,
    "starter":    500,
    "growth":    2000,
    "enterprise": 10000,
}

PLAN_DAILY_LIMITS: dict[str, int] = {
    "free":          1_000,
    "starter":      50_000,
    "growth":      500_000,
    "enterprise": 10_000_000,
}


# ── API Client schemas ────────────────────────────────────────────────────────

class APIClientCreate(BaseModel):
    """Request body to register a new API client."""
    name:     str       = Field(..., min_length=2,  max_length=255)
    email:    EmailStr
    plan:     PlanType  = "free"
    metadata: dict[str, Any] = Field(default_factory=dict)


class APIClientPublic(BaseModel):
    """
    Safe public representation of an API client.
    NEVER includes the raw key or the hash.
    """
    id:             UUID
    name:           str
    email:          str
    api_key_prefix: str          # e.g., "tn_live_ab12" — for identification only
    plan:           str
    rate_limit:     int
    is_active:      bool
    created_at:     datetime


class APIClientCreatedResponse(APIClientPublic):
    """
    Returned ONCE at creation. Contains the raw API key.
    After this response, the raw key is gone — it is not stored.
    """
    raw_api_key: str = Field(
        ...,
        description="Store this immediately. It will not be shown again."
    )


# ── Authenticated client context (injected by middleware) ────────────────────

class AuthenticatedClient(BaseModel):
    """Attached to every request that passes API key validation."""
    client_id:   str
    plan:        str
    rate_limit:  int   # requests per minute


# ── Usage log schemas ─────────────────────────────────────────────────────────

class UsageSummary(BaseModel):
    """Per-client usage summary returned by admin or self-service dashboard."""
    client_id:      str
    period:         str          # e.g., "today", "7d", "30d"
    total_requests: int
    endpoints_used: list[str]
    avg_latency_ms: Optional[float] = None
    plan:           str
    rate_limit:     int
    daily_limit:    int
