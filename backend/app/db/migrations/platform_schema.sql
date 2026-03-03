-- ============================================================
-- Tech Nest Platform: API Client & Usage Schema
-- ============================================================
-- Design:
--   api_clients  — registered developer accounts + plan metadata
--   api_usage_logs — append-only usage audit log (no updates ever)
--
-- The api_key column stores only a bcrypt-hashed key.
-- The raw key is shown ONCE to the developer at creation time.
-- This mirrors how Stripe, GitHub, and OpenAI handle API keys.
-- ============================================================

-- 1. Developer Client Registry
CREATE TABLE IF NOT EXISTS api_clients (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name         VARCHAR(255) NOT NULL,           -- Business / app name
    email        VARCHAR(255) NOT NULL UNIQUE,    -- Developer contact
    api_key_hash TEXT    NOT NULL UNIQUE,         -- bcrypt-hashed key (prefix: tn_live_ or tn_test_)
    api_key_prefix VARCHAR(16) NOT NULL,          -- First 12 chars of raw key for identification (e.g., "tn_live_ab12")
    plan         VARCHAR(50)  NOT NULL DEFAULT 'free',   -- 'free' | 'starter' | 'growth' | 'enterprise'
    rate_limit   INTEGER NOT NULL DEFAULT 100,    -- requests per minute
    is_active    BOOLEAN NOT NULL DEFAULT TRUE,
    metadata     JSONB DEFAULT '{}',              -- e.g., {"use_case": "comparison widget", "website": "..."}
    created_at   TIMESTAMPTZ DEFAULT NOW(),
    updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- Plan tiers and their rate limits:
--   free:       100 req/min,   1,000   req/day
--   starter:    500 req/min,   50,000  req/day
--   growth:   2,000 req/min,  500,000 req/day
--   enterprise: custom

-- 2. Usage Audit Log (append-only — NEVER update rows)
CREATE TABLE IF NOT EXISTS api_usage_logs (
    id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id     UUID REFERENCES api_clients(id) ON DELETE SET NULL,
    endpoint      VARCHAR(255) NOT NULL,  -- e.g., "/platform/v1/devices/score"
    method        VARCHAR(10)  NOT NULL DEFAULT 'GET',
    request_count INTEGER NOT NULL DEFAULT 1,
    status_code   INTEGER NOT NULL,
    latency_ms    INTEGER,                -- response time in milliseconds
    request_meta  JSONB DEFAULT '{}',    -- e.g., {"device_id": "uuid", "ip": "..."}
    timestamp     TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for billing aggregation queries (per client per day)
CREATE INDEX IF NOT EXISTS idx_usage_client_time
    ON api_usage_logs (client_id, timestamp DESC);

CREATE INDEX IF NOT EXISTS idx_usage_endpoint
    ON api_usage_logs (endpoint, timestamp DESC);

-- RLS: api_clients and usage logs are backend-only
ALTER TABLE api_clients     ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_usage_logs  ENABLE ROW LEVEL SECURITY;
-- No public read policies — service role only.
