# ADR 005 — Pre-generated Audio over Real-time TTS

**Date:** 2025-05-02  
**Status:** Accepted  
**Deciders:** Founding team

---

## Context

Voice narration can be delivered in two ways: generate audio on-demand when a user plays a story, or pre-generate all audio offline and serve static MP3 files from a CDN.

---

## Decision

We will **pre-generate all story audio** using a one-time batch script and store MP3 files in Supabase Storage. The app streams static URLs, not a live TTS API.

---

## Rationale

**Real-time TTS:**
- Each story play calls the TTS API → latency before audio starts (500ms–2s)
- Cost scales with plays, not content volume. 100,000 plays of one story = 100,000 API calls
- Requires API key in a server-side function (security complexity)
- Poor experience on slow Indian mobile networks

**Pre-generated static audio:**
- Audio generation runs once per story slide per language
- MP3 files served from Supabase CDN → fast start (< 500ms), cacheable
- Cost is fixed per content volume, not per play
- Works partially offline if files are cached on device
- No API key exposed to clients

**Cost comparison for 100,000 story plays:**
- Real-time: ~₹330 (100k × avg 500 chars × ₹0.0033/char)
- Pre-generated: ~₹20 one-time for the content

The only downside to pre-generation is that adding a new story or correcting a voice error requires re-running the generation script and re-uploading. This is acceptable — content changes are infrequent and the script is idempotent.

---

## Consequences

- `scripts/generate-audio.js` must be run after any new story content is added to the database.
- Word timestamps (for read-along highlighting) are generated at the same time and stored in the `word_timestamps` JSONB column.
- Audio files follow the path convention: `story-audio/stories/{story_id}/{slide_id}_{lang}.mp3`
- The admin panel will surface a "Generate Audio" button that triggers the script via a Supabase Edge Function, so non-technical content editors can add new stories without CLI access.