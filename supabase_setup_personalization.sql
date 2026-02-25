-- 1️⃣ Bookmarks (Saved Devices)
CREATE TABLE IF NOT EXISTS bookmarks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  device_id uuid REFERENCES devices(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, device_id)
);

-- Enable RLS for bookmarks
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own bookmarks"
ON bookmarks FOR ALL USING (auth.uid() = user_id);

-- 2️⃣ Recently Viewed
CREATE TABLE IF NOT EXISTS device_views (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  device_id uuid REFERENCES devices(id) ON DELETE CASCADE,
  viewed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, device_id)
);

-- Enable RLS for device_views
ALTER TABLE device_views ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own viewing history"
ON device_views FOR ALL USING (auth.uid() = user_id);

-- 3️⃣ User Preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  user_id uuid PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  preferred_brands text[] DEFAULT '{}',
  preferred_price_range text,
  interested_categories text[] DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS for user_preferences
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own preferences"
ON user_preferences FOR ALL USING (auth.uid() = user_id);
