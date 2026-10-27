import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { userService } from './userService';

/**
 * Determines whether a given task was created by (or assigned to) a specific user.
 * Supports matching across User ID, Email, Full Name, Reporter, and Assignee (for team member self-assignment).
 */
export function isTaskCreatedByUser(task, user) {
  if (!task || !user) return false;

  const targetId = user.id ? String(user.id).trim().toLowerCase() : null;
  const targetEmail = user.email ? user.email.trim().toLowerCase() : null;
  const targetName = user.name ? user.name.trim().toLowerCase() : null;
  const targetAvatar = user.avatar ? user.avatar.trim().toLowerCase() : null;

  // 1. Direct ID match
  if (targetId) {
    if (task.created_by_id && String(task.created_by_id).trim().toLowerCase() === targetId) return true;
    if (task.reporter_id && String(task.reporter_id).trim().toLowerCase() === targetId) return true;
    if (task.user_id && String(task.user_id).trim().toLowerCase() === targetId) return true;
    if (task.creator_id && String(task.creator_id).trim().toLowerCase() === targetId) return true;
    if (task.assignee_id && String(task.assignee_id).trim().toLowerCase() === targetId) return true;
  }

  // 2. Email match
  if (targetEmail) {
    if (task.created_by_email && task.created_by_email.trim().toLowerCase() === targetEmail) return true;
    if (task.reporter_email && task.reporter_email.trim().toLowerCase() === targetEmail) return true;
    if (task.assignee_email && task.assignee_email.trim().toLowerCase() === targetEmail) return true;
  }

  // 3. Name match
  if (targetName) {
    if (task.created_by && task.created_by.trim().toLowerCase() === targetName) return true;
    if (task.reporter && task.reporter.trim().toLowerCase() === targetName) return true;
    if (task.assignee && task.assignee.trim().toLowerCase() === targetName) return true;
  }

  // 4. Avatar/Initials match (e.g. badge "RA" on ACME-60 for Aadhi Rajini)
  const initials = targetName
    ? targetName.split(' ').map((n) => n[0]).join('').toLowerCase()
    : null;

  if (task.assignee) {
    const cleanAssignee = task.assignee.trim().toLowerCase();
    if (targetAvatar && cleanAssignee === targetAvatar) return true;
    if (initials && cleanAssignee === initials) return true;
  }

  return false;
}

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
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        if (isSupabaseConfigured) {
          return parsed.filter(
            (t) =>
              !t.id?.toString().startsWith('srs-') &&
              !t.id?.toString().startsWith('acme-') &&
              !t.id?.toString().startsWith('mob-')
          );
        }
        return parsed;
      }
    }
  } catch {}
  return isSupabaseConfigured ? [] : MOCK_TASKS;
}

function saveStoredTasks(tasks) {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch {}
}

export const normalizeWorkspaceId = (wsId) => {
  if (!wsId) return '00000000-0000-0000-0000-000000000020';
  const clean = String(wsId).trim().toLowerCase();
  if (clean === '4rged' || clean === 'ws-1' || clean === '00000000-0000-0000-0000-000000000020') {
    return '00000000-0000-0000-0000-000000000020';
  }
  if (clean === 'acme-studio' || clean === 'ws-2' || clean === '00000000-0000-0000-0000-000000000010') {
    return '00000000-0000-0000-0000-000000000010';
  }
  return wsId;
};

export const taskService = {
  async fetchTasks(projectId = null, workspaceId = null) {
    const normWorkspaceId = workspaceId ? normalizeWorkspaceId(workspaceId) : null;

    if (!isSupabaseConfigured) {
      let all = getStoredTasks();
      if (normWorkspaceId) {
        all = all.filter((t) => !t.workspace_id || normalizeWorkspaceId(t.workspace_id) === normWorkspaceId);
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
      const allUsers = userService.getUsers();
      let tasks = (data || []).map((t, idx) => {
        const reporterUser = allUsers.find(
          (u) => u.id === t.reporter_id || (t.reporter_id && u.email === t.reporter_id)
        );
        const assigneeUser = allUsers.find(
          (u) => u.id === t.assignee_id || (t.assignee_id && u.email === t.assignee_id)
        );
        const taskWsId = normalizeWorkspaceId(t.workspace_id || t.projects?.workspace_id);
        return {
          ...t,
          workspace_id: taskWsId,
          project_name: t.projects?.name,
          created_by: reporterUser?.name || t.created_by || assigneeUser?.name || 'Admin',
          created_by_id: t.reporter_id || reporterUser?.id || t.created_by_id || null,
          created_by_email: reporterUser?.email || t.created_by_email || null,
          reporter: reporterUser?.name || t.reporter || 'Admin',
          reporter_id: t.reporter_id || reporterUser?.id || null,
          assignee: assigneeUser?.name || t.assignee || 'Unassigned',
          assignee_id: t.assignee_id || assigneeUser?.id || null,
          key: t.key || `TASK-${(t.id || '').slice(0, 4) || idx + 1}`,
        };
      });

      // Two-way synchronization: If any local tasks exist that were not saved to Supabase (starts with 'task-'), sync them!
      const localTasks = getStoredTasks();
      const unsynced = localTasks.filter((lt) => lt && String(lt.id).startsWith('task-'));
      for (const un of unsynced) {
        if (!tasks.some((rt) => rt.title === un.title && rt.status === un.status)) {
          this.createTask(un).then((created) => {
            if (created) tasks.unshift(created);
          }).catch(() => {});
        }
      }

      if (normWorkspaceId) {
        tasks = tasks.filter((t) => !t.workspace_id || normalizeWorkspaceId(t.workspace_id) === normWorkspaceId);
      }
      return tasks;
    } catch (err) {
      console.warn('Supabase fetch tasks error:', err);
      let all = getStoredTasks();
      if (normWorkspaceId) all = all.filter((t) => !t.workspace_id || normalizeWorkspaceId(t.workspace_id) === normWorkspaceId);
      if (projectId) all = all.filter((t) => t.project_id === projectId);
      return all;
    }
  },

  async createTask(taskData) {
    const isUuid = (val) => typeof val === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
    const normWsId = normalizeWorkspaceId(taskData.workspace_id);

    const defaultPrefix =
      normWsId === '00000000-0000-0000-0000-000000000020'
        ? 'ACME'
        : 'SRS';

    const localNewTask = {
      id: 'task-' + Date.now(),
      workspace_id: normWsId,
      key: `${defaultPrefix}-${Math.floor(Math.random() * 80) + 10}`,
      type: taskData.type || 'task',
      priority: taskData.priority || 'medium',
      status: taskData.status || 'todo',
      created_by: taskData.created_by || taskData.reporter || 'Admin',
      created_by_id: taskData.created_by_id || null,
      created_by_email: taskData.created_by_email || null,
      created_by_role: taskData.created_by_role || 'team_member',
      reporter: taskData.reporter || taskData.created_by || 'Admin',
      reporter_id: taskData.reporter_id || taskData.created_by_id || null,
      assignee: taskData.assignee || 'Unassigned',
      assignee_id: taskData.assignee_id || null,
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
          const { data: prjs } = await supabase.from('projects').select('id, name').eq('workspace_id', normWsId).limit(1);
          if (prjs && prjs.length > 0) resolvedProjectId = prjs[0].id;
          
          if (!resolvedProjectId) {
            const { data: anyPrj } = await supabase.from('projects').select('id, name').limit(1);
            if (anyPrj && anyPrj.length > 0) resolvedProjectId = anyPrj[0].id;
          }
        }

        // Robust resolution of assignee_id and reporter_id
        let resolvedAssigneeId = isUuid(taskData.assignee_id) ? taskData.assignee_id : null;
        if (!resolvedAssigneeId && taskData.assignee) {
          const found = userService.getUsers().find(
            (u) =>
              (u.id && isUuid(u.id) && u.id === taskData.assignee) ||
              (u.name && u.name.toLowerCase() === taskData.assignee.toLowerCase()) ||
              (u.avatar && u.avatar.toLowerCase() === taskData.assignee.toLowerCase()) ||
              (u.email && u.email.toLowerCase() === taskData.assignee.toLowerCase())
          );
          if (found && isUuid(found.id)) resolvedAssigneeId = found.id;
        }

        let resolvedReporterId = isUuid(taskData.reporter_id) ? taskData.reporter_id : (isUuid(taskData.created_by_id) ? taskData.created_by_id : null);
        if (!resolvedReporterId && (taskData.reporter || taskData.created_by || taskData.created_by_email)) {
          const term = (taskData.created_by_email || taskData.reporter || taskData.created_by || '').toLowerCase();
          const found = userService.getUsers().find(
            (u) =>
              (u.id && isUuid(u.id) && u.id === term) ||
              (u.email && u.email.toLowerCase() === term) ||
              (u.name && u.name.toLowerCase() === term) ||
              (u.avatar && u.avatar.toLowerCase() === term)
          );
          if (found && isUuid(found.id)) resolvedReporterId = found.id;
        }

        const insertPayload = {
          title: taskData.title?.trim() || 'Untitled Task',
          description: taskData.description?.trim() || null,
          status: ['backlog', 'todo', 'in_progress', 'in_review', 'done', 'cancelled'].includes(taskData.status) ? taskData.status : 'todo',
          priority: ['low', 'medium', 'high', 'urgent'].includes(taskData.priority) ? taskData.priority : 'medium',
          project_id: resolvedProjectId,
          due_date: taskData.due_date ? new Date(taskData.due_date).toISOString() : null,
          start_date: taskData.start_date ? new Date(taskData.start_date).toISOString() : null,
          assignee_id: resolvedAssigneeId,
          reporter_id: resolvedReporterId,
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
