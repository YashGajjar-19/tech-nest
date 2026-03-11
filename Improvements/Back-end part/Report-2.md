# Tech Nest — API Design Audit

> **Auditor Role**: Senior API Architect
> **Date**: 2026-03-09
> **Scope**: All 40+ endpoints across `/api/v1/*` (internal) and `/platform/v1/*` (public platform)
> **Verdict**: 🔴 **Not Production-Ready** — Significant gaps in consistency, security, and scalability

---

## 1. API Design Summary

### What Exists

| Surface                                     | Auth Model            | Endpoints     | Router Files |
| ------------------------------------------- | --------------------- | ------------- | ------------ |
| Internal API (`/api/v1/*`)                  | Supabase JWT          | ~25           | 10 routers   |
| Platform API (`/platform/v1/*`)             | API Key (`X-API-Key`) | ~10           | 3 routers    |
| Platform Admin (`/api/v1/platform-admin/*`) | Supabase JWT (admin)  | 6             | 1 router     |
| Infrastructure                              | None                  | 1 (`/health`) | `main.py`    |

### Overall Grade

| Area                 | Grade | Verdict                                        |
| -------------------- | ----- | ---------------------------------------------- |
| Endpoint Naming      | C+    | Inconsistent, overlapping prefixes             |
| Response Consistency | D     | No standard envelope, mixed formats            |
| Error Handling       | D+    | Catch-all swallowing, inconsistent shapes      |
| Versioning           | C     | Present in URLs but not enforced               |
| Pagination           | F     | Missing on internal APIs entirely              |
| Caching              | F     | Zero `Cache-Control` headers, no HTTP ETags    |
| Rate Limiting        | B-    | Platform has it; internal has none             |
| Security             | D+    | CORS wildcard, bare excepts, mock data leaking |
| Idempotency          | F     | No idempotency keys on any mutating endpoints  |

---

## 2. Endpoint Design Issues

### 2.1 — Prefix Collision: `intelligence` and `generate`

```python
# main.py — Both share the SAME prefix
app.include_router(intelligence.router, prefix="/api/v1/intelligence")
app.include_router(generate.router,    prefix="/api/v1/intelligence")
```

Two completely different routers mounted on **the same prefix**. This creates:

- **Route ambiguity**: `GET /api/v1/intelligence/status/{id}` lives in `generate.py`, not `intelligence.py`
- **OpenAPI confusion**: Tags say "Intelligence" vs "Intelligence Pipeline" — but the paths are identical
- **Maintenance nightmare**: Developers cannot tell which router owns which route

**Fix**: Mount `generate.py` under `/api/v1/intelligence/pipeline` or restructure into a single router.

---

### 2.2 — Inconsistent Naming Conventions

| Pattern          | Examples                                                 | Problem                                         |
| ---------------- | -------------------------------------------------------- | ----------------------------------------------- |
| Kebab-case       | `/knowledge-graph`, `/market-signals`, `/platform-admin` | ✅ Correct                                      |
| Bare noun        | `/devices`, `/network`, `/advisor`                       | ✅ Acceptable                                   |
| Verb-as-path     | `/decision/orchestrate`, `/intelligence/generate/{id}`   | ❌ RPC-style, not RESTful                       |
| PUT for creation | `PUT /market-signals/ingest`                             | ❌ PUT implies replace; this is a create action |

**Stripe's API** uses nouns for resources and HTTP verbs for actions. The current design mixes RPC verbs into paths:

| Current (RPC)                        | Suggested (REST)                               |
| ------------------------------------ | ---------------------------------------------- |
| `POST /decision/orchestrate`         | `POST /decisions` or `POST /decision/verdicts` |
| `POST /intelligence/generate/{id}`   | `POST /devices/{id}/intelligence`              |
| `POST /intelligence/regenerate/{id}` | `PUT /devices/{id}/intelligence`               |
| `PUT /market-signals/ingest`         | `POST /market-signals`                         |
| `POST /advisor/refresh`              | `POST /advisor/feeds` (with `force: true`)     |
| `POST /network/aggregate`            | `POST /network/aggregations`                   |

---

### 2.3 — Admin Routes Buried Inside Public Routers

```python
# intelligence.py — admin endpoints inside a non-admin-tagged router
@router.get("/admin/metrics", ...)    # Requires require_admin
@router.get("/admin/queue", ...)      # Requires require_admin
```

Admin endpoints for intelligence metrics live in the same router as public `POST /context`. These should be in a dedicated admin router, not scattered across feature routers.

---

### 2.4 — Missing Auth on Sensitive Endpoints

| Endpoint                                | Issue                                                             |
| --------------------------------------- | ----------------------------------------------------------------- |
| `GET /network/insights`                 | Described as "Admin-grade" but **has no auth dependency**         |
| `POST /network/aggregate`               | Described as "restricted to admin" but **has no auth dependency** |
| `POST /network/event`                   | Accepts any `user_id` with zero validation — allows spoofing      |
| `GET /knowledge-graph/adjacencies/{id}` | No auth at all                                                    |
| `GET /devices`                          | No auth — acceptable if intentionally public                      |

> [!CAUTION]
> `GET /network/insights` and `POST /network/aggregate` have comments saying "restricted to admin" but **zero auth middleware or dependency**. Any unauthenticated request can trigger aggregation or view collective intelligence data.

---

## 3. Response Structure Improvements

### 3.1 — No Standard Response Envelope

Every router uses a **different response shape**:

```python
# devices.py — returns raw list
return devices  # List[Device]

# analytics.py — wraps in status + metrics
return {"status": "success", "metrics": {...}}

# network.py — returns {"status": "accepted", ...}
return {"status": "accepted", "event_type": "..."}

# advisor.py — returns {"message": "..."}
return {"message": "Advisor background processing triggered successfully."}

# intelligence.py admin — returns {"status": "success", "metrics": {...}}
# intelligence.py error — returns {"status": "error", "message": str(e), "metrics": {...}}
```

**Stripe**, **Twilio**, and **GitHub** all wrap responses in a standard envelope. Proposed:

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "request_id": "req_abc123",
    "timestamp": "2026-03-09T12:00:00Z",
    "version": "v1"
  },
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 142,
    "has_more": true
  }
}
```

For errors:

```json
{
  "success": false,
  "error": {
    "code": "DEVICE_NOT_FOUND",
    "message": "No device found with ID 'xyz'.",
    "type": "not_found",
    "param": "device_id",
    "docs_url": "https://docs.technest.app/errors/DEVICE_NOT_FOUND"
  },
  "meta": {
    "request_id": "req_abc123",
    "timestamp": "2026-03-09T12:00:00Z"
  }
}
```

### 3.2 — Numbers Returned as Strings

```python
# analytics.py
"page_views_7d": f"{current_pv:,}",     # "1,234" ← string with commas
"unique_visitors_7d": f"{current_uv:,}", # "567"   ← string with commas
```

API consumers (mobile apps, AI agents) must parse formatted strings back into numbers. **All numeric values should be returned as numbers**. Formatting is a frontend concern.

### 3.3 — Hardcoded Mock/Fake Data in Production

| File                               | Mock Data                                                                                       |
| ---------------------------------- | ----------------------------------------------------------------------------------------------- |
| `knowledge_graph.py`               | Entire response is hardcoded mock JSON                                                          |
| `intelligence.py` `/context`       | Returns fake vector `[0.012, -0.045, 0.89]`                                                     |
| `decision.py` `/orchestrate`       | Hard-codes verdict `"BUY"` and scores for every device                                          |
| `system.py` `/logs`                | Falls back to mock `"mock-1"` log on any error                                                  |
| `system.py` `/settings`            | Entire response is hardcoded dict — no DB                                                       |
| `intelligence.py` `/admin/metrics` | `"pipeline_uptime": "99.9%"`, `"models_in_prod": 2`, `"avg_latency": "124ms"` are all hardcoded |
| `analytics.py`                     | `"avg_session_time": "4m 12s"` — hardcoded                                                      |

> [!WARNING]
> Mock data in production endpoints gives consumers false confidence. Either implement the real logic or return `501 Not Implemented` with a clear message. Never silently return fake data.

---

## 4. Error Handling Improvements

### 4.1 — Catch-All Exception Swallowing

The most critical anti-pattern in this codebase:

```python
# devices.py — bare except silently continues
except:
    pass  # Fallback if table doesn't exist yet

# decision.py — silently swallows network enrichment failures
except Exception:
    pass  # Network enrichment is non-critical

# system.py — returns mock data on ANY error
except Exception as e:
    return [{"id": "mock-1", ...}]

# analytics.py — returns zeros instead of surfacing the error
except Exception as e:
    return {"status": "error", "message": str(e), ...}

# platform_agent.py — returns success=False with internal error in response body
except Exception as exc:
    return AgentResponse(action=..., success=False, data=None,
                         metadata={"error": str(exc)})
```

**Problems:**

1. **Bare `except:` (no exception type)** — catches `SystemExit`, `KeyboardInterrupt`. A Python anti-pattern that can mask critical failures
2. **Leaking `str(e)` to clients** — exposes internal stack traces, DB schema, and library versions
3. **Returning HTTP 200 for errors** — `analytics.py` and `intelligence.py` return `{"status": "error"}` with status code 200. This breaks standard HTTP error handling
4. **No error codes** — just free-text messages, impossible for clients to programmatically handle

### 4.2 — Proposed Standard Error Model

```python
# app/models/errors.py

class APIError(BaseModel):
    code:      str            # Machine-readable: "DEVICE_NOT_FOUND"
    message:   str            # Human-readable
    type:      str            # "validation", "not_found", "auth", "rate_limit", "internal"
    param:     Optional[str]  # Which parameter caused the error
    docs_url:  Optional[str]  # Link to docs

# Global exception handler
@app.exception_handler(Exception)
async def global_handler(request, exc):
    # Log full trace internally
    logger.exception(f"Unhandled: {request.url}")
    # Return sanitized error
    return JSONResponse(status_code=500, content={
        "success": False,
        "error": {
            "code": "INTERNAL_ERROR",
            "message": "An unexpected error occurred.",
            "type": "internal"
        }
    })
```

---

## 5. API Versioning Strategy

### Current State

Versioning exists in URLs (`/api/v1/`, `/platform/v1/`), but:

- **No version enforcement** — there's no mechanism to deprecate v1 or run v2 in parallel
- **No `API-Version` header** — clients can't specify preferred version
- **No deprecation policy** — no sunset headers, no migration guides
- **Version hardcoded in `main.py`** — version `"3.0.0"` in FastAPI config doesn't match `v1` in URLs

### Proposed Strategy

| Element                    | Implementation                                                                    |
| -------------------------- | --------------------------------------------------------------------------------- |
| **URL versioning**         | Keep `/api/v1/`, `/api/v2/` — already in place                                    |
| **Version router factory** | Create `create_v1_app()`, `create_v2_app()` functions that mount separate routers |
| **Deprecation headers**    | Add `Sunset: <date>` and `Deprecation: true` headers to old versions              |
| **Changelog**              | Maintain `/api/versions` endpoint listing active versions                         |
| **Breaking change policy** | Internal: minimum 30 days notice. Platform: minimum 90 days with email            |

```python
# Proposed: version isolation
from app.routers.v1 import router as v1_router
from app.routers.v2 import router as v2_router

app.include_router(v1_router, prefix="/api/v1")
app.include_router(v2_router, prefix="/api/v2")
```

---

## 6. Pagination Strategy

### Current State

| Endpoint                               | Pagination?          | Problem                                                                 |
| -------------------------------------- | -------------------- | ----------------------------------------------------------------------- |
| `GET /api/v1/devices`                  | `limit` only         | **No offset/cursor, no `total` count, no `has_more`**                   |
| `GET /api/v1/network/rankings`         | `limit` only         | Same                                                                    |
| `GET /api/v1/intelligence/admin/queue` | Hardcoded `limit=20` | No user control                                                         |
| `GET /api/v1/system/logs`              | `limit` only         | Same                                                                    |
| `GET /api/v1/analytics/summary`        | None                 | Fixed 7-day window                                                      |
| `GET /platform/v1/devices/`            | ✅ `page` + `limit`  | **`total` is wrong** — returns `len(filtered_results)` not actual total |

The **only** endpoint with proper pagination is the platform device list, and even that has a bug:

```python
# platform_devices.py — total is count of THIS page, not DB total
return DeviceListPublic(
    devices=devices_out,
    total=len(devices_out),  # ❌ This is the page size, not the total count
    page=page,
    limit=limit
)
```

### Proposed Implementation

```python
# Cursor-based pagination (preferred for large datasets)
class PaginatedResponse(BaseModel, Generic[T]):
    data: list[T]
    pagination: PaginationMeta

class PaginationMeta(BaseModel):
    total: int            # Total records matching filter
    page: int             # Current page (for offset-based)
    limit: int            # Items per page
    has_more: bool        # Whether more pages exist
    next_cursor: Optional[str]  # For cursor-based pagination

# Applied to devices
@router.get("", response_model=PaginatedResponse[Device])
def list_devices(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    category: Optional[str] = None,
    sort_by: str = Query("created_at", regex="^(created_at|name|score)$"),
    order: str = Query("desc", regex="^(asc|desc)$"),
):
    # Use Supabase count="exact" for total
    total = supabase.table("devices").select("id", count="exact").execute().count
    ...
```

---

## 7. Caching Strategy

### Current State

**Zero HTTP caching is implemented.** No `Cache-Control`, no `ETag`, no `Last-Modified` headers on any endpoint. Every request hits Supabase directly.

### Endpoints That Should Be Cached

| Endpoint                                | Cache Strategy             | TTL    | Rationale                             |
| --------------------------------------- | -------------------------- | ------ | ------------------------------------- |
| `GET /devices`                          | CDN + `Cache-Control`      | 60s    | Device list changes infrequently      |
| `GET /devices/{id}`                     | `Cache-Control` + `ETag`   | 300s   | Individual device data is stable      |
| `GET /devices/{id}/decision`            | `Cache-Control`            | 120s   | Scores update on pipeline run only    |
| `GET /platform/v1/devices/{id}/score`   | `Cache-Control` + Redis    | 300s   | Highest traffic endpoint for platform |
| `GET /platform/v1/devices/`             | Redis + `Cache-Control`    | 60s    | List endpoint, high traffic           |
| `GET /platform/v1/agent/capabilities`   | `Cache-Control: immutable` | 86400s | Static schema, changes only on deploy |
| `GET /network/device/{id}`              | Redis                      | 30s    | Network signals update every 5min     |
| `GET /intelligence/status/{id}`         | Redis                      | 60s    | Status stable between pipeline runs   |
| `GET /system/settings`                  | `Cache-Control: immutable` | 3600s  | Hardcoded values, never changes       |
| `GET /knowledge-graph/adjacencies/{id}` | Redis + `Cache-Control`    | 600s   | Graph changes only on re-score        |

### Proposed Implementation

```python
# Middleware-level cache headers
from fastapi import Response

@router.get("/{device_id}")
async def get_device(device_id: str, response: Response):
    response.headers["Cache-Control"] = "public, max-age=300, stale-while-revalidate=60"
    response.headers["ETag"] = f'"{hash(device_data)}"'
    ...

# Redis application cache layer
class CacheService:
    async def get_or_compute(self, key: str, ttl: int, compute_fn):
        cached = await redis.get(key)
        if cached:
            return json.loads(cached)
        result = await compute_fn()
        await redis.setex(key, ttl, json.dumps(result))
        return result
```

---

## 8. API Security Improvements

### 8.1 — CORS Wildcard Defeats All Protection

```python
# main.py
allow_origins=["http://localhost:3000", "https://technest.app", "*"],
```

Including `"*"` alongside specific origins makes the specific origins meaningless. **Any website on the internet** can make credentialed requests to this API.

**Fix**: Remove `"*"`. Use environment-based origin lists:

```python
ALLOWED_ORIGINS = settings.CORS_ORIGINS.split(",")
# Production: "https://technest.app,https://admin.technest.app"
# Development: "http://localhost:3000"
```

### 8.2 — Service Role Key Used as Singleton

```python
# database.py — one global service-role client
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
```

The service role key **bypasses all Row Level Security**. Every endpoint—public and admin—uses the same unrestricted client. If any endpoint has a query injection or filtering bug, the attacker has access to all data in all tables.

**Fix**: For user-authenticated endpoints, create per-request clients with the user's JWT to enforce RLS:

```python
def get_user_supabase(token: str) -> Client:
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY,
                         options={"headers": {"Authorization": f"Bearer {token}"}})
```

### 8.3 — Internal Exception Details Leaked

```python
# advisor.py
raise HTTPException(status_code=500, detail=str(e))

# deps.py
detail=str(e) if "token" in str(e).lower() else "Authentication failed"

# platform_admin.py
raise HTTPException(status_code=500, detail=str(exc))
```

`str(e)` can contain database error messages, table names, column names, authentication internals. Never expose raw exception strings.

### 8.4 — No Request ID Tracing

Zero endpoints generate or propagate a `X-Request-Id`. Debugging production issues across services is impossible without request correlation.

**Fix**: Add middleware that generates UUIDv4 for each request and includes it in every response:

```python
@app.middleware("http")
async def add_request_id(request: Request, call_next):
    request_id = request.headers.get("X-Request-Id", str(uuid4()))
    request.state.request_id = request_id
    response = await call_next(request)
    response.headers["X-Request-Id"] = request_id
    return response
```

### 8.5 — No Input Validation on System Logs

```python
# system.py — accepts ANY dict as a log entry, no validation
@router.post("/logs", status_code=201)
async def create_log(log: Dict[str, Any], _: dict = Depends(require_admin)):
    resp = supabase.table("system_logs").insert(log).execute()
```

An admin can insert arbitrary JSON into the database with no schema validation. Combined with the service role key, this is a direct path to data corruption.

### 8.6 — No Rate Limiting on Internal API

Internal endpoints have **zero rate limiting**. The `RateLimiter` import in `devices.py` is never used:

```python
from fastapi_limiter.depends import RateLimiter  # Imported but never applied
```

A single malicious user with a valid JWT can hammer N+1 query endpoints like `GET /devices` and bring down Supabase.

### 8.7 — N+1 Query in Devices Router

```python
# devices.py — For each device, makes a SEPARATE query for specs
for row in resp.data:
    device_id = row["id"]
    specs_resp_data = (
        supabase.table("device_specs")
            .select("spec_key, spec_value")
            .eq("device_id", device_id)
            .execute()
    )
```

Listing 20 devices makes **21 database calls** (1 for devices + 20 for specs). At 100 devices per page, that's **101 queries per request**. This will not scale.

**Fix**: Batch fetch specs in a single query using `.in_("device_id", device_ids)`.

---

## 9. Complete Endpoint Catalog

### Internal API (`/api/v1/*`)

| Method | Path                                | Auth      | Rating | Issues                                          |
| ------ | ----------------------------------- | --------- | ------ | ----------------------------------------------- |
| `GET`  | `/devices`                          | None      | ⚠️     | N+1 query, no pagination offset, no total count |
| `GET`  | `/devices/{id}`                     | None      | ⚠️     | N+1 for specs                                   |
| `GET`  | `/devices/{id}/decision`            | None      | ❌     | Returns fake data when not found instead of 404 |
| `POST` | `/intelligence/context`             | None      | ❌     | Hardcoded mock response                         |
| `GET`  | `/intelligence/admin/metrics`       | Admin JWT | ⚠️     | Contains hardcoded values mixed with real data  |
| `GET`  | `/intelligence/admin/queue`         | Admin JWT | ⚠️     | Hardcoded limit, no pagination                  |
| `POST` | `/intelligence/generate/{id}`       | Admin JWT | ✅     | Well-designed guard logic                       |
| `POST` | `/intelligence/regenerate/{id}`     | Admin JWT | ✅     | Good                                            |
| `GET`  | `/intelligence/status/{id}`         | None      | ⚠️     | Makes 4 separate DB calls                       |
| `POST` | `/intelligence/bulk-generate`       | Admin JWT | ✅     | Has max-100 guard                               |
| `POST` | `/decision/orchestrate`             | None      | ❌     | Mock verdict, no auth                           |
| `GET`  | `/knowledge-graph/adjacencies/{id}` | None      | ❌     | Fully mocked                                    |
| `PUT`  | `/market-signals/ingest`            | None      | ❌     | Wrong HTTP verb, empty implementation           |
| `GET`  | `/advisor/feed`                     | Fake auth | ❌     | `get_current_user_id()` returns hardcoded UUID  |
| `POST` | `/advisor/refresh`                  | None      | ❌     | Accepts arbitrary `user_id` with no validation  |
| `POST` | `/network/event`                    | None      | ⚠️     | No auth, any user_id accepted                   |
| `GET`  | `/network/device/{id}`              | None      | ✅     | Clean                                           |
| `GET`  | `/network/rankings`                 | None      | ⚠️     | No pagination beyond limit                      |
| `GET`  | `/network/insights`                 | None      | ❌     | Should be admin-only, has no auth               |
| `POST` | `/network/aggregate`                | None      | ❌     | Should be admin-only, has no auth               |
| `GET`  | `/analytics/summary`                | Admin JWT | ⚠️     | Returns error as 200 with "status": "error"     |
| `GET`  | `/system/logs`                      | Admin JWT | ⚠️     | Returns mock on error                           |
| `GET`  | `/system/settings`                  | Admin JWT | ⚠️     | Entirely hardcoded                              |
| `POST` | `/system/logs`                      | Admin JWT | ❌     | Accepts arbitrary unvalidated JSON              |

### Platform API (`/platform/v1/*`)

| Method | Path                  | Auth    | Rating | Issues                                             |
| ------ | --------------------- | ------- | ------ | -------------------------------------------------- |
| `GET`  | `/devices/{id}/score` | API Key | ✅     | Well-structured response                           |
| `GET`  | `/devices/`           | API Key | ⚠️     | `total` count is wrong, brand filter is post-query |
| `POST` | `/decision/recommend` | API Key | ✅     | Good schema, but fetches 200 devices to filter     |
| `POST` | `/agent/query`        | API Key | ⚠️     | Returns 200 on errors with `success: false`        |
| `GET`  | `/agent/capabilities` | API Key | ✅     | Clean discovery endpoint                           |

### Platform Admin (`/api/v1/platform-admin/*`)

| Method | Path                 | Auth      | Rating |
| ------ | -------------------- | --------- | ------ |
| `POST` | `/keys`              | Admin JWT | ✅     |
| `GET`  | `/keys`              | Admin JWT | ✅     |
| `POST` | `/keys/revoke`       | Admin JWT | ✅     |
| `POST` | `/keys/rotate`       | Admin JWT | ✅     |
| `GET`  | `/usage`             | Admin JWT | ⚠️     |
| `GET`  | `/usage/{client_id}` | Admin JWT | ✅     |

---

## 10. Priority Remediation Roadmap

### 🔴 P0 — Fix Before Any Launch (Security)

1. **Remove CORS wildcard `"*"`** — replace with explicit production origins
2. **Add auth to `/network/insights` and `/network/aggregate`** — they're admin endpoints with no auth
3. **Stop leaking `str(e)` in error responses** — sanitize all HTTPException detail strings
4. **Fix the fake auth in `advisor.py`** — `get_current_user_id()` returns hardcoded UUID
5. **Add global exception handler** — catch all unhandled exceptions, log internally, return sanitized 500

### 🟡 P1 — Fix Before Platform Launch (API Quality)

6. **Standardize response envelope** — `{success, data, meta, pagination}`
7. **Fix N+1 query in `devices.py`** — batch specs fetch
8. **Fix `total` count in platform device list** — use Supabase `count="exact"`
9. **Return numbers as numbers** in analytics, not formatted strings
10. **Separate `intelligence.py` and `generate.py` prefixes** — eliminate collision
11. **Remove or gate mock responses** — return `501 Not Implemented` for unfinished endpoints

### 🟢 P2 — Before Scale (Performance & DX)

12. **Add pagination to all list endpoints** — `page`, `limit`, `total`, `has_more`
13. **Add `Cache-Control` headers** — start with device and capabilities endpoints
14. **Add Redis caching layer** — for device scores, network signals
15. **Add `X-Request-Id` middleware** — for request correlation
16. **Add rate limiting to internal API** — apply `fastapi_limiter` dependency
17. **Add OpenAPI descriptions** — summary, examples, and error schemas for all endpoints
18. **Implement idempotency keys** — for `POST /decision/orchestrate`, `/intelligence/generate`

---

## 11. Comparison to Industry Standards

| Principle              | Stripe               | GitHub                   | Tech Nest                    | Gap          |
| ---------------------- | -------------------- | ------------------------ | ---------------------------- | ------------ |
| Standard envelope      | ✅ `{data, error}`   | ✅                       | ❌ Mixed formats             | Critical     |
| Pagination             | ✅ Cursor-based      | ✅ Link headers          | ❌ Missing                   | Critical     |
| Error codes            | ✅ Machine-readable  | ✅                       | ❌ Free-text only            | Critical     |
| Versioning             | ✅ Date-based header | ✅ URL-based             | ⚠️ URL present, not enforced | Medium       |
| Idempotency            | ✅ `Idempotency-Key` | N/A                      | ❌ None                      | High         |
| Rate limit headers     | ✅ `X-RateLimit-*`   | ✅                       | ❌ Only `Retry-After` on 429 | Medium       |
| Request IDs            | ✅ `Request-Id`      | ✅ `X-GitHub-Request-Id` | ❌ None                      | High         |
| Webhook events         | ✅                   | ✅                       | ❌ None                      | Low (future) |
| SDK / client libraries | ✅                   | ✅                       | ❌ Empty `/sdk` dir          | Low (future) |