import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { userService } from './userService';

const PROJECTS_STORAGE_KEY = 'taskflow_manage_projects_list_v4';

const SEED_WORKSPACE_IDS = {
  WS1: '00000000-0000-0000-0000-000000000001',
  WS2: '00000000-0000-0000-0000-000000000010',
  WS3: '00000000-0000-0000-0000-000000000003',
};

const normalizeWorkspaceId = (id) => {
  if (!id) return SEED_WORKSPACE_IDS.WS1;
  if (id === 'ws-1') return SEED_WORKSPACE_IDS.WS1;
  if (id === 'ws-2') return SEED_WORKSPACE_IDS.WS2;
  if (id === 'ws-3') return SEED_WORKSPACE_IDS.WS3;
  return id;
};

const MOCK_PROJECTS = [
  // --- Workspace 1: Southern Rescue Services ---
  {
    id: '00000000-0000-0000-0000-000000000101',
    key: 'SRS-PROJ-1',
    name: 'Emergency Field Dispatch',
    description: 'Real-time emergency unit routing and dispatch coordination system.',
    color: '#0C66E4',
    task_count: 6,
    completed_count: 1,
    status: 'in_progress',
    duration: 'Nov 12, 2026',
    workspace_id: SEED_WORKSPACE_IDS.WS1,
    member_ids: ['usr-admin', 'usr-2'],
    moreCount: 0,
  },
  {
    id: '00000000-0000-0000-0000-000000000102',
    key: 'SRS-PROJ-2',
    name: 'Search & Rescue Drone Fleet',
    description: 'Thermal-imaging automated aerial grid search flights and beacon locator.',
    color: '#0055CC',
    task_count: 4,
    completed_count: 2,
    status: 'in_progress',
    duration: 'Dec 05, 2026',
    workspace_id: SEED_WORKSPACE_IDS.WS1,
    member_ids: ['usr-2', 'usr-3'],
    moreCount: 0,
  },
  {
    id: '00000000-0000-0000-0000-000000000103',
    key: 'SRS-PROJ-3',
    name: 'Helicopter Evacuation Network',
    description: 'Urgent hospital transfer logistics, helipad flight tracking and clearance.',
    color: '#10B981',
    task_count: 5,
    completed_count: 4,
    status: 'complete',
    duration: 'Oct 30, 2026',
    workspace_id: SEED_WORKSPACE_IDS.WS1,
    member_ids: ['usr-admin', 'usr-4'],
    moreCount: 0,
  },

  // --- Workspace 2: Acme Product Studio ---
  {
    id: '00000000-0000-0000-0000-000000000020',
    key: 'ACME-PROJ-1',
    name: 'Taskora Core Web App',
    description: 'Next-gen collaborative project dashboard and planning board.',
    color: '#7C3AED',
    task_count: 14,
    completed_count: 8,
    status: 'in_progress',
    duration: 'Nov 18, 2026',
    workspace_id: SEED_WORKSPACE_IDS.WS2,
    member_ids: ['usr-admin', 'usr-2', 'usr-3'],
    moreCount: 0,
  },
  {
    id: '00000000-0000-0000-0000-000000000202',
    key: 'ACME-PROJ-2',
    name: 'Design System & UI Library',
    description: 'Accessible React UI components and dark mode tokens matching Plane/Jira.',
    color: '#6366F1',
    task_count: 7,
    completed_count: 5,
    status: 'in_progress',
    duration: 'Nov 22, 2026',
    workspace_id: SEED_WORKSPACE_IDS.WS2,
    member_ids: ['usr-2', 'usr-5'],
    moreCount: 0,
  },
  {
    id: '00000000-0000-0000-0000-000000000203',
    key: 'ACME-PROJ-3',
    name: 'Payment Gateway & Billing',
    description: 'Stripe subscription portal, checkout sessions, and invoice generator.',
    color: '#F59E0B',
    task_count: 6,
    completed_count: 2,
    status: 'on_hold',
    duration: 'Dec 15, 2026',
    workspace_id: SEED_WORKSPACE_IDS.WS2,
    member_ids: ['usr-admin', 'usr-6'],
    moreCount: 0,
  },

  // --- Workspace 3: Mobile App Labs ---
  {
    id: '00000000-0000-0000-0000-000000000301',
    key: 'MOB-PROJ-1',
    name: 'iOS Native Client',
    description: 'SwiftUI companion app with widgets, lock screen live activities, and quick capture.',
    color: '#10B981',
    task_count: 9,
    completed_count: 4,
    status: 'in_progress',
    duration: 'Nov 25, 2026',
    workspace_id: SEED_WORKSPACE_IDS.WS3,
    member_ids: ['usr-2', 'usr-4'],
    moreCount: 0,
  },
  {
    id: '00000000-0000-0000-0000-000000000302',
    key: 'MOB-PROJ-2',
    name: 'Android Jetpack App',
    description: 'Material 3 native Android client for tablet and mobile devices.',
    color: '#06B6D4',
    task_count: 7,
    completed_count: 3,
    status: 'in_progress',
    duration: 'Dec 10, 2026',
    workspace_id: SEED_WORKSPACE_IDS.WS3,
    member_ids: ['usr-admin', 'usr-3', 'usr-5'],
    moreCount: 0,
  },
];

function getStoredProjects() {
  try {
    const raw = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        if (isSupabaseConfigured) {
          return parsed.filter(
            (p) =>
              !p.id?.toString().startsWith('SRS-') &&
              !p.id?.toString().startsWith('00000000-0000-0000-0000-000000000') &&
              !['proj-101', 'proj-102', 'proj-201', 'proj-301', 'proj-302'].includes(p.id)
          );
        }
        return parsed.map((p) => ({
          ...p,
          workspace_id: normalizeWorkspaceId(p.workspace_id),
        }));
      }
    }
  } catch {}
  return isSupabaseConfigured ? [] : MOCK_PROJECTS;
}

function saveStoredProjects(projects) {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
  } catch {}
}

const mapRemoteProject = (row) => ({
  id: row.id,
  workspace_id: row.workspace_id,
  name: row.name,
  description: row.description || '',
  color: row.color || '#0C66E4',
  key: 'PROJ-' + (row.id.replace(/-/g, '').slice(0, 4).toUpperCase()),
  start_date: row.start_date,
  end_date: row.end_date,
  duration: row.end_date
    ? new Date(row.end_date + (row.end_date.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : row.start_date
    ? new Date(row.start_date + (row.start_date.includes('T') ? '' : 'T00:00:00')).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Nov 20, 2026',
  client: row.client || 'Acme Corporation',
  budget: row.budget || '',
  estimatedHours: row.estimated_hours || '',
  tag: row.tag || 'General',
  status: row.status || 'in_progress',
  imageUrl: row.image_url || null,
  project_manager_id: row.project_manager_id || null,
  task_count: 0,
  completed_count: 0,
  moreCount: 0,
  members: [],
  member_ids: [],
  memberIds: [],
});

export const projectService = {
  getInitialProjects() {
    return getStoredProjects();
  },

  async fetchProjects(workspaceId = null) {
    const normWorkspaceId = workspaceId ? normalizeWorkspaceId(workspaceId) : null;

    if (!isSupabaseConfigured) {
      let all = getStoredProjects();
      if (normWorkspaceId) {
        all = all.filter((p) => !p.workspace_id || p.workspace_id === normWorkspaceId);
      }
      return all;
    }

    try {
      let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
      if (normWorkspaceId) {
        query = query.eq('workspace_id', normWorkspaceId);
      }
      const { data: remoteData, error } = await query;
      if (error) throw error;

      const remoteProjects = (remoteData || []).map(mapRemoteProject);
      const stored = getStoredProjects();

      // Merge remote projects with local UI details (members, member_ids, manager)
      const merged = remoteProjects.map((rp) => {
        const localMatch = stored.find((lp) => lp.id === rp.id || lp.name === rp.name);
        const members = localMatch?.members || rp.members || [];
        const memberIds = localMatch?.memberIds || localMatch?.member_ids || rp.member_ids || [];
        return {
          ...rp,
          members,
          member_ids: memberIds,
          memberIds,
          project_manager_id: localMatch?.project_manager_id || rp.project_manager_id || null,
        };
      });

      saveStoredProjects(merged);
      return merged;
    } catch (err) {
      console.warn('Supabase fetch projects error, using cached storage:', err);
      let all = getStoredProjects();
      if (normWorkspaceId) {
        all = all.filter((p) => !p.workspace_id || p.workspace_id === normWorkspaceId);
      }
      return all;
    }
  },

  async createProject(project) {
    const wsId = normalizeWorkspaceId(project.workspace_id);

    const dbPayload = {
      workspace_id: wsId,
      name: project.name?.trim(),
      description: project.description?.trim() || '',
      color: project.color || '#0C66E4',
      start_date: project.start_date || null,
      end_date: project.end_date || null,
      image_url: project.imageUrl || project.image_url || null,
      client: project.client || null,
      budget: project.budget || null,
      estimated_hours: project.estimatedHours || project.estimated_hours || null,
      tag: project.tag || 'General',
      status: project.status || 'in_progress',
    };

    let remoteRecord = null;
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('projects')
          .insert([dbPayload])
          .select()
          .single();

        if (error) {
          console.error('Supabase project insert failed:', error);
        } else if (data) {
          remoteRecord = data;
        }
      } catch (supaErr) {
        console.error('Supabase project insert error:', supaErr);
      }
    }

    const assignedId = remoteRecord
      ? remoteRecord.id
      : (typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : '00000000-0000-0000-0000-' + Date.now().toString().padStart(12, '0'));

    const finalProject = {
      ...project,
      ...dbPayload,
      id: assignedId,
      key: project.key || ('PROJ-' + assignedId.replace(/-/g, '').slice(0, 4).toUpperCase()),
      duration: project.duration || (project.end_date || 'Nov 20, 2026'),
      task_count: 0,
      completed_count: 0,
      moreCount: 0,
      members: project.members || [],
      member_ids: project.member_ids || project.memberIds || (project.members ? project.members.map((m) => m.id) : []),
      memberIds: project.memberIds || project.member_ids || (project.members ? project.members.map((m) => m.id) : []),
    };

    const current = getStoredProjects();
    const updated = [finalProject, ...current.filter((p) => p.id !== finalProject.id)];
    saveStoredProjects(updated);

    return finalProject;
  },

  async deleteProject(id) {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('projects').delete().eq('id', id);
      } catch (err) {
        console.warn('Failed to delete project in Supabase:', err);
      }
    }
    const current = getStoredProjects();
    const updated = current.filter((p) => p.id !== id);
    saveStoredProjects(updated);
    return true;
  },

  async updateProject(id, updates) {
    if (isSupabaseConfigured) {
      try {
        const dbUpdates = {};
        if (updates.name) dbUpdates.name = updates.name;
        if (updates.description !== undefined) dbUpdates.description = updates.description;
        if (updates.status) dbUpdates.status = updates.status;
        if (updates.color) dbUpdates.color = updates.color;
        if (updates.client) dbUpdates.client = updates.client;
        if (updates.start_date) dbUpdates.start_date = updates.start_date;
        if (updates.end_date) dbUpdates.end_date = updates.end_date;
        if (updates.budget) dbUpdates.budget = updates.budget;
        if (updates.estimatedHours || updates.estimated_hours) {
          dbUpdates.estimated_hours = updates.estimatedHours || updates.estimated_hours;
        }
        if (Object.keys(dbUpdates).length > 0) {
          await supabase.from('projects').update(dbUpdates).eq('id', id);
        }
      } catch (err) {
        console.warn('Failed to update project in Supabase:', err);
      }
    }
    const current = getStoredProjects();
    const updated = current.map((p) => (p.id === id ? { ...p, ...updates } : p));
    saveStoredProjects(updated);
    return { id, ...updates };
  },
};

/**
 * Verify if a project is assigned to a specific user by their email or ID.
 */
export const isProjectAssignedToEmail = (project, userEmail, userId = null) => {
  if (!userEmail && !userId) return false;
  const cleanEmail = userEmail?.trim().toLowerCase();

  // 1. Check project.members array (objects or strings)
  if (Array.isArray(project.members) && project.members.length > 0) {
    const isMember = project.members.some((m) => {
      if (!m) return false;
      if (typeof m === 'string') {
        return (cleanEmail && m.trim().toLowerCase() === cleanEmail) || (userId && m === userId);
      }
      if (typeof m === 'object') {
        const memEmail = m.email?.trim().toLowerCase();
        return (cleanEmail && memEmail === cleanEmail) || (userId && m.id === userId);
      }
      return false;
    });
    if (isMember) return true;
  }

  // 2. Check project.member_ids array
  if (Array.isArray(project.member_ids) && project.member_ids.length > 0) {
    if (userId && project.member_ids.includes(userId)) return true;
    try {
      const allUsers = userService.getUsers();
      const hasMatchedUser = project.member_ids.some((mid) => {
        const u = allUsers.find((usr) => usr.id === mid || usr.employee_id === mid);
        return cleanEmail && u && u.email?.trim().toLowerCase() === cleanEmail;
      });
      if (hasMatchedUser) return true;
    } catch {}
  }

  // 3. Check project.project_manager_id
  if (project.project_manager_id) {
    if (userId && project.project_manager_id === userId) return true;
    try {
      const allUsers = userService.getUsers();
      const pm = allUsers.find((usr) => usr.id === project.project_manager_id);
      if (cleanEmail && pm && pm.email?.trim().toLowerCase() === cleanEmail) return true;
    } catch {}
  }

  return false;
};

