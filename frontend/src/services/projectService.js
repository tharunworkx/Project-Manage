import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { userService, SEED_USER_IDS } from './userService';

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
    project_manager_id: SEED_USER_IDS.ALEX,
    member_ids: [SEED_USER_IDS.ADMIN, SEED_USER_IDS.ALEX, SEED_USER_IDS.MARIA],
    member_emails: ['tharun@gmail.com', 'alex.j@company.com', 'maria.g@company.com'],
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
    project_manager_id: SEED_USER_IDS.SARAH,
    member_ids: [SEED_USER_IDS.SARAH, SEED_USER_IDS.DAVID],
    member_emails: ['sarah.m@company.com', 'david.c@company.com'],
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
    project_manager_id: SEED_USER_IDS.ADMIN,
    member_ids: [SEED_USER_IDS.ADMIN, SEED_USER_IDS.MARIA, SEED_USER_IDS.SOPHIE],
    member_emails: ['tharun@gmail.com', 'maria.g@company.com', 'sophie.t@company.com'],
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
    project_manager_id: SEED_USER_IDS.ALEX,
    member_ids: [SEED_USER_IDS.ADMIN, SEED_USER_IDS.ALEX, SEED_USER_IDS.SARAH, SEED_USER_IDS.MARIA],
    member_emails: ['tharun@gmail.com', 'alex.j@company.com', 'sarah.m@company.com', 'maria.g@company.com'],
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
    project_manager_id: SEED_USER_IDS.ALEX,
    member_ids: [SEED_USER_IDS.ALEX, SEED_USER_IDS.DAVID],
    member_emails: ['alex.j@company.com', 'david.c@company.com'],
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
    project_manager_id: SEED_USER_IDS.SARAH,
    member_ids: [SEED_USER_IDS.ADMIN, SEED_USER_IDS.SARAH, SEED_USER_IDS.SOPHIE],
    member_emails: ['tharun@gmail.com', 'sarah.m@company.com', 'sophie.t@company.com'],
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
    project_manager_id: SEED_USER_IDS.ALEX,
    member_ids: [SEED_USER_IDS.ALEX, SEED_USER_IDS.MARIA, SEED_USER_IDS.LIAM],
    member_emails: ['alex.j@company.com', 'maria.g@company.com', 'liam.w@company.com'],
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
    project_manager_id: SEED_USER_IDS.SARAH,
    member_ids: [SEED_USER_IDS.ADMIN, SEED_USER_IDS.SARAH, SEED_USER_IDS.DAVID],
    member_emails: ['tharun@gmail.com', 'sarah.m@company.com', 'david.c@company.com'],
    moreCount: 0,
  },
];

function getStoredProjects() {
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

    // Resolve PM
    let pmId = project.project_manager_id || null;
    if (pmId) {
      const pmUser = userService.findUserById(pmId) || userService.findUserByEmail(pmId);
      if (pmUser) {
        pmId = pmUser.id;
        await userService.syncUserToRemote(pmUser);
      }
    }

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

    return finalProject;
  },

  async deleteProject(id) {
    if (isSupabaseConfigured) {
      try {
        await supabase.from('project_members').delete().eq('project_id', id);
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
        if (updates.project_manager_id) {
          dbUpdates.project_manager_id = updates.project_manager_id;
        }

        if (Object.keys(dbUpdates).length > 0) {
          await supabase.from('projects').update(dbUpdates).eq('id', id);
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
