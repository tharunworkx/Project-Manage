-- Seed initial mock workspace and tasks
INSERT INTO public.workspaces (id, name, slug)
VALUES ('00000000-0000-0000-0000-000000000001', 'Acme Product Studio', 'acme-studio')
ON CONFLICT DO NOTHING;

INSERT INTO public.projects (id, workspace_id, name, description, color)
VALUES ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Taskflow Core Web App', 'Core project management application', '#4f46e5')
ON CONFLICT DO NOTHING;

-- Seed initial clients
INSERT INTO public.clients (name, contact_person, email, phone, status)
VALUES
  ('Partical Black', 'Sundhar', 'sundar@mail.com', '9876543210', 'active'),
  ('Southern Rescue Services', 'Southern Rescue Services', 'contact@southernrescue.org', '+1 (555) 234-5678', 'active'),
  ('Acme Corporation', 'Acme Corporation', 'billing@acme.corp', '+1 (555) 987-6543', 'active'),
  ('Stripe Payments', 'Stripe Payments', 'enterprise@stripe.com', '+1 (555) 345-6789', 'active'),
  ('Global Dynamics', 'Global Dynamics Inc.', 'partners@globaldynamics.io', '+1 (555) 876-5432', 'active'),
  ('Taskflow Internal', 'Taskflow Inc.', 'ops@taskflow.internal', '+1 (555) 456-7890', 'active')
ON CONFLICT DO NOTHING;

