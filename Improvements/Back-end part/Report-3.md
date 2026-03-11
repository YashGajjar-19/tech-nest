# Tech Nest — Backend Security Audit

> **Date**: March 9, 2026  
> **Scope**: FastAPI backend, Supabase database, Next.js middleware, authentication, API surface  
> **Severity Scale**: 🔴 CRITICAL · 🟠 HIGH · 🟡 MEDIUM · 🔵 LOW

---

## 1. Security Risk Summary

| Category | Critical | High | Medium | Low | Total |
|---|:---:|:---:|:---:|:---:|:---:|
| **Secrets & Credential Management** | 3 | 1 | — | — | 4 |
| **Authentication & Authorization** | 2 | 3 | 2 | — | 7 |
| **API Security** | 1 | 3 | 2 | 1 | 7 |
| **Database Security** | 1 | 2 | 2 | — | 5 |
| **Data Exposure & Leakage** | 1 | 2 | 1 | 1 | 5 |
| **Infrastructure & Hardening** | — | 2 | 2 | 1 | 5 |
| **Total** | **8** | **13** | **9** | **3** | **33** |

> [!CAUTION]
> **8 critical vulnerabilities** require immediate remediation before any production deployment. The system is currently **not safe** for production traffic.

---

## 2. Critical Security Issues

### 🔴 SEC-01: Supabase Service Role Key Committed to Git

**Files**: [.env.local](file:///c:/Users/user/Documents/tech-nest/.env.local), [backend/.env](file:///c:/Users/user/Documents/tech-nest/backend/.env)

The **Supabase Service Role Key** is committed to the repository in plaintext. This key **bypasses all Row Level Security** and grants unrestricted database access. Anyone with repo access (or if the repo is public) can:
- Read, write, and delete **all data** in every table
- Impersonate any user
- Access `auth.users` directly
- Bypass every RLS policy

```
# backend/.env — Line 4
SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIs...5v_n4c6oiZv5XuLyDN4a5Zn0h4ibyZXAgTh5fNuNYFw

# .env.local — Line 10
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...5v_n4c6oiZv5XuLyDN4a5Zn0h4ibyZXAgTh5fNuNYFw
```

> [!IMPORTANT]
> The `.gitignore` has `.env*` pattern, but `.env.local` is currently tracked. This means the key is already in git history even if removed now.

**Impact**: Complete database takeover  
**Remediation**:
1. **Immediately rotate** the Supabase Service Role Key in the dashboard
2. Remove `.env.local` and `backend/.env` from git tracking: `git rm --cached .env.local backend/.env`
3. Scrub from git history using `git filter-branch` or BFG Repo-Cleaner
4. Use environment variables injected by deployment platform (Vercel, Railway, etc.)

---

### 🔴 SEC-02: OpenAI API Key Committed to Git

**File**: [backend/.env](file:///c:/Users/user/Documents/tech-nest/backend/.env) — Line 8

```
OPENAI_API_KEY=sk-abcdef1234567890abcdef1234567890abcdef12
```

Even if this is a placeholder, the pattern trains developers to commit real keys here. If real, an attacker can consume the OpenAI quota at the project owner's expense.

**Remediation**: Same as SEC-01 — rotate key, remove from history, inject via environment.

---

### 🔴 SEC-03: Supabase Anon Key Committed with Live Project URL

**File**: [.env.local](file:///c:/Users/user/Documents/tech-nest/.env.local) — Lines 5–6

The anon key + project URL are committed together. While the anon key is designed to be public, having it committed with the service role key in the same file is a risk amplifier — and the anon key allows direct Supabase client-side access within RLS boundaries.

---

### 🔴 SEC-04: Developer Email Hardcoded in Migration Script

**File**: [fix_permissions.sql](file:///c:/Users/user/Documents/tech-nest/supabase/migrations/fix_permissions.sql) — Line 17

```sql
(SELECT id FROM auth.users WHERE email = 'gajjaryash19@outlook.com'),
```

This exposes a developer's personal email in the source code and auto-promotes it to `super_admin`. This is a social engineering target and a privilege escalation backdoor.

---

### 🔴 SEC-05: 8+ Unauthenticated API Endpoints Expose Internal Data

The following endpoints require **no authentication** — anyone can call them:

| Endpoint | Router | Data Exposed |
|---|---|---|
| `GET /api/v1/devices` | [devices.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/devices.py) | All published devices + specs |
| `GET /api/v1/devices/{id}` | devices.py | Full device detail + specs |
| `GET /api/v1/devices/{id}/decision` | devices.py | Decision scores |
| `POST /api/v1/intelligence/context` | [intelligence.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/intelligence.py) | Accepts arbitrary session data |
| `GET /api/v1/intelligence/status/{id}` | [generate.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/generate.py) | Internal intelligence pipeline status |
| `POST /api/v1/decision/orchestrate` | [decision.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/decision.py) | Full decision verdicts |
| `POST /api/v1/network/event` | [network.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/network.py) | Accepts unlimited events |
| `POST /api/v1/network/aggregate` | network.py | Triggers DB aggregation |
| `GET /api/v1/network/insights` | network.py | Admin-grade analytics |
| `GET /api/v1/network/rankings` | network.py | Full ranked device list |
| `PUT /api/v1/market-signals/ingest` | [market.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/market.py) | Accepts arbitrary signals |
| `GET /api/v1/knowledge-graph/adjacencies/{id}` | [knowledge_graph.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/knowledge_graph.py) | Knowledge graph data |
| `GET /api/v1/advisor/feed` | [advisor.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/advisor.py) | Advisor feed (hardcoded user) |
| `POST /api/v1/advisor/refresh` | advisor.py | Triggers background processing |

**Impact**:
- **Data scraping**: Any bot can extract the entire device database
- **Event poisoning**: Attackers can flood `POST /network/event` and `PUT /market-signals/ingest` with fake events, corrupting the Intelligence Network's behavioral data
- **Resource abuse**: `POST /network/aggregate` triggers heavy DB computation with no auth
- **Intelligence leakage**: `GET /network/insights` returns admin-grade collective intelligence data publicly

---

### 🔴 SEC-06: Wildcard CORS Origin Negates Credential Protection

**File**: [main.py](file:///c:/Users/user/Documents/tech-nest/backend/app/main.py) — Lines 71–77

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://technest.app", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

The wildcard `"*"` in `allow_origins` alongside `allow_credentials=True` is a contradiction per the CORS spec. While browsers technically reject `Access-Control-Allow-Origin: *` with credentials, many CORS middleware implementations work around this by echoing back the request's `Origin` header — effectively allowing **any website** to make authenticated cross-origin requests.

**Impact**: Cross-Site Request Forgery (CSRF) on all endpoints, cookie/credential theft  
**Remediation**: Remove `"*"` and explicitly list allowed origins.

---

### 🔴 SEC-07: Backend Uses Service Role Key for ALL Database Operations

**File**: [database.py](file:///c:/Users/user/Documents/tech-nest/backend/app/database.py)

```python
supabase: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)
```

A single global Supabase client initialized with the **service role key** is used for every operation — admin endpoints, public endpoints, user-facing queries. This means:
- **RLS is completely bypassed** for every query from the backend
- Any SQL injection or logic error in any endpoint has **full database access**
- No defense-in-depth — a bug in a single route compromises the entire database

**Remediation**:
- Use anon key client for public/user-facing endpoints
- Use per-request Supabase clients with the user's JWT for authenticated operations
- Reserve the service role client exclusively for admin/system operations

---

### 🔴 SEC-08: Overly Permissive Database Grants

**File**: [fix_permissions.sql](file:///c:/Users/user/Documents/tech-nest/supabase/migrations/fix_permissions.sql)

```sql
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
```

This grants the **`anon` role** full CRUD privileges on **every table** — bypassing all RLS policies because `anon` now has direct write access. Anyone with just the anon key can INSERT, UPDATE, DELETE on any table.

**Impact**: Complete database compromise via the publicly-known anon key  
**Remediation**: Grant only `SELECT` and specific permissions per role:
```sql
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT SELECT, INSERT, UPDATE ON ... TO authenticated;
```

---

## 3. API Security Improvements

### 🟠 SEC-09: No Rate Limiting on Internal API Endpoints

**File**: [main.py](file:///c:/Users/user/Documents/tech-nest/backend/app/main.py)

While `fastapi-limiter` is initialized and `RateLimiter` is imported in [devices.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/devices.py), it is **never actually applied** as a dependency on any internal API endpoint. Only platform routes have rate limiting (via middleware).

**Impact**: Denial of Service via flooding any `/api/v1/*` endpoint  
**Remediation**: Apply `dependencies=[Depends(RateLimiter(times=N, seconds=60))]` to all public-facing routers at the router level.

---

### 🟠 SEC-10: Fail-Open Rate Limiting on Platform Routes

**File**: [platform_gateway.py](file:///c:/Users/user/Documents/tech-nest/backend/app/middleware/platform_gateway.py) — Lines 213–227

```python
if not redis:
    return True  # Fail-open: no Redis → no rate limiting
```

If Redis is unavailable (crash, network partition, OOM), rate limiting is **completely disabled** for all platform clients. An attacker can take Redis down and then make unlimited API requests.

**Remediation**: Implement a fallback rate limiter (in-memory sliding window) or fail-closed with a circuit breaker:
```python
if not redis:
    return False  # Fail-closed: deny requests when rate limiter is down
```

---

### 🟠 SEC-11: No UUID Validation on Path Parameters

**Files**: All routers accepting `device_id: str`

None of the endpoints validate that path parameters are valid UUIDs before passing them to database queries:

```python
@router.get("/{device_id}")
def get_device(device_id: str):  # No UUID validation
    resp = supabase.table("devices").select("*").eq("id", device_id)...
```

**Impact**: Potential injection of malformed values, unexpected query behavior  
**Remediation**: Use Pydantic's UUID type or a path validator:
```python
from uuid import UUID
@router.get("/{device_id}")
def get_device(device_id: UUID): ...
```

---

### 🟠 SEC-12: Frontend API Client Uses Fake Auth Header

**File**: [api.ts](file:///c:/Users/user/Documents/tech-nest/src/lib/api.ts) — Lines 74–75, 119–120, 134–135, 149, 163

```typescript
headers: {
    "x-admin-role": "admin" // For simulation; real app would use proper JWT auth
}
```

The frontend sends an `x-admin-role: admin` header for admin endpoints, but the backend **ignores** this header and correctly uses `Depends(require_admin)`. However, this indicates the frontend is **not sending actual JWT tokens** for admin routes, meaning these calls will fail with 401 in production but succeed silently during development (because the routes are unprotected in some code paths).

**Remediation**: Implement proper JWT token passing in the frontend API client using the Supabase session.

---

### 🟡 SEC-13: Missing Request Size Limits

No request body size limits are configured at the FastAPI level. Endpoints accepting JSON payloads (e.g., `POST /decision/orchestrate`, `POST /network/event`) can receive arbitrarily large payloads.

**Remediation**: Configure `max_body_size` or add middleware to reject oversized requests:
```python
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware
# Add request size limiting middleware
```

---

### 🟡 SEC-14: No HTTPS Enforcement

No HTTP-to-HTTPS redirect middleware is configured. In production, all API traffic must be TLS-encrypted.

**Remediation**: Add `HTTPSRedirectMiddleware` for production deployments.

---

### 🔵 SEC-15: Health Endpoint Leaks Version Information

**File**: [main.py](file:///c:/Users/user/Documents/tech-nest/backend/app/main.py) — Lines 100–106

```python
return {
    "status": "ok",
    "system": "Intelligence OS Online",
    "version": "3.0.0 — Intelligence Platform Active",
}
```

The health endpoint reveals the system name, version, and internal branding. This gives attackers reconnaissance data.

**Remediation**: Return only `{"status": "ok"}` on public health checks.

---

## 4. Database Security Improvements

### 🟠 SEC-16: Public SELECT Policies on Sensitive Derived Tables

Multiple RLS policies allow **any unauthenticated user** to read derived intelligence data directly via the Supabase anon key:

| Table | Policy | File |
|---|---|---|
| `device_intelligence` | `USING (true)` | [supabase_schema.sql](file:///c:/Users/user/Documents/tech-nest/supabase/migrations/supabase_schema.sql) |
| `device_network_stats` | `USING (true)` | [network_schema.sql](file:///c:/Users/user/Documents/tech-nest/supabase/migrations/network_schema.sql) |
| `device_trends` | `USING (true)` | network_schema.sql |

This exposes:
- `capability_embedding` (1536-dimensional vector) — proprietary ML model output
- `network_multiplier` — internal scoring weights
- `trend_score` — competitive intelligence data

**Remediation**: Remove public read policies from sensitive derived tables. Serve this data only through the authenticated backend API.

---

### 🟠 SEC-17: Missing RLS Policies for Write Operations on Core Tables

While `devices`, `device_specs`, `device_intelligence`, `device_relationships`, and `market_signals` have RLS enabled, they lack INSERT/UPDATE/DELETE policies. Combined with the overly permissive grants from SEC-08, any role with table access can write freely.

**Remediation**: Add explicit write policies restricting INSERT/UPDATE to `service_role` and `authenticated` users with appropriate checks.

---

### 🟡 SEC-18: No INSERT Policies on `interaction_events`

The `interaction_events` table has RLS enabled but no INSERT policy for the `authenticated` or `anon` role. Writes rely entirely on the service role key (via backend). If the backend service role key is compromised, there's no last line of defense.

---

### 🟡 SEC-19: Storage Policies Allow Any Authenticated User to Upload/Delete

**File**: [storage_policies.sql](file:///c:/Users/user/Documents/tech-nest/supabase/migrations/storage_policies.sql) — Lines 13–24

```sql
CREATE POLICY "Authenticated Users Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'device-images' );

CREATE POLICY "Authenticated Users Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'device-images' );
```

**Any authenticated user** can upload arbitrary files to `device-images` and **delete any file** in the bucket (not just their own).

**Impact**: Malicious file upload, deletion of production images  
**Remediation**:
- Restrict uploads to admin roles: `WITH CHECK (bucket_id = 'device-images' AND public.is_admin(auth.uid()))`
- Restrict deletes to file owner or admin

---

## 5. Authentication Improvements

### 🟠 SEC-20: Hardcoded User ID in Advisor Router

**File**: [advisor.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/advisor.py) — Lines 12–14

```python
def get_current_user_id() -> str:
    # In production, uses auth dependencies to retrieve the token's User UUID.
    return "example-user-uuid"
```

This function returns a hardcoded user ID. Any call to `GET /advisor/feed` or `POST /advisor/refresh` operates on behalf of a fixed "user", meaning:
- All users see the same advisor feed
- Anyone can refresh another user's advisor data
- No actual user identity verification

---

### 🟠 SEC-21: POST /advisor/refresh Allows Arbitrary User Targeting

**File**: [advisor.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/advisor.py) — Lines 31–43

```python
class ForceRefreshRequest(BaseModel):
    user_id: str

@router.post("/refresh")
async def manual_trigger_advisor(payload: ForceRefreshRequest, ...):
    engine = AdvisorEngine()
    background_tasks.add_task(engine.process_user_events, payload.user_id)
```

Any unauthenticated caller can supply **any** `user_id` in the request body and trigger background processing for that user. This is an unauthenticated privilege escalation vector.

---

### 🟡 SEC-22: No Token Refresh Handling in Backend Auth

**File**: [deps.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/deps.py)

The `get_current_user` dependency validates the JWT but does not handle token refresh. If a token is expired, the user receives a 401 with no guidance on how to refresh. The middleware (`middleware.ts`) handles refresh on the Next.js side, but the FastAPI backend does not.

---

### 🟡 SEC-23: Role Check Makes Separate Database Query Per Request

**File**: [deps.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/deps.py) — Lines 30–52

Every admin-protected endpoint makes **two database calls**: one to verify the JWT and one to check the role in `user_roles`. Under load, this becomes a bottleneck and a potential DoS vector.

**Remediation**: Cache role lookups in Redis with a short TTL, or embed the role in the JWT claims and verify against the database only periodically.

---

## 6. Data Exposure & Leakage

### 🔴 SEC-24: Error Messages Leak Internal State

Multiple endpoints return raw exception messages to the client:

```python
# intelligence.py — Line 138
"message": str(e),

# analytics.py — Line 73  
"message": str(e),

# system.py — Line 71
raise HTTPException(status_code=500, detail=str(e))

# deps.py — Line 26
detail=str(e) if "token" in str(e).lower() else "Authentication failed",

# network.py — Line 87
raise HTTPException(status_code=500, detail=str(exc))
```

**Impact**: Stack traces, database connection strings, SQL errors, and internal service names can leak to attackers.

**Remediation**: Return generic error messages to clients; log full details server-side only:
```python
except Exception as e:
    logger.error(f"Internal error: {e}", exc_info=True)
    raise HTTPException(status_code=500, detail="An internal error occurred.")
```

---

### 🟠 SEC-25: Intelligence Status Endpoint Exposes Pipeline Internals

**File**: [generate.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/generate.py) — Line 152

`GET /intelligence/status/{device_id}` is unauthenticated and reveals:
- `intelligence_status` (pending/processing/ready/failed)
- All individual score dimensions
- Whether AI insights have been generated
- Whether search index exists
- Number of linked competitors

This gives competitors visibility into the intelligence pipeline's internal state and coverage.

---

### 🟠 SEC-26: Admin Metrics Return Error Details to Client on Failure

**File**: [intelligence.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/intelligence.py) — Lines 135–146

```python
except Exception as e:
    return {
        "status": "error",
        "message": str(e),  # ← Full exception text
        ...
    }
```

Note this returns a 200 OK with error details embedded — it doesn't even raise an HTTPException. The frontend may not detect the error condition.

---

### 🟡 SEC-27: Agent Response Metadata Leaks Internal Error Details

**File**: [platform_agent.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/platform_agent.py) — Lines 189–196

```python
except Exception as exc:
    return AgentResponse(
        action=payload.action,
        success=False,
        data=None,
        metadata={"error": str(exc)},  # ← Exposes internal errors to external API consumers
    )
```

---

### 🔵 SEC-28: System Logs Router Returns Mock Data on DB Error

**File**: [system.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/system.py) — Lines 34–46

When the `system_logs` table doesn't exist, the endpoint returns fabricated mock data instead of an error. This silently hides system issues from administrators.

---

## 7. Security Hardening Recommendations

### 🟠 SEC-29: Create Log Endpoint Accepts Arbitrary JSON

**File**: [system.py](file:///c:/Users/user/Documents/tech-nest/backend/app/routers/system.py) — Lines 62–71

```python
@router.post("/logs", status_code=201)
async def create_log(log: Dict[str, Any], _: dict = Depends(require_admin)):
    resp = supabase.table("system_logs").insert(log).execute()
```

The log payload is typed as `Dict[str, Any]` — there's no schema validation. An admin (or anyone who compromises admin credentials) can inject arbitrary data into the audit log, including oversized payloads or specially crafted JSON.

**Remediation**: Use the existing `SystemLog` Pydantic model as the input type to enforce structure.

---

### 🟠 SEC-30: No Audit Logging for Security-Critical Operations

Key rotation, key revocation, admin role assignments, and bulk intelligence generation do not write to the `admin_logs` audit trail. The `platform_key_service.py` uses `logger.info()` which goes to stdout, not the database audit table.

**Remediation**: Write audit entries for all security-critical operations to `admin_logs` table.

---

### 🟡 SEC-31: Redis Connection String Hardcoded

**File**: [config.py](file:///c:/Users/user/Documents/tech-nest/backend/app/config.py)

```python
REDIS_URL: str = "redis://localhost:6379"
```

No authentication is configured for Redis. In production, Redis should require a password and use TLS.

---

### 🟡 SEC-32: No API Key Scope/Permission Model

API keys have plan-based rate limits but no **scope** restrictions. A `free` plan key can access the same endpoints as an `enterprise` key (just slower). There's no way to restrict a key to read-only, or to specific resource types.

**Remediation**: Add a `scopes` field to `api_clients` and enforce in the middleware:
```python
scopes: list[str]  # e.g., ["devices:read", "decision:read"]
```

---

### 🔵 SEC-33: Dependency Versions Have Known CVEs

**File**: [requirements.txt](file:///c:/Users/user/Documents/tech-nest/backend/requirements.txt)

Pinned versions may contain known vulnerabilities. Example: `fastapi==0.111.0`, `uvicorn==0.30.1`. These should be audited with `pip audit` or `safety check` regularly.

**Remediation**: Run `pip audit` and update dependencies. Set up automated dependency scanning (Dependabot, Snyk).

---

## 8. Prioritized Remediation Roadmap

### 🔴 Immediate (Before Any Production Deployment)

| # | Action | Effort |
|---|---|---|
| 1 | **Rotate all compromised keys** (Supabase service role, anon key, OpenAI key) | 30 min |
| 2 | Remove `.env.local` and `backend/.env` from git, scrub from history | 1 hr |
| 3 | Fix `fix_permissions.sql` — remove `ALL PRIVILEGES` grants to `anon` | 30 min |
| 4 | Remove wildcard `"*"` from CORS origins | 5 min |
| 5 | Add authentication to all `/api/v1/*` endpoints (SEC-05) | 3 hrs |
| 6 | Replace `str(e)` error leaks with generic messages (SEC-24) | 1 hr |
| 7 | Remove developer email from migration scripts | 5 min |

### 🟠 Short-Term (Before Public Beta)

| # | Action | Effort |
|---|---|---|
| 8 | Implement per-request Supabase client with user JWT (SEC-07) | 4 hrs |
| 9 | Apply rate limiting to internal API routes (SEC-09) | 2 hrs |
| 10 | Add UUID validation to all path parameters (SEC-11) | 1 hr |
| 11 | Fix advisor router auth (SEC-20, SEC-21) | 1 hr |
| 12 | Remove public RLS policies from sensitive tables (SEC-16) | 1 hr |
| 13 | Restrict storage upload/delete to admin (SEC-19) | 30 min |
| 14 | Change rate limiting to fail-closed (SEC-10) | 30 min |
| 15 | Add audit logging for security operations (SEC-30) | 2 hrs |

### 🟡 Medium-Term (Production Hardening)

| # | Action | Effort |
|---|---|---|
| 16 | Implement API key scopes (SEC-32) | 4 hrs |
| 17 | Add Redis authentication and TLS (SEC-31) | 1 hr |
| 18 | Cache role lookups to reduce DB queries (SEC-23) | 2 hrs |
| 19 | Enforce HTTPS with redirect middleware (SEC-14) | 30 min |
| 20 | Set up automated dependency scanning (SEC-33) | 1 hr |
| 21 | Implement request size limits (SEC-13) | 30 min |
| 22 | Validate system log input schema (SEC-29) | 30 min |

---

## 9. Architecture-Level Security Recommendations

### Use Separate Supabase Clients by Trust Level

```
┌────────────┐     ┌────────────────────┐     ┌──────────────────┐
│  Frontend   │────▶│  anon key client   │────▶│   RLS-enforced   │
│  (public)   │     │  (user JWT scope)  │     │   queries only   │
└────────────┘     └────────────────────┘     └──────────────────┘

┌────────────┐     ┌────────────────────┐     ┌──────────────────┐
│  Backend    │────▶│  user JWT client   │────▶│   RLS-enforced   │
│  (authed)   │     │  (per-request)     │     │   user-scoped    │
└────────────┘     └────────────────────┘     └──────────────────┘

┌────────────┐     ┌────────────────────┐     ┌──────────────────┐
│  Backend    │────▶│  service role      │────▶│   RLS bypassed   │
│  (admin)    │     │  (admin ops only)  │     │   system tasks   │
└────────────┘     └────────────────────┘     └──────────────────┘
```

### Implement Defense-in-Depth Layers

```
Request → HTTPS → CORS → Auth Middleware → Rate Limiter → Input Validation → RLS → Response Sanitization
```

Currently missing layers: **HTTPS enforcement**, **input validation**, and **response sanitization**.

### Security Headers

Add these response headers via middleware:
```python
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains
Content-Security-Policy: default-src 'self'
X-XSS-Protection: 1; mode=block
```

---

> *This audit identified **33 security issues** across 6 categories. The 8 critical issues represent immediate risks that must be resolved before production deployment. The backend architecture has solid foundations (bcrypt key hashing, plan-based rate limiting, RLS schemas) but needs systematic hardening in authentication enforcement, credential management, and input/output security.*
