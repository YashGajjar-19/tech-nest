-- Create KV-based device_specs table for compatibility with Admin & Backend
CREATE TABLE IF NOT EXISTS public.device_specs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
    spec_key TEXT NOT NULL,
    spec_value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(device_id, spec_key)
);

-- Enable RLS
ALTER TABLE public.device_specs ENABLE ROW LEVEL SECURITY;

-- Public read access
DROP POLICY IF EXISTS "Public read device_specs" ON public.device_specs;
CREATE POLICY "Public read device_specs" ON public.device_specs FOR SELECT USING (true);

-- Authenticated (Admin) write access
DROP POLICY IF EXISTS "Admin manage device_specs" ON public.device_specs;
CREATE POLICY "Admin manage device_specs" ON public.device_specs FOR ALL TO authenticated USING (true);

-- Grant privileges for service_role and authenticated
GRANT ALL ON public.device_specs TO service_role, authenticated;
