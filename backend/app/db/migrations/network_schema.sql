-- ============================================================
-- Tech Nest: Intelligence Network Schema
-- ============================================================
-- Design principles:
--   1. interaction_events is append-only — never update, only insert.
--   2. device_network_stats is derived — never manually edited.
--   3. device_trends are time-windowed snapshots — idempotently recomputed.
--   4. Indexes are designed for high-volume writes + fast reads.
-- ============================================================

-- 1. Universal Event Log (Write-Heavy — append only)
CREATE TABLE IF NOT EXISTS interaction_events (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id        UUID,           -- nullable: anonymous sessions allowed
    device_id      UUID REFERENCES devices(id) ON DELETE SET NULL,
    event_type     VARCHAR(50) NOT NULL,  -- view_device | compare_devices | start_decision |
                                          -- select_recommendation | save_device | dismiss_recommendation
    metadata       JSONB DEFAULT '{}',   -- e.g., {"compared_with": ["uuid1","uuid2"], "source": "feed"}
    created_at     TIMESTAMPTZ DEFAULT NOW()
);

-- Partial index: most queries filter by device_id + created_at (aggregation window)
CREATE INDEX IF NOT EXISTS idx_ie_device_time
    ON interaction_events (device_id, created_at DESC)
    WHERE device_id IS NOT NULL;

-- Partial index: user session reconstruction
CREATE INDEX IF NOT EXISTS idx_ie_user_time
    ON interaction_events (user_id, created_at DESC)
    WHERE user_id IS NOT NULL;

-- Index on event_type for batch aggregation filters
CREATE INDEX IF NOT EXISTS idx_ie_event_type ON interaction_events (event_type);

-- 2. Aggregated Device Network Stats (Derived — never manually edited)
CREATE TABLE IF NOT EXISTS device_network_stats (
    device_id           UUID PRIMARY KEY REFERENCES devices(id) ON DELETE CASCADE,
    views               BIGINT DEFAULT 0,
    comparisons         BIGINT DEFAULT 0,
    recommendations     BIGINT DEFAULT 0,
    selections          BIGINT DEFAULT 0,
    saves               BIGINT DEFAULT 0,
    dismissals          BIGINT DEFAULT 0,
    trend_score         DECIMAL(5, 3) DEFAULT 0.0,   -- bayesian dampened, 0.0–1.0
    network_multiplier  DECIMAL(4, 3) DEFAULT 1.0,   -- final modifier for scoring engine (0.5–1.5)
    last_aggregated_at  TIMESTAMPTZ DEFAULT NOW(),
    updated_at          TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Time-Windowed Trend Detection (Idempotent snapshots)
-- Unique constraint ensures one row per (device, type, window) — safe to upsert
CREATE TABLE IF NOT EXISTS device_trends (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id      UUID REFERENCES devices(id) ON DELETE CASCADE,
    trend_type     VARCHAR(50) NOT NULL,   -- rising_interest | declining_interest | upgrade_wave | market_shift
    trend_score    DECIMAL(5, 3) NOT NULL, -- magnitude 0.0–1.0
    time_window    VARCHAR(10) NOT NULL,   -- '24h' | '7d' | '30d'
    calculated_at  TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (device_id, trend_type, time_window)     -- idempotent upsert key
);

CREATE INDEX IF NOT EXISTS idx_dt_device ON device_trends (device_id);
CREATE INDEX IF NOT EXISTS idx_dt_type   ON device_trends (trend_type, trend_score DESC);

-- RLS: interaction_events are sensitive — backend only
ALTER TABLE interaction_events   ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_network_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_trends        ENABLE ROW LEVEL SECURITY;

-- Public reads on derived stats (used by frontend rankings)
CREATE POLICY "Allow public read on network stats"
    ON device_network_stats FOR SELECT USING (true);

CREATE POLICY "Allow public read on trends"
    ON device_trends FOR SELECT USING (true);
