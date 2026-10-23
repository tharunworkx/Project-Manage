-- ============================================================
-- 011_create_users_table.sql
-- Creates the users table in Supabase PostgreSQL
-- Stores all registered users and their roles
-- ============================================================

-- 1. Create users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  employee_id VARCHAR(50) UNIQUE,
  role VARCHAR(30) DEFAULT 'TEAM_MEMBER' CHECK (role IN ('ADMIN', 'PROJECT_MANAGER', 'TEAM_MEMBER')),
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Performance indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_employee_id ON public.users(employee_id);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- 3. Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_users_updated_at ON public.users;
CREATE TRIGGER trigger_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_users_updated_at();

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policies for public / authenticated access
DROP POLICY IF EXISTS "Allow select for all" ON public.users;
CREATE POLICY "Allow select for all"
  ON public.users FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Allow insert for all" ON public.users;
CREATE POLICY "Allow insert for all"
  ON public.users FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow update for all" ON public.users;
CREATE POLICY "Allow update for all"
  ON public.users FOR UPDATE
  USING (true);

-- 5. Seed default admin user
INSERT INTO public.users (full_name, email, employee_id, role, is_active)
VALUES 
  ('Tharun R', 'tharun@gmail.com', 'EMP-001', 'ADMIN', true)
ON CONFLICT (email) DO NOTHING;
