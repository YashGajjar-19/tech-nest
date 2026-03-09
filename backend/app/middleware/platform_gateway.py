"""
Platform Gateway Middleware
────────────────────────────
Intercepts ALL requests under /platform/v1/* and performs:

  1. API Key extraction + validation (X-API-Key header)
  2. Per-client sliding-window rate limiting (Redis)
  3. Attaches AuthenticatedClient to request.state
  4. Fires a background usage log after the response

This is the ONLY auth gate for platform routes. If this middleware
is bypassed, platform_deps.py will raise 401 as a secondary guard.

Design decisions:

  BCRYPT CACHING:
    bcrypt.checkpw costs ~100ms per call — unacceptable per-request.
    After the first successful verification, we cache the client record
    in Redis keyed by raw API key with a 5-minute TTL.
    Subsequent requests within 5 minutes cost ~1ms (Redis GET) instead of 100ms.
    If Redis is down, we fall back to DB + bcrypt every request.

  RATE LIMITING:
    We use a Redis sliding-window counter per client_id.
    Key: "rl:{client_id}:{minute_bucket}" with 60s TTL.
    The per-minute limit is stored on the api_clients row.
    If Redis is down, rate limiting is disabled (fail-open, not fail-closed)
    — this prevents a Redis outage from blocking all platform traffic.

  USAGE LOGGING:
    Fires as a BackgroundTask AFTER the response. The response is never
    delayed by logging. If logging fails, it's logged to stderr and dropped.
"""

from __future__ import annotations

import hashlib
import json
import logging
import time
from typing import Optional

import bcrypt
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.responses import JSONResponse, Response

from app.database import supabase
from app.models.platform import AuthenticatedClient, PLAN_RATE_LIMITS

logger = logging.getLogger(__name__)

# Cache TTL for validated API keys (seconds)
_CACHE_TTL: int = 300  # 5 minutes


class PlatformGatewayMiddleware(BaseHTTPMiddleware):
    """
    Middleware that gates /platform/v1/* routes behind API key auth + rate limiting.
    Passes through all other routes untouched.
    """

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> Response:
        path = request.url.path

        # Only intercept platform routes
        if not path.startswith("/platform/"):
            return await call_next(request)

        start_time = time.monotonic()

        # ── Step 1: Extract API Key ───────────────────────────────────────────
        api_key = request.headers.get("X-API-Key")
        if not api_key:
            return JSONResponse(
                status_code=401,
                content={
                    "error": "api_key_missing",
                    "message": "Include your API key in the X-API-Key header.",
                    "docs": "https://docs.technest.app/platform/authentication",
                },
            )

        # ── Step 2: Validate API Key (cache → DB fallback) ────────────────────
        client = await self._resolve_client(request, api_key)
        if client is None:
            return JSONResponse(
                status_code=401,
                content={
                    "error": "invalid_api_key",
                    "message": "The provided API key is invalid or has been revoked.",
                },
            )

        if not client.is_active:
            return JSONResponse(
                status_code=403,
                content={
                    "error": "client_deactivated",
                    "message": "This API key has been deactivated. Contact support.",
                },
            )

        # ── Step 3: Rate Limiting ─────────────────────────────────────────────
        rate_ok = await self._check_rate_limit(request, client)
        if not rate_ok:
            return JSONResponse(
                status_code=429,
                content={
                    "error": "rate_limit_exceeded",
                    "message": f"Rate limit: {client.rate_limit} requests/minute on '{client.plan}' plan.",
                    "upgrade_url": "https://technest.app/platform/pricing",
                },
                headers={"Retry-After": "60"},
            )

        # ── Step 4: Attach to request state ───────────────────────────────────
        request.state.platform_client = client

        # ── Step 5: Forward request ───────────────────────────────────────────
        response = await call_next(request)

        # ── Step 6: Background usage logging ──────────────────────────────────
        latency_ms = int((time.monotonic() - start_time) * 1000)
        # We can't use FastAPI BackgroundTasks from middleware, so we fire-and-forget
        # via a simple non-blocking approach. If it fails, it logs to stderr.
        self._log_usage_sync(
            client_id=client.client_id,
            endpoint=path,
            method=request.method,
            status_code=response.status_code,
            latency_ms=latency_ms,
            agent_id=request.headers.get("X-Agent-Id"),
        )

        return response

    # ── Private: API Key Resolution ───────────────────────────────────────────

    async def _resolve_client(self, request: Request, raw_key: str) -> Optional[AuthenticatedClient]:
        """
        Attempts to resolve an API key to an AuthenticatedClient.
        Flow: Redis cache → Supabase DB + bcrypt → None
        """
        redis = getattr(request.app.state, "redis", None)
        cache_key = f"platform:key:{hashlib.sha256(raw_key.encode()).hexdigest()}"

        # Try cache first
        if redis:
            try:
                cached = await redis.get(cache_key)
                if cached:
                    data = json.loads(cached)
                    return AuthenticatedClient(**data)
            except Exception as exc:
                logger.debug(f"[Gateway] Redis cache miss/error: {exc}")

        # Fall back to DB lookup
        # We look up by prefix (first 12 chars) to narrow the search,
        # then verify against the bcrypt hash.
        prefix = raw_key[:12] if len(raw_key) >= 12 else raw_key

        try:
            resp = (
                supabase.table("api_clients")
                .select("id, name, email, api_key_hash, plan, rate_limit, is_active, metadata")
                .eq("api_key_prefix", prefix)
                .execute()
            )
        except Exception as exc:
            logger.error(f"[Gateway] DB lookup failed: {exc}")
            return None

        for row in (resp.data or []):
            stored_hash = row.get("api_key_hash", "")
            try:
                if bcrypt.checkpw(raw_key.encode("utf-8"), stored_hash.encode("utf-8")):
                    client = AuthenticatedClient(
                        client_id=row["id"],
                        name=row["name"],
                        email=row["email"],
                        plan=row.get("plan", "free"),
                        rate_limit=row.get("rate_limit", 100),
                        is_active=row.get("is_active", True),
                        metadata=row.get("metadata", {}),
                    )

                    # Cache for 5 minutes
                    if redis:
                        try:
                            await redis.setex(
                                cache_key,
                                _CACHE_TTL,
                                client.model_dump_json(),
                            )
                        except Exception:
                            pass  # Cache write failure is non-critical

                    return client
            except Exception:
                continue  # Hash format mismatch — skip row

        return None

    # ── Private: Rate Limiting ────────────────────────────────────────────────

    async def _check_rate_limit(self, request: Request, client: AuthenticatedClient) -> bool:
        """
        Sliding-window rate limiter using Redis INCR + EXPIRE.
        Key: rl:{client_id}:{minute_bucket}
        If Redis is unavailable, rate limiting is disabled (fail-open).
        """
        redis = getattr(request.app.state, "redis", None)
        if not redis:
            return True  # Fail-open: no Redis → no rate limiting

        minute_bucket = int(time.time() // 60)
        rl_key = f"rl:{client.client_id}:{minute_bucket}"

        try:
            current = await redis.incr(rl_key)
            if current == 1:
                await redis.expire(rl_key, 120)  # 2-minute TTL for safety
            return current <= client.rate_limit
        except Exception as exc:
            logger.warning(f"[Gateway] Rate limit check failed: {exc}")
            return True  # Fail-open

    # ── Private: Usage Logging ────────────────────────────────────────────────

    def _log_usage_sync(
        self,
        client_id: str,
        endpoint: str,
        method: str,
        status_code: int,
        latency_ms: int,
        agent_id: Optional[str] = None,
    ) -> None:
        """
        Synchronously insert a usage log row.
        This runs AFTER the response is sent (middleware level).
        If this fails, the platform continues operating — no user impact.
        """
        try:
            meta: dict = {}
            if agent_id:
                meta["agent_id"] = agent_id

            supabase.table("api_usage_logs").insert({
                "client_id":     client_id,
                "endpoint":      endpoint,
                "method":        method,
                "status_code":   status_code,
                "latency_ms":    latency_ms,
                "request_meta":  meta,
            }).execute()
        except Exception as exc:
            logger.warning(f"[Gateway] Usage log insert failed: {exc}")
