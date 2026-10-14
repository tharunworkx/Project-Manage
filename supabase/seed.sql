-- Seed initial mock workspace and tasks
INSERT INTO public.workspaces (id, name, slug)
VALUES ('00000000-0000-0000-0000-000000000001', 'Acme Product Studio', 'acme-studio')
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (id, workspace_id, name, description, color)
VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Taskflow Core Web App', 'Core project management application', '#4f46e5')
ON CONFLICT DO NOTHING;
