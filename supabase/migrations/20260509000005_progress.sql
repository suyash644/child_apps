-- Progress, badges, and XP tracking per child

CREATE TABLE badges (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            JSONB NOT NULL DEFAULT '{}',
  description     JSONB NOT NULL DEFAULT '{}',
  image_url       TEXT NOT NULL,
  condition_type  badge_condition_type NOT NULL,
  condition_value INT NOT NULL, -- e.g. 5 for "complete 5 stories"
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One row per child per content item; UNIQUE prevents duplicate tracking
CREATE TABLE user_progress (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id         UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  entity_type      progress_entity_type NOT NULL,
  entity_id        UUID NOT NULL,
  status           progress_status NOT NULL DEFAULT 'started',
  last_slide_index INT,  -- resume point for stories
  score            INT,  -- 0–100 for quizzes
  xp_earned        INT NOT NULL DEFAULT 0,
  completed_at     TIMESTAMPTZ,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (child_id, entity_type, entity_id)
);

CREATE TABLE user_badges (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id  UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  badge_id  UUID NOT NULL REFERENCES badges(id),
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (child_id, badge_id)
);
