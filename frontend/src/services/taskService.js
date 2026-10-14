import { supabase, isSupabaseConfigured } from '../lib/supabase';

const TASKS_STORAGE_KEY = 'taskflow_tasks_cache_v1';

const MOCK_TASKS = [
  {
    id: '1',
    key: 'KAN-1',
    title: 'OAuth 2.0 & WorkOS SSO Authentication Provider',
    description: 'Integrate Google, GitHub, and Enterprise SAML SSO providers for team workspaces.',
    status: 'backlog',
    priority: 'medium',
    type: 'story',
    due_date: '2026-11-05',
    project_id: 'p1',
    assignee: 'TR',
  },
  {
    id: '2',
    key: 'KAN-2',
    title: 'Database index tuning & query caching for work items',
    description: 'Index project_id and state_group columns to optimize board load speeds.',
    status: 'backlog',
    priority: 'low',
    type: 'task',
    due_date: '2026-11-10',
    project_id: 'p1',
    assignee: null,
  },
  {
    id: '3',
    key: 'KAN-3',
    title: 'Architecture RFC for Cycles & Timebox Engine',
    description: 'Design data schema and burn-down velocity tracking across 2-week sprint cycles.',
    status: 'todo',
    priority: 'high',
    type: 'story',
    due_date: '2026-10-20',
    project_id: 'p1',
    assignee: 'TR',
  },
  {
    id: '4',
    key: 'KAN-4',
    title: 'Implement Plane 5-state drag-n-drop workflow',
    description: 'Support Backlog, Unstarted, Started, Completed, and Cancelled state groups on the board.',
    status: 'in_progress',
    priority: 'urgent',
    type: 'story',
    due_date: '2026-10-18',
    project_id: 'p1',
    assignee: 'TR',
  },
  {
    id: '5',
    key: 'KAN-5',
    title: 'Burndown velocity chart calculation & cycle progress bar',
    description: 'Calculate real-time completion percentage based on estimate points and completed work items.',
    status: 'in_review',
    priority: 'high',
    type: 'task',
    due_date: '2026-10-19',
    project_id: 'p1',
    assignee: null,
  },
  {
    id: '6',
    key: 'KAN-6',
    title: 'Initialize Taskora dark theme design system',
    description: 'Configure curated tokens matching Plane and Jira styling with seamless contrast.',
    status: 'done',
    priority: 'medium',
    type: 'task',
    due_date: '2026-10-14',
    project_id: 'p1',
    assignee: 'TR',
  },
  {
    id: '7',
    key: 'KAN-7',
    title: 'Deprecate legacy XML task exporter',
    description: 'Standardize export functionality to JSON and CSV formats.',
    status: 'cancelled',
    priority: 'low',
    type: 'task',
    due_date: '2026-10-15',
    project_id: 'p1',
    assignee: null,
  },
];

function getStoredTasks() {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return MOCK_TASKS;
}

function saveStoredTasks(tasks) {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch {}
}

export const taskService = {
  async fetchTasks(projectId) {
    if (!isSupabaseConfigured) {
      const all = getStoredTasks();
      if (projectId) return all.filter((t) => t.project_id === projectId);
      return all;
    }
    try {
      let query = supabase.from('tasks').select('*, profiles(full_name, avatar_url), labels(*)');
      if (projectId) query = query.eq('project_id', projectId);
      const { data, error } = await query;
      if (error) throw error;
      return data && data.length ? data : getStoredTasks();
    } catch {
      return getStoredTasks();
    }
  },
  async createTask(taskData) {
    const newTask = {
      id: Date.now().toString(),
      key: `KAN-${Math.floor(Math.random() * 80) + 3}`,
      type: taskData.type || 'task',
      ...taskData,
    };
    if (!isSupabaseConfigured) {
      const current = getStoredTasks();
      const updated = [newTask, ...current];
      saveStoredTasks(updated);
      return newTask;
    }
    try {
      const { data, error } = await supabase.from('tasks').insert([taskData]).select().single();
      if (error) return newTask;
      return data;
    } catch {
      const current = getStoredTasks();
      saveStoredTasks([newTask, ...current]);
      return newTask;
    }
  },
  async updateTask(id, updates) {
    if (!isSupabaseConfigured) {
      const current = getStoredTasks();
      const updated = current.map((t) => (t.id === id ? { ...t, ...updates } : t));
      saveStoredTasks(updated);
      return { id, ...updates };
    }
    try {
      const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select().single();
      if (error) return { id, ...updates };
      return data;
    } catch {
      const current = getStoredTasks();
      const updated = current.map((t) => (t.id === id ? { ...t, ...updates } : t));
      saveStoredTasks(updated);
      return { id, ...updates };
    }
  },
  async deleteTask(id) {
    if (!isSupabaseConfigured) {
      const current = getStoredTasks();
      const updated = current.filter((t) => t.id !== id);
      saveStoredTasks(updated);
      return true;
    }
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', id);
      if (error) throw error;
      return true;
    } catch {
      const current = getStoredTasks();
      const updated = current.filter((t) => t.id !== id);
      saveStoredTasks(updated);
      return true;
    }
  },
};
