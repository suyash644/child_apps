-- Database triggers and utility functions

-- ── updated_at auto-maintenance ───────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_shlokas_updated_at
  BEFORE UPDATE ON shlokas
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_quizzes_updated_at
  BEFORE UPDATE ON quizzes
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TRIGGER trg_user_progress_updated_at
  BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ── ADR 010: Reset published content to 'review' on text edit ─────────────────
-- Forces audio regeneration review when a published story or shloka is edited.
CREATE OR REPLACE FUNCTION public.reset_status_on_content_edit()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.status = 'published' AND (
    OLD.title IS DISTINCT FROM NEW.title OR
    OLD.description IS DISTINCT FROM NEW.description
  ) THEN
    NEW.status = 'review';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_stories_reset_on_edit
  BEFORE UPDATE ON stories
  FOR EACH ROW EXECUTE FUNCTION public.reset_status_on_content_edit();

CREATE TRIGGER trg_shlokas_reset_on_edit
  BEFORE UPDATE ON shlokas
  FOR EACH ROW EXECUTE FUNCTION public.reset_status_on_content_edit();

-- ── XP: award points when a child completes content ──────────────────────────
-- XP values: story = 50, shloka = 30, quiz = 0–10 based on score
CREATE OR REPLACE FUNCTION public.award_xp_on_completion()
RETURNS TRIGGER AS $$
DECLARE
  xp_amount INT;
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    xp_amount := CASE NEW.entity_type
      WHEN 'story'  THEN 50
      WHEN 'shloka' THEN 30
      WHEN 'quiz'   THEN GREATEST(COALESCE(NEW.score, 0) / 10, 5)
      ELSE 10
    END;

    NEW.xp_earned = xp_amount;
    NEW.completed_at = NOW();

    UPDATE children
    SET
      total_xp            = total_xp + xp_amount,
      last_active_date    = CURRENT_DATE,
      current_streak_days = CASE
        WHEN last_active_date = CURRENT_DATE - 1 THEN current_streak_days + 1
        WHEN last_active_date = CURRENT_DATE      THEN current_streak_days
        ELSE 1
      END
    WHERE id = NEW.child_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_award_xp_on_completion
  BEFORE UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION public.award_xp_on_completion();

-- ── Badge check: runs after XP update to unlock earned badges ─────────────────
CREATE OR REPLACE FUNCTION public.check_and_award_badges()
RETURNS TRIGGER AS $$
DECLARE
  b RECORD;
  child_count INT;
BEGIN
  -- Only run on completion events
  IF NEW.status != 'completed' OR OLD.status = 'completed' THEN
    RETURN NEW;
  END IF;

  FOR b IN SELECT * FROM badges LOOP
    -- Skip badges the child already has
    IF EXISTS (
      SELECT 1 FROM user_badges
      WHERE child_id = NEW.child_id AND badge_id = b.id
    ) THEN CONTINUE; END IF;

    child_count := CASE b.condition_type
      WHEN 'stories_completed' THEN (
        SELECT COUNT(*) FROM user_progress
        WHERE child_id = NEW.child_id AND entity_type = 'story' AND status = 'completed'
      )
      WHEN 'shlokas_learned' THEN (
        SELECT COUNT(*) FROM user_progress
        WHERE child_id = NEW.child_id AND entity_type = 'shloka' AND status = 'completed'
      )
      WHEN 'quizzes_passed' THEN (
        SELECT COUNT(*) FROM user_progress
        WHERE child_id = NEW.child_id AND entity_type = 'quiz'
          AND status = 'completed' AND score >= 70
      )
      WHEN 'streak_days' THEN (
        SELECT current_streak_days FROM children WHERE id = NEW.child_id
      )
      WHEN 'xp_total' THEN (
        SELECT total_xp FROM children WHERE id = NEW.child_id
      )
      ELSE 0
    END;

    IF child_count >= b.condition_value THEN
      INSERT INTO user_badges (child_id, badge_id)
      VALUES (NEW.child_id, b.id)
      ON CONFLICT DO NOTHING;
    END IF;
  END LOOP;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_check_badges_on_completion
  AFTER UPDATE ON user_progress
  FOR EACH ROW EXECUTE FUNCTION public.check_and_award_badges();
