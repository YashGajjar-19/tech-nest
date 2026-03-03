"""
Platform Gateway Middleware
────────────────────────────
A Starlette ASGI middleware that intercepts ALL requests to /platform/v1/*.

Responsibilities (in order, per request):
  1. API Key extraction from Authorization header: "Bearer tn_live_..."
     OR from X-API-Key header (for agent compatibility).
  2. Authentication: validate key → resolve AuthenticatedClient.
  3. Rate limiting: check token bucket for this client_id.
     If limit exceeded → 429 with Retry-After header (response returned early).
  4. Inject authenticated client into request.state for use by endpoint handlers.
  5. Time the request (start_time → response).
  6. Log usage: endpoint, status_code, latency_ms → api_usage_logs via BackgroundTask.

Why ASGI middleware (not FastAPI dependency)?
  - Dependencies run per-route. Middleware runs per-request BEFORE routing.
  - This means unauthenticated requests never reach any platform route handler.
  - It also gives us access to the raw request path for rate limiting,
    even if the route doesn't exist (404 responses also get logged).
  - The tradeoff: we can't use FastAPI's dependency injection here.
    The authenticated client is attached to request.state instead.
"""

from __future__ import annotations

import logging
import time
from collections.abc import Callable

from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import JSONResponse, Response
from starlette.types import ASGIApp

from app.services.api_key_service import authenticate_api_key
from app.services.platform_ratelimiter import check_rate_limit
from app.services.usage_logger import log_api_usage

logger = logging.getLogger(__name__)

_PLATFORM_PREFIX: str = "/platform/v1"


class PlatformGatewayMiddleware(BaseHTTPMiddleware):
    """
    ASGI middleware guarding the /platform/v1/* namespace.
    Requests to other paths pass through without any processing.
    """

    def __init__(self, app: ASGIApp) -> None:
        super().__init__(app)

    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        path = request.url.path

        # Pass-through for non-platform routes (internal API, docs, health)
        if not path.startswith(_PLATFORM_PREFIX):
            return await call_next(request)

        start_time = time.monotonic()

        # ── Step 1: Extract API Key ──────────────────────────────────────────
        raw_key = self._extract_key(request)
        if not raw_key:
            return self._error(
                status=401,
                code="missing_api_key",
                message="API key required. Supply via 'Authorization: Bearer tn_live_...' or 'X-API-Key' header.",
            )

        # ── Step 2: Authenticate ──────────────────────────────────────────────
        client = authenticate_api_key(raw_key)
        if not client:
            return self._error(
                status=401,
                code="invalid_api_key",
                message="Invalid or revoked API key.",
            )

        # ── Step 3: Rate Limiting ─────────────────────────────────────────────
        allowed, rate_headers = check_rate_limit(client.client_id, client.rate_limit)
        if not allowed:
            return self._error(
                status=429,
                code="rate_limit_exceeded",
                message=f"Rate limit exceeded ({client.rate_limit} requests/min). See Retry-After header.",
                extra_headers=rate_headers,
            )

        # ── Step 4: Inject client into request state ──────────────────────────
        request.state.platform_client = client

        # ── Step 5: Process request ───────────────────────────────────────────
        response = await call_next(request)

        # Inject rate limit headers into every successful platform response
        for key, value in rate_headers.items():
            response.headers[key] = value

        # ── Step 6: Log usage (non-blocking) ─────────────────────────────────
        latency_ms = int((time.monotonic() - start_time) * 1000)

        # FastAPI BackgroundTasks aren't available in ASGI middleware —
        # We run the log call directly but it's non-critical (fast Supabase insert).
        # For production: swap this with a Redis stream push or Celery task.
        try:
            log_api_usage(
                client_id=client.client_id,
                endpoint=path,
                method=request.method,
                status_code=response.status_code,
                latency_ms=latency_ms,
                request_meta={
                    "plan": client.plan,
                    "query": str(request.query_params),
                },
            )
        except Exception as exc:
            logger.warning(f"[Gateway] Usage log failed (non-critical): {exc}")

        return response

    @staticmethod
    def _extract_key(request: Request) -> str | None:
        """
        Extract API key from:
          1. Authorization: Bearer tn_live_...  (OAuth2 compatible)
          2. X-API-Key: tn_live_...             (simpler for agent integrations)
        """
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer tn_"):
            return auth_header.removeprefix("Bearer ").strip()

        x_api_key = request.headers.get("X-API-Key", "")
        if x_api_key.startswith("tn_"):
            return x_api_key.strip()

        return None

    @staticmethod
    def _error(
        status: int,
        code: str,
        message: str,
        extra_headers: dict | None = None,
    ) -> JSONResponse:
        headers = {"Content-Type": "application/json"}
        if extra_headers:
            headers.update(extra_headers)
        return JSONResponse(
            status_code=status,
            content={
                "error": {
                    "code":    code,
                    "message": message,
                    "docs":    "https://docs.technest.app/platform/authentication",
                }
            },
            headers=headers,
        )
