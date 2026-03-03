-- Tech Nest: Supabase PostgreSQL Schema with pgvector
-- This schema powers the Intelligence & Data Operating System

-- Enable the pgvector extension to work with embeddings
CREATE EXTENSION IF NOT EXISTS vector;

-- 1. RAW DEVICE DATA LAYER
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    release_date DATE,
    base_price DECIMAL(10, 2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. NORMALIZED SPECIFICATION LAYER (Structured Data)
CREATE TABLE device_specs (
    device_id UUID PRIMARY KEY REFERENCES devices(id) ON DELETE CASCADE,
    -- Normalized constraints (e.g., benchmark numbers, battery sizes)
    nits_peak INTEGER,
    battery_mah INTEGER,
    ram_gb INTEGER,
    storage_base_gb INTEGER,
    -- Complex JSON for flexible spec storage without strict columns
    raw_specs JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. DERIVED INSIGHT LAYER (Score Cache & Vector Location)
CREATE TABLE device_intelligence (
    device_id UUID PRIMARY KEY REFERENCES devices(id) ON DELETE CASCADE,
    
    -- Algorithmic Base Scores (Out of 10)
    score_hardware DECIMAL(3, 1),
    score_experience DECIMAL(3, 1),
    score_longevity DECIMAL(3, 1),
    score_value DECIMAL(3, 1),
    score_community DECIMAL(3, 1),
    score_ai_confidence DECIMAL(3, 1),
    
    -- Overall base score (Can be dynamically adjusted by context)
    tech_nest_score DECIMAL(3, 1),
    
    -- Semantic Vector: captures the "capability fingerprint" of the device.
    -- E.g., a massive vector holding the embedded representation of all specs + positioning.
    capability_embedding VECTOR(1536), 
    
    last_computed TIMESTAMPTZ DEFAULT NOW()
);

-- 4. KNOWLEDGE GRAPH RELATIONSHIPS
CREATE TABLE device_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    target_device_id UUID REFERENCES devices(id) ON DELETE CASCADE,
    relationship_type VARCHAR(50) NOT NULL, -- 'UPGRADE_FROM', 'COMPETITOR', 'BUDGET_ALTERNATIVE'
    weight DECIMAL(3, 2) DEFAULT 1.0, -- Confidence or strength of relationship
    UNIQUE(source_device_id, target_device_id, relationship_type)
);

-- 5. BEHAVIORAL LEARNING LAYER (Anonymized Market Signals)
CREATE TABLE market_signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_uuid UUID NOT NULL, -- Anonymized tracking
    intent_vector VECTOR(1536), -- The embedded intent of the user's search trajectory
    considered_devices UUID[], -- Array of devices compared in the session
    outcome_device_id UUID REFERENCES devices(id), -- The device they clicked 'Buy' or 'External Link' for
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- CREATE INDEXES FOR VECTOR SIMILARITY SEARCH
-- Improves speed of similarity queries (cosine distance)
CREATE INDEX ON device_intelligence USING hnsw (capability_embedding vector_cosine_ops);
CREATE INDEX ON market_signals USING hnsw (intent_vector vector_cosine_ops);

-- RLS (Row Level Security) Configuration
-- Assuming frontend accesses derived data through our FastAPI backend, 
-- but if using Supabase client, we lock down raw data:
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_intelligence ENABLE ROW LEVEL SECURITY;
ALTER TABLE device_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_signals ENABLE ROW LEVEL SECURITY;

-- Backend Service Role has full access. Public reads only on certain views if necessary.
CREATE POLICY "Allow public read on devices" ON devices FOR SELECT USING (true);
CREATE POLICY "Allow public read on intelligence" ON device_intelligence FOR SELECT USING (true);
