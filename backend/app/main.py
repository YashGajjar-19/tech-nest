from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.endpoints import intelligence, decision, knowledge_graph, market, generate, advisor, network, devices
from app.services.scheduler import lifespan_with_scheduler

app = FastAPI(
    title="Tech Nest Intelligence Engine",
    description="The Decision Intelligence backend powering Tech Nest.",
    version="2.0.0",
    lifespan=lifespan_with_scheduler,   # Starts APScheduler on startup, shuts it down on exit
)

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://technest.app"],
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


@app.get("/health")
async def health_check():
    return {
        "status": "ok",
        "system": "Intelligence OS Online",
        "version": "2.0.0 — Intelligence Network Active",
    }
