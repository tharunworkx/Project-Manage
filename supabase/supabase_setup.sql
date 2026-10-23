-- ============================================================
-- Taskora / Project Management - Complete Supabase Setup Script
-- Run this in your Supabase Dashboard -> SQL Editor -> Run
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Profiles Table (syncs with Supabase auth / user profiles)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'team_member' CHECK (role IN ('admin', 'project_manager', 'team_member', 'ADMIN', 'PROJECT_MANAGER', 'TEAM_MEMBER')),
  status TEXT DEFAULT 'active',
  color TEXT DEFAULT '#7C3AED',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Users Table (Employee Accounts & Credentials)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255),
  employee_id VARCHAR(50) UNIQUE,
  role VARCHAR(30) DEFAULT 'TEAM_MEMBER' CHECK (role IN ('ADMIN', 'PROJECT_MANAGER', 'TEAM_MEMBER', 'admin', 'project_manager', 'team_member')),
  avatar_url TEXT,
  color VARCHAR(30) DEFAULT '#7C3AED',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Workspaces Table
CREATE TABLE IF NOT EXISTS public.workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#0C66E4',
  owner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Workspace Members Table
CREATE TABLE IF NOT EXISTS public.workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'team_member',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, user_id)
);

-- 5. Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  project_manager_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#0C66E4',
  start_date TEXT,
  end_date TEXT,
  image_url TEXT,
  client TEXT,
  budget TEXT,
  estimated_hours TEXT,
  tag TEXT,
  status TEXT DEFAULT 'in_progress',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Project Members Table
CREATE TABLE IF NOT EXISTS public.project_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  role_in_project TEXT DEFAULT 'team_member',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(project_id, user_id)
);

-- 7. Tasks Table
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  assignee_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  assignee TEXT,
  reporter TEXT,
  created_by TEXT,
  key TEXT,
  type TEXT DEFAULT 'task',
  title TEXT NOT NULL,
  description TEXT,
  status VARCHAR(30) DEFAULT 'todo',
  priority VARCHAR(30) DEFAULT 'medium',
  due_date TIMESTAMPTZ,
  start_date TIMESTAMPTZ,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS workspace_id UUID;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS assignee TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS reporter TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS created_by TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS key TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS type TEXT DEFAULT 'task';

-- 8. Comments Table
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Labels Table
CREATE TABLE IF NOT EXISTS public.labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1'
);

-- 10. Task Labels Join Table
CREATE TABLE IF NOT EXISTS public.task_labels (
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  label_id UUID REFERENCES public.labels(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, label_id)
);

-- 11. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. Clients Table
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  contact_person TEXT,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Ensure all columns exist (in case tables already exist from previous setups)
-- ============================================================
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS color VARCHAR(30) DEFAULT '#7C3AED';
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50);
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#7C3AED';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;

ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS color TEXT DEFAULT '#0C66E4';
ALTER TABLE public.workspaces ADD COLUMN IF NOT EXISTS description TEXT;

ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS start_date TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS end_date TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS client TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS budget TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS estimated_hours TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tag TEXT;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'in_progress';

ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS start_date TIMESTAMPTZ;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS due_date TIMESTAMPTZ;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS order_index INTEGER DEFAULT 0;

-- ============================================================
-- Enable Row Level Security (RLS) & Policies
-- ============================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- Development-friendly policies (Allow full read/write for anon and authenticated clients)
DO $$
BEGIN
  -- Profiles
  DROP POLICY IF EXISTS "Public access profiles" ON public.profiles;
  CREATE POLICY "Public access profiles" ON public.profiles FOR ALL USING (true) WITH CHECK (true);

  -- Users
  DROP POLICY IF EXISTS "Public access users" ON public.users;
  CREATE POLICY "Public access users" ON public.users FOR ALL USING (true) WITH CHECK (true);

  -- Workspaces
  DROP POLICY IF EXISTS "Public access workspaces" ON public.workspaces;
  CREATE POLICY "Public access workspaces" ON public.workspaces FOR ALL USING (true) WITH CHECK (true);

  -- Workspace Members
  DROP POLICY IF EXISTS "Public access workspace_members" ON public.workspace_members;
  CREATE POLICY "Public access workspace_members" ON public.workspace_members FOR ALL USING (true) WITH CHECK (true);

  -- Projects
  DROP POLICY IF EXISTS "Public access projects" ON public.projects;
  CREATE POLICY "Public access projects" ON public.projects FOR ALL USING (true) WITH CHECK (true);

  -- Project Members
  DROP POLICY IF EXISTS "Public access project_members" ON public.project_members;
  CREATE POLICY "Public access project_members" ON public.project_members FOR ALL USING (true) WITH CHECK (true);

  -- Tasks
  DROP POLICY IF EXISTS "Public access tasks" ON public.tasks;
  CREATE POLICY "Public access tasks" ON public.tasks FOR ALL USING (true) WITH CHECK (true);

  -- Comments
  DROP POLICY IF EXISTS "Public access comments" ON public.comments;
  CREATE POLICY "Public access comments" ON public.comments FOR ALL USING (true) WITH CHECK (true);

  -- Labels
  DROP POLICY IF EXISTS "Public access labels" ON public.labels;
  CREATE POLICY "Public access labels" ON public.labels FOR ALL USING (true) WITH CHECK (true);

  -- Task Labels
  DROP POLICY IF EXISTS "Public access task_labels" ON public.task_labels;
  CREATE POLICY "Public access task_labels" ON public.task_labels FOR ALL USING (true) WITH CHECK (true);

  -- Notifications
  DROP POLICY IF EXISTS "Public access notifications" ON public.notifications;
  CREATE POLICY "Public access notifications" ON public.notifications FOR ALL USING (true) WITH CHECK (true);

  -- Clients
  DROP POLICY IF EXISTS "Public access clients" ON public.clients;
  CREATE POLICY "Public access clients" ON public.clients FOR ALL USING (true) WITH CHECK (true);
END $$;

-- ============================================================
-- Seed Default Initial Data
-- ============================================================
-- 1. Initial Admin Profile
INSERT INTO public.profiles (id, full_name, email, role, status, color)
VALUES ('00000000-0000-0000-0000-000000000001', 'Tharun R', 'tharun@gmail.com', 'admin', 'active', '#7C3AED')
ON CONFLICT (id) DO NOTHING;

-- 2. Initial Admin User
INSERT INTO public.users (id, full_name, email, role, is_active, color)
VALUES ('00000000-0000-0000-0000-000000000001', 'Tharun R', 'tharun@gmail.com', 'ADMIN', true, '#7C3AED')
ON CONFLICT (email) DO NOTHING;

-- 3. Default Workspace
INSERT INTO public.workspaces (id, name, slug, description, color, owner_id)
VALUES ('00000000-0000-0000-0000-000000000010', 'Acme Product Studio', 'acme-studio', 'Main delivery & product workspace', '#0C66E4', '00000000-0000-0000-0000-000000000001')
ON CONFLICT (slug) DO NOTHING;

-- 4. Default Project
INSERT INTO public.projects (id, workspace_id, name, description, color, status)
VALUES ('00000000-0000-0000-0000-000000000020', '00000000-0000-0000-0000-000000000010', 'Taskora Core Web App', 'Core project management application with Kanban & Cycles', '#0C66E4', 'in_progress')
ON CONFLICT (id) DO NOTHING;

-- 5. Sample Tasks
INSERT INTO public.tasks (id, project_id, title, description, status, priority, order_index)
VALUES 
  ('00000000-0000-0000-0000-000000000031', '00000000-0000-0000-0000-000000000020', 'Design onboarding and login flow', 'Create sleek animated login screen with role routing', 'todo', 'high', 0),
  ('00000000-0000-0000-0000-000000000032', '00000000-0000-0000-0000-000000000020', 'Configure PostgreSQL schema & Supabase RLS', 'Set up tables, relations, and permissions', 'in_progress', 'urgent', 1),
  ('00000000-0000-0000-0000-000000000033', '00000000-0000-0000-0000-000000000020', 'Implement dual-theme Kanban Board', 'Jira-style board with columns and smooth drag-drop', 'done', 'medium', 2)
ON CONFLICT (id) DO NOTHING;
