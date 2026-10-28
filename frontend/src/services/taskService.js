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

const MOCK_TASKS = [];

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
  return [];
}

export function saveStoredTasks(tasks, emitEvent = true) {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    if (emitEvent && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('taskflow_tasks_updated', { detail: tasks }));
    }
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

      const localTasks = getStoredTasks();
      if (normWorkspaceId) {
        const otherWorkspaceTasks = localTasks.filter(
          (t) => t.workspace_id && normalizeWorkspaceId(t.workspace_id) !== normWorkspaceId
        );
        saveStoredTasks([...tasks, ...otherWorkspaceTasks], false);
      } else {
        saveStoredTasks(tasks, false);
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
    saveStoredTasks(updated, true);

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

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('taskflow_tasks_updated', { detail: { id, deleted: true } }));
    }

    return true;
  },
};
