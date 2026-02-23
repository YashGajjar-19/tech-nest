-- UUID generator
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Vector embeddings (for AI search)
CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE device_categories (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE brands (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE,
  logo_url text,
  website_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE devices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  brand_id uuid REFERENCES brands(id),
  category_id uuid REFERENCES device_categories(id),

  model_name text NOT NULL,
  slug text UNIQUE NOT NULL,

  release_date date,
  image_url text,

  tech_nest_score numeric,

  is_foldable boolean DEFAULT false,
  ai_summary text,

  created_at timestamptz DEFAULT now()
);

CREATE TABLE device_media (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id uuid REFERENCES devices(id) ON DELETE CASCADE,

  media_type text, -- front, back, side, gallery
  url text NOT NULL,
  is_primary boolean DEFAULT false,

  created_at timestamptz DEFAULT now()
);

CREATE TABLE spec_definitions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  key_name text UNIQUE NOT NULL,
  display_label text NOT NULL,
  unit text,
  human_explanation text,

  category text CHECK (
    category IN (
      'Display','Performance','Camera','Battery',
      'Connectivity','Build','Audio','Software',
      'Sensors','Dimensions','Gaming','AI'
    )
  )
);

CREATE TABLE device_specs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  device_id uuid REFERENCES devices(id) ON DELETE CASCADE,
  spec_key text REFERENCES spec_definitions(key_name),

  raw_value text NOT NULL,
  numeric_value numeric,

  is_highlight boolean DEFAULT false
);

CREATE TABLE device_variants (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  device_id uuid REFERENCES devices(id) ON DELETE CASCADE,

  region text,
  ram_gb integer,
  storage_gb integer,
  chipset text,
  sku text,

  price_launch_usd numeric
);

CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),

  username text UNIQUE,
  avatar_url text,
  bio text,

  reputation_score integer DEFAULT 0,

  role text DEFAULT 'user'
  CHECK (role IN ('user','editor','admin')),

  created_at timestamptz DEFAULT now()
);

CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  user_id uuid REFERENCES profiles(id),
  device_id uuid REFERENCES devices(id),

  rating integer CHECK (rating BETWEEN 1 AND 10),

  title text,
  content text,

  pros text[],
  cons text[],

  is_verified_owner boolean DEFAULT false,
  proof_image_url text,

  upvotes integer DEFAULT 0,
  helpful_score integer DEFAULT 0,

  created_at timestamptz DEFAULT now()
);

CREATE TABLE device_embeddings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  device_id uuid REFERENCES devices(id) ON DELETE CASCADE,

  embedding vector(1536),
  embedding_model text,

  last_updated timestamptz DEFAULT now()
);

CREATE TABLE device_comparisons (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  device_a uuid REFERENCES devices(id),
  device_b uuid REFERENCES devices(id),

  comparison_summary text,
  ai_winner uuid REFERENCES devices(id),

  created_at timestamptz DEFAULT now()
);

CREATE TABLE spec_reports (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),

  user_id uuid REFERENCES profiles(id),
  device_id uuid REFERENCES devices(id),

  incorrect_spec_key text,
  suggested_value text,

  status text DEFAULT 'pending'
  CHECK (status IN ('pending','verified','rejected')),

  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_devices_brand ON devices(brand_id);
CREATE INDEX idx_devices_category ON devices(category_id);
CREATE INDEX idx_device_specs_device ON device_specs(device_id);
CREATE INDEX idx_reviews_device ON reviews(device_id);

ALTER TABLE profiles
DROP CONSTRAINT profiles_role_check;

ALTER TABLE profiles
ADD CONSTRAINT profiles_role_check
CHECK (role IN ('user','editor','moderator','admin','super_admin'));

ALTER TABLE devices ENABLE ROW LEVEL SECURITY;

CREATE POLICY editors_insert_devices
ON devices
FOR INSERT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND role IN ('editor','admin','super_admin')
  )
);