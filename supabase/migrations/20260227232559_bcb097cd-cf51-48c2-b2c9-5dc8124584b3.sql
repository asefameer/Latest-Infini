
-- Create a public storage bucket for CMS images
INSERT INTO storage.buckets (id, name, public)
VALUES ('cms-images', 'cms-images', true);

-- Allow anyone to read files (public bucket)
CREATE POLICY "Public read access" ON storage.objects
  FOR SELECT USING (bucket_id = 'cms-images');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'cms-images');

-- Allow authenticated users to update files
CREATE POLICY "Authenticated users can update" ON storage.objects
  FOR UPDATE USING (bucket_id = 'cms-images');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete" ON storage.objects
  FOR DELETE USING (bucket_id = 'cms-images');
