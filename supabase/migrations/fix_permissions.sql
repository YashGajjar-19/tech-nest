-- Run this in your Supabase SQL Editor to restore permissions!
-- This is required because the schema public was likely dropped and recreated, which removes default Supabase permissions.

GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;

GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;

-- Then run this at the bottom to ensure your account is super_admin!
INSERT INTO public.user_roles (user_id, role)
VALUES (
    (SELECT id FROM auth.users WHERE email = 'gajjaryash19@outlook.com'),
    'super_admin'
)
ON CONFLICT (user_id) DO UPDATE
SET role = 'super_admin';
