import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { userService, SEED_USER_IDS } from './userService';

const PROJECTS_STORAGE_KEY = 'taskflow_manage_projects_list_v4';

const SEED_WORKSPACE_IDS = {
  WS_4RGED: '00000000-0000-0000-0000-000000000020',
  WS_ACME: '00000000-0000-0000-0000-000000000010',
  WS1: '00000000-0000-0000-0000-000000000001',
};

export const normalizeWorkspaceId = (id) => {
  if (!id) return SEED_WORKSPACE_IDS.WS_4RGED;
  const clean = String(id).trim().toLowerCase();
  if (clean === '4rged' || clean === 'ws-1' || clean === SEED_WORKSPACE_IDS.WS_4RGED.toLowerCase()) {
    return SEED_WORKSPACE_IDS.WS_4RGED;
  }
  if (clean === 'acme-studio' || clean === 'ws-2' || clean === SEED_WORKSPACE_IDS.WS_ACME.toLowerCase()) {
    return SEED_WORKSPACE_IDS.WS_ACME;
  }
  return id;
};

const MOCK_PROJECTS = [
  {
    id: '00000000-0000-0000-0001-000000000001',
    key: 'PROJ-FE48',
    name: 'Inventory Management System',
    description: 'Build a Inventory Management System for the company Standard',
    color: '#F59E0B',
    tag: 'General',
    client: 'Partical Black',
    budget: 10000,
    status: 'on_hold',
    workspace_id: SEED_WORKSPACE_IDS.WS_4RGED,
    project_manager_id: SEED_USER_IDS.NEEL,
    member_ids: [SEED_USER_IDS.NEEL, SEED_USER_IDS.RABIL],
    member_emails: ['neel@gmail.com', 'rabil@gmail.com'],
    moreCount: 0,
  },
  {
    id: '00000000-0000-0000-0001-000000000002',
    key: 'PROJ-E2A7',
    name: 'HRO',
    description: 'Build a Hiring Recusation Onboarding system for the company Standard',
    color: '#F59E0B',
    tag: 'General',
    client: 'Partical Black',
    budget: 10000,
    status: 'on_hold',
    workspace_id: SEED_WORKSPACE_IDS.WS_4RGED,
    project_manager_id: SEED_USER_IDS.NEEL,
    member_ids: [SEED_USER_IDS.NEEL, SEED_USER_IDS.AADHI],
    member_emails: ['neel@gmail.com', 'aadhi@gmail.com'],
    moreCount: 0,
  },
  {
    id: '00000000-0000-0000-0001-000000000003',
    key: 'PROJ-49C9',
    name: 'Chat Application',
    description: 'Chat Application , To communicate with clients',
    color: '#F59E0B',
    tag: 'General',
    client: 'Partical Black',
    budget: 10000,
    status: 'on_hold',
    workspace_id: SEED_WORKSPACE_IDS.WS_4RGED,
    project_manager_id: SEED_USER_IDS.NEEL,
    member_ids: [SEED_USER_IDS.NEEL, SEED_USER_IDS.ALEX],
    member_emails: ['neel@gmail.com', 'alex@gmail.com'],
    moreCount: 0,
  },
  {
    id: '00000000-0000-0000-0001-000000000004',
    key: 'PROJ-C682',
    name: 'PES',
    description: 'Build a Project Management System ,that should be in a companyn standard',
    color: '#F59E0B',
    tag: 'General',
    client: 'Partical Black',
    budget: 10000,
    status: 'on_hold',
    workspace_id: SEED_WORKSPACE_IDS.WS_4RGED,
    project_manager_id: SEED_USER_IDS.NEEL,
    member_ids: [SEED_USER_IDS.NEEL, SEED_USER_IDS.DHANUSH],
    member_emails: ['neel@gmail.com', 'dhanush@gmail.com'],
    moreCount: 0,
  },
];

export function getStoredProjects() {
  try {
    const stored = localStorage.getItem(PROJECTS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map((p) => ({
          ...p,
          workspace_id: normalizeWorkspaceId(p.workspace_id),
          member_emails: p.member_emails || (p.members ? p.members.map((m) => m.email?.toLowerCase()).filter(Boolean) : []),
        }));
      }
    }
  } catch {}
  return isSupabaseConfigured ? [] : MOCK_PROJECTS;
}

export function saveStoredProjects(projects, emitEvent = true) {
  try {
    localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify(projects));
    if (emitEvent && typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('taskflow_projects_updated', { detail: projects }));
    }
  } catch {}
}

export const mapRemoteProject = (row) => ({
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
  member_emails: [],
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

      // Also fetch all project_members joined with profiles from Supabase!
      let remoteMembers = [];
      try {
        const { data: pmData, error: pmErr } = await supabase
          .from('project_members')
          .select('project_id, user_id, role_in_project, profiles(id, email, full_name, role, color, avatar_url)');
        if (!pmErr && Array.isArray(pmData)) {
          remoteMembers = pmData;
        }
      } catch (e) {
        console.warn('Could not fetch project_members from Supabase:', e);
      }

      // Group members by project_id
      const allUsers = userService.getUsers();
      const membersByProject = new Map();
      for (const rm of remoteMembers) {
        if (!rm.project_id) continue;
        if (!membersByProject.has(rm.project_id)) {
          membersByProject.set(rm.project_id, []);
        }
        const profile = rm.profiles || {};
        const matchedLocalUser = allUsers.find(
          (u) =>
            (profile.email && u.email && u.email.toLowerCase() === profile.email.toLowerCase()) ||
            (rm.user_id && u.id === rm.user_id)
        );

        const email = (profile.email || matchedLocalUser?.email || '').toLowerCase();
        const name = profile.full_name || matchedLocalUser?.name || email.split('@')[0] || 'Member';
        const role = rm.role_in_project || profile.role || matchedLocalUser?.role || 'team_member';
        const color = profile.color || matchedLocalUser?.color || '#10B981';

        membersByProject.get(rm.project_id).push({
          id: rm.user_id || profile.id || matchedLocalUser?.id,
          name,
          email,
          role,
          color,
          avatar:
            profile.avatar_url ||
            matchedLocalUser?.avatar ||
            name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase(),
        });
      }

      const remoteProjects = (remoteData || []).map(mapRemoteProject);
      const stored = getStoredProjects();

      // Merge remote projects with database members AND local UI cache
      const merged = remoteProjects.map((rp) => {
        const localMatch = stored.find((lp) => lp.id === rp.id || lp.name === rp.name);
        const dbMembers = membersByProject.get(rp.id) || [];

        // Combine DB members with localMatch members, deduplicating by email
        const memberMap = new Map();
        for (const m of localMatch?.members || []) {
          if (m?.email) memberMap.set(m.email.toLowerCase(), m);
        }
        for (const m of dbMembers) {
          if (m?.email) memberMap.set(m.email.toLowerCase(), m);
        }

        const combinedMembers = Array.from(memberMap.values());
        const memberIds = Array.from(
          new Set([
            ...combinedMembers.map((m) => m.id).filter(Boolean),
            ...(localMatch?.member_ids || localMatch?.memberIds || []),
          ])
        );
        const memberEmails = Array.from(
          new Set([
            ...combinedMembers.map((m) => m.email.toLowerCase()).filter(Boolean),
            ...(localMatch?.member_emails || []),
          ])
        );

        return {
          ...rp,
          members: combinedMembers,
          member_ids: memberIds,
          memberIds,
          member_emails: memberEmails,
          project_manager_id: localMatch?.project_manager_id || rp.project_manager_id || null,
        };
      });

      if (normWorkspaceId) {
        const otherWorkspaceProjects = stored.filter(
          (p) => p.workspace_id && p.workspace_id !== normWorkspaceId
        );
        saveStoredProjects([...merged, ...otherWorkspaceProjects], false);
      } else {
        saveStoredProjects(merged, false);
      }
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

    // Resolve PM
    let pmId = project.project_manager_id || null;
    if (pmId) {
      const pmUser = userService.findUserById(pmId) || userService.findUserByEmail(pmId);
      if (pmUser) {
        pmId = pmUser.id;
        await userService.syncUserToRemote(pmUser);
      }
    }

    const cleanBudget = project.budget
      ? parseFloat(String(project.budget).replace(/[^0-9.]/g, '')) || null
      : null;
    const cleanHours = (project.estimatedHours || project.estimated_hours)
      ? parseInt(String(project.estimatedHours || project.estimated_hours).replace(/[^0-9]/g, ''), 10) || null
      : null;

    const dbPayload = {
      workspace_id: wsId,
      project_manager_id: pmId && pmId.includes('-') ? pmId : null,
      name: project.name?.trim(),
      description: project.description?.trim() || '',
      color: project.color || '#0C66E4',
      start_date: project.start_date || null,
      end_date: project.end_date || null,
      image_url: project.imageUrl || project.image_url || null,
      client: project.client || null,
      budget: cleanBudget,
      estimated_hours: cleanHours,
      tag: project.tag || 'General',
      status: project.status || 'in_progress',
    };

    let remoteRecord = null;
    if (isSupabaseConfigured) {
      try {
        let insertPayload = { ...dbPayload };
        let { data, error } = await supabase
          .from('projects')
          .insert([insertPayload])
          .select()
          .single();

        // If foreign key constraint failed on workspace_id, ensure workspace exists or fallback to available
        if (error && (error.code === '23503' || error.message?.includes('workspace_id'))) {
          console.warn('Workspace foreign key constraint hit. Ensuring workspace exists...', wsId);
          // Try to upsert the workspace first
          await supabase.from('workspaces').upsert([
            {
              id: wsId,
              name: 'Southern Rescue Services',
              slug: 'southern-rescue-' + wsId.slice(-4),
              description: 'Workspace',
              color: '#0C66E4',
            }
          ], { onConflict: 'id' });

          const retry = await supabase
            .from('projects')
            .insert([insertPayload])
            .select()
            .single();

          data = retry.data;
          error = retry.error;

          // If still failing, fallback to any available workspace in DB
          if (error && (error.code === '23503' || error.message?.includes('workspace_id'))) {
            const { data: wsRows } = await supabase.from('workspaces').select('id').limit(1);
            if (wsRows && wsRows.length > 0) {
              insertPayload.workspace_id = wsRows[0].id;
              const fallbackRetry = await supabase
                .from('projects')
                .insert([insertPayload])
                .select()
                .single();
              data = fallbackRetry.data;
              error = fallbackRetry.error;
            }
          }
        }

        // If foreign key constraint failed on project_manager_id, retry with null PM
        if (error && (error.code === '23503' || error.message?.includes('project_manager_id'))) {
          console.warn('PM foreign key constraint hit, retrying with project_manager_id: null');
          insertPayload.project_manager_id = null;
          const retryPm = await supabase
            .from('projects')
            .insert([insertPayload])
            .select()
            .single();
          data = retryPm.data;
          error = retryPm.error;
        }

        if (error) {
          console.error('Supabase project insert failed:', error);
          throw new Error('Supabase save failed: ' + error.message);
        } else if (data) {
          remoteRecord = data;
        }
      } catch (supaErr) {
        console.error('Supabase project insert error:', supaErr);
        throw supaErr;
      }
    }

    const assignedId = remoteRecord
      ? remoteRecord.id
      : typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : '00000000-0000-0000-0000-' + Date.now().toString().padStart(12, '0');

    // Resolve all member users and their emails
    const rawMembers = project.members || [];
    const rawMemberIds = project.member_ids || project.memberIds || [];
    const allUsers = userService.getUsers();

    const resolvedMembers = [];
    const memberIds = [];
    const memberEmails = [];

    const combinedRefs = [
      ...rawMembers,
      ...rawMemberIds.map((id) => allUsers.find((u) => u.id === id || u.email === id) || id),
    ];

    const seenEmails = new Set();
    for (const ref of combinedRefs) {
      let u = null;
      if (typeof ref === 'object' && ref !== null) {
        u = ref.email ? allUsers.find((user) => user.email?.toLowerCase() === ref.email.toLowerCase()) || ref : ref;
      } else if (typeof ref === 'string') {
        u = allUsers.find((user) => user.id === ref || (user.email && user.email.toLowerCase() === ref.toLowerCase()));
      }
      if (u && u.email && !seenEmails.has(u.email.toLowerCase())) {
        seenEmails.add(u.email.toLowerCase());
        resolvedMembers.push(u);
        if (u.id) memberIds.push(u.id);
        memberEmails.push(u.email.toLowerCase());
      }
    }

    // Persist to Supabase project_members table
    if (isSupabaseConfigured && remoteRecord) {
      try {
        for (const member of resolvedMembers) {
          // ensure profile row exists in Supabase so foreign key constraint is satisfied
          await userService.syncUserToRemote(member);

          await supabase.from('project_members').upsert(
            {
              project_id: assignedId,
              user_id: member.id,
              role_in_project: member.role || 'team_member',
            },
            { onConflict: 'project_id,user_id' }
          );
        }

        // Also if PM exists, ensure PM is in project_members
        if (pmId) {
          await supabase.from('project_members').upsert(
            {
              project_id: assignedId,
              user_id: pmId,
              role_in_project: 'project_manager',
            },
            { onConflict: 'project_id,user_id' }
          );
        }
      } catch (pmErr) {
        console.warn('Error saving project_members in Supabase:', pmErr);
      }
    }

    const finalProject = {
      ...project,
      ...dbPayload,
      id: assignedId,
      key: project.key || 'PROJ-' + assignedId.replace(/-/g, '').slice(0, 4).toUpperCase(),
      duration: project.duration || (project.end_date || 'Nov 20, 2026'),
      task_count: 0,
      completed_count: 0,
      moreCount: resolvedMembers.length > 3 ? resolvedMembers.length - 3 : 0,
      members: resolvedMembers,
      member_ids: memberIds,
      memberIds: memberIds,
      member_emails: memberEmails,
    };

    const current = getStoredProjects();
    const updated = [finalProject, ...current.filter((p) => p.id !== finalProject.id)];
    saveStoredProjects(updated);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('taskflow_activity_log', {
          detail: {
            workspaceId: wsId,
            user: 'Admin',
            action: 'created project',
            target: finalProject.name,
            type: 'project',
          },
        })
      );
    }

    return finalProject;
  },

  async deleteProject(id) {
    const current = getStoredProjects();
    const targetProject = current.find((p) => p.id === id);
    if (isSupabaseConfigured) {
      try {
        const { error: tskErr } = await supabase.from('tasks').delete().eq('project_id', id);
        if (tskErr) console.warn('Supabase tasks delete warning:', tskErr);

        const { error: pmErr } = await supabase.from('project_members').delete().eq('project_id', id);
        if (pmErr) console.warn('Supabase project_members delete warning:', pmErr);

        const { error: prjErr } = await supabase.from('projects').delete().eq('id', id);
        if (prjErr) {
          console.error('Failed to delete project in Supabase:', prjErr);
          throw new Error('Supabase project deletion failed: ' + prjErr.message);
        }
      } catch (err) {
        console.error('Failed to delete project in Supabase:', err);
        throw err;
      }
    }
    const updated = current.filter((p) => p.id !== id);
    saveStoredProjects(updated, false);

    // Also clean up tasks belonging to this project from local cache
    try {
      const rawTasks = localStorage.getItem('taskflow_tasks_cache_v5');
      if (rawTasks) {
        const parsedTasks = JSON.parse(rawTasks);
        if (Array.isArray(parsedTasks)) {
          const remTasks = parsedTasks.filter((t) => t.project_id !== id && t.projectId !== id);
          localStorage.setItem('taskflow_tasks_cache_v5', JSON.stringify(remTasks));
          if (typeof window !== 'undefined') {
            window.dispatchEvent(new CustomEvent('taskflow_tasks_updated', { detail: remTasks }));
          }
        }
      }
    } catch (e) {
      console.warn('Could not clean tasks for deleted project:', e);
    }

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('taskflow_projects_updated', {
          detail: { id, deleted: true, projects: updated },
        })
      );
      window.dispatchEvent(
        new CustomEvent('taskflow_activity_log', {
          detail: {
            user: 'Admin',
            action: 'deleted project',
            target: targetProject?.name || 'Project',
            type: 'project',
          },
        })
      );
    }

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
        if (updates.project_manager_id) {
          dbUpdates.project_manager_id = updates.project_manager_id;
        }

        if (Object.keys(dbUpdates).length > 0) {
          const { error: prjErr } = await supabase.from('projects').update(dbUpdates).eq('id', id);
          if (prjErr) {
            console.error('Failed to update project in Supabase:', prjErr);
            throw new Error('Supabase project update failed: ' + prjErr.message);
          }
        }

        // Sync members if updated
        if (Array.isArray(updates.members) || Array.isArray(updates.member_ids)) {
          const allUsers = userService.getUsers();
          const targetMembers = updates.members || updates.member_ids.map((mid) => allUsers.find((u) => u.id === mid) || { id: mid });

          for (const mem of targetMembers) {
            if (mem && mem.id) {
              await userService.syncUserToRemote(mem);
              await supabase.from('project_members').upsert(
                {
                  project_id: id,
                  user_id: mem.id,
                  role_in_project: mem.role || 'team_member',
                },
                { onConflict: 'project_id,user_id' }
              );
            }
          }
        }
      } catch (err) {
        console.error('Failed to update project in Supabase:', err);
        throw err;
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

  // 1. Check project.member_emails array
  if (Array.isArray(project.member_emails) && cleanEmail) {
    if (project.member_emails.some((em) => em && em.toLowerCase() === cleanEmail)) {
      return true;
    }
  }

  // 2. Check project.members array (objects or strings)
  if (Array.isArray(project.members) && project.members.length > 0) {
    const isMember = project.members.some((m) => {
      if (!m) return false;
      if (typeof m === 'string') {
        const mClean = m.trim().toLowerCase();
        return (cleanEmail && mClean === cleanEmail) || (userId && m === userId);
      }
      if (typeof m === 'object') {
        const memEmail = m.email?.trim().toLowerCase();
        return (cleanEmail && memEmail === cleanEmail) || (userId && m.id === userId);
      }
      return false;
    });
    if (isMember) return true;
  }

  // 3. Check project.member_ids array
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

  // 4. Check project.project_manager_id
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
