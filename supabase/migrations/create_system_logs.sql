-- ============================================================
-- Tech Nest: System Audit Logs
-- ============================================================

CREATE TABLE IF NOT EXISTS public.system_logs (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    timestamp   TIMESTAMPTZ DEFAULT NOW(),
    actor       VARCHAR(255) NOT NULL, -- display name or email
    actor_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action      VARCHAR(100) NOT NULL, -- e.g., 'update_device', 'delete_brand', 'deploy_model'
    details     JSONB DEFAULT '{}',    -- e.g., {"device_id": "...", "changes": {...}}
    severity    VARCHAR(20) DEFAULT 'info', -- 'info', 'warning', 'error', 'critical'
    ip_address  INET
);

CREATE INDEX IF NOT EXISTS idx_system_logs_timestamp ON public.system_logs (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_system_logs_action ON public.system_logs (action);

-- Enable RLS
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can see logs
CREATE POLICY "Admins can view all logs"
    ON public.system_logs FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
    ));

-- Note: Inserting into logs should happen via backend (service_role) or 
-- a trigger/function that enforces auditability.
