# Tech Nest — Backend Architecture Audit

**Reviewer**: Principal Backend Architect & Distributed Systems Engineer
**Date**: March 9, 2026
**Scope**: Full backend codebase — `backend/app/` (routers, services, models, middleware, workers, utils)

---

## 1. Backend Architecture Summary

| Dimension | Current State |
|---|---|
| **Framework** | FastAPI 0.111.0 (Python) |
| **Database** | PostgreSQL via Supabase client SDK (sync) |
| **Authentication** | Dual-world: Supabase JWT (internal) + bcrypt API keys (platform) |
| **Background Jobs** | APScheduler in-process + FastAPI `BackgroundTasks` |
| **Cache / Rate Limit** | Redis (optional, fail-open) |
| **AI Integration** | OpenAI GPT-4o-mini (synchronous HTTP, no async client) |
| **Dependency Management** | `requirements.txt` (no lockfile, no hash pinning) |

### Architecture Shape

```
┌──────────────┐           ┌──────────────────────┐
│  Next.js FE  │──JWT───▶  │  FastAPI Monolith     │
└──────────────┘           │  ┌──────────────────┐ │
                           │  │ Routers (16)      │ │
┌──────────────┐           │  │ Services (16)     │ │
│  AI Agents   │──API Key─▶│  │ Workers (1)       │ │
└──────────────┘           │  │ Scheduler (1)     │ │
                           │  │ Middleware (1)     │ │
                           │  └──────────────────┘ │
                           │         │              │
                           │    ┌────▼────┐         │
                           │    │ Supabase│ (sync)  │
                           │    │ Client  │ ◀──────▶│ PostgreSQL / OpenAI
                           │    └─────────┘         │
                           └──────────────────────┘
```

The backend is a **single-process monolith** running scoring, AI inference, trend detection, network aggregation, and search indexing inside the same process that serves HTTP requests. There is no service isolation, no async database access, and no distributed task queue.

---

## 2. Critical Architecture Issues

> [!CAUTION]
> These are production-blocking issues that will cause real outages or data quality bugs under load.

### 2.1. The Decision Engine Returns Hardcoded Stubs

**File**: [decision.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/decision.py#L88-L107)

The most important endpoint in the product — `POST /decision/orchestrate` — returns **hardcoded verdict data**:

```python
# Line 90-91: STUB — every device gets the same verdict
base_confidence = 0.92
...
verdicts.append(DeviceVerdict(
    device_id=device_id,
    verdict="BUY",                            # ← Always BUY
    confidence_score=final_confidence,
    definitive_reason=(
        "Unmatched sustained performance..."   # ← Always the same text
    ),
    pillars={
        "hardware":   {"score": 9.5, ...},     # ← Static, device-independent
        "experience": {"score": 8.0, ...},
        "value":      {"score": 6.5, ...},
    }
))
```

**Impact**: Every device in the system gets verdict "BUY" with identical reasoning, regardless of specs, scores, or user context. The scoring engine and network intelligence this endpoint claims to use are never called. This makes the Decision AI feature **non-functional**.

---

### 2.2. Classic N+1 Query in Device Listing

**File**: [devices.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/devices.py#L47-L63)

```python
for row in resp.data:           # For each of N devices...
    device_id = row["id"]
    specs_resp_data = (          # ...fire a separate DB query
        supabase.table("device_specs")
        .select("spec_key, spec_value")
        .eq("device_id", device_id)
        .execute()
    )
```

**Impact**: Listing 20 devices = 21 DB round trips (1 device list + 20 spec lookups). At 50ms per Supabase round trip, that's **~1 second** for a simple browse page. Under pagination or 100-device limits: **5+ seconds**.

---

### 2.3. Synchronous LLM Calls Block the Thread Pool

**File**: [ai_insight_service.py](file:///c:/Users/user/Documents/tech-nest/backend/app/services/ai_insight_service.py#L108-L143)

```python
def _call_llm(prompt: str, max_retries: int = 3) -> AIInsightOutput:
    for attempt in range(1, max_retries + 1):
        try:
            response = client.chat.completions.create(...)  # Sync, blocks thread
            ...
        except RateLimitError:
            time.sleep(wait)  # Blocks the thread for 2-8 seconds
```

- Uses the synchronous `openai.OpenAI` client, not `openai.AsyncOpenAI`.
- `time.sleep()` blocks the worker thread during retries.
- Under bulk generation, this starves the FastAPI default thread pool (40 threads).

---

### 2.4. Global Singleton Supabase Client — No Connection Pooling

**File**: [database.py](file:///c:/Users/user/Documents/tech-nest/backend/app/database.py)

```python
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
```

A single module-level `Client` instance is shared across all threads and coroutines. The Supabase Python SDK client uses `httpx.Client` internally — a **single-threaded, synchronous** HTTP session. Under concurrent load:

- **Thread-safety risk**: Multiple threads sharing one `httpx.Client` can cause connection corruption.
- **No connection pooling**: Every request reuses the same underlying TCP connection — creating a serialization bottleneck.
- **No async**: All DB calls block the calling thread, defeating the purpose of FastAPI's async architecture.

---

### 2.5. CORS Allows `*` Alongside Credentialed Requests

**File**: [main.py](file:///c:/Users/user/Documents/tech-nest/backend/app/main.py#L71-L77)

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://technest.app", "*"],
    allow_credentials=True,      # ← Combined with "*" — dangerous
    allow_methods=["*"],
    allow_headers=["*"],
)
```

`allow_origins=["*"]` with `allow_credentials=True` is ignored by browsers (per CORS spec), but signals that no thought has been given to origin restrictions. Any misconfigured proxy could enable credential theft. This is a security audit failure.

---

### 2.6. Network Aggregation Does N+5 Queries Per Device

**File**: [network_learning.py](file:///c:/Users/user/Documents/tech-nest/backend/app/services/network_learning.py#L148-L198)

For each device in the aggregation batch:

```python
def _aggregate_single_device(device_id: str):
    existing_resp = supabase.table("device_network_stats")...   # Query 1
    for etype in event_counts:                                   # 5 event types
        count_resp = supabase.table("interaction_events")...     # Queries 2-6
    rec_resp = supabase.table("interaction_events")...           # Query 7
    supabase.table("device_network_stats").upsert(...)...        # Query 8
```

**8 DB queries per device**. In a batch of 100 devices, this is **800 sequential HTTP calls** to Supabase. At 50ms each → ~40 seconds for aggregation. This could be a **single SQL UPDATE ... FROM ... GROUP BY** executed in 100ms.

---

### 2.7. Trend Engine: Quadratic DB Query Pattern

**File**: [trend_engine.py](file:///c:/Users/user/Documents/tech-nest/backend/app/services/trend_engine.py#L89-L147)

```python
def detect_trends_for_device(device_id: str):
    for window in ("24h", "7d", "30d"):       # 3 windows
        current_views = _count_events(...)     # 1 query
        prior_views   = _count_events(...)     # 1 query
        current_sel   = _count_events(...)     # 1 query
```

**9 queries per device** (3 windows × 3 queries). For 500 active devices: **4,500 DB round trips** per hour. Each query is an `exact` count on `interaction_events` — a table scan unless indexed.

---

## 3. Service Architecture Improvements

### Current Service Boundaries

| Service File | Responsibilities (Actual) |
|---|---|
| `scoring_engine.py` | Fetch specs + score + persist scores |
| `ai_insight_service.py` | Build prompt + call LLM + persist insights |
| `pipeline.py` | Orchestrate scoring → AI → comparison → search index |
| `comparison_builder.py` | Find competitors + persist relationships |
| `search_indexer.py` | Build search text + persist index |
| `network_learning.py` | Aggregate events → compute multiplier |
| `trend_engine.py` | Count events in windows → detect trends |
| `intelligence_graph.py` | Rank devices combining scores + network + personalization |
| `collective_insights.py` | Compute upgrade paths, brand affinity, emerging devices |
| `event_logger.py` | Insert interaction events |
| `decision_memory.py` | Log decisions + upsert user-device ownership |
| `preference_engine.py` | User preference inference |
| `advisor_engine.py` | Advisory recommendation composition |
| `platform_key_service.py` | API key CRUD for platform clients |
| `scheduler.py` | APScheduler job registration |
| `upgrade_predictor.py` | Upgrade timing prediction |

### Problems

1. **No service interface abstraction**. Routers call services directly, and services call other services directly. There is no dependency injection, no protocol/interface definition. This makes testing nearly impossible without hitting the real database.

2. **Database access is scattered everywhere**. Every service file imports `from app.database import supabase` and runs raw Supabase client calls inline. There is no repository layer, no data access abstraction. Business logic and persistence are inseparable.

3. **Router files contain significant business logic**:
   - `decision.py` — verdict computation logic lives in the router
   - `intelligence.py` — admin metrics aggregation with 7+ queries lives in the router
   - `platform_agent.py` — recommendation filtering logic lives in the router
   - `devices.py` — N+1 spec loading logic lives in the router

4. **Service coupling graph is tangled**:
   ```
   pipeline.py → scoring_engine.py → database
              → ai_insight_service.py → database + OpenAI
              → comparison_builder.py → scoring_engine.py → database
              → search_indexer.py → scoring_engine.py → database
   
   scheduler.py → network_learning.py → database
               → trend_engine.py → database
               → intelligence_worker.py → pipeline.py
   ```
   Every service is tightly coupled to the global Supabase client, making unit testing impossible.

### Recommended Architecture

```
┌───────────────┐
│ Routers       │ ── Thin HTTP layer, validation + auth only
└───────┬───────┘
        │ depends on
┌───────▼───────┐
│ Use Cases     │ ── Business orchestration (e.g., RunScoringPipeline)
└───────┬───────┘
        │ depends on
┌───────▼───────┐
│ Domain Logic  │ ── Pure functions (scoring algorithms, trend math)
└───────┬───────┘
        │ depends on
┌───────▼───────┐
│ Repositories  │ ── Data access abstraction (async, batched queries)
└───────────────┘
```

**Key changes**:

| Layer | Responsibility | Example |
|---|---|---|
| **Router** | Parse request, validate, call use case, return response | `generate.py` → calls `IntelligencePipelineUseCase.run(device_id)` |
| **Use Case** | Orchestrate business flow | `IntelligencePipelineUseCase` → calls `ScoringService`, `InsightService` |
| **Domain** | Pure business rules | `compute_display_score(specs) -> float` (no DB, no IO) |
| **Repository** | Data access | `DeviceRepository.get_with_specs(id)` (batched, async) |

---

## 4. Database Query Improvements

### Issue Matrix

| Location | Problem | Fix |
|---|---|---|
| `devices.py:list_devices` | N+1: 1 + N specs queries | Single query with join or `IN` clause |
| `network_learning.py:_aggregate_single_device` | 8 queries per device | Single `SELECT ... GROUP BY event_type` |
| `trend_engine.py:detect_trends_for_device` | 9 queries per device | Single aggregate query per device |
| `trend_engine.py:run_trend_engine` | Fetches all events to deduplicate in Python | `SELECT DISTINCT device_id` |
| `intelligence.py:get_intelligence_metrics` | 7+ sequential queries, in-Python aggregation | SQL view or materialized view |
| `intelligence_graph.py:get_ranked_devices` | Fetches ALL scores + ALL network stats | Paginated query with JOIN |
| `collective_insights.py:get_brand_affinity_patterns` | Fetches all devices + all network stats into Python dicts | SQL aggregate query |
| `comparison_builder.py:run_comparison_builder` | Fetches ALL scored devices for comparison | Filter in SQL with price segment bounds |
| `intelligence_graph.py:enhance_decision_context` | Loop calling `get_network_signal` per device | Batch `IN` query |

### Recommended Fixes

#### 4.1. Batch Spec Loading (Fix N+1)

```python
# BEFORE: N+1 pattern
for device in devices:
    specs = supabase.table("device_specs").eq("device_id", device["id"]).execute()

# AFTER: Single batch query
device_ids = [d["id"] for d in devices]
all_specs = supabase.table("device_specs") \
    .select("device_id, spec_key, spec_value") \
    .in_("device_id", device_ids) \
    .execute()
specs_by_device = group_by(all_specs.data, "device_id")
```

#### 4.2. Replace Python Aggregation with SQL (Network Aggregation)

Move the aggregation logic into a Supabase RPC (PostgreSQL function):

```sql
CREATE OR REPLACE FUNCTION aggregate_device_events(p_device_id UUID, p_since TIMESTAMPTZ)
RETURNS TABLE(event_type TEXT, event_count BIGINT) AS $$
    SELECT event_type, COUNT(*) as event_count
    FROM interaction_events
    WHERE device_id = p_device_id
      AND created_at > p_since
    GROUP BY event_type;
$$ LANGUAGE sql;
```

**Impact**: Replaces 6 sequential queries with 1.

#### 4.3. Add Database Indexes

```sql
-- Critical for all event-counting queries
CREATE INDEX idx_interaction_events_device_type_created
ON interaction_events (device_id, event_type, created_at);

-- Critical for trend engine windowed counts
CREATE INDEX idx_interaction_events_created_device
ON interaction_events (created_at, device_id);

-- Critical for network aggregation watermark lookups
CREATE INDEX idx_device_network_stats_device
ON device_network_stats (device_id);
```

#### 4.4. Implement Query Caching

```python
# Cache device scores (change infrequently — only on pipeline run)
@lru_cache(maxsize=1000, ttl=300)
async def get_device_score(device_id: str) -> dict:
    ...

# Or use Redis for shared cache:
async def get_device_score(device_id: str, redis) -> dict:
    cached = await redis.get(f"score:{device_id}")
    if cached:
        return json.loads(cached)
    ...
```

---

## 5. Background Job Improvements

### Current Architecture

```
┌────────────────────────────────┐
│   FastAPI Process (single)     │
│                                │
│  ┌──────────────┐              │
│  │ APScheduler  │─────────┐    │
│  │ (3 jobs)     │         │    │
│  └──────────────┘         │    │
│                            │    │
│  ┌──────────────────────┐  │    │
│  │ BackgroundTasks       │  │   │
│  │ (thread pool: 40)    │◀─┘   │
│  │                       │      │
│  │ • intelligence_worker │      │
│  │ • log_event           │      │
│  │ • aggregation         │      │
│  └──────────────────────┘      │
└────────────────────────────────┘
```

### Problems

| Issue | Impact |
|---|---|
| **In-process scheduler** shares the thread pool with HTTP requests | A bulk intelligence run (100 devices × 5-15s each) will exhaust all 40 default threads, blocking user-facing HTTP requests |
| **No retry queue** | If `intelligence_background_job` fails, the device stays in "failed" status permanently with no automatic retry |
| **No dead-letter queue** | Failed jobs are logged but never tracked for investigation or manual retry |
| **No concurrency control** | `bulk-generate` can enqueue 100 background tasks simultaneously, all fighting for the same thread pool and Supabase connection |
| **Synchronous `time.sleep` in retry logic** | Blocks a thread for 2-8 seconds during OpenAI retries |
| **No job progress tracking** | No way to know which step a pipeline job is on, or how long it's been running |
| **APScheduler runs intelligence sweep every 5 min** | Processes up to 20 pending devices sequentially — can run for 5+ minutes, potentially overlapping with the next sweep |

### Recommended Architecture

**Phase 1** (Immediate — No Infrastructure Changes):

```python
# Replace BackgroundTasks with asyncio.create_task + semaphore
_pipeline_semaphore = asyncio.Semaphore(3)  # Max 3 concurrent pipelines

async def run_pipeline_bounded(device_id: str, force: bool):
    async with _pipeline_semaphore:
        await asyncio.to_thread(run_intelligence_pipeline, device_id, force)
```

**Phase 2** (When >50 concurrent pipelines needed):

```
┌──────────────┐     ┌──────────┐     ┌──────────────┐
│ FastAPI API   │────▶│ Redis    │────▶│ Celery Worker │
│ (enqueue)    │     │ (broker) │     │ (process)     │
└──────────────┘     └──────────┘     └──────────────┘
```

Migrate to Celery with:
- **Retry policy**: Exponential backoff with max 3 retries
- **Dead-letter queue**: Failed jobs go to a DLQ for investigation
- **Priority queues**: Separate queues for user-triggered (high) vs. scheduler (low)
- **Concurrency control**: `worker_concurrency=4` per worker
- **Result backend**: Track job status, completion time, errors

---

## 6. Error Handling Assessment

### Patterns Found

| Pattern | Files | Problem |
|---|---|---|
| **Bare `except:` with `pass`** | `devices.py:60`, `devices.py:103`, `decision.py:70`, `generate.py:240` | Silently swallows errors — no debugging information, masks data issues |
| **Catch-all returns mock data** | `intelligence.py:136-146` | Admin metrics endpoint returns zeros on any error instead of surfacing the failure |
| **Inconsistent error format** | Various | Some endpoints return `{"error": "..."}`, others return `{"status": "error", "message": "..."}`, others raise `HTTPException` |
| **Internal errors leak to clients** | `network.py:87` | `raise HTTPException(status_code=500, detail=str(exc))` — leaks stack trace details |
| **No structured logging** | All files | `logger.info(f"[Pipeline] Starting...")` — no structured fields for aggregation |
| **No correlation/request IDs** | None | No request ID propagation for tracing across services |

### Recommendations

1. **Create a unified error response model**:

```python
class APIError(BaseModel):
    error_code: str          # Machine-readable: "DEVICE_NOT_FOUND"
    message: str             # Human-readable
    request_id: str          # For support debugging
    details: Optional[dict]  # Additional context (dev mode only)
```

2. **Add a global exception handler**:

```python
@app.exception_handler(Exception)
async def global_handler(request, exc):
    request_id = request.state.request_id
    logger.error(f"Unhandled error", extra={"request_id": request_id, "error": str(exc)})
    return JSONResponse(status_code=500, content={
        "error_code": "INTERNAL_ERROR",
        "message": "An unexpected error occurred.",
        "request_id": request_id,
    })
```

3. **Replace bare `except:` with typed catches**:

```python
# BEFORE
try:
    specs_resp_data = supabase.table("device_specs")...
except:
    pass

# AFTER
try:
    specs_resp_data = supabase.table("device_specs")...
except SupabaseError as e:
    logger.warning(f"Failed to fetch specs for {device_id}", extra={"error": str(e)})
    specs_resp_data = []
```

4. **Adopt structured logging** with `structlog` or JSON formatters:

```python
logger.info("pipeline.step.complete",
    device_id=device_id,
    step="scoring",
    duration_ms=elapsed,
    overall_score=scores.overall_score,
)
```

---

## 7. Performance Optimizations

### Identified Bottlenecks

| Bottleneck | Current Latency | Root Cause | Target |
|---|---|---|---|
| `GET /devices` (list) | ~1,000ms (20 devices) | N+1 spec queries | <100ms |
| `POST /decision/orchestrate` | ~200ms | Loops over devices sequentially | <50ms (after un-stubbing, with batch network fetch) |
| `GET /intelligence/admin/metrics` | ~2,000ms | 7+ sequential queries + Python aggregation | <200ms (materialized view) |
| `POST /intelligence/generate/{id}` (background) | 5-15s | Sequential pipeline: sync DB + sync OpenAI | <3s (async DB + async OpenAI) |
| `GET /network/rankings` | ~500ms | Fetches ALL scores + ALL network stats | <100ms (paginated, cached) |
| `GET /network/insights` | ~3,000ms | 4 sequential service calls, each with multiple queries | <500ms (pre-computed, cached) |

### Optimization Plan

#### 7.1. Move to Async Database Access

```python
# BEFORE (sync — blocks thread)
from supabase import create_client, Client
supabase: Client = create_client(url, key)
resp = supabase.table("devices").select("*").execute()

# AFTER (async — non-blocking)
from supabase import acreate_client, AsyncClient
supabase: AsyncClient = await acreate_client(url, key)
resp = await supabase.table("devices").select("*").execute()
```

#### 7.2. Use Async OpenAI Client

```python
# BEFORE
from openai import OpenAI
client = OpenAI(api_key=...)
response = client.chat.completions.create(...)  # Blocks thread

# AFTER
from openai import AsyncOpenAI
client = AsyncOpenAI(api_key=...)
response = await client.chat.completions.create(...)  # Non-blocking
```

#### 7.3. Pre-compute Admin Metrics

Create a PostgreSQL materialized view:

```sql
CREATE MATERIALIZED VIEW intelligence_metrics AS
SELECT
    COUNT(*) FILTER (WHERE intelligence_status = 'pending') AS pending_count,
    COUNT(*) FILTER (WHERE intelligence_status = 'ready') AS ready_count,
    COUNT(*) FILTER (WHERE intelligence_status = 'failed') AS failed_count,
    COUNT(*) FILTER (WHERE intelligence_status = 'processing') AS processing_count
FROM devices;

-- Refresh on a schedule
REFRESH MATERIALIZED VIEW CONCURRENTLY intelligence_metrics;
```

#### 7.4. Cache Rankings and Network Signals

```python
# Redis cache with 60s TTL for rankings
RANKINGS_CACHE_KEY = "rankings:anonymous"
RANKINGS_TTL = 60  # seconds

async def get_ranked_devices_cached(user_id=None, limit=20):
    cache_key = f"rankings:{user_id or 'anonymous'}:{limit}"
    cached = await redis.get(cache_key)
    if cached:
        return json.loads(cached)
    result = compute_ranked_devices(user_id, limit)
    await redis.setex(cache_key, RANKINGS_TTL, json.dumps(result))
    return result
```

---

## 8. Scalability Strategy

### Current Single-Process Bottlenecks

```
                Single Process
┌──────────────────────────────────────┐
│  HTTP Requests ◀──┐                  │
│  Background Jobs ◀┤  Thread Pool: 40 │  ← All share the same pool
│  APScheduler ◀────┤                  │
│  OpenAI Calls ◀───┘                  │
│                                      │
│  Single Supabase Client ─────────────│── Single TCP connection
└──────────────────────────────────────┘
```

### Problems at Scale

| Users/Devices | Breaking Point |
|---|---|
| **100 concurrent users** | Thread pool exhaustion from sync Supabase calls |
| **1,000 devices** | Trend engine takes 30+ min (9 queries × 1,000 devices) |
| **10,000 devices** | Network aggregation loop takes 60+ min, overlapping runs |
| **50 concurrent API agent requests** | Platform gateway bcrypt takes 100ms × 50 = 5s of thread blocking |
| **Bulk regeneration of 100 devices** | 100 × 5-15s background jobs → thread pool starvation |

### Scalability Roadmap

#### Phase 1: Async + Connection Pooling (Weeks 1-2)

```python
# Replace sync Supabase with async + pooling
supabase = await acreate_client(url, key)

# OR: Use asyncpg directly for hot paths
pool = await asyncpg.create_pool(
    dsn=DATABASE_URL,
    min_size=5,
    max_size=20,
)
```

**Impact**: 5-10x throughput increase per process without adding infrastructure.

#### Phase 2: Extract Background Processing (Weeks 3-4)

```
┌─────────────┐     ┌─────────┐     ┌──────────────────────┐
│ FastAPI API  │────▶│ Redis   │────▶│ Worker Process       │
│ (stateless)  │     │ (queue) │     │ • Intelligence jobs  │
└─────────────┘     └─────────┘     │ • Aggregation        │
                                    │ • Trend detection    │
                                    └──────────────────────┘
```

- **Decouple HTTP from background work**: API process handles only HTTP; workers handle pipelines.
- **Horizontal scaling**: Run N worker processes independently.
- **Use Celery or arq**: Built-in retry, DLQ, monitoring.

#### Phase 3: Read Replicas + Caching (Weeks 5-6)

```
┌────────────┐
│   Redis     │  ← Rankings, scores, network signals (60s TTL)
└─────┬──────┘
      │ cache miss
┌─────▼──────┐     ┌──────────────┐
│ API Server  │────▶│ Read Replica  │  ← All GET endpoints
└─────┬──────┘     └──────────────┘
      │ writes
┌─────▼──────┐
│ Primary DB  │  ← Event inserts, score upserts
└─────────────┘
```

#### Phase 4: Service Extraction (Month 2+)

Only if load demands it. Extract into independent services:

| Service | Reason |
|---|---|
| **Intelligence Pipeline** | CPU-heavy (scoring + AI), scales independently |
| **Event Ingestion** | High write volume, needs its own data store |
| **Platform API** | Different SLA/auth model, rate limits, billing |

---

## 9. Backend Refactoring Plan

### Priority Matrix

| # | Refactor | Severity | Effort | Impact |
|---|---|---|---|---|
| 1 | **Implement real Decision Engine** (un-stub `decision.py`) | 🔴 Critical | High | Core product feature is non-functional |
| 2 | **Fix N+1 in `devices.py`** | 🔴 Critical | Low | Immediate 10x speedup on browse page |
| 3 | **Add repository layer** (extract DB access from services) | 🟡 High | Medium | Enables testing, async migration, caching |
| 4 | **Switch to async Supabase client** | 🟡 High | Medium | Unblocks thread pool under concurrent load |
| 5 | **Replace Python aggregation with SQL** (network, trends) | 🟡 High | Medium | 100x faster background jobs |
| 6 | **Fix CORS configuration** | 🟡 High | Low | Security hygiene |
| 7 | **Add async OpenAI client** | 🟡 High | Low | Prevents thread starvation during AI insight generation |
| 8 | **Add response caching for rankings/scores** | 🟠 Medium | Low | Reduces DB load, improves p99 latency |
| 9 | **Unified error handling + structured logging** | 🟠 Medium | Medium | Debugging and observability |
| 10 | **Extract background jobs to worker process** | 🟠 Medium | High | Eliminates resource contention |
| 11 | **Add role check caching** (auth `deps.py`) | 🟠 Medium | Low | Eliminates 1 DB query per authenticated request |
| 12 | **Add database indexes for event queries** | 🟠 Medium | Low | 10x faster trend/aggregation queries |
| 13 | **Move admin metrics to materialized view** | 🟢 Low | Low | Faster admin dashboard |
| 14 | **Pin dependency versions with lockfile** | 🟢 Low | Low | Build reproducibility |
| 15 | **Add comprehensive test suite** | 🟢 Low | High | Long-term maintainability |

### Recommended Execution Order

```
Week 1: Items 2, 6, 14 (quick wins — low effort, high impact)
Week 2: Items 3, 4 (repository layer + async migration)
Week 3: Items 5, 7, 12 (SQL optimization + async OpenAI)
Week 4: Items 1, 9 (Decision Engine implementation + error handling)
Week 5: Items 8, 11, 13 (caching layer)
Week 6: Items 10, 15 (worker extraction + test suite)
```

---

## 10. Additional Observations

### 10.1. `DecisionMemoryService` Async/Sync Mismatch

[decision_memory.py](file:///c:/Users/user/Documents/tech-nest/backend/app/services/decision_memory.py#L8-L33): The `log_decision` method is declared `async` but calls `self.supabase.table(...).insert(...)` synchronously. When called via `BackgroundTasks`, this silently runs without `await`, potentially corrupting data or silently failing.

### 10.2. Intelligence Sweep Has No Backpressure

[scheduler.py](file:///c:/Users/user/Documents/tech-nest/backend/app/services/scheduler.py#L60-L78): `_safe_run_intelligence_sweep` fetches 20 pending devices and processes them **sequentially inside the scheduler thread**. If each takes 15 seconds, the sweep runs for 5 minutes — potentially overlapping with the next 5-minute interval. Should use `max_instances=1` (which it does), but this means pending devices accumulate unbounded.

### 10.3. Bulk Generate Silently Drops Failures

[generate.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/generate.py#L232-L240):

```python
for device_id in payload.device_ids:
    try:
        _mark_pending(device_id)
        background_tasks.add_task(...)
        enqueued.append(device_id)
    except Exception:
        pass  # ← Invalid IDs are silently dropped
```

Callers of `bulk-generate` have no way to know which devices failed. Should return `{ "enqueued": [...], "failed": [...] }`.

### 10.4. No Health Check Depth

[main.py](file:///c:/Users/user/Documents/tech-nest/backend/app/main.py#L100-L106): The health check returns static OK without verifying database connectivity or Redis availability. A real health check should ping dependencies:

```python
@app.get("/health")
async def health_check():
    db_ok = await check_database()
    redis_ok = await check_redis()
    return {
        "status": "ok" if db_ok else "degraded",
        "database": "connected" if db_ok else "unreachable",
        "redis": "connected" if redis_ok else "unavailable",
    }
```

### 10.5. No Request Validation on `session_id`

Several endpoints accept `session_id` as a plain string with no format validation. Since sessions are used for analytics tracking, malformed or excessively long session IDs could pollute the event table.

### 10.6. Missing `sentence-transformers` Usage

`requirements.txt` includes `sentence-transformers==3.0.1` and `numpy`, `pandas` — but no code in the backend uses them. These are heavy dependencies (~2GB with models) that inflate the container image for no reason.

---

> [!IMPORTANT]
> **Bottom line**: The backend has strong conceptual architecture (scoring engine, pipeline orchestration, network learning) but suffers from **synchronous-by-default execution**, a **missing Decision Engine implementation**, and **DB query patterns that will not scale**. The most impactful changes are fixing the N+1 query, implementing the real Decision Engine, and migrating to async database access. These three changes alone would make the backend production-viable.