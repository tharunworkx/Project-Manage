-- 010_user_roles.sql
-- Configure 3 user roles: 'admin', 'project_manager', 'team_member'

-- 1. Add role column to profiles table if not present
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'team_member' 
CHECK (role IN ('admin', 'project_manager', 'team_member'));

-- 2. Add role column to workspace_members if not present
ALTER TABLE public.workspace_members 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'team_member' 
CHECK (role IN ('admin', 'project_manager', 'team_member', 'owner'));

-- 3. Designate the primary user as Admin
UPDATE public.profiles 
SET role = 'admin' 
WHERE id IN (
  SELECT id FROM auth.users 
  WHERE email ILIKE '%tharun%' OR email ILIKE '%admin%'
);

-- 4. Automatically assign 'team_member' to all newly registered users via trigger
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'full_name', 'New Member'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(new.raw_user_meta_data->>'role', 'team_member')
  )
  ON CONFLICT (id) DO UPDATE
  SET 
    full_name = EXCLUDED.full_name,
    role = CASE 
      -- Retain admin if already set, otherwise default to team_member
      WHEN profiles.role = 'admin' THEN 'admin'
      ELSE COALESCE(new.raw_user_meta_data->>'role', 'team_member')
    END;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users after insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_role();
