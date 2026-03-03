-- Tech Nest: Personal Tech Advisor Layer Schema

-- Users Profile (Preferences tracked by learning engine)
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    primary_device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
    budget_range VARCHAR(50), -- e.g., 'budget', 'mid-range', 'flagship'
    priority_camera DECIMAL(3, 2) DEFAULT 0.5,
    priority_battery DECIMAL(3, 2) DEFAULT 0.5,
    priority_performance DECIMAL(3, 2) DEFAULT 0.5,
    preferred_brands VARCHAR(255)[],
    last_updated TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Device Ownership Graph
CREATE TYPE ownership_status_enum AS ENUM ('current', 'previous', 'wishlist', 'considering');

CREATE TABLE IF NOT EXISTS user_devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    purchase_date DATE,
    ownership_status ownership_status_enum NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, device_id, ownership_status)
);

-- Decision Memory (Tracking outcomes of AI Decision APIs)
CREATE TABLE IF NOT EXISTS user_decisions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    decision_session_id VARCHAR(255) NOT NULL,
    chosen_device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    decision_type VARCHAR(50) NOT NULL, -- e.g., 'upgrade_phone', 'gift', 'switch_brand'
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Pre-computed Advisor Events Feed
CREATE TABLE IF NOT EXISTS advisor_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES user_profiles(user_id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'UPGRADE_ALERT', 'PRICE_DROP', 'BETTER_ALTERNATIVE', 'NEW_RELEASE'
    device_id UUID REFERENCES devices(id) ON DELETE SET NULL,
    message TEXT NOT NULL,
    priority INTEGER DEFAULT 1, -- Higher is more important
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW( ),
    expires_at TIMESTAMPTZ, -- For temporal events like price drops
    UNIQUE(user_id, event_type, device_id) -- Ensures idempotency (no duplicate alerts for same device + event)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_devices_status ON user_devices(user_id, ownership_status);
CREATE INDEX IF NOT EXISTS idx_advisor_events_user ON advisor_events(user_id, is_read, priority DESC);
CREATE INDEX IF NOT EXISTS idx_user_decisions_user ON user_decisions(user_id);
