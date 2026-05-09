-- Profiles: extends Supabase auth.users
-- One profile per parent account; children are separate rows in the children table
CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name    TEXT,
  phone           TEXT UNIQUE,
  preferred_lang  language_code NOT NULL DEFAULT 'hi',
  -- Admin fields (ADR 011) — NULL means regular app user
  admin_role      admin_role,
  admin_role_langs language_code[], -- translators: restricts editable language keys
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Each parent can register multiple child profiles
CREATE TABLE children (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name                TEXT NOT NULL,
  birth_year          INT,
  age_group           age_group NOT NULL,
  preferred_lang      language_code NOT NULL DEFAULT 'hi',
  avatar_id           TEXT NOT NULL DEFAULT 'default',
  total_xp            INT NOT NULL DEFAULT 0,
  current_streak_days INT NOT NULL DEFAULT 0,
  last_active_date    DATE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create a profile row when Supabase Auth creates a new user (phone OTP signup)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, phone)
  VALUES (NEW.id, NEW.phone);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
