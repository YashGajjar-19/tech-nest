"""
Platform Dependencies
──────────────────────
FastAPI dependencies for the /platform/v1/* router.

Unlike the internal API (which uses Supabase JWT auth via deps.py),
platform routes authenticate via API Key, processed in PlatformGatewayMiddleware.

By the time any platform endpoint handler runs, the middleware has already:
  1. Validated the API key
  2. Checked rate limits
  3. Attached the client to request.state.platform_client

This dependency simply extracts that state for clean injection into handlers.
"""

from __future__ import annotations

from fastapi import HTTPException, Request, status

from app.models.platform import AuthenticatedClient


def get_platform_client(request: Request) -> AuthenticatedClient:
    """
    Extract the authenticated API client from request.state.
    If the middleware was bypassed (should never happen in production),
    raise 401 to prevent unauthenticated access.
    """
    client = getattr(request.state, "platform_client", None)
    if not client:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Platform authentication required.",
        )
    return client


def require_plan(minimum_plan: str):
    """
    Dependency factory: enforces minimum plan tier for an endpoint.

    Usage:
        @router.get("/advanced", dependencies=[Depends(require_plan("starter"))])
        async def advanced_endpoint(): ...

    Plan hierarchy: free < starter < growth < enterprise
    """
    _PLAN_ORDER = {"free": 0, "starter": 1, "growth": 2, "enterprise": 3}

    def _check(client: AuthenticatedClient = get_platform_client):
        client_tier = _PLAN_ORDER.get(client.plan, 0)
        required_tier = _PLAN_ORDER.get(minimum_plan, 0)
        if client_tier < required_tier:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail={
                    "error": "plan_upgrade_required",
                    "message": f"This endpoint requires '{minimum_plan}' plan or higher.",
                    "current_plan": client.plan,
                    "upgrade_url": "https://technest.app/platform/pricing",
                }
            )
        return client

    return _check
