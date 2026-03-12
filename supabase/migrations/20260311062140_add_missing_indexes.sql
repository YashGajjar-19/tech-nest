-- DB-1: Add missing indexing on critical query paths.
-- Also add back tables removed by the canonical schema that are still used by the backend.

CREATE TABLE IF NOT EXISTS public.interaction_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL,
    device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
    user_id UUID,
    session_id TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.device_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
    target_device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
    relationship_type TEXT NOT NULL,
    weight DECIMAL(3,2) DEFAULT 0.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source_device_id, target_device_id, relationship_type)
);

CREATE INDEX IF NOT EXISTS idx_devices_is_published_created_at ON public.devices (is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_devices_brand_id ON public.devices (brand_id);
CREATE INDEX IF NOT EXISTS idx_interaction_events_event_type_device_id_created_at ON public.interaction_events (event_type, device_id, created_at);
CREATE INDEX IF NOT EXISTS idx_interaction_events_session_id ON public.interaction_events (session_id);
CREATE INDEX IF NOT EXISTS idx_device_relationships_target_device_id ON public.device_relationships (target_device_id);

-- RLS
ALTER TABLE public.interaction_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.device_relationships ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read interaction_events" ON public.interaction_events FOR SELECT USING (true);
CREATE POLICY "Public insert interaction_events" ON public.interaction_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read device_relationships" ON public.device_relationships FOR SELECT USING (true);
