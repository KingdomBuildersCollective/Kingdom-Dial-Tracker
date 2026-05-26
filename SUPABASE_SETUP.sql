-- Run this SQL in your Supabase SQL editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Agent profiles (linked to auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  agency_name TEXT DEFAULT 'Kingdom Business Services',
  avatar_initials TEXT,
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  xp_needed INTEGER DEFAULT 500,
  streak INTEGER DEFAULT 0,
  last_active_date DATE,
  total_dials INTEGER DEFAULT 0,
  total_sales INTEGER DEFAULT 0,
  total_ap NUMERIC DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Daily dial sessions
CREATE TABLE IF NOT EXISTS dial_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  day_of_week TEXT NOT NULL,
  time_block TEXT NOT NULL,
  dials INTEGER DEFAULT 0,
  contacts INTEGER DEFAULT 0,
  appointments INTEGER DEFAULT 0,
  presentations INTEGER DEFAULT 0,
  sales INTEGER DEFAULT 0,
  recruiting INTEGER DEFAULT 0,
  timer_seconds INTEGER DEFAULT 0,
  hour_blocks JSONB DEFAULT '[]',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Client records
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES dial_sessions(id),
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  dob TEXT,
  age INTEGER,
  address TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  occupation TEXT,
  is_smoker BOOLEAN DEFAULT FALSE,
  carrier TEXT,
  apv NUMERIC DEFAULT 0,
  show_status TEXT DEFAULT 'show',
  sale_status TEXT DEFAULT 'progress',
  appointment_day TEXT,
  appointment_time TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Achievements earned
CREATE TABLE IF NOT EXISTS achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agent_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  earned_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE dial_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Policies: agents can only see/edit their own data
CREATE POLICY "agents_own_profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "agents_own_sessions" ON dial_sessions FOR ALL USING (auth.uid() = agent_id);
CREATE POLICY "agents_own_clients" ON clients FOR ALL USING (auth.uid() = agent_id);
CREATE POLICY "agents_own_achievements" ON achievements FOR ALL USING (auth.uid() = agent_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_initials)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Agent'),
    UPPER(LEFT(COALESCE(NEW.raw_user_meta_data->>'full_name', 'AG'), 1) ||
          COALESCE(SPLIT_PART(NEW.raw_user_meta_data->>'full_name', ' ', 2), '')[1:1])
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
