from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import intelligence, decision, knowledge_graph, market, generate, advisor, network, devices, analytics, system
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
        # Verify connection
        await redis_conn.ping()
        await FastAPILimiter.init(redis_conn)
        app.state.redis = redis_conn
        logger.info("[Lifespan] Redis connection established.")
    except Exception as e:
        logger.warning(f"[Lifespan] Redis unavailable — Rate limiting and caching disabled. Error: {e}")
        app.state.redis = None
        
    yield
    
    stop_scheduler()
    if hasattr(app.state, "redis"):
        await app.state.redis.close()

app = FastAPI(
    title="Tech Nest Intelligence Engine",
    description="The Decision Intelligence backend powering Tech Nest.",
    version="2.0.0",
    lifespan=lifespan,   # Starts APScheduler and Redis Limiter on startup
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://127.0.0.1:3000", "http://127.0.0.1:3001", "https://technest.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ───────────────────────────────────────────────────────────────────
app.include_router(devices.router,         prefix="/api/v1/devices",          tags=["Device Database"])
app.include_router(intelligence.router,   prefix="/api/v1/intelligence",     tags=["Intelligence"])
app.include_router(generate.router,       prefix="/api/v1/intelligence",     tags=["Intelligence Pipeline"])
app.include_router(decision.router,       prefix="/api/v1/decision",         tags=["Decision Engine"])
app.include_router(knowledge_graph.router,prefix="/api/v1/knowledge-graph",  tags=["Knowledge Graph"])
app.include_router(market.router,         prefix="/api/v1/market-signals",   tags=["Market Signals"])
app.include_router(advisor.router,        prefix="/api/v1/advisor",          tags=["Personal Advisor"])
app.include_router(network.router,        prefix="/api/v1/network",          tags=["Intelligence Network"])
app.include_router(analytics.router,      prefix="/api/v1/analytics",        tags=["Analytics"])
app.include_router(system.router,         prefix="/api/v1/system",           tags=["System Management"])


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "system": "Intelligence OS Online",
        "version": "2.0.0 — Intelligence Network Active",
    }
