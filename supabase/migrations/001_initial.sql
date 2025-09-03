-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create orgs table
CREATE TABLE orgs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE profiles (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  org_id UUID REFERENCES orgs(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create api_keys table
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES orgs(id) ON DELETE CASCADE,
  key_hash TEXT NOT NULL UNIQUE,
  name TEXT DEFAULT 'Default Key',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  revoked_at TIMESTAMPTZ
);

-- Create events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES orgs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  request_id TEXT NOT NULL,
  step_type TEXT,
  tool_name TEXT,
  input_tokens INTEGER DEFAULT 0,
  output_tokens INTEGER DEFAULT 0,
  cost_usd NUMERIC(10,6) DEFAULT 0,
  latency_ms INTEGER DEFAULT 0,
  cache_hit BOOLEAN DEFAULT FALSE,
  status TEXT DEFAULT 'ok' CHECK (status IN ('ok', 'error', 'partial')),
  payload JSONB,
  index INTEGER DEFAULT 0
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  org_id UUID REFERENCES orgs(id) ON DELETE CASCADE,
  stripe_customer_id TEXT UNIQUE,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT DEFAULT 'hacker' CHECK (plan IN ('hacker', 'startup', 'scale')),
  status TEXT DEFAULT 'trialing',
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_events_org_id ON events(org_id);
CREATE INDEX idx_events_request_id ON events(request_id);
CREATE INDEX idx_events_created_at ON events(created_at DESC);
CREATE INDEX idx_api_keys_org_id ON api_keys(org_id);
CREATE INDEX idx_api_keys_key_hash ON api_keys(key_hash);
CREATE INDEX idx_profiles_org_id ON profiles(org_id);

-- Row Level Security
ALTER TABLE orgs ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Orgs: Users can view their own org
CREATE POLICY "Users can view their org" ON orgs
  FOR SELECT USING (
    id IN (
      SELECT org_id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Profiles: Users can view profiles in their org
CREATE POLICY "Users can view profiles in their org" ON profiles
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- API Keys: Users can manage keys in their org
CREATE POLICY "Users can view API keys in their org" ON api_keys
  FOR ALL USING (
    org_id IN (
      SELECT org_id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Events: Users can view events in their org
CREATE POLICY "Users can view events in their org" ON events
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Subscriptions: Users can view their org subscription
CREATE POLICY "Users can view their subscription" ON subscriptions
  FOR SELECT USING (
    org_id IN (
      SELECT org_id FROM profiles WHERE user_id = auth.uid()
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION get_org_events_count(org_uuid UUID, period_days INTEGER DEFAULT 30)
RETURNS BIGINT AS $$
BEGIN
  RETURN (
    SELECT COUNT(*)
    FROM events
    WHERE org_id = org_uuid
      AND created_at >= NOW() - INTERVAL '1 day' * period_days
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_org_plan_limits(org_uuid UUID)
RETURNS TABLE(events_limit BIGINT, api_keys_limit INTEGER) AS $$
BEGIN
  RETURN QUERY
  SELECT
    CASE
      WHEN s.plan = 'scale' THEN 5000000::BIGINT
      WHEN s.plan = 'startup' THEN 500000::BIGINT
      ELSE 50000::BIGINT
    END AS events_limit,
    CASE
      WHEN s.plan = 'scale' THEN 999
      WHEN s.plan = 'startup' THEN 5
      ELSE 1
    END AS api_keys_limit
  FROM subscriptions s
  WHERE s.org_id = org_uuid
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
