"""
API Key Service
────────────────
Handles all cryptographic operations for API key management.

Security model:
  - Keys are generated with 32 bytes of cryptographic randomness (secrets module).
  - Raw keys are formatted: tn_live_{urlsafe_b64_32bytes}
  - Only the bcrypt hash is stored in the database.
  - The prefix (first 12 chars) is stored in plaintext for identification.
  - bcrypt work factor = 12 (2^12 = 4096 iterations — good for 2026 hardware).
  - Comparison uses bcrypt.checkpw() — timing-safe by design.

Key format: tn_live_<44 chars of base64url>
Example:    tn_live_dGhpcyBpcyBhIHRlc3Qga2V5IGZvciBkZW1v
Total length: ~56 characters
"""

from __future__ import annotations

import secrets
import string
import logging
from base64 import urlsafe_b64encode

import bcrypt

from app.database import supabase
from app.models.platform import APIClientCreate, APIClientCreatedResponse, AuthenticatedClient, PLAN_RATE_LIMITS

logger = logging.getLogger(__name__)

_BCRYPT_ROUNDS: int = 12
_KEY_PREFIX: str = "tn_live_"


def _generate_raw_key() -> str:
    """Generate a cryptographically secure API key."""
    raw_bytes = secrets.token_bytes(32)
    b64 = urlsafe_b64encode(raw_bytes).decode("utf-8").rstrip("=")
    return f"{_KEY_PREFIX}{b64}"


def _hash_key(raw_key: str) -> str:
    """bcrypt-hash a raw API key. Returns the hash string."""
    return bcrypt.hashpw(raw_key.encode("utf-8"), bcrypt.gensalt(rounds=_BCRYPT_ROUNDS)).decode("utf-8")


def _verify_key(raw_key: str, stored_hash: str) -> bool:
    """Timing-safe comparison of raw key against stored bcrypt hash."""
    try:
        return bcrypt.checkpw(raw_key.encode("utf-8"), stored_hash.encode("utf-8"))
    except Exception:
        return False


def register_client(payload: APIClientCreate) -> APIClientCreatedResponse:
    """
    Create a new API client.
    1. Generate raw key
    2. Hash it
    3. Store hash + prefix in DB
    4. Return raw key to caller (only time it's visible)
    """
    raw_key    = _generate_raw_key()
    key_hash   = _hash_key(raw_key)
    key_prefix = raw_key[:16]  # "tn_live_" + 8 chars

    rate_limit = PLAN_RATE_LIMITS.get(payload.plan, 100)

    resp = supabase.table("api_clients").insert({
        "name":           payload.name,
        "email":          payload.email,
        "api_key_hash":   key_hash,
        "api_key_prefix": key_prefix,
        "plan":           payload.plan,
        "rate_limit":     rate_limit,
        "metadata":       payload.metadata,
    }).execute()

    if not resp.data:
        raise RuntimeError("Failed to create API client")

    row = resp.data[0]

    return APIClientCreatedResponse(
        id=row["id"],
        name=row["name"],
        email=row["email"],
        api_key_prefix=row["api_key_prefix"],
        plan=row["plan"],
        rate_limit=row["rate_limit"],
        is_active=row["is_active"],
        created_at=row["created_at"],
        raw_api_key=raw_key,
    )


def authenticate_api_key(raw_key: str) -> AuthenticatedClient | None:
    """
    Validate a raw API key against the database.

    Steps:
    1. Extract the prefix (first 16 chars) to narrow the DB lookup.
       This avoids scanning all rows — we only bcrypt-compare against
       clients whose prefix matches. Prefix is not a secret; it's
       just an O(1) lookup hint.
    2. bcrypt.checkpw() for the matching candidate.
    3. Verify client is active.

    Returns AuthenticatedClient if valid, None otherwise.
    """
    if not raw_key or not raw_key.startswith(_KEY_PREFIX):
        return None

    prefix = raw_key[:16]

    resp = (
        supabase.table("api_clients")
        .select("id, api_key_hash, plan, rate_limit, is_active")
        .eq("api_key_prefix", prefix)
        .eq("is_active", True)
        .maybe_single()
        .execute()
    )

    if not resp.data:
        return None

    row = resp.data
    if not _verify_key(raw_key, row["api_key_hash"]):
        return None

    return AuthenticatedClient(
        client_id=row["id"],
        plan=row["plan"],
        rate_limit=row["rate_limit"],
    )


def revoke_client(client_id: str) -> bool:
    """Soft-delete: mark is_active = False. Usage history is preserved."""
    resp = (
        supabase.table("api_clients")
        .update({"is_active": False})
        .eq("id", client_id)
        .execute()
    )
    return bool(resp.data)
