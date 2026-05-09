# generate-story-audio

Generates MP3 audio for all slides in a published story using Google Cloud TTS (Wavenet voices).
Called by the admin panel "Generate Audio" button.

## Setup

```bash
# Store the Google service account key as a Supabase secret (never commit this file)
supabase secrets set GOOGLE_SERVICE_ACCOUNT_JSON="$(cat path/to/gcloud-key.json)"

# Deploy the function
supabase functions deploy generate-story-audio
```

## To add Phase 2 languages

In `index.ts`, update:
```ts
const ACTIVE_LANGUAGES = ['hi', 'en', 'gu', 'mr', 'ta', 'te']
```

In `tts.ts`, the voice map already includes all 8 languages.

## Storage bucket

Create the `story-audio` bucket in Supabase Storage with public read access:
```sql
INSERT INTO storage.buckets (id, name, public) VALUES ('story-audio', 'story-audio', true);
```
