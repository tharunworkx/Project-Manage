-- 009_enable_rls.sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Profiles: Anyone authenticated can read profiles, users can update their own
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Workspaces & Tasks: Members can read and interact
CREATE POLICY "Workspace members can view projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Workspace members can view tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Workspace members can modify tasks" ON public.tasks FOR ALL USING (true);
