-- ============================================================
-- Tech Nest: Canonical Database Schema
-- Provides a single source of truth for the core product.
-- Eliminates previously conflicting schema definitions.
-- ============================================================

-- Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- Clean Slate (DROP statements)
DROP TABLE IF EXISTS public.decision_sessions CASCADE;
DROP TABLE IF EXISTS public.device_network_stats CASCADE;
DROP TABLE IF EXISTS public.device_relationships CASCADE;
DROP TABLE IF EXISTS public.device_images CASCADE;
DROP TABLE IF EXISTS public.device_ai_insights CASCADE;
DROP TABLE IF EXISTS public.device_search_index CASCADE;
DROP TABLE IF EXISTS public.device_scores CASCADE;
DROP TABLE IF EXISTS public.device_spec_values CASCADE;
DROP TABLE IF EXISTS public.spec_definitions CASCADE;
DROP TABLE IF EXISTS public.spec_categories CASCADE;
DROP TABLE IF EXISTS public.device_variants CASCADE;
DROP TABLE IF EXISTS public.device_specs CASCADE;
DROP TABLE IF EXISTS public.market_signals CASCADE;
DROP TABLE IF EXISTS public.devices CASCADE;
DROP TABLE IF EXISTS public.brands CASCADE;

-- ENUMs
DO $$ BEGIN CREATE TYPE public.intelligence_status AS ENUM ('pending', 'processing', 'ready', 'failed'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.price_segment AS ENUM ('budget', 'mid', 'premium', 'ultra'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.performance_tier AS ENUM ('entry', 'mid', 'high', 'flagship'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE public.camera_tier AS ENUM ('basic', 'good', 'great', 'exceptional'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 1. Brands
CREATE TABLE public.brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    country TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Devices
CREATE TABLE public.devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    device_type TEXT DEFAULT 'smartphone',
    category_id TEXT,
    release_date DATE,
    price NUMERIC,
    status TEXT,
    image_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    intelligence_status public.intelligence_status DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Device Specs (EAV for backend/scraper compatibility)
CREATE TABLE public.device_specs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
    spec_key TEXT NOT NULL,
    spec_value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(device_id, spec_key)
);

-- 4. Device Scores (Deterministic category scores)
CREATE TABLE public.device_scores (
    device_id       UUID PRIMARY KEY REFERENCES public.devices(id) ON DELETE CASCADE,
    display_score   DECIMAL(3,1) NOT NULL DEFAULT 0.0,
    performance_score DECIMAL(3,1) NOT NULL DEFAULT 0.0,
    camera_score    DECIMAL(3,1) NOT NULL DEFAULT 0.0,
    battery_score   DECIMAL(3,1) NOT NULL DEFAULT 0.0,
    design_score    DECIMAL(3,1) NOT NULL DEFAULT 0.0,
    software_score  DECIMAL(3,1) NOT NULL DEFAULT 0.0,
    overall_score   DECIMAL(3,1) NOT NULL DEFAULT 0.0,
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Device AI Insights (LLM-generated prose)
CREATE TABLE public.device_ai_insights (
    device_id    UUID PRIMARY KEY REFERENCES public.devices(id) ON DELETE CASCADE,
    summary      TEXT NOT NULL,
    pros         TEXT[] NOT NULL DEFAULT '{}',
    cons         TEXT[] NOT NULL DEFAULT '{}',
    best_for     TEXT[] NOT NULL DEFAULT '{}',
    avoid_if     TEXT[] NOT NULL DEFAULT '{}',
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Device Search Index (Flat search metadata)
CREATE TABLE public.device_search_index (
    device_id        UUID PRIMARY KEY REFERENCES public.devices(id) ON DELETE CASCADE,
    search_text      TEXT NOT NULL,
    keywords         TEXT[] NOT NULL DEFAULT '{}',
    price_segment    public.price_segment NOT NULL DEFAULT 'mid',
    performance_tier public.performance_tier NOT NULL DEFAULT 'mid',
    camera_tier      public.camera_tier NOT NULL DEFAULT 'good',
    search_vector    TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', search_text)) STORED
);

-- Indexes
CREATE INDEX idx_device_search_vector ON public.device_search_index USING GIN (search_vector);
CREATE INDEX idx_device_search_keywords ON public.device_search_index USING GIN (keywords);
CREATE INDEX idx_device_search_price_segment ON public.device_search_index (price_segment);
CREATE INDEX idx_device_search_perf_tier ON public.device_search_index (performance_tier);
CREATE INDEX idx_device_scores_overall ON public.device_scores (overall_score DESC);
CREATE INDEX idx_device_scores_performance ON public.device_scores (performance_score DESC);
CREATE INDEX idx_device_scores_camera ON public.device_scores (camera_score DESC);

-- Trigger Function for updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER on_devices_updated
    BEFORE UPDATE ON public.devices
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER on_device_specs_updated
    BEFORE UPDATE ON public.device_specs
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER on_device_scores_updated
    BEFORE UPDATE ON public.device_scores
    FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- RLS
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_specs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_search_index ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Public read devices" ON public.devices FOR SELECT USING (true);
CREATE POLICY "Public read specs" ON public.device_specs FOR SELECT USING (true);
CREATE POLICY "Public read scores" ON public.device_scores FOR SELECT USING (true);
CREATE POLICY "Public read insights" ON public.device_ai_insights FOR SELECT USING (true);
CREATE POLICY "Public read search" ON public.device_search_index FOR SELECT USING (true);
