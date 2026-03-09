"""
Platform API Key Management Service
──────────────────────────────────────
Handles:
  - Secure API key generation (cryptographic random + bcrypt hash)
  - Key registration in api_clients table
  - Key revocation
  - Client listing for admin dashboard

Security model:
  - Raw key format: tn_live_{32 hex chars} (total: 40+ chars)
  - Only the bcrypt hash is stored. The raw key is returned ONCE at creation.
  - Prefix (first 12 chars) is stored in plaintext for fast DB lookup.
  - This mirrors the GitHub / Stripe / OpenAI API key pattern.
"""

from __future__ import annotations

import logging
import secrets
from typing import Optional

import bcrypt

from app.database import supabase
from app.models.platform import (
    APIKeyCreateRequest,
    APIKeyCreateResponse,
    AuthenticatedClient,
    PLAN_RATE_LIMITS,
)

logger = logging.getLogger(__name__)


def generate_api_key(prefix: str = "tn_live_") -> str:
    """Generate a cryptographically secure API key."""
    random_part = secrets.token_hex(20)  # 40 hex chars
    return f"{prefix}{random_part}"


def hash_api_key(raw_key: str) -> str:
    """Bcrypt-hash an API key for storage."""
    return bcrypt.hashpw(raw_key.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def create_api_client(request: APIKeyCreateRequest) -> APIKeyCreateResponse:
    """
    Register a new API client and return the raw key (shown once).

    Steps:
      1. Generate cryptographic key
      2. Hash with bcrypt
      3. Store hash + prefix in api_clients
      4. Return raw key to caller
    """
    raw_key = generate_api_key()
    key_hash = hash_api_key(raw_key)
    key_prefix = raw_key[:12]  # e.g., "tn_live_ab12"
    rate_limit = PLAN_RATE_LIMITS.get(request.plan, 100)

    row = {
        "name":           request.name,
        "email":          request.email,
        "api_key_hash":   key_hash,
        "api_key_prefix": key_prefix,
        "plan":           request.plan,
        "rate_limit":     rate_limit,
        "is_active":      True,
        "metadata":       request.metadata,
    }

    resp = supabase.table("api_clients").insert(row).execute()
    if not resp.data:
        raise RuntimeError("Failed to create API client — database insert returned no data.")

    client_id = resp.data[0]["id"]
    logger.info(f"[Platform] Created API client '{request.name}' (plan={request.plan}, id={client_id})")

    return APIKeyCreateResponse(
        client_id=client_id,
        api_key=raw_key,
        plan=request.plan,
        rate_limit=rate_limit,
    )


def revoke_api_key(client_id: str) -> bool:
    """Deactivate a client's API key. Does NOT delete the record (audit trail)."""
    try:
        supabase.table("api_clients").update({"is_active": False}).eq("id", client_id).execute()
        logger.info(f"[Platform] Revoked API key for client {client_id}")
        return True
    except Exception as exc:
        logger.error(f"[Platform] Failed to revoke key for {client_id}: {exc}")
        return False


def rotate_api_key(client_id: str) -> Optional[APIKeyCreateResponse]:
    """
    Generate a new key for an existing client.
    The old key is immediately invalidated.
    """
    raw_key = generate_api_key()
    key_hash = hash_api_key(raw_key)
    key_prefix = raw_key[:12]

    try:
        resp = (
            supabase.table("api_clients")
            .update({
                "api_key_hash":   key_hash,
                "api_key_prefix": key_prefix,
            })
            .eq("id", client_id)
            .execute()
        )
        if not resp.data:
            return None

        row = resp.data[0]
        logger.info(f"[Platform] Rotated API key for client {client_id}")

        return APIKeyCreateResponse(
            client_id=client_id,
            api_key=raw_key,
            plan=row.get("plan", "free"),
            rate_limit=row.get("rate_limit", 100),
            message="New key generated. Previous key is immediately invalidated.",
        )
    except Exception as exc:
        logger.error(f"[Platform] Key rotation failed for {client_id}: {exc}")
        return None


def list_api_clients(active_only: bool = True) -> list[dict]:
    """List all registered API clients (for admin dashboard). Never returns key hashes."""
    query = supabase.table("api_clients").select(
        "id, name, email, api_key_prefix, plan, rate_limit, is_active, metadata, created_at"
    )
    if active_only:
        query = query.eq("is_active", True)

    resp = query.order("created_at", desc=True).execute()
    return resp.data or []
