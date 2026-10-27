import { supabase, isSupabaseConfigured } from '../lib/supabase';

const TASKS_STORAGE_KEY = 'taskflow_tasks_cache_v5';

const MOCK_TASKS = [
  // --- Workspace 1: Southern Rescue Services (ws-1) ---
  {
    id: 'srs-1',
    key: 'SRS-1',
    title: 'Deploy mobile dispatch response unit 4',
    description: 'Coordinate field logistics and telemetry equipment for high-priority dispatch.',
    status: 'in_progress',
    priority: 'urgent',
    type: 'story',
    due_date: '2026-10-18',
    project_id: 'proj-101',
    workspace_id: 'ws-1',
    assignee: 'TR',
    reporter: 'Tharun R',
    created_at: '2026-10-13T15:54:00',
    updated_at: '2026-10-14T13:02:00',
  },
  {
    id: 'srs-2',
    key: 'SRS-2',
    title: 'Calibrate thermal drone aerial sensors',
    description: 'Optimize high-altitude infrared sensor sensitivity for nighttime coastal search sweeps.',
    status: 'in_progress',
    priority: 'high',
    type: 'task',
    due_date: '2026-10-23',
    project_id: 'proj-102',
    workspace_id: 'ws-1',
    assignee: null,
    reporter: 'Tharun R',
    created_at: '2026-10-13T15:54:00',
    updated_at: '2026-10-13T15:54:00',
  },
  {
    id: 'srs-3',
    key: 'SRS-3',
    title: 'Verify VHF emergency repeater network',
    description: 'Establish redundant radio relay towers across mountainous sector 7.',
    status: 'todo',
    priority: 'medium',
    type: 'task',
    due_date: null,
    project_id: 'proj-101',
    workspace_id: 'ws-1',
    assignee: null,
    reporter: 'Tharun R',
    created_at: '2026-10-13T15:54:00',
    updated_at: '2026-10-13T15:54:00',
  },
  {
    id: 'srs-4',
    key: 'SRS-4',
    title: 'Automated casualty triage classification system',
    description: 'Integrate real-time patient vitals telemetry directly into the command board.',
    status: 'done',
    priority: 'urgent',
    type: 'story',
    due_date: '2026-10-14',
    project_id: 'proj-103',
    workspace_id: 'ws-1',
    assignee: 'TR',
    reporter: 'Tharun R',
    created_at: '2026-10-13T15:54:00',
    updated_at: '2026-10-14T13:02:00',
  },
  {
    id: 'srs-5',
    key: 'SRS-5',
    title: 'Helicopter evacuation route safety audit',
    description: 'Coordinate with civil aviation authorities for low-altitude landing clearances.',
    status: 'in_review',
    priority: 'high',
    type: 'task',
    due_date: '2026-10-19',
    project_id: 'proj-103',
    workspace_id: 'ws-1',
    assignee: null,
    reporter: 'Tharun R',
    created_at: '2026-10-13T15:54:00',
    updated_at: '2026-10-14T13:02:00',
  },
  {
    id: 'srs-6',
    key: 'SRS-6',
    title: 'Replenish disaster relief supply caches',
    description: 'Audit life-support kits, emergency ration packs, and water filtration equipment.',
    status: 'backlog',
    priority: 'low',
    type: 'task',
    due_date: '2026-10-25',
    project_id: 'proj-101',
    workspace_id: 'ws-1',
    assignee: null,
    reporter: 'Tharun R',
    created_at: '2026-10-13T15:54:00',
    updated_at: '2026-10-14T13:02:00',
  },

  // --- Workspace 2: Acme Product Studio (ws-2) ---
  {
    id: 'acme-1',
    key: 'ACME-1',
    title: 'OAuth 2.0 & WorkOS SSO Authentication Provider',
    description: 'Implement enterprise single sign-on with SAML and OIDC support.',
    status: 'in_progress',
    priority: 'urgent',
    type: 'story',
    due_date: '2026-10-18',
    project_id: 'proj-201',
    workspace_id: 'ws-2',
    assignee: 'TR',
    reporter: 'Tharun R',
    created_at: '2026-10-13T15:54:00',
    updated_at: '2026-10-14T13:02:00',
  },
  {
    id: 'acme-2',
    key: 'ACME-2',
    title: 'Database index tuning & query caching for work items',
    description: 'Improve response latency across high-throughput table projections.',
    status: 'in_progress',
    priority: 'high',
    type: 'task',
    due_date: '2026-10-23',
    project_id: 'proj-201',
    workspace_id: 'ws-2',
    assignee: null,
    reporter: 'Tharun R',
    created_at: '2026-10-13T15:54:00',
    updated_at: '2026-10-13T15:54:00',
  },
  {
    id: 'acme-3',
    key: 'ACME-3',
    title: 'Implement Plane 5-state drag-n-drop workflow',
    description: 'Support Backlog, Unstarted, Started, Completed, and Cancelled state groups.',
    status: 'done',
    priority: 'urgent',
    type: 'story',
    due_date: '2026-10-15',
    project_id: 'proj-202',
    workspace_id: 'ws-2',
    assignee: 'TR',
    reporter: 'Tharun R',
    created_at: '2026-10-13T15:54:00',
    updated_at: '2026-10-14T13:02:00',
  },
  {
    id: 'acme-4',
    key: 'ACME-4',
    title: 'Burndown velocity calculation & cycle progress bar',
    description: 'Calculate real-time completion percentage based on story points and velocity.',
    status: 'in_review',
    priority: 'medium',
    type: 'task',
    due_date: '2026-10-20',
    project_id: 'proj-204',
    workspace_id: 'ws-2',
    assignee: null,
    reporter: 'Tharun R',
    created_at: '2026-10-13T15:54:00',
    updated_at: '2026-10-14T13:02:00',
  },
  {
    id: 'acme-5',
    key: 'ACME-5',
    title: 'Stripe webhook payment failure recovery flow',
    description: 'Handle customer dunning emails and automatic credit card retry logic.',
    status: 'todo',
    priority: 'high',
    type: 'task',
    due_date: '2026-10-28',
    project_id: 'proj-203',
    workspace_id: 'ws-2',
    assignee: null,
    reporter: 'Tharun R',
    created_at: '2026-10-13T15:54:00',
    updated_at: '2026-10-14T13:02:00',
  },
  {
    id: 'acme-6',
    key: 'ACME-6',
    title: 'Dark mode design tokens unification',
    description: 'Synchronize color contrast ratios to meet WCAG AA requirements.',
    status: 'done',
    priority: 'low',
    type: 'task',
    due_date: '2026-10-14',
    project_id: 'proj-202',
    workspace_id: 'ws-2',
    assignee: 'TR',
    reporter: 'Tharun R',
    created_at: '2026-10-13T15:54:00',
    updated_at: '2026-10-14T13:02:00',
  },
  {
    id: 'acme-7',
    key: 'ACME-7',
    title: 'Deprecate legacy XML data exporter',
    description: 'Transition all customer export requests to JSON and CSV endpoints.',
    status: 'backlog',
    priority: 'none',
    type: 'task',
    due_date: '2026-10-30',
    project_id: 'proj-201',
    workspace_id: 'ws-2',
    assignee: null,
    reporter: 'Tharun R',
    created_at: '2026-10-13T15:54:00',
    updated_at: '2026-10-14T13:02:00',
  },

  // --- Workspace 3: Mobile App Labs (ws-3) ---
  {
    id: 'mob-1',
    key: 'MOB-1',
    title: 'SwiftUI NavigationStack rewrite for iOS 18',
    description: 'Modernize view hierarchies and deep-linking routing paths.',
    status: 'in_progress',
    priority: 'urgent',
    type: 'task',
    due_date: '2026-10-22',
    project_id: 'proj-301',
    workspace_id: 'ws-3',
    assignee: 'TR',
    reporter: 'Tharun R',
    created_at: '2026-10-13T15:54:00',
    updated_at: '2026-10-14T13:02:00',
  },
  {
    id: 'mob-2',
    key: 'MOB-2',
    title: 'Android Jetpack Compose theme synchronization',
    description: 'Integrate dynamic Material You palette tokens for Android 15.',
    status: 'in_progress',
    priority: 'high',
    type: 'story',
    due_date: '2026-10-26',
    project_id: 'proj-302',
    workspace_id: 'ws-3',
    assignee: null,
    reporter: 'Tharun R',
    created_at: '2026-10-13T15:54:00',
    updated_at: '2026-10-13T15:54:00',
  },
  {
    id: 'mob-3',
    key: 'MOB-3',
    title: 'Push notification payload routing via FCM',
    description: 'Support interactive background notifications and badges.',
    status: 'done',
    priority: 'urgent',
    type: 'story',
    due_date: '2026-10-12',
    project_id: 'proj-301',
    workspace_id: 'ws-3',
    assignee: 'TR',
    reporter: 'Tharun R',
    created_at: '2026-10-13T15:54:00',
    updated_at: '2026-10-14T13:02:00',
  },
  {
    id: 'mob-4',
    key: 'MOB-4',
    title: 'Biometric FaceID / Fingerprint lock screen',
    description: 'Hardware keychain integration with LocalAuthentication framework.',
    status: 'in_review',
    priority: 'medium',
    type: 'task',
    due_date: '2026-10-21',
    project_id: 'proj-301',
    workspace_id: 'ws-3',
    assignee: null,
    reporter: 'Tharun R',
    created_at: '2026-10-13T15:54:00',
    updated_at: '2026-10-14T13:02:00',
  },
  {
    id: 'mob-5',
    key: 'MOB-5',
    title: 'SQLite local sync queue and conflict resolver',
    description: 'Implement optimistic mutations with automatic server reconciliation.',
    status: 'todo',
    priority: 'high',
    type: 'task',
    due_date: '2026-10-29',
    project_id: 'proj-303',
    workspace_id: 'ws-3',
    assignee: null,
    reporter: 'Tharun R',
    created_at: '2026-10-13T15:54:00',
    updated_at: '2026-10-14T13:02:00',
  },
  {
    id: 'mob-6',
    key: 'MOB-6',
    title: 'Bluetooth Low Energy peripheral beacon listener',
    description: 'Background proximity detection for localized workplace check-ins.',
    status: 'backlog',
    priority: 'low',
    type: 'task',
    due_date: '2026-11-04',
    project_id: 'proj-302',
    workspace_id: 'ws-3',
    assignee: null,
    reporter: 'Tharun R',
    created_at: '2026-10-13T15:54:00',
    updated_at: '2026-10-14T13:02:00',
  },
];

function getStoredTasks() {
  const teamMemberPool = ['Maria Garcia', 'David Chen', 'Sophie Taylor', 'Liam Wilson'];
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const enriched = parsed.map((t, idx) => {
          if (!t.created_by) {
            return { ...t, created_by: teamMemberPool[idx % teamMemberPool.length] };
          }
          return t;
        });
        if (isSupabaseConfigured) {
          return enriched.filter(
            (t) =>
              !t.id?.toString().startsWith('srs-') &&
              !t.id?.toString().startsWith('acme-') &&
              !t.id?.toString().startsWith('mob-')
          );
        }
        return enriched;
      }
    }
  } catch {}
  return isSupabaseConfigured
    ? []
    : MOCK_TASKS.map((t, idx) => ({
        ...t,
        created_by: t.created_by || teamMemberPool[idx % teamMemberPool.length],
      }));
}

function saveStoredTasks(tasks) {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch {}
}

export const taskService = {
  async fetchTasks(projectId = null, workspaceId = null) {
    if (!isSupabaseConfigured) {
      let all = getStoredTasks();
      if (workspaceId) {
        all = all.filter((t) => !t.workspace_id || t.workspace_id === workspaceId);
      }
      if (projectId) {
        all = all.filter((t) => t.project_id === projectId);
      }
      return all;
    }
    try {
      let query = supabase.from('tasks').select('*, projects(id, name, workspace_id)');
      if (projectId) query = query.eq('project_id', projectId);
      const { data, error } = await query;
      if (error) throw error;
      const teamMemberPool = ['Maria Garcia', 'David Chen', 'Sophie Taylor', 'Liam Wilson'];
      let tasks = (data || []).map((t, idx) => ({
        ...t,
        workspace_id: t.workspace_id || t.projects?.workspace_id,
        project_name: t.projects?.name,
        created_by: t.created_by || teamMemberPool[idx % teamMemberPool.length],
        key: t.key || `TASK-${(t.id || '').slice(0, 4) || idx + 1}`,
      }));
      if (workspaceId) {
        tasks = tasks.filter((t) => t.workspace_id === workspaceId);
      }
      return tasks;
    } catch (err) {
      console.warn('Supabase fetch tasks error:', err);
      let all = getStoredTasks();
      if (workspaceId) all = all.filter((t) => !t.workspace_id || t.workspace_id === workspaceId);
      if (projectId) all = all.filter((t) => t.project_id === projectId);
      return all;
    }
  },

  async createTask(taskData) {
    const isUuid = (val) => typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

    const defaultPrefix =
      taskData.workspace_id === 'ws-1'
        ? 'SRS'
        : taskData.workspace_id === 'ws-3'
        ? 'MOB'
        : 'ACME';

    const localNewTask = {
      id: 'task-' + Date.now(),
      workspace_id: taskData.workspace_id || 'ws-1',
      key: `${defaultPrefix}-${Math.floor(Math.random() * 80) + 10}`,
      type: taskData.type || 'task',
      priority: taskData.priority || 'medium',
      status: taskData.status || 'todo',
      created_by: taskData.created_by || 'Maria Garcia',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...taskData,
    };

    // Always immediately save to local cache
    const current = getStoredTasks();
    const updated = [localNewTask, ...current.filter((t) => t.id !== localNewTask.id)];
    saveStoredTasks(updated);

    if (isSupabaseConfigured) {
      try {
        let resolvedProjectId = isUuid(taskData.project_id) ? taskData.project_id : null;
        if (!resolvedProjectId) {
          if (isUuid(taskData.workspace_id)) {
            const { data: prjs } = await supabase.from('projects').select('id, name').eq('workspace_id', taskData.workspace_id).limit(1);
            if (prjs && prjs.length > 0) resolvedProjectId = prjs[0].id;
          }
          if (!resolvedProjectId) {
            const { data: anyPrj } = await supabase.from('projects').select('id, name').limit(1);
            if (anyPrj && anyPrj.length > 0) resolvedProjectId = anyPrj[0].id;
          }
        }

        const insertPayload = {
          title: taskData.title?.trim() || 'Untitled Task',
          description: taskData.description?.trim() || null,
          status: ['backlog', 'todo', 'in_progress', 'in_review', 'done', 'cancelled'].includes(taskData.status) ? taskData.status : 'todo',
          priority: ['low', 'medium', 'high', 'urgent'].includes(taskData.priority) ? taskData.priority : 'medium',
          project_id: resolvedProjectId,
          due_date: taskData.due_date ? new Date(taskData.due_date).toISOString() : null,
          start_date: taskData.start_date ? new Date(taskData.start_date).toISOString() : null,
          assignee_id: isUuid(taskData.assignee_id) ? taskData.assignee_id : null,
        };

        const { data, error } = await supabase
          .from('tasks')
          .insert([insertPayload])
          .select('*, projects(id, name, workspace_id)')
          .single();

        if (error) {
          console.error('Supabase task insert error:', error);
          throw new Error('Supabase task insert failed: ' + error.message);
        } else if (data) {
          const formatted = {
            ...localNewTask,
            ...data,
            id: data.id,
            workspace_id: data.workspace_id || data.projects?.workspace_id || localNewTask.workspace_id,
            project_name: data.projects?.name || taskData.project_name,
            key: `TASK-${(data.id || '').slice(0, 4)}`,
          };
          const synced = [formatted, ...current.filter((t) => t.id !== localNewTask.id && t.id !== formatted.id)];
          saveStoredTasks(synced);
          return formatted;
        }
      } catch (err) {
        console.error('Supabase task insert error:', err);
        throw err;
      }
    }

    return localNewTask;
  },

  async updateTask(id, updates) {
    const isUuid = (val) => typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
    const current = getStoredTasks();
    const updated = current.map((t) => (t.id === id ? { ...t, ...updates, updated_at: new Date().toISOString() } : t));
    saveStoredTasks(updated);

    if (isSupabaseConfigured && isUuid(id)) {
      try {
        const allowed = ['title', 'description', 'status', 'priority', 'project_id', 'due_date', 'start_date', 'assignee_id', 'order_index'];
        const payload = {};
        for (const col of allowed) {
          if (updates[col] !== undefined) {
            payload[col] = updates[col];
          }
        }
        if (payload.due_date === '') payload.due_date = null;
        if (payload.start_date === '') payload.start_date = null;
        if (payload.status && !['backlog', 'todo', 'in_progress', 'in_review', 'done', 'cancelled'].includes(payload.status)) {
          delete payload.status;
        }
        if (payload.priority && !['low', 'medium', 'high', 'urgent'].includes(payload.priority)) {
          delete payload.priority;
        }
        if (Object.keys(payload).length > 0) {
          const { data, error } = await supabase
            .from('tasks')
            .update(payload)
            .eq('id', id)
            .select('*, projects(id, name, workspace_id)')
            .single();

          if (error) {
            console.error('Supabase task update error:', error);
            throw new Error('Supabase task update failed: ' + error.message);
          } else if (data) {
            const formatted = {
              ...data,
              workspace_id: data.workspace_id || data.projects?.workspace_id,
              project_name: data.projects?.name,
            };
            const synced = current.map((t) => (t.id === id ? { ...t, ...formatted } : t));
            saveStoredTasks(synced);
            return formatted;
          }
        }
      } catch (err) {
        console.error('Supabase task update error:', err);
        throw err;
      }
    }

    return { id, ...updates };
  },

  async deleteTask(id) {
    const isUuid = (val) => typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
    const current = getStoredTasks();
    const updated = current.filter((t) => t.id !== id);
    saveStoredTasks(updated);

    if (isSupabaseConfigured && isUuid(id)) {
      try {
        const { error } = await supabase.from('tasks').delete().eq('id', id);
        if (error) {
          console.error('Supabase task delete failed:', error);
          throw new Error('Supabase task delete failed: ' + error.message);
        }
      } catch (err) {
        console.error('Supabase task delete error:', err);
        throw err;
      }
    }

    return true;
  },
};
