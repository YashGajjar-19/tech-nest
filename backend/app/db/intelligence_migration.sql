    -- ============================================================
    -- Tech Nest: Intelligence Engine Schema Migration
    -- IDEMPOTENT — Safe to run multiple times
    -- Run this in Supabase SQL Editor after deploying the backend
    -- ============================================================

    --------------------------------------------------------------------------------
    -- 1. Add intelligence_status enum to devices table
    --------------------------------------------------------------------------------

    DO $$ BEGIN
        CREATE TYPE public.intelligence_status AS ENUM (
            'pending', 'processing', 'ready', 'failed'
        );
    EXCEPTION
        WHEN duplicate_object THEN
            RAISE NOTICE 'Type intelligence_status already exists, skipping.';
    END $$;

    ALTER TABLE public.devices
        ADD COLUMN IF NOT EXISTS intelligence_status public.intelligence_status
        DEFAULT 'pending'::public.intelligence_status;

    --------------------------------------------------------------------------------
    -- 2. device_scores — Deterministic category scores (0.0–10.0)
    --------------------------------------------------------------------------------

    CREATE TABLE IF NOT EXISTS public.device_scores (
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

    -- Trigger: auto-update updated_at on device_scores
    DROP TRIGGER IF EXISTS on_device_scores_updated ON public.device_scores;
    CREATE TRIGGER on_device_scores_updated
        BEFORE UPDATE ON public.device_scores
        FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

    --------------------------------------------------------------------------------
    -- 3. device_ai_insights — LLM-generated device intelligence
    --------------------------------------------------------------------------------

    CREATE TABLE IF NOT EXISTS public.device_ai_insights (
        device_id    UUID PRIMARY KEY REFERENCES public.devices(id) ON DELETE CASCADE,
        summary      TEXT NOT NULL,
        pros         TEXT[] NOT NULL DEFAULT '{}',
        cons         TEXT[] NOT NULL DEFAULT '{}',
        best_for     TEXT[] NOT NULL DEFAULT '{}',
        avoid_if     TEXT[] NOT NULL DEFAULT '{}',
        generated_at TIMESTAMPTZ DEFAULT NOW()
    );

    --------------------------------------------------------------------------------
    -- 4. device_search_index — Flat search + tier metadata
    --------------------------------------------------------------------------------

    DO $$ BEGIN
        CREATE TYPE public.price_segment AS ENUM ('budget', 'mid', 'premium', 'ultra');
    EXCEPTION
        WHEN duplicate_object THEN
            RAISE NOTICE 'Type price_segment already exists, skipping.';
    END $$;

    DO $$ BEGIN
        CREATE TYPE public.performance_tier AS ENUM ('entry', 'mid', 'high', 'flagship');
    EXCEPTION
        WHEN duplicate_object THEN
            RAISE NOTICE 'Type performance_tier already exists, skipping.';
    END $$;

    DO $$ BEGIN
        CREATE TYPE public.camera_tier AS ENUM ('basic', 'good', 'great', 'exceptional');
    EXCEPTION
        WHEN duplicate_object THEN
            RAISE NOTICE 'Type camera_tier already exists, skipping.';
    END $$;

    CREATE TABLE IF NOT EXISTS public.device_search_index (
        device_id        UUID PRIMARY KEY REFERENCES public.devices(id) ON DELETE CASCADE,
        search_text      TEXT NOT NULL,
        keywords         TEXT[] NOT NULL DEFAULT '{}',
        price_segment    public.price_segment NOT NULL DEFAULT 'mid',
        performance_tier public.performance_tier NOT NULL DEFAULT 'mid',
        camera_tier      public.camera_tier NOT NULL DEFAULT 'good',
        -- Full-text search vector (auto-generated from search_text)
        search_vector    TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', search_text)) STORED
    );

    -- Full-text search index on search_vector
    CREATE INDEX IF NOT EXISTS idx_device_search_vector
        ON public.device_search_index USING GIN (search_vector);

    -- GIN index on keywords array for fast contains-any queries
    CREATE INDEX IF NOT EXISTS idx_device_search_keywords
        ON public.device_search_index USING GIN (keywords);

    -- Index on tier columns for faceted filtering
    CREATE INDEX IF NOT EXISTS idx_device_search_price_segment
        ON public.device_search_index (price_segment);

    CREATE INDEX IF NOT EXISTS idx_device_search_perf_tier
        ON public.device_search_index (performance_tier);

    --------------------------------------------------------------------------------
    -- 5. device_relationships — ensure COMPETITOR upsert constraint exists
    --    (table likely already exists; just add the unique constraint if missing)
    --------------------------------------------------------------------------------

    CREATE TABLE IF NOT EXISTS public.device_relationships (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        source_device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
        target_device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
        relationship_type VARCHAR(50) NOT NULL,
        weight DECIMAL(3, 2) DEFAULT 1.0,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );

    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT 1 FROM pg_constraint
            WHERE conname = 'uq_device_relationships'
        ) THEN
            ALTER TABLE public.device_relationships
                ADD CONSTRAINT uq_device_relationships
                UNIQUE (source_device_id, target_device_id, relationship_type);
        END IF;
    END $$;

    --------------------------------------------------------------------------------
    -- 6. RLS Policies for new tables
    --------------------------------------------------------------------------------

    ALTER TABLE public.device_scores ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.device_ai_insights ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.device_search_index ENABLE ROW LEVEL SECURITY;
    ALTER TABLE public.device_relationships ENABLE ROW LEVEL SECURITY;

    -- Public read: relationships are public knowledge
    DROP POLICY IF EXISTS "Public read device_relationships" ON public.device_relationships;
    CREATE POLICY "Public read device_relationships"
        ON public.device_relationships FOR SELECT USING (true);

    -- Public read: scores are public knowledge
    DROP POLICY IF EXISTS "Public read device_scores" ON public.device_scores;
    CREATE POLICY "Public read device_scores"
        ON public.device_scores FOR SELECT USING (true);

    -- Public read: insights are public knowledge
    DROP POLICY IF EXISTS "Public read device_ai_insights" ON public.device_ai_insights;
    CREATE POLICY "Public read device_ai_insights"
        ON public.device_ai_insights FOR SELECT USING (true);

    -- Public read: search index is public knowledge
    DROP POLICY IF EXISTS "Public read device_search_index" ON public.device_search_index;
    CREATE POLICY "Public read device_search_index"
        ON public.device_search_index FOR SELECT USING (true);

    -- Backend service role has full access via service_role key (bypasses RLS by default)
    -- No additional policies needed for writes — the FastAPI backend uses service_role.

    --------------------------------------------------------------------------------
    -- 7. Indexes on device_scores for leaderboard / ranking queries
    --------------------------------------------------------------------------------

    CREATE INDEX IF NOT EXISTS idx_device_scores_overall
        ON public.device_scores (overall_score DESC);

    CREATE INDEX IF NOT EXISTS idx_device_scores_performance
        ON public.device_scores (performance_score DESC);

    CREATE INDEX IF NOT EXISTS idx_device_scores_camera
        ON public.device_scores (camera_score DESC);

    -- ============================================================
    -- Migration complete.
    -- Next steps:
    --   1. Deploy FastAPI backend with the new intelligence/ package
    --   2. Set OPENAI_API_KEY in backend environment
    --   3. Trigger: POST /api/v1/intelligence/generate/{device_id}
    --      (called automatically from publishDeviceAction)
    -- ============================================================
