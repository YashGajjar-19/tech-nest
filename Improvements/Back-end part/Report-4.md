# Tech Nest — Backend Performance Audit

> **Audited by:** Senior Performance Engineer perspective
> **Date:** March 10, 2026
> **Scope:** All backend code under `backend/app/`, Supabase schemas, and data access patterns
> **Target scale:** Thousands of concurrent users · Tens of thousands of devices · Frequent decision queries

---

## 1. Performance Summary

| Area | Current State | At-Scale Risk |
|---|---|---|
| Database queries | N+1 patterns, full-table scans, sequential per-device loops | 🔴 **Critical** |
| API latency | Synchronous Supabase REST calls, no connection pooling | 🔴 **Critical** |
| Background jobs | Single-process APScheduler + FastAPI BackgroundTasks | 🟡 **High** |
| Caching | Redis initialized but **zero** application-level cache reads on hot paths | 🔴 **Critical** |
| External API calls | OpenAI LLM calls with synchronous `time.sleep` retries | 🟡 **High** |
| Middleware | Synchronous DB write in response path (usage logging) | 🟡 **High** |

> [!CAUTION]
> The platform has **no caching on any read-hot endpoint** — every API call hits the database directly. At thousands of concurrent users, the Supabase HTTP gateway will become the bottleneck long before application logic does.

---

## 2. Bottlenecks Identified

### 🔴 B1 — N+1 Device Specs Query (Critical)

**File:** [devices.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/devices.py#L27-L82)

```python
# For EACH device in the list, fires a separate Supabase query
for row in resp.data:
    specs_resp_data = (
        supabase.table("device_specs")
        .select("spec_key, spec_value")
        .eq("device_id", device_id)
        .execute()
    )
```

**Impact:** Listing 20 devices = **21 HTTP round-trips** to Supabase (1 list + 20 spec fetches). At 100 devices, this is ~2-3 seconds of pure network time.

---

### 🔴 B2 — Analytics Query Fan-Out (Critical)

**File:** [analytics.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/analytics.py#L9-L67)

The analytics summary endpoint fires **20+ sequential Supabase queries** per call:
- 2 calls for current period metrics (page views + unique visitors + decisions = 6 queries across 2 periods)
- 14 calls for daily stats (7 days × 2 queries each)

**Impact:** Single admin dashboard load = **~20 sequential HTTP calls** to Supabase. At even moderate admin activity, this will timeout under load.

---

### 🔴 B3 — Intelligence Metrics Endpoint (Critical)

**File:** [intelligence.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/intelligence.py#L40-L146)

The `/admin/metrics` endpoint makes **8+ sequential DB calls**: device status scan (full table), event counts, session deduplication, decision counts, score averaging (pulls ALL device_scores rows into Python), and trend calculations.

```python
# Pulls EVERY row into Python to compute average
avg_score_resp = supabase.table("device_scores").select("overall_score").execute()
total_score = sum(row.get("overall_score", 0) for row in avg_score_resp.data)
```

**Impact:** With 10,000+ devices, this transfers megabytes of data just to compute an average that PostgreSQL can do with `AVG()`.

---

### 🔴 B4 — No Application-Level Caching on Hot Paths (Critical)

Despite Redis being initialized in [main.py](file:///c:/Users/user/Documents/tech-nest/backend/app/main.py#L39-L48), it is **only used for**:
1. Rate limiting (middleware)
2. API key validation cache (middleware)

The following high-traffic endpoints make **zero use of caching**:

| Endpoint | Call Frequency | Cache Strategy Needed |
|---|---|---|
| `GET /devices` | Every page load | 30-60s TTL |
| `GET /devices/{id}` | Every device view | 60s TTL |
| `GET /devices/{id}/decision` | Every device card | 5min TTL |
| `GET /network/rankings` | Personalized feed | 60s per user_id |
| `GET /network/device/{id}` | Device detail page | 60s TTL |
| `GET /analytics/summary` | Admin dashboard | 5min TTL |
| `GET /intelligence/admin/metrics` | Admin dashboard | 5min TTL |

---

### 🟡 B5 — Synchronous Usage Logging in Middleware (High)

**File:** [platform_gateway.py](file:///c:/Users/user/Documents/tech-nest/backend/app/middleware/platform_gateway.py#L231-L259)

```python
def _log_usage_sync(self, ...):
    # This runs SYNCHRONOUSLY after response, blocking the connection
    supabase.table("api_usage_logs").insert({...}).execute()
```

Despite the comment claiming this runs "after the response," `BaseHTTPMiddleware` blocks: the response is **not** sent until `dispatch()` returns. Every platform API call adds a synchronous DB insert before the HTTP connection closes.

**Impact:** Adds ~50-150ms to every platform API response under load.

---

### 🟡 B6 — Trend Engine: O(N × 3) Sequential Query Storm (High)

**File:** [trend_engine.py](file:///c:/Users/user/Documents/tech-nest/backend/app/services/trend_engine.py#L150-L186)

```python
for device_id in device_ids:       # Could be 1000+ devices
    trends = detect_trends_for_device(device_id)  # 3 windows × 3 queries each = 9 queries
    for trend in trends:
        supabase.table("device_trends").upsert(trend, ...).execute()  # 1 more per trend
```

**Impact:** With 1,000 active devices: up to **9,000 sequential Supabase queries** per hourly run + thousands of upserts. This will take 30+ minutes and potentially miss its hourly window.

---

### 🟡 B7 — Network Aggregation: Per-Device Sequential Queries (High)

**File:** [network_learning.py](file:///c:/Users/user/Documents/tech-nest/backend/app/services/network_learning.py#L131-L145)

Each device aggregation fires **6 individual count queries** + 1 fetch + 1 upsert = **8 HTTP round-trips per device**. Processing 500 devices = 4,000 sequential Supabase calls.

---

### 🟡 B8 — Decision Engine: Sequential Network Enrichment (High)

**File:** [intelligence_graph.py](file:///c:/Users/user/Documents/tech-nest/backend/app/services/intelligence_graph.py#L186-L199)

```python
def enhance_decision_context(device_ids):
    for device_id in device_ids:
        enrichments[device_id] = get_network_signal(device_id)  # 2 queries each
```

Each device makes 2 sequential Supabase queries. A decision with 5 devices = 10 sequential round-trips, adding 500ms+ to a user-facing real-time API.

---

### 🟡 B9 — Rankings: Full Table Scans + Python-Side Joins (High)

**File:** [intelligence_graph.py](file:///c:/Users/user/Documents/tech-nest/backend/app/services/intelligence_graph.py#L108-L183)

`get_ranked_devices()` fetches **ALL rows** from `device_scores` and `device_network_stats`, joins them in Python, sorts in Python, then slices. No server-side filtering, no pagination at the DB level.

**Impact:** With 10,000 devices, transfers ~1MB+ of JSON per call. All ranking computation happens in Python, not in PostgreSQL where it belongs.

---

### 🟡 B10 — Collective Insights: Full Table Downloads (High)

**File:** [collective_insights.py](file:///c:/Users/user/Documents/tech-nest/backend/app/services/collective_insights.py#L35-L82)

`get_popular_upgrade_paths()` downloads **all user_devices** AND **all user_decisions** into Python memory and does in-memory joins. `get_brand_affinity_patterns()` downloads all devices + all network_stats.

**Impact:** Unbounded memory growth. At 100K decision records, this will consume hundreds of MB per call.

---

### 🟡 B11 — Single-Process Background Workers (High)

**File:** [intelligence_worker.py](file:///c:/Users/user/Documents/tech-nest/backend/app/workers/intelligence_worker.py)

All background work runs in FastAPI's **single-process thread pool**:
- Intelligence pipeline (5-15s each)
- Event logging
- Network aggregation
- Trend detection

If bulk-generate is called with 100 devices, the thread pool is consumed for 25+ minutes, blocking **all** other background tasks including event logging.

---

### 🟡 B12 — Platform Recommend: Cascading Full-Table Queries (High)

**File:** [platform_decision.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/platform_decision.py#L73-L201)

The `/platform/v1/decision/recommend` endpoint:
1. Calls `get_ranked_devices(limit=200)` — fetches ALL scores + ALL network stats
2. Fetches device metadata for 100 device IDs (IN query)
3. Fetches device scores again for the same 100 IDs (duplicate data!)
4. Sorts and filters in Python

**Impact:** Redundant full-table scans and duplicate data fetching. Each recommendation call triggers **4+ full-table queries**.

---

### 🟢 B13 — Supabase Client: Synchronous HTTP, Not Connection Pool

**File:** [database.py](file:///c:/Users/user/Documents/tech-nest/backend/app/database.py)

The Supabase Python SDK uses synchronous HTTP REST calls, not a connection pool to PostgreSQL. Every query is a full HTTP round-trip including DNS, TLS, and JSON serialization. There is no connection reuse or pipelining.

---

### 🟢 B14 — Missing Database Indexes

Examining all Supabase migrations, the following frequently-queried patterns **lack indexes**:

| Query Pattern | Missing Index |
|---|---|
| `device_specs WHERE device_id = ?` | `device_specs.device_id` (table uses `device_id` as PK in original schema but current code uses it as a regular column with separate rows per spec_key) |
| `device_scores WHERE device_id = ?` | Likely PK, but verify composite queries |
| `devices WHERE intelligence_status = ?` | `devices.intelligence_status` |
| `interaction_events WHERE device_id AND event_type AND created_at > ?` | Composite index `(device_id, event_type, created_at)` |
| `user_decisions WHERE user_id = ?` | `user_decisions.user_id` |
| `user_devices WHERE user_id AND ownership_status = ?` | Composite `(user_id, ownership_status)` |

> [!IMPORTANT]
> The composite index `idx_ie_device_time` exists but filters only on `device_id + created_at`. The trend engine and aggregation queries also filter by `event_type`, which means these queries do a **sequential scan** on `event_type` within the index range.

---

## 3. Query Optimization Strategy

### Priority 1: Eliminate N+1 Patterns

```diff
# BEFORE: N+1 in devices.py (21 queries for 20 devices)
- for row in resp.data:
-     specs = supabase.table("device_specs").select(...).eq("device_id", row["id"]).execute()

# AFTER: Batch fetch with IN clause (2 queries total)
+ device_ids = [row["id"] for row in resp.data]
+ all_specs = supabase.table("device_specs").select("device_id, spec_key, spec_value").in_("device_id", device_ids).execute()
+ specs_by_device = defaultdict(dict)
+ for spec in all_specs.data:
+     specs_by_device[spec["device_id"]][spec["spec_key"]] = spec["spec_value"]
```

### Priority 2: Push Aggregations to PostgreSQL

```sql
-- Replace Python-side averaging with server-side RPC
CREATE OR REPLACE FUNCTION get_platform_metrics()
RETURNS JSON LANGUAGE sql STABLE AS $$
  SELECT json_build_object(
    'avg_score', (SELECT ROUND(AVG(overall_score)::numeric, 1) FROM device_scores),
    'total_devices', (SELECT COUNT(*) FROM devices WHERE is_published = true),
    'decisions_today', (
      SELECT COUNT(*) FROM interaction_events
      WHERE event_type = 'start_decision'
      AND created_at >= date_trunc('day', now())
    ),
    'active_sessions', (
      SELECT COUNT(DISTINCT session_id) FROM interaction_events
      WHERE created_at >= now() - interval '30 minutes'
    )
  );
$$;
```

### Priority 3: Batch Network Enrichment

```diff
# BEFORE: Sequential per-device queries
- for device_id in device_ids:
-     enrichments[device_id] = get_network_signal(device_id)

# AFTER: Single batch query
+ stats_resp = supabase.table("device_network_stats") \
+     .select("device_id, network_multiplier, views, ...") \
+     .in_("device_id", device_ids).execute()
+ trends_resp = supabase.table("device_trends") \
+     .select("device_id, trend_type, trend_score") \
+     .in_("device_id", device_ids).execute()
```

### Priority 4: Server-Side Rankings

```sql
-- Replace Python-side join + sort with a single materialized view
CREATE MATERIALIZED VIEW device_rankings AS
SELECT
  ds.device_id,
  ds.overall_score AS base_score,
  COALESCE(dns.network_multiplier, 1.0) AS network_multiplier,
  ROUND((ds.overall_score * COALESCE(dns.network_multiplier, 1.0))::numeric, 3) AS final_score,
  d.name, d.brand, d.price
FROM device_scores ds
JOIN devices d ON d.id = ds.device_id AND d.is_published = true
LEFT JOIN device_network_stats dns ON dns.device_id = ds.device_id
ORDER BY final_score DESC;

-- Refresh every 15 minutes (tied to aggregation job)
REFRESH MATERIALIZED VIEW CONCURRENTLY device_rankings;
```

### Priority 5: Add Missing Composite Indexes

```sql
-- Trend engine + aggregation hot path
CREATE INDEX CONCURRENTLY idx_ie_device_type_time
  ON interaction_events (device_id, event_type, created_at DESC)
  WHERE device_id IS NOT NULL;

-- Intelligence pipeline queue
CREATE INDEX CONCURRENTLY idx_devices_status
  ON devices (intelligence_status)
  WHERE intelligence_status IN ('pending', 'processing');

-- Upgrade path analytics
CREATE INDEX CONCURRENTLY idx_user_devices_ownership
  ON user_devices (user_id, ownership_status);
```

---

## 4. Caching Strategy

### Tier 1: Hot Read Cache (Redis — already connected)

| Key Pattern | TTL | Invalidation |
|---|---|---|
| `cache:devices:list:{category}:{limit}` | 60s | On device publish/unpublish |
| `cache:device:{id}` | 60s | On device update |
| `cache:device:{id}:scores` | 5min | On scoring engine run |
| `cache:rankings:{user_id or "anon"}:{limit}` | 60s | On aggregation job |
| `cache:network:{device_id}` | 60s | On aggregation job |
| `cache:admin:metrics` | 5min | Time-based expiry |
| `cache:admin:analytics` | 5min | Time-based expiry |

### Tier 2: Materialized Views (PostgreSQL)

| View | Refresh Frequency | Replaces |
|---|---|---|
| `device_rankings` | Every 15min (post-aggregation) | Python-side ranking computation |
| `platform_metrics` | Every 5min | 8+ sequential admin metric queries |
| `brand_affinity_mv` | Every 1hr | Full-table download in collective_insights |

### Tier 3: Application-Level Memoization

```python
# For frequently-called internal functions during a single request
from functools import lru_cache

@lru_cache(maxsize=256)
def get_device_scores_cached(device_id: str) -> dict:
    """Per-process in-memory cache for scoring data. Evicted on LRU basis."""
    resp = supabase.table("device_scores").select("*").eq("device_id", device_id).single().execute()
    return resp.data
```

### Implementation Pattern (Redis cache decorator):

```python
import json
from functools import wraps
from typing import Optional

async def redis_cache(key: str, ttl: int, redis_conn) -> Optional[str]:
    if not redis_conn:
        return None
    try:
        return await redis_conn.get(key)
    except Exception:
        return None

async def redis_set(key: str, value: str, ttl: int, redis_conn):
    if not redis_conn:
        return
    try:
        await redis_conn.setex(key, ttl, value)
    except Exception:
        pass  # Cache write failure is non-critical
```

---

## 5. Worker Scaling Strategy

### Current Architecture Problems

```
┌──────────────────────────────────────────┐
│           FastAPI Process (single)        │
│                                          │
│  ┌─────────────┐  ┌──────────────────┐  │
│  │  HTTP Server │  │ APScheduler      │  │
│  │  (uvicorn)   │  │  (3 cron jobs)   │  │
│  └──────┬──────┘  └────────┬─────────┘  │
│         │                  │             │
│         ▼                  ▼             │
│  ┌─────────────────────────────────┐    │
│  │   Shared Thread Pool (default)   │    │
│  │   - BackgroundTasks              │    │
│  │   - Intelligence pipeline        │    │
│  │   - Event logging                │    │
│  │   - Aggregation jobs             │    │
│  │   - Trend detection              │    │
│  └─────────────────────────────────┘    │
└──────────────────────────────────────────┘
```

**Problems:**
1. Intelligence pipeline (5-15s per device) starves event logging
2. Bulk-generate with 100 devices monopolizes thread pool for 25+ minutes
3. APScheduler jobs compete with request-triggered background tasks
4. Single process crash = everything goes down
5. No retry queue — failed jobs are lost

### Phase 1: Immediate (No New Infrastructure)

```python
# Separate thread pools for different priorities
import concurrent.futures

# Dedicated pools prevent starvation
IO_POOL = concurrent.futures.ThreadPoolExecutor(max_workers=4, thread_name_prefix="io")
PIPELINE_POOL = concurrent.futures.ThreadPoolExecutor(max_workers=2, thread_name_prefix="pipeline")
SCHEDULER_POOL = concurrent.futures.ThreadPoolExecutor(max_workers=2, thread_name_prefix="scheduler")
```

### Phase 2: Redis + Celery (When Redis is Production-Ready)

```
┌──────────────┐    ┌─────────┐    ┌───────────────────┐
│ FastAPI API   │───▶│  Redis  │◀───│  Celery Worker(s) │
│ (HTTP only)   │    │ (Broker │    │  - Pipeline queue  │
│               │    │  + Cache│    │  - Aggregation     │
│               │    │  + Rate │    │  - Trend detection │
│               │    │  Limit) │    │                    │
└──────────────┘    └─────────┘    └───────────────────┘
```

**Queue design:**

| Queue | Concurrency | Priority | Contents |
|---|---|---|---|
| `pipeline` | 2 workers | Normal | Intelligence generation jobs |
| `aggregation` | 1 worker | Low | Network stats + trend engine |
| `events` | 4 workers | High | Event logging (fire-and-forget) |
| `ai` | 1 worker | Low | OpenAI LLM calls (rate-limited) |

### Phase 3: Horizontal Scaling

- Deploy multiple Celery workers behind a load balancer
- Use Celery's `rate_limit` decorator for OpenAI calls
- Implement dead-letter queue for failed pipeline jobs
- Add Flower dashboard for real-time worker monitoring

---

## 6. Infrastructure Recommendations

### Immediate Actions (Week 1-2)

| Priority | Action | Impact | Effort |
|---|---|---|---|
| P0 | Fix N+1 in `devices.py` — batch spec fetch | ~10x faster device listing | 1 hour |
| P0 | Add Redis cache to `GET /devices`, `GET /devices/{id}`, `GET /rankings` | ~50x faster reads | 2 hours |
| P0 | Replace analytics fan-out with Supabase RPC function | ~20x faster admin dashboard | 3 hours |
| P1 | Fix middleware usage logging — use true async fire-and-forget | -50-150ms per platform call | 1 hour |
| P1 | Batch `enhance_decision_context()` — single IN query | -500ms per decision call | 1 hour |
| P1 | Add composite index `(device_id, event_type, created_at)` | 10-100x faster aggregation queries | 30 min |

### Short-Term (Month 1)

| Priority | Action | Impact |
|---|---|---|
| P1 | Build `device_rankings` materialized view | Eliminate Python-side ranking |
| P1 | Replace trend engine per-device loops with batch SQL queries | From 9,000 queries to ~10 |
| P1 | Replace collective_insights full-table downloads with SQL aggregation | Eliminate unbounded memory |
| P2 | Switch from synchronous Supabase SDK to async `httpx` client | ~2x throughput on IO-bound calls |
| P2 | Introduce connection pooling via Supabase's `pgbouncer` endpoint | Prevent connection exhaustion |

### Medium-Term (Month 2-3)

| Priority | Action | Impact |
|---|---|---|
| P2 | Migrate to Celery + Redis for background jobs | Horizontal scaling, retry queues |
| P2 | Implement cache invalidation hooks on scoring/aggregation | Fresh data without constant DB hits |
| P3 | Deploy multiple uvicorn workers with `--workers=N` | Horizontal API scaling |
| P3 | Implement read replicas for analytics/insights queries | Separate read vs write load |

### Scale Thresholds (When to Act)

| Metric | Threshold | Action |
|---|---|---|
| P95 API latency | > 500ms | Deploy Redis caching + fix N+1 |
| Concurrent users | > 500 | Add uvicorn workers + connection pooling |
| Devices in DB | > 5,000 | Materialized views for rankings |
| Pipeline jobs/hour | > 50 | Migrate to Celery |
| Events/minute | > 1,000 | Batch event inserts (bulk INSERT) |
| Supabase API calls/min | > 5,000 | Switch to direct PostgreSQL connection |

---

## 📊 Estimated Latency Impact

| Endpoint | Current (est.) | After P0 Fixes | After Full Optimization |
|---|---|---|---|
| `GET /devices` (20) | 1,200-2,000ms | 100-200ms | 5-15ms (cached) |
| `GET /devices/{id}` | 200-400ms | 100-150ms | 3-10ms (cached) |
| `POST /decision/orchestrate` (5 devices) | 800-1,500ms | 200-400ms | 50-100ms (cached enrichments) |
| `GET /analytics/summary` | 3,000-5,000ms | 200-500ms | 10-30ms (cached) |
| `GET /admin/metrics` | 2,000-4,000ms | 100-300ms | 10-30ms (cached) |
| `GET /network/rankings` | 500-1,000ms | 100-200ms | 5-15ms (cached/MV) |
| `POST /platform/v1/decision/recommend` | 2,000-4,000ms | 300-600ms | 50-150ms (cached + MV) |

> [!TIP]
> The P0 fixes alone (N+1 elimination, Redis caching, and analytics RPC) would reduce average API latency by **~80%** and Supabase API call volume by **~95%**. These require no infrastructure changes — just code modifications.
