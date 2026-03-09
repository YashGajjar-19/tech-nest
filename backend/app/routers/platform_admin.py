"""
Platform Admin API
───────────────────
Admin-only endpoints for managing API clients and viewing usage analytics.

These are INTERNAL endpoints protected by Supabase JWT (require_admin),
NOT by platform API keys. They live under /api/v1/platform-admin/*
so the PlatformGatewayMiddleware does NOT intercept them.

Endpoints:
  POST /api/v1/platform-admin/keys           — Create new API client
  GET  /api/v1/platform-admin/keys           — List all clients
  POST /api/v1/platform-admin/keys/revoke    — Revoke a key
  POST /api/v1/platform-admin/keys/rotate    — Rotate a key
  GET  /api/v1/platform-admin/usage          — Usage analytics dashboard
  GET  /api/v1/platform-admin/usage/{client_id} — Per-client usage
"""

from __future__ import annotations

import logging
from datetime import datetime, timedelta, timezone
from typing import Any, Optional

from fastapi import APIRouter, Depends, HTTPException, Query
from pydantic import BaseModel

from app.routers.deps import require_admin
from app.database import supabase
from app.models.platform import APIKeyCreateRequest, APIKeyCreateResponse
from app.services.platform_key_service import (
    create_api_client,
    list_api_clients,
    revoke_api_key,
    rotate_api_key,
)

logger = logging.getLogger(__name__)
router = APIRouter()


# ── Schemas ───────────────────────────────────────────────────────────────────

class RevokeRequest(BaseModel):
    client_id: str


class RotateRequest(BaseModel):
    client_id: str


# ── Key Management ────────────────────────────────────────────────────────────

@router.post("/keys", response_model=APIKeyCreateResponse)
async def admin_create_api_key(
    payload: APIKeyCreateRequest,
    _admin: dict = Depends(require_admin),
):
    """
    Create a new API client and return the raw key (shown ONCE).
    The raw key is never stored — only its bcrypt hash.
    """
    try:
        return create_api_client(payload)
    except Exception as exc:
        logger.error(f"[PlatformAdmin] Key creation failed: {exc}")
        raise HTTPException(status_code=500, detail=str(exc))


@router.get("/keys")
async def admin_list_api_keys(
    active_only: bool = Query(default=True),
    _admin: dict = Depends(require_admin),
) -> list[dict]:
    """List all API clients. Never returns key hashes."""
    return list_api_clients(active_only=active_only)


@router.post("/keys/revoke")
async def admin_revoke_key(
    payload: RevokeRequest,
    _admin: dict = Depends(require_admin),
):
    """Deactivate an API key. The record is kept for audit trail."""
    success = revoke_api_key(payload.client_id)
    if success:
        return {"status": "revoked", "client_id": payload.client_id}
    raise HTTPException(status_code=500, detail="Revocation failed.")


@router.post("/keys/rotate", response_model=APIKeyCreateResponse)
async def admin_rotate_key(
    payload: RotateRequest,
    _admin: dict = Depends(require_admin),
):
    """Generate a new key for a client. Old key is immediately invalidated."""
    result = rotate_api_key(payload.client_id)
    if result:
        return result
    raise HTTPException(status_code=500, detail="Key rotation failed.")


# ── Usage Analytics ───────────────────────────────────────────────────────────

@router.get("/usage")
async def admin_usage_overview(
    _admin: dict = Depends(require_admin),
) -> dict[str, Any]:
    """
    Platform-wide usage overview for the admin dashboard.
    Returns: total requests (24h, 7d), per-plan breakdown, top clients, error rate.
    """
    now = datetime.now(timezone.utc)
    day_ago = (now - timedelta(days=1)).isoformat()
    week_ago = (now - timedelta(days=7)).isoformat()

    # Total requests 24h
    r24 = (
        supabase.table("api_usage_logs")
        .select("id", count="exact")
        .gte("timestamp", day_ago)
        .execute()
    )
    total_24h = r24.count or 0

    # Total requests 7d
    r7 = (
        supabase.table("api_usage_logs")
        .select("id", count="exact")
        .gte("timestamp", week_ago)
        .execute()
    )
    total_7d = r7.count or 0

    # Error rate 24h (status_code >= 400)
    err_r = (
        supabase.table("api_usage_logs")
        .select("id", count="exact")
        .gte("timestamp", day_ago)
        .gte("status_code", 400)
        .execute()
    )
    errors_24h = err_r.count or 0
    error_rate = round((errors_24h / max(total_24h, 1)) * 100, 2)

    # Active clients 24h
    active_r = (
        supabase.table("api_usage_logs")
        .select("client_id")
        .gte("timestamp", day_ago)
        .execute()
    )
    active_clients = len({r["client_id"] for r in (active_r.data or []) if r.get("client_id")})

    # Top 5 endpoints by volume
    endpoint_r = (
        supabase.table("api_usage_logs")
        .select("endpoint")
        .gte("timestamp", day_ago)
        .execute()
    )
    ep_counts: dict[str, int] = {}
    for row in (endpoint_r.data or []):
        ep = row.get("endpoint", "unknown")
        ep_counts[ep] = ep_counts.get(ep, 0) + 1
    top_endpoints = sorted(ep_counts.items(), key=lambda x: x[1], reverse=True)[:5]

    return {
        "total_requests_24h": total_24h,
        "total_requests_7d":  total_7d,
        "error_rate_24h":     f"{error_rate}%",
        "active_clients_24h": active_clients,
        "top_endpoints":      [{"endpoint": ep, "requests": c} for ep, c in top_endpoints],
    }


@router.get("/usage/{client_id}")
async def admin_client_usage(
    client_id: str,
    _admin: dict = Depends(require_admin),
) -> dict[str, Any]:
    """Per-client usage breakdown."""
    now = datetime.now(timezone.utc)
    day_ago = (now - timedelta(days=1)).isoformat()
    week_ago = (now - timedelta(days=7)).isoformat()

    # Client info
    client_r = (
        supabase.table("api_clients")
        .select("id, name, email, plan, rate_limit, is_active, created_at")
        .eq("id", client_id)
        .maybe_single()
        .execute()
    )
    if not client_r.data:
        raise HTTPException(status_code=404, detail="Client not found.")

    # Request counts
    r24 = supabase.table("api_usage_logs").select("id", count="exact").eq("client_id", client_id).gte("timestamp", day_ago).execute()
    r7 = supabase.table("api_usage_logs").select("id", count="exact").eq("client_id", client_id).gte("timestamp", week_ago).execute()

    # Average latency 7d
    latency_r = (
        supabase.table("api_usage_logs")
        .select("latency_ms")
        .eq("client_id", client_id)
        .gte("timestamp", week_ago)
        .execute()
    )
    latencies = [r.get("latency_ms", 0) for r in (latency_r.data or []) if r.get("latency_ms")]
    avg_latency = round(sum(latencies) / max(len(latencies), 1), 1)

    return {
        "client":              client_r.data,
        "total_requests_24h":  r24.count or 0,
        "total_requests_7d":   r7.count or 0,
        "avg_latency_ms_7d":   avg_latency,
    }
