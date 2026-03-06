-- Create search index table
CREATE TABLE IF NOT EXISTS public.device_search_index (
    device_id UUID PRIMARY KEY REFERENCES public.devices(id) ON DELETE CASCADE,
    search_text TEXT NOT NULL,
    keywords TEXT[] DEFAULT '{}',
    price_segment TEXT,
    performance_tier TEXT,
    camera_tier TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.device_search_index ENABLE ROW LEVEL SECURITY;

-- Public read access
DROP POLICY IF EXISTS "Public read search_index" ON public.device_search_index;
CREATE POLICY "Public read search_index" ON public.device_search_index FOR SELECT USING (true);

-- Authenticated (Admin) manage access
DROP POLICY IF EXISTS "Admin manage search_index" ON public.device_search_index;
CREATE POLICY "Admin manage search_index" ON public.device_search_index FOR ALL TO authenticated USING (true);

-- Grant privileges
GRANT ALL ON public.device_search_index TO service_role, authenticated;
