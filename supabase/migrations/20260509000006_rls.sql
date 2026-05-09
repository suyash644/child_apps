-- Row Level Security policies for all tables
-- Two enforcement layers: RLS (data) + Next.js middleware (UI) per ADR 011

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE shlokas ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

-- Helper: true if the calling user has at least the given admin role.
-- super_admin passes all role checks; other roles are checked exactly.
CREATE OR REPLACE FUNCTION public.has_admin_role(required_role TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
      AND (
        admin_role = 'super_admin'
        OR admin_role::TEXT = required_role
      )
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ── Profiles ─────────────────────────────────────────────────────────────────
CREATE POLICY "users_read_own_profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "users_update_own_profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "admins_read_all_profiles" ON profiles
  FOR SELECT USING (has_admin_role('content_manager'));

-- ── Children ──────────────────────────────────────────────────────────────────
CREATE POLICY "parents_manage_own_children" ON children
  FOR ALL USING (parent_id = auth.uid());

CREATE POLICY "admins_read_all_children" ON children
  FOR SELECT USING (has_admin_role('analytics_viewer'));

-- ── Subscriptions ─────────────────────────────────────────────────────────────
-- Write is service-role only (Edge Functions). Clients can only read.
CREATE POLICY "users_read_own_subscriptions" ON subscriptions
  FOR SELECT USING (profile_id = auth.uid());

CREATE POLICY "admins_read_all_subscriptions" ON subscriptions
  FOR SELECT USING (has_admin_role('analytics_viewer'));

-- ── Stories ───────────────────────────────────────────────────────────────────
-- Free published stories: all authenticated users
-- Premium published stories: only paying subscribers
CREATE POLICY "users_read_accessible_stories" ON stories
  FOR SELECT USING (
    status = 'published'
    AND (is_premium = FALSE OR public.is_premium(auth.uid()))
  );

CREATE POLICY "admins_manage_all_stories" ON stories
  FOR ALL USING (has_admin_role('content_manager'));

-- ── Story Slides ──────────────────────────────────────────────────────────────
CREATE POLICY "users_read_slides_for_accessible_stories" ON story_slides
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM stories s
      WHERE s.id = story_slides.story_id
        AND s.status = 'published'
        AND (s.is_premium = FALSE OR public.is_premium(auth.uid()))
    )
  );

CREATE POLICY "admins_manage_all_slides" ON story_slides
  FOR ALL USING (has_admin_role('content_manager'));

-- ── Shlokas ───────────────────────────────────────────────────────────────────
CREATE POLICY "users_read_accessible_shlokas" ON shlokas
  FOR SELECT USING (
    status = 'published'
    AND (is_premium = FALSE OR public.is_premium(auth.uid()))
  );

CREATE POLICY "admins_manage_all_shlokas" ON shlokas
  FOR ALL USING (has_admin_role('content_manager'));

-- ── Quizzes ───────────────────────────────────────────────────────────────────
CREATE POLICY "users_read_accessible_quizzes" ON quizzes
  FOR SELECT USING (
    status = 'published'
    AND (is_premium = FALSE OR public.is_premium(auth.uid()))
  );

CREATE POLICY "admins_manage_all_quizzes" ON quizzes
  FOR ALL USING (has_admin_role('content_manager'));

-- ── Quiz Questions ────────────────────────────────────────────────────────────
CREATE POLICY "users_read_questions_for_accessible_quizzes" ON quiz_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM quizzes q
      WHERE q.id = quiz_questions.quiz_id
        AND q.status = 'published'
        AND (q.is_premium = FALSE OR public.is_premium(auth.uid()))
    )
  );

CREATE POLICY "admins_manage_all_questions" ON quiz_questions
  FOR ALL USING (has_admin_role('content_manager'));

-- ── Badges ────────────────────────────────────────────────────────────────────
CREATE POLICY "all_authenticated_read_badges" ON badges
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "super_admin_manage_badges" ON badges
  FOR ALL USING (has_admin_role('super_admin'));

-- ── User Progress ─────────────────────────────────────────────────────────────
CREATE POLICY "parents_manage_own_children_progress" ON user_progress
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM children c
      WHERE c.id = user_progress.child_id
        AND c.parent_id = auth.uid()
    )
  );

-- ── User Badges ───────────────────────────────────────────────────────────────
CREATE POLICY "parents_read_own_children_badges" ON user_badges
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM children c
      WHERE c.id = user_badges.child_id
        AND c.parent_id = auth.uid()
    )
  );
