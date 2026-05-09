-- Create the story-audio storage bucket (ADR 005)
-- Public read so audio URLs work directly in the mobile app without auth headers.
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'story-audio',
  'story-audio',
  true,
  10485760,           -- 10 MB per file limit
  ARRAY['audio/mpeg'] -- only MP3 files allowed
)
ON CONFLICT (id) DO NOTHING;

-- Anyone can read audio files (needed for unauthenticated CDN streaming)
CREATE POLICY "public_read_audio" ON storage.objects
  FOR SELECT USING (bucket_id = 'story-audio');

-- Only service role (Edge Function) can upload/overwrite audio files
CREATE POLICY "service_role_write_audio" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'story-audio' AND
    auth.role() = 'service_role'
  );

CREATE POLICY "service_role_update_audio" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'story-audio' AND
    auth.role() = 'service_role'
  );
