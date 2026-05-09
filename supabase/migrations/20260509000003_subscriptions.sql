-- Subscriptions: written only by Edge Functions via service role key
-- Client-side code reads but never writes this table
CREATE TABLE subscriptions (
  id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id               UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan                     subscription_plan NOT NULL DEFAULT 'free',
  status                   subscription_status NOT NULL DEFAULT 'active',
  started_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at               TIMESTAMPTZ, -- NULL for lifetime plans
  razorpay_subscription_id TEXT UNIQUE,
  razorpay_payment_id      TEXT,
  -- School license fields
  school_name              TEXT,
  max_children             INT,
  created_at               TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at               TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Convenience: is a given profile currently on a paid plan?
-- Used inside RLS policies to gate premium content.
CREATE OR REPLACE FUNCTION public.is_premium(profile_uuid UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM subscriptions
    WHERE profile_id = profile_uuid
      AND status = 'active'
      AND plan != 'free'
      AND (expires_at IS NULL OR expires_at > NOW())
  );
$$ LANGUAGE sql STABLE SECURITY DEFINER;
