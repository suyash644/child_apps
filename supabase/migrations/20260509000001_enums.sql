-- Enums used across all tables
-- Add new language codes here as phases progress (Phase 2: gu, mr, ta, te; Phase 3: bn, kn)
CREATE TYPE language_code AS ENUM ('hi', 'en', 'gu', 'mr', 'ta', 'te', 'bn', 'kn');

-- Three age segments from the product spec
CREATE TYPE age_group AS ENUM ('tiny_devotee', 'young_scholar', 'dharma_scholar');

-- Content lifecycle (ADR 010)
CREATE TYPE content_status AS ENUM ('draft', 'review', 'published');

-- Admin permission levels (ADR 011)
CREATE TYPE admin_role AS ENUM ('super_admin', 'content_manager', 'translator', 'analytics_viewer');

-- Subscription plans (ADR 006)
CREATE TYPE subscription_plan AS ENUM (
  'free',
  'premium_monthly',
  'premium_yearly',
  'lifetime',
  'nri_monthly',
  'school_yearly'
);

CREATE TYPE subscription_status AS ENUM ('active', 'cancelled', 'expired', 'trial');

-- Content categories for stories
CREATE TYPE story_category AS ENUM (
  'ramayana',
  'mahabharata',
  'ganesha',
  'krishna',
  'hanuman',
  'shiva',
  'festivals',
  'dharma_values'
);

-- User progress tracking
CREATE TYPE progress_entity_type AS ENUM ('story', 'shloka', 'quiz');
CREATE TYPE progress_status AS ENUM ('started', 'completed');

-- Badge unlock conditions
CREATE TYPE badge_condition_type AS ENUM (
  'stories_completed',
  'shlokas_learned',
  'quizzes_passed',
  'streak_days',
  'xp_total'
);
