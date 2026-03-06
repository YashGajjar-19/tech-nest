-- 1. Create the bucket if it doesn't exist (already done via Python, but good to have)
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('device-images', 'device-images', true)
-- ON CONFLICT (id) DO NOTHING;

-- 2. Allow Public Access (SELECT) to images
DROP POLICY IF EXISTS "Public Access" ON storage.objects;
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'device-images' );

-- 3. Allow Authenticated Users to Upload
DROP POLICY IF EXISTS "Authenticated Users Upload" ON storage.objects;
CREATE POLICY "Authenticated Users Upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'device-images' );

-- 4. Allow Authenticated Users to Delete/Update their own uploads (optional but good)
DROP POLICY IF EXISTS "Authenticated Users Delete" ON storage.objects;
CREATE POLICY "Authenticated Users Delete"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'device-images' );
