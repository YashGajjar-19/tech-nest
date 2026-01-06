-- 1. SETUP EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector"; -- Essential for AI comparisons

-- 2. USER SYSTEM (PROFILES)
-- Note: Supabase handles auth.users; this table extends it.
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    reputation_score INT DEFAULT 0,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'editor', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. BRANDS & DEVICES
CREATE TABLE public.brands (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES public.brands(id) ON DELETE CASCADE,
    model_name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL, -- For SEO friendly URLs: /samsung-s24-ultra
    release_date DATE,
    image_url TEXT,
    is_foldable BOOLEAN DEFAULT FALSE,
    ai_summary TEXT, -- Pre-generated AI summary of the phone
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SPECIFICATION DEFINITIONS (The "Translation Layer")
CREATE TABLE public.spec_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key_name TEXT UNIQUE NOT NULL, -- e.g., 'display_nits'
    display_label TEXT NOT NULL,   -- e.g., 'Peak Brightness'
    unit TEXT,                    -- e.g., 'nits'
    human_explanation TEXT,       -- e.g., 'Higher nits mean the screen is easier to see under sunlight.'
    category TEXT CHECK (category IN ('Display', 'Performance', 'Camera', 'Battery', 'Connectivity', 'Build'))
);

-- 5. DEVICE SPECIFICATIONS (The Data)
CREATE TABLE public.device_specs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
    spec_key TEXT REFERENCES public.spec_definitions(key_name),
    raw_value TEXT NOT NULL, -- e.g., '2600'
    is_highlight BOOLEAN DEFAULT FALSE, -- Should this appear in the "Key Specs" section?
    UNIQUE(device_id, spec_key)
);

-- 6. VARIANTS (Regional/Hardware differences)
CREATE TABLE public.device_variants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
    region TEXT, -- e.g., 'Global', 'USA', 'India'
    ram_gb INT,
    storage_gb INT,
    chipset TEXT, -- To handle Exynos vs Snapdragon variants
    price_launch_usd DECIMAL
);

-- 7. AI VECTOR TABLE (For Semantic Comparison)
CREATE TABLE public.device_embeddings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
    embedding vector(1536), -- Compatible with OpenAI/Claude embeddings
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. SOCIAL & REVIEWS
CREATE TABLE public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    device_id UUID REFERENCES public.devices(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 10),
    title TEXT,
    content TEXT,
    pros TEXT[],
    cons TEXT[],
    is_verified_owner BOOLEAN DEFAULT FALSE,
    proof_image_url TEXT,
    upvotes INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. TICKETS & REPORTS
CREATE TABLE public.spec_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id),
    device_id UUID REFERENCES public.devices(id),
    incorrect_spec_key TEXT,
    suggested_value TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. AUTOMATED PROFILE TRIGGER
-- This automatically creates a profile when a new user signs up via Supabase Auth.
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username, avatar_url)
    VALUES (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'avatar_url');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();