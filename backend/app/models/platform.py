"""
Platform Models
─────────────────
Pydantic DTOs for the /platform/v1 API surface.

These models define the contract between:
  - PlatformGatewayMiddleware (auth + rate limiting)
  - platform_deps.py (dependency injection)
  - platform_*.py endpoint handlers

AuthenticatedClient is the canonical identity object placed on
request.state.platform_client after successful API key validation.
"""

from __future__ import annotations

from datetime import datetime
from typing import Any, Literal, Optional

from pydantic import BaseModel, Field


# ── Plan Tier Constants ───────────────────────────────────────────────────────

PLAN_ORDER: dict[str, int] = {
    "free":       0,
    "starter":    1,
    "growth":     2,
    "enterprise": 3,
}

PLAN_RATE_LIMITS: dict[str, int] = {
    "free":       100,     # req/min
    "starter":    500,
    "growth":     2000,
    "enterprise": 10000,
}

PLAN_DAILY_LIMITS: dict[str, int] = {
    "free":       1_000,
    "starter":    50_000,
    "growth":     500_000,
    "enterprise": 5_000_000,
}


# ── Core Identity ─────────────────────────────────────────────────────────────

class AuthenticatedClient(BaseModel):
    """
    Represents a validated platform API client.
    Attached to request.state by the gateway middleware.
    """
    client_id:   str
    name:        str
    email:       str
    plan:        Literal["free", "starter", "growth", "enterprise"]
    rate_limit:  int          # requests per minute
    is_active:   bool
    metadata:    dict[str, Any] = Field(default_factory=dict)

    @property
    def plan_rank(self) -> int:
        return PLAN_ORDER.get(self.plan, 0)

    def meets_plan(self, minimum: str) -> bool:
        return self.plan_rank >= PLAN_ORDER.get(minimum, 0)


# ── API Key Creation ──────────────────────────────────────────────────────────

class APIKeyCreateRequest(BaseModel):
    name:     str = Field(..., min_length=2, max_length=255)
    email:    str = Field(..., min_length=5, max_length=255)
    plan:     Literal["free", "starter", "growth", "enterprise"] = "free"
    metadata: dict[str, Any] = Field(default_factory=dict)


class APIKeyCreateResponse(BaseModel):
    """
    Returned ONCE after key creation. The raw key is never stored or shown again.
    """
    client_id:  str
    api_key:    str          # Full raw key — shown only this one time
    plan:       str
    rate_limit: int
    message:    str = "Store this key securely. It cannot be retrieved again."


# ── Usage Log ─────────────────────────────────────────────────────────────────

class UsageLogEntry(BaseModel):
    client_id:     Optional[str]
    endpoint:      str
    method:        str
    status_code:   int
    latency_ms:    int
    request_meta:  dict[str, Any] = Field(default_factory=dict)


# ── Developer Dashboard ──────────────────────────────────────────────────────

class ClientUsageSummary(BaseModel):
    client_id:         str
    name:              str
    plan:              str
    total_requests_24h: int
    total_requests_7d:  int
    avg_latency_ms:    float
    top_endpoints:     list[dict[str, Any]]
