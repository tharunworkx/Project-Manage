-- ==============================================================================
-- TASKFLOW / PROJECT MANAGEMENT - COMPLETE SUPABASE SETUP SCRIPT
-- ==============================================================================
-- This script safely drops old tables and builds a complete, robust schema for
-- workspaces, users, profiles, projects, members, tasks, clients, and notifications.
-- Run this script in the Supabase SQL Editor: Dashboard -> SQL Editor -> Run
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Clean teardown of existing tables in reverse dependency order
DROP TABLE IF EXISTS public.task_labels CASCADE;
DROP TABLE IF EXISTS public.labels CASCADE;
DROP TABLE IF EXISTS public.attachments CASCADE;
DROP TABLE IF EXISTS public.comments CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.project_members CASCADE;
DROP TABLE IF EXISTS public.tasks CASCADE;
DROP TABLE IF EXISTS public.projects CASCADE;
DROP TABLE IF EXISTS public.clients CASCADE;
DROP TABLE IF EXISTS public.workspaces CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 3. Create Core Tables

-- 3.1 Workspaces Table
CREATE TABLE public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT,
  description TEXT DEFAULT '',
  color TEXT DEFAULT '#0C66E4',
  owner_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.2 Profiles Table (referenced by projects, tasks, members, notifications)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  role TEXT DEFAULT 'team_member',
  status TEXT DEFAULT 'active',
  avatar_url TEXT,
  color TEXT DEFAULT '#10B981',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.3 Users Table (auth, employee list, passwords, role enforcement)
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  password_hash VARCHAR(255) DEFAULT '12345678',
  employee_id VARCHAR(50),
  role VARCHAR(30) DEFAULT 'TEAM_MEMBER',
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  color VARCHAR(30) DEFAULT '#10B981',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.4 Clients Table
CREATE TABLE public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact_person TEXT,
  company TEXT,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.5 Projects Table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  project_manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  color TEXT DEFAULT '#0C66E4',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  image_url TEXT,
  client TEXT,
  budget NUMERIC,
  estimated_hours NUMERIC,
  tag TEXT DEFAULT 'General',
  status TEXT DEFAULT 'in_progress',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.6 Project Members (Many-to-Many linking Projects and Employee Profiles)
CREATE TABLE public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_in_project TEXT DEFAULT 'team_member',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT uq_project_member UNIQUE (project_id, user_id)
);

-- 3.7 Tasks Table
CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('backlog', 'todo', 'in_progress', 'in_review', 'done', 'cancelled')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  reporter_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  start_date TIMESTAMPTZ,
  due_date TIMESTAMPTZ,
  points INTEGER DEFAULT 1,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.8 Comments Table
CREATE TABLE public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.9 Notifications Table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT DEFAULT 'info',
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3.10 Attachments Table
CREATE TABLE public.attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size INTEGER,
  file_type TEXT,
  file_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Performance Indexes
CREATE INDEX idx_profiles_email ON public.profiles(email);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_projects_workspace ON public.projects(workspace_id);
CREATE INDEX idx_project_members_project ON public.project_members(project_id);
CREATE INDEX idx_project_members_user ON public.project_members(user_id);
CREATE INDEX idx_tasks_project ON public.tasks(project_id);
CREATE INDEX idx_tasks_assignee ON public.tasks(assignee_id);
CREATE INDEX idx_notifications_user ON public.notifications(user_id);

-- 5. Updated_at Trigger Helper
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_workspaces_updated BEFORE UPDATE ON public.workspaces FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_users_updated BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_projects_updated BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_tasks_updated BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 6. Row Level Security (RLS) - Permissive Policies for Web App Access
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attachments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow all operations for workspaces" ON public.workspaces FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for project_members" ON public.project_members FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for comments" ON public.comments FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations for attachments" ON public.attachments FOR ALL USING (true) WITH CHECK (true);

-- 7. Configure Supabase Realtime Publication
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END $$;

ALTER PUBLICATION supabase_realtime ADD TABLE public.workspaces;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.project_members;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.clients;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- 8. Seed Default Essential Data

-- 8.1 Workspaces
INSERT INTO public.workspaces (id, name, slug, description, color)
VALUES
  ('00000000-0000-0000-0000-000000000020', '4rged', '4rged', 'Core product development workspace', '#F59E0B'),
  ('00000000-0000-0000-0000-000000000010', 'Acme Product Studio', 'acme-studio', 'Main product engineering and SaaS dashboard', '#7C3AED')
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, color = EXCLUDED.color;

-- 8.2 Actual Employee User Accounts & Matching Profiles
-- 1. Tharun R (Admin)
INSERT INTO public.profiles (id, email, full_name, role, status, color)
VALUES ('00000000-0000-0000-0000-000000000001', 'tharun@gmail.com', 'Tharun R', 'admin', 'active', '#7C3AED')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;
INSERT INTO public.users (id, email, full_name, password_hash, employee_id, role, is_active, color)
VALUES ('00000000-0000-0000-0000-000000000001', 'tharun@gmail.com', 'Tharun R', '12345678', 'EMP-001', 'ADMIN', true, '#7C3AED')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

-- 2. Tharun R Alias (Admin)
INSERT INTO public.profiles (id, email, full_name, role, status, color)
VALUES ('00000000-0000-0000-0000-00000000001a', 'tharun.workx@gmail.com', 'Tharun R', 'admin', 'active', '#7C3AED')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;
INSERT INTO public.users (id, email, full_name, password_hash, employee_id, role, is_active, color)
VALUES ('00000000-0000-0000-0000-00000000001a', 'tharun.workx@gmail.com', 'Tharun R', '12345678', 'EMP-001A', 'ADMIN', true, '#7C3AED')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

-- 3. Samvel
INSERT INTO public.profiles (id, email, full_name, role, status, color)
VALUES ('00000000-0000-0000-0000-000000000003', 'samvel@gmail.com', 'Samvel', 'team_member', 'active', '#10B981')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;
INSERT INTO public.users (id, email, full_name, password_hash, employee_id, role, is_active, color)
VALUES ('00000000-0000-0000-0000-000000000003', 'samvel@gmail.com', 'Samvel', '12345678', 'EMP-003', 'TEAM_MEMBER', true, '#10B981')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

-- 4. Sham Alex
INSERT INTO public.profiles (id, email, full_name, role, status, color)
VALUES ('00000000-0000-0000-0000-000000000004', 'alex@gmail.com', 'Sham Alex', 'team_member', 'active', '#10B981')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;
INSERT INTO public.users (id, email, full_name, password_hash, employee_id, role, is_active, color)
VALUES ('00000000-0000-0000-0000-000000000004', 'alex@gmail.com', 'Sham Alex', '12345678', 'EMP-004', 'TEAM_MEMBER', true, '#10B981')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

-- 5. Srinivasan
INSERT INTO public.profiles (id, email, full_name, role, status, color)
VALUES ('00000000-0000-0000-0000-000000000005', 'srini@gmail.com', 'Srinivasan', 'team_member', 'active', '#10B981')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;
INSERT INTO public.users (id, email, full_name, password_hash, employee_id, role, is_active, color)
VALUES ('00000000-0000-0000-0000-000000000005', 'srini@gmail.com', 'Srinivasan', '12345678', 'EMP-005', 'TEAM_MEMBER', true, '#10B981')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

-- 6. Gokul
INSERT INTO public.profiles (id, email, full_name, role, status, color)
VALUES ('00000000-0000-0000-0000-000000000006', 'gokul@gmail.com', 'Gokul', 'team_member', 'active', '#10B981')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;
INSERT INTO public.users (id, email, full_name, password_hash, employee_id, role, is_active, color)
VALUES ('00000000-0000-0000-0000-000000000006', 'gokul@gmail.com', 'Gokul', '12345678', 'EMP-006', 'TEAM_MEMBER', true, '#10B981')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

-- 7. Rabil
INSERT INTO public.profiles (id, email, full_name, role, status, color)
VALUES ('00000000-0000-0000-0000-000000000007', 'rabil@gmail.com', 'Rabil', 'team_member', 'active', '#10B981')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;
INSERT INTO public.users (id, email, full_name, password_hash, employee_id, role, is_active, color)
VALUES ('00000000-0000-0000-0000-000000000007', 'rabil@gmail.com', 'Rabil', '12345678', 'EMP-007', 'TEAM_MEMBER', true, '#10B981')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

-- 8. Aadhi Rajini
INSERT INTO public.profiles (id, email, full_name, role, status, color)
VALUES ('00000000-0000-0000-0000-000000000008', 'rajini@gmail.com', 'Aadhi Rajini', 'team_member', 'active', '#10B981')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;
INSERT INTO public.users (id, email, full_name, password_hash, employee_id, role, is_active, color)
VALUES ('00000000-0000-0000-0000-000000000008', 'rajini@gmail.com', 'Aadhi Rajini', '12345678', 'EMP-008', 'TEAM_MEMBER', true, '#10B981')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

-- 9. Adithya Chaubhe
INSERT INTO public.profiles (id, email, full_name, role, status, color)
VALUES ('00000000-0000-0000-0000-000000000009', 'aadhi@gmail.com', 'Adithya Chaubhe', 'team_member', 'active', '#10B981')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;
INSERT INTO public.users (id, email, full_name, password_hash, employee_id, role, is_active, color)
VALUES ('00000000-0000-0000-0000-000000000009', 'aadhi@gmail.com', 'Adithya Chaubhe', '12345678', 'EMP-009', 'TEAM_MEMBER', true, '#10B981')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

-- 10. Neel (Project Manager)
INSERT INTO public.profiles (id, email, full_name, role, status, color)
VALUES ('00000000-0000-0000-0000-000000000010', 'neel@gmail.com', 'Neel', 'project_manager', 'active', '#0C66E4')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;
INSERT INTO public.users (id, email, full_name, password_hash, employee_id, role, is_active, color)
VALUES ('00000000-0000-0000-0000-000000000010', 'neel@gmail.com', 'Neel', '12345678', 'EMP-010', 'PROJECT_MANAGER', true, '#0C66E4')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

-- 11. Dhanush
INSERT INTO public.profiles (id, email, full_name, role, status, color)
VALUES ('00000000-0000-0000-0000-000000000011', 'dhanush@gmail.com', 'Dhanush', 'team_member', 'active', '#10B981')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;
INSERT INTO public.users (id, email, full_name, password_hash, employee_id, role, is_active, color)
VALUES ('00000000-0000-0000-0000-000000000011', 'dhanush@gmail.com', 'Dhanush', '12345678', 'EMP-011', 'TEAM_MEMBER', true, '#10B981')
ON CONFLICT (email) DO UPDATE SET full_name = EXCLUDED.full_name, role = EXCLUDED.role;

-- 8.3 Clients
INSERT INTO public.clients (id, name, contact_person, company, email, phone, status)
VALUES
  ('00000000-0000-0000-0002-000000000001', 'Partical Black', 'Partical Black Tech', 'Partical Black Tech', 'contact@particalblack.com', '+1 (555) 019-2834', 'active')
ON CONFLICT (id) DO NOTHING;

-- 8.4 Actual Company Projects
INSERT INTO public.projects (id, workspace_id, project_manager_id, client, client_id, name, description, color, tag, status, budget, estimated_hours)
VALUES
  (
    '00000000-0000-0000-0001-000000000001',
    '00000000-0000-0000-0000-000000000020',
    '00000000-0000-0000-0000-000000000010',
    'Partical Black',
    '00000000-0000-0000-0002-000000000001',
    'Inventory Management System',
    'Build a Inventory Management System for the company Standard',
    '#F59E0B',
    'General',
    'on_hold',
    10000,
    160
  ),
  (
    '00000000-0000-0000-0001-000000000002',
    '00000000-0000-0000-0000-000000000020',
    '00000000-0000-0000-0000-000000000010',
    'Partical Black',
    '00000000-0000-0000-0002-000000000001',
    'HRO',
    'Build a Hiring Recusation Onboarding system for the company Standard',
    '#F59E0B',
    'General',
    'on_hold',
    10000,
    160
  ),
  (
    '00000000-0000-0000-0001-000000000003',
    '00000000-0000-0000-0000-000000000020',
    '00000000-0000-0000-0000-000000000010',
    'Partical Black',
    '00000000-0000-0000-0002-000000000001',
    'Chat Application',
    'Chat Application , To communicate with clients',
    '#F59E0B',
    'General',
    'on_hold',
    10000,
    160
  ),
  (
    '00000000-0000-0000-0001-000000000004',
    '00000000-0000-0000-0000-000000000020',
    '00000000-0000-0000-0000-000000000010',
    'Partical Black',
    '00000000-0000-0000-0002-000000000001',
    'PES',
    'Build a Project Management System ,that should be in a companyn standard',
    '#F59E0B',
    'General',
    'on_hold',
    10000,
    160
  )
ON CONFLICT (id) DO NOTHING;

-- 8.5 Assign Project Members
INSERT INTO public.project_members (project_id, user_id, role_in_project)
VALUES
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000007', 'team_member'),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000009', 'team_member'),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000004', 'team_member'),
  ('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000011', 'team_member'),
  ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000010', 'project_manager'),
  ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000010', 'project_manager'),
  ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000010', 'project_manager'),
  ('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000010', 'project_manager')
ON CONFLICT (project_id, user_id) DO NOTHING;

