-- ============================================================
-- Tech Nest: Authentication & Authorization Schema
-- IDEMPOTENT VERSION — Safe to run multiple times on existing DBs
-- ============================================================

--------------------------------------------------------------------------------
-- 1. Enums
--------------------------------------------------------------------------------

-- Add enum type safely; skip if it already exists
DO $$ BEGIN
    CREATE TYPE public.app_role AS ENUM ('user', 'editor', 'admin', 'super_admin');
EXCEPTION
    WHEN duplicate_object THEN
        RAISE NOTICE 'Type public.app_role already exists, skipping.';
END $$;

-- If you need to ADD a new value to the existing enum later, use:
-- ALTER TYPE public.app_role ADD VALUE IF NOT EXISTS 'moderator';

--------------------------------------------------------------------------------
-- 2. Tables (CREATE IF NOT EXISTS — never drops existing data)
--------------------------------------------------------------------------------

-- profiles: Public representation of every auth user
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
);
-- Ensure all expected columns exist (safe to re-run on existing tables)
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email       TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name   TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url  TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS created_at  TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS updated_at  TIMESTAMPTZ DEFAULT NOW();

-- user_roles: App-level RBAC table
CREATE TABLE IF NOT EXISTS public.user_roles (
    user_id     UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    role        public.app_role DEFAULT 'user'::public.app_role NOT NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW(),
    assigned_by UUID REFERENCES auth.users(id)
);

-- admin_logs: Immutable audit trail
CREATE TABLE IF NOT EXISTS public.admin_logs (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id    UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action      TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id   UUID,
    details     JSONB,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

--------------------------------------------------------------------------------
-- 3. Functions (CREATE OR REPLACE — always safe)
--------------------------------------------------------------------------------

-- Auto-create profile + default role on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
    -- Insert into profiles (ignore if row already exists, e.g. from a previous partial run)
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        NEW.email,
        NEW.raw_user_meta_data->>'full_name',
        NEW.raw_user_meta_data->>'avatar_url'
    )
    ON CONFLICT (id) DO NOTHING;

    -- Insert default 'user' role (ignore if already assigned)
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user'::public.app_role)
    ON CONFLICT (user_id) DO NOTHING;

    RETURN NEW;
END;
$$;

-- Auto-update updated_at timestamp on profiles
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Helper: check if a given user_id has admin-level access
DROP FUNCTION IF EXISTS public.is_admin(uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.is_admin(uid uuid)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_roles.user_id = uid
        AND role IN ('admin', 'super_admin')
    );
$$;

-- Helper: check if a given user_id is a super_admin
DROP FUNCTION IF EXISTS public.is_super_admin(uuid) CASCADE;
CREATE OR REPLACE FUNCTION public.is_super_admin(uid uuid)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_roles.user_id = uid
        AND role = 'super_admin'
    );
$$;

--------------------------------------------------------------------------------
-- 4. Triggers (DROP IF EXISTS → recreate — always safe)
--------------------------------------------------------------------------------

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

DROP TRIGGER IF EXISTS on_profiles_updated ON public.profiles;
CREATE TRIGGER on_profiles_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

--------------------------------------------------------------------------------
-- 5. Row Level Security — Enable (idempotent, safe to run again)
--------------------------------------------------------------------------------

ALTER TABLE public.profiles   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_logs ENABLE ROW LEVEL SECURITY;

--------------------------------------------------------------------------------
-- 6. RLS Policies
-- Strategy: DROP IF EXISTS → CREATE. This is the only idempotent pattern
-- for policies since PostgreSQL has no CREATE OR REPLACE POLICY syntax.
--------------------------------------------------------------------------------

-- ── profiles ──────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

DROP POLICY IF EXISTS "Admins can read all profiles" ON public.profiles;
CREATE POLICY "Admins can read all profiles"
    ON public.profiles FOR SELECT
    USING (public.is_admin(auth.uid()));

-- ── user_roles ────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can view own role" ON public.user_roles;
CREATE POLICY "Users can view own role"
    ON public.user_roles FOR SELECT
    USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
CREATE POLICY "Admins can view all roles"
    ON public.user_roles FOR SELECT
    USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Super Admins can manage roles" ON public.user_roles;
CREATE POLICY "Super Admins can manage roles"
    ON public.user_roles FOR ALL
    USING (public.is_super_admin(auth.uid()));

-- ── admin_logs ────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Admins can view logs" ON public.admin_logs;
CREATE POLICY "Admins can view logs"
    ON public.admin_logs FOR SELECT
    USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Admins can insert logs" ON public.admin_logs;
CREATE POLICY "Admins can insert logs"
    ON public.admin_logs FOR INSERT
    WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Logs are immutable" ON public.admin_logs;
CREATE POLICY "Logs are immutable"
    ON public.admin_logs FOR UPDATE
    USING (false);

DROP POLICY IF EXISTS "Super Admins can delete logs" ON public.admin_logs;
CREATE POLICY "Super Admins can delete logs"
    ON public.admin_logs FOR DELETE
    USING (public.is_super_admin(auth.uid()));

--------------------------------------------------------------------------------
-- 7. Super Admin Bootstrap
-- Run ONLY ONCE after your first account is created.
-- Replace the email below with yours, then uncomment and execute.
--------------------------------------------------------------------------------

-- UPDATE public.user_roles
-- SET role = 'super_admin'
-- WHERE user_id = (
--     SELECT id FROM auth.users WHERE email = 'your.email@example.com'
-- );
