-- 006_create_labels.sql
CREATE TABLE IF NOT EXISTS public.labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1'
);

CREATE TABLE IF NOT EXISTS public.task_labels (
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  label_id UUID REFERENCES public.labels(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, label_id)
);
