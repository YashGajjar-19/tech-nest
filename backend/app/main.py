"""
Tech Nest Intelligence Engine — Main Application
──────────────────────────────────────────────────

Two authentication worlds:
  /api/v1/*       → Internal APIs, authenticated via Supabase JWT (user sessions)
  /platform/v1/*  → Public Platform APIs, authenticated via X-API-Key header

The PlatformGatewayMiddleware intercepts ONLY /platform/* routes.
CORS, Redis, and APScheduler are shared infrastructure.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import (
    intelligence, decision, knowledge_graph, market, generate,
    devices, analytics, system,
)
from app.services.scheduler import start_scheduler, stop_scheduler
from app.config import settings
import redis.asyncio as redis
from fastapi_limiter import FastAPILimiter
from contextlib import asynccontextmanager
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Start background scheduler
    start_scheduler()

    # Initialize Redis for rate limiting & cache
    try:
        redis_conn = redis.from_url(settings.REDIS_URL, encoding="utf-8", decode_responses=True)
        await redis_conn.ping()
        await FastAPILimiter.init(redis_conn)
        app.state.redis = redis_conn
        logger.info("[Lifespan] Redis connection established.")
    except Exception as e:
        logger.warning(f"[Lifespan] Redis unavailable — Rate limiting and caching disabled. Error: {e}")
        app.state.redis = None

    yield

    stop_scheduler()
    if hasattr(app.state, "redis") and app.state.redis:
        await app.state.redis.close()


app = FastAPI(
    title="Tech Nest Intelligence Engine",
    description="The Decision Intelligence backend powering Tech Nest.",
    version="3.0.0",
    lifespan=lifespan,
)

# CORS: allows Next.js frontend + any platform embed origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://technest.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Internal Routers (Supabase JWT Auth) ──────────────────────────────────────
app.include_router(devices.router,         prefix="/api/v1/devices",           tags=["Device Database"])
app.include_router(intelligence.router,    prefix="/api/v1/intelligence",      tags=["Intelligence"])
app.include_router(generate.router,        prefix="/api/v1/intelligence",      tags=["Intelligence Pipeline"])
app.include_router(decision.router,        prefix="/api/v1/decision",          tags=["Decision Engine"])
app.include_router(knowledge_graph.router, prefix="/api/v1/knowledge-graph",   tags=["Knowledge Graph"])
app.include_router(market.router,          prefix="/api/v1/market-signals",    tags=["Market Signals"])
app.include_router(analytics.router,       prefix="/api/v1/analytics",         tags=["Analytics"])
app.include_router(system.router,          prefix="/api/v1/system",            tags=["System Management"])


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "system": "Intelligence OS Online",
        "version": "3.0.0 — Intelligence Platform Active",
    }
