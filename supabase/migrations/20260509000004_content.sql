-- Content tables: stories, slides, shlokas, quizzes, quiz questions
-- All user-facing text fields are JSONB keyed by language_code (ADR 004)
-- Audio URLs follow path: story-audio/stories/{story_id}/{slide_id}_{lang}.mp3 (ADR 005)

CREATE TABLE stories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category      story_category NOT NULL,
  age_group     age_group NOT NULL,
  title         JSONB NOT NULL DEFAULT '{}', -- { "hi": "...", "en": "..." }
  description   JSONB NOT NULL DEFAULT '{}',
  thumbnail_url TEXT,
  is_premium    BOOLEAN NOT NULL DEFAULT FALSE,
  status        content_status NOT NULL DEFAULT 'draft',
  display_order INT NOT NULL DEFAULT 0,
  created_by    UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE story_slides (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id        UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  slide_index     INT NOT NULL,
  content         JSONB NOT NULL DEFAULT '{}',
  image_url       TEXT,
  -- Populated by generate-audio.js script after content is published
  audio_urls      JSONB NOT NULL DEFAULT '{}', -- { "hi": "https://...", "en": "https://..." }
  word_timestamps JSONB NOT NULL DEFAULT '{}', -- { "hi": [{"word":"राम","start_ms":0,"end_ms":400},...] }
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (story_id, slide_index)
);

CREATE TABLE shlokas (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title           JSONB NOT NULL DEFAULT '{}',
  shloka_text     JSONB NOT NULL DEFAULT '{}', -- Sanskrit + transliteration per language
  meaning         JSONB NOT NULL DEFAULT '{}',
  deity           TEXT,
  difficulty      TEXT NOT NULL DEFAULT 'beginner'
                  CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  audio_urls      JSONB NOT NULL DEFAULT '{}',
  word_timestamps JSONB NOT NULL DEFAULT '{}',
  is_premium      BOOLEAN NOT NULL DEFAULT FALSE,
  status          content_status NOT NULL DEFAULT 'draft',
  created_by      UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE quizzes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id    UUID REFERENCES stories(id) ON DELETE SET NULL, -- optional: quiz linked to a story
  title       JSONB NOT NULL DEFAULT '{}',
  age_group   age_group NOT NULL,
  is_premium  BOOLEAN NOT NULL DEFAULT FALSE,
  status      content_status NOT NULL DEFAULT 'draft',
  created_by  UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE quiz_questions (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id        UUID NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_index INT NOT NULL,
  question       JSONB NOT NULL DEFAULT '{}',
  -- [{ "text": {"hi": "...", "en": "..."}, "is_correct": false }, ...]
  options        JSONB NOT NULL DEFAULT '[]',
  explanation    JSONB NOT NULL DEFAULT '{}', -- shown to child after answering
  created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (quiz_id, question_index)
);
