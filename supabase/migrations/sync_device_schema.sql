    -- Synced Schema for devices
    -- This migration ensures the 'devices' table has all the columns expected 
    -- by both the Intelligence Engine (Backend) and the Admin OS (Frontend).

    -- Enable uuid-ossp if not already enabled
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

    -- 1. Ensure the devices table exists (it should, based on knowledge_graph_schema.sql)
    -- But we add any missing columns.

    -- Basic identity
    ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE;
    ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE;

    -- Categories (Admin UI expects it)
    -- First check if the column exists under a different name or if we need to create it.
    -- Let's create it if missing.
    ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS category_id TEXT; 

    -- Pricing & Status (The source of the current error)
    ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS price NUMERIC;
    ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT FALSE;

    -- Media & Summaries
    ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS image_url TEXT;
    ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS short_summary TEXT;

    -- Scores & Metrics (Admin OS expects these on the device level)
    ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS reality_score DECIMAL(3, 1) DEFAULT 0.0;
    ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS popularity_score DECIMAL(3, 1) DEFAULT 0.0;

    -- Timestamps
    ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

    -- NOT NULL constraint fixes for Wizard compatibility
    ALTER TABLE public.devices ALTER COLUMN device_type DROP NOT NULL;
    ALTER TABLE public.devices ALTER COLUMN device_type SET DEFAULT 'smartphone';

    -- 2. Clean up: hero_image -> image_url if hero_image exists but image_url is empty
    DO $$
    BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='devices' AND column_name='hero_image') THEN
            UPDATE public.devices SET image_url = hero_image WHERE image_url IS NULL;
        END IF;
    END $$;

    -- 3. Intelligence Status (needed by the backend pipeline)
    DO $$ BEGIN
        CREATE TYPE public.intelligence_status AS ENUM ('pending', 'processing', 'ready', 'failed');
    EXCEPTION
        WHEN duplicate_object THEN NULL;
    END $$;

    ALTER TABLE public.devices ADD COLUMN IF NOT EXISTS intelligence_status public.intelligence_status DEFAULT 'pending';

    -- 4. Set search path (best practice)
    ALTER DATABASE postgres SET search_path TO "$user", public, auth, vector;
