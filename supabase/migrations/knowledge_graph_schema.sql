-- ============================================================
-- Tech Nest: Core Knowledge Graph Schema
-- Defines the foundational structure for devices, specs, and intelligence.
-- ============================================================

-- Enable uuid-ossp for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if re-running (WARNING: Deletes data)
DROP TABLE IF EXISTS public.decision_sessions CASCADE;
DROP TABLE IF EXISTS public.device_network_stats CASCADE;
DROP TABLE IF EXISTS public.device_relationships CASCADE;
DROP TABLE IF EXISTS public.device_images CASCADE;
DROP TABLE IF EXISTS public.device_ai_insights CASCADE;
DROP TABLE IF EXISTS public.device_scores CASCADE;
DROP TABLE IF EXISTS public.device_spec_values CASCADE;
DROP TABLE IF EXISTS public.spec_definitions CASCADE;
DROP TABLE IF EXISTS public.spec_categories CASCADE;
DROP TABLE IF EXISTS public.device_variants CASCADE;
DROP TABLE IF EXISTS public.device_specs CASCADE;
DROP TABLE IF EXISTS public.devices CASCADE;
DROP TABLE IF EXISTS public.brands CASCADE;

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
    device_type TEXT NOT NULL, -- e.g., 'smartphone', 'laptop', 'tablet'
    release_date DATE,
    status TEXT, -- e.g., 'released', 'upcoming', 'rumored'
    hero_image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Device Variants
CREATE TABLE public.device_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
    ram_gb INTEGER,
    storage_gb INTEGER,
    price NUMERIC,
    currency TEXT DEFAULT 'USD',
    sku_name TEXT
);

-- 4. Specification Categories
CREATE TABLE public.spec_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    display_order INTEGER DEFAULT 0
);

-- 5. Specification Definitions
CREATE TABLE public.spec_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT UNIQUE NOT NULL,
    label TEXT NOT NULL,
    category_id UUID REFERENCES public.spec_categories(id) ON DELETE CASCADE,
    unit TEXT,
    value_type TEXT -- e.g., 'number', 'string', 'boolean'
);

-- 6. Device Specification Values
CREATE TABLE public.device_spec_values (
    device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
    spec_id UUID REFERENCES public.spec_definitions(id) ON DELETE CASCADE,
    value_number NUMERIC,
    value_text TEXT,
    PRIMARY KEY (device_id, spec_id)
);

-- 7. Device Intelligence Scores
CREATE TABLE public.device_scores (
    device_id UUID PRIMARY KEY REFERENCES public.devices(id) ON DELETE CASCADE,
    display_score INTEGER DEFAULT 0,
    performance_score INTEGER DEFAULT 0,
    camera_score INTEGER DEFAULT 0,
    battery_score INTEGER DEFAULT 0,
    design_score INTEGER DEFAULT 0,
    software_score INTEGER DEFAULT 0,
    overall_score INTEGER DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. AI Insights
CREATE TABLE public.device_ai_insights (
    device_id UUID PRIMARY KEY REFERENCES public.devices(id) ON DELETE CASCADE,
    summary TEXT,
    pros JSONB DEFAULT '[]'::jsonb,
    cons JSONB DEFAULT '[]'::jsonb,
    best_for TEXT,
    avoid_if TEXT,
    generated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Device Images
CREATE TABLE public.device_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    image_type TEXT, -- e.g., 'hero', 'gallery', 'color_variant'
    display_order INTEGER DEFAULT 0
);

-- 10. Device Relationships
CREATE TABLE public.device_relationships (
    device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
    related_device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
    relation_type TEXT NOT NULL, -- e.g., 'competitor', 'previous_generation', 'upgrade_to', 'alternative'
    PRIMARY KEY (device_id, related_device_id, relation_type)
);

-- 11. Network Intelligence
CREATE TABLE public.device_network_stats (
    device_id UUID PRIMARY KEY REFERENCES public.devices(id) ON DELETE CASCADE,
    views INTEGER DEFAULT 0,
    comparisons INTEGER DEFAULT 0,
    recommendations INTEGER DEFAULT 0,
    selections INTEGER DEFAULT 0,
    trend_score NUMERIC DEFAULT 0.0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Decision Sessions
CREATE TABLE public.decision_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query TEXT,
    parsed_intent JSONB,
    filters JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_device_scores_modtime
    BEFORE UPDATE ON public.device_scores
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

CREATE TRIGGER update_device_network_stats_modtime
    BEFORE UPDATE ON public.device_network_stats
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Enable RLS
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spec_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spec_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_spec_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_network_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.decision_sessions ENABLE ROW LEVEL SECURITY;

-- Standard public read policies
CREATE POLICY "Public read brands" ON public.brands FOR SELECT USING (true);
CREATE POLICY "Public read devices" ON public.devices FOR SELECT USING (true);
CREATE POLICY "Public read variants" ON public.device_variants FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON public.spec_categories FOR SELECT USING (true);
CREATE POLICY "Public read spec_defs" ON public.spec_definitions FOR SELECT USING (true);
CREATE POLICY "Public read spec_vals" ON public.device_spec_values FOR SELECT USING (true);
CREATE POLICY "Public read scores" ON public.device_scores FOR SELECT USING (true);
CREATE POLICY "Public read insights" ON public.device_ai_insights FOR SELECT USING (true);
CREATE POLICY "Public read images" ON public.device_images FOR SELECT USING (true);
CREATE POLICY "Public read relationships" ON public.device_relationships FOR SELECT USING (true);
CREATE POLICY "Public read network stats" ON public.device_network_stats FOR SELECT USING (true);
