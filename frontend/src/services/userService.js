// User and Employee Account Service with Supabase Database Sync and Role Enforcement
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const USERS_STORAGE_KEY = 'taskflow_authorized_users_v2';

export const SEED_USER_IDS = {
  ADMIN: '00000000-0000-0000-0000-000000000001',
  ADMIN_ALIAS: '00000000-0000-0000-0000-00000000001a',
  SAMVEL: '00000000-0000-0000-0000-000000000003',
  ALEX: '00000000-0000-0000-0000-000000000004',
  SRINI: '00000000-0000-0000-0000-000000000005',
  GOKUL: '00000000-0000-0000-0000-000000000006',
  RABIL: '00000000-0000-0000-0000-000000000007',
  RAJINI: '00000000-0000-0000-0000-000000000008',
  AADHI: '00000000-0000-0000-0000-000000000009',
  NEEL: '00000000-0000-0000-0000-000000000010',
  DHANUSH: '00000000-0000-0000-0000-000000000011',
};

const INITIAL_AUTHORIZED_USERS = [];

export const userService = {
  getUsers() {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {}
    return [];
  },

  saveUsers(users) {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      window.dispatchEvent(new CustomEvent('taskflow_users_updated'));
    } catch {}
  },

  findUserByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getUsers();
    return users.find((u) => u.email && u.email.toLowerCase() === cleanEmail) || null;
  },

  findUserById(id) {
    if (!id) return null;
    const cleanId = String(id).trim().toLowerCase();
    const users = this.getUsers();
    return (
      users.find(
        (u) =>
          (u.id && String(u.id).toLowerCase() === cleanId) ||
          (u.employee_id && String(u.employee_id).toLowerCase() === cleanId)
      ) || null
    );
  },

  isEmailAuthorized(email) {
    return Boolean(this.findUserByEmail(email));
  },

  /**
   * Synchronize local cache with remote Supabase `profiles` and `users` tables.
   * When Supabase is configured, the remote database is the source of truth.
   */
  async fetchUsersFromRemote() {
    if (!isSupabaseConfigured) return this.getUsers();
    try {
      const [{ data: remoteProfiles, error: pErr }, { data: remoteUsers, error: uErr }] = await Promise.all([
        supabase.from('profiles').select('*').order('created_at', { ascending: true }),
        supabase.from('users').select('*').order('created_at', { ascending: true }),
      ]);

      if (pErr && uErr) {
        return this.getUsers();
      }

      // Supabase is the single source of truth when configured.
      const userMap = new Map();

      // 1. Merge remote profiles
      if (Array.isArray(remoteProfiles)) {
        for (const rp of remoteProfiles) {
          if (!rp.email) continue;
          const email = rp.email.toLowerCase();
          userMap.set(email, {
            id: rp.id,
            name: rp.full_name || email.split('@')[0],
            email: email,
            role: (rp.role || 'team_member').toLowerCase(),
            status: rp.status === 'deactivated' ? 'Deactivated' : 'Active',
            color: rp.color || '#10B981',
            avatar: rp.full_name
              ? rp.full_name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
              : email.substring(0, 2).toUpperCase(),
          });
        }
      }

      // 2. Merge remote users table
      if (Array.isArray(remoteUsers)) {
        for (const ru of remoteUsers) {
          if (!ru.email) continue;
          const email = ru.email.toLowerCase();
          const existing = userMap.get(email) || {};
          userMap.set(email, {
            ...existing,
            id: ru.id || existing.id,
            name: ru.full_name || existing.name || email.split('@')[0],
            email: email,
            password: ru.password_hash || existing.password || '12345678',
            role: (ru.role || existing.role || 'team_member').toLowerCase(),
            status: ru.is_active === false ? 'Deactivated' : (existing.status || 'Active'),
            color: ru.color || existing.color || '#10B981',
            avatar: existing.avatar || (ru.full_name ? ru.full_name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : email.substring(0, 2).toUpperCase()),
          });
        }
      }

      if (userMap.size === 0) {
        this.saveUsers([]);
        return [];
      }

      const merged = Array.from(userMap.values());
      // Save authoritative list to local storage
      this.saveUsers(merged);
      return merged;
    } catch (err) {
      console.warn('Error fetching remote users:', err);
      return this.getUsers();
    }
  },

  /**
   * Sync a user account into both Supabase `profiles` and `users` tables
   */
  async syncUserToRemote(user) {
    if (!isSupabaseConfigured || !user || !user.email) return;
    try {
      const cleanEmail = user.email.toLowerCase().trim();
      const validId =
        user.id && user.id.includes('-') && user.id.length >= 32
          ? user.id
          : typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : '00000000-0000-0000-0000-' + Date.now().toString().padStart(12, '0');

      user.id = validId;

      // 1. Sync to `profiles` table
      try {
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', cleanEmail)
          .maybeSingle();

        const profileData = {
          full_name: user.name || cleanEmail.split('@')[0],
          role: user.role?.toLowerCase() || 'team_member',
          status: user.status === 'Deactivated' ? 'deactivated' : 'active',
          color: user.color || '#10B981',
        };

        if (existingProfile) {
          const { error } = await supabase
            .from('profiles')
            .update(profileData)
            .eq('email', cleanEmail);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('profiles')
            .insert([{ id: validId, email: cleanEmail, ...profileData }]);
          if (error) throw error;
        }
      } catch (profErr) {
        console.error('[userService] profiles sync error:', profErr);
        throw profErr;
      }

      // 2. Sync to `users` table
      try {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('email', cleanEmail)
          .maybeSingle();

        const userData = {
          full_name: user.name || cleanEmail.split('@')[0],
          role: (user.role || 'team_member').toUpperCase(),
          password_hash: user.password || '12345678',
          is_active: user.status !== 'Deactivated',
          color: user.color || '#10B981',
        };

        if (existingUser) {
          const { error } = await supabase
            .from('users')
            .update(userData)
            .eq('email', cleanEmail);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('users')
            .insert([{ id: validId, email: cleanEmail, ...userData }]);
          if (error) throw error;
        }
      } catch (usrErr) {
        console.error('[userService] users sync error:', usrErr);
        throw usrErr;
      }
    } catch (err) {
      console.error('Could not sync user to Supabase:', err);
      throw err;
    }
  },

  authenticate(email, password) {
    const user = this.findUserByEmail(email);
    if (!user) {
      throw new Error('Account does not exist. Please ask your Admin to register your email.');
    }
    if (user.status === 'Deactivated') {
      throw new Error('This account has been deactivated. Please contact your Administrator.');
    }
    if (user.password && user.password !== password) {
      throw new Error('Invalid credentials. Please verify your email and password.');
    }
    return user;
  },

  /**
   * Self-registration by an Employee:
   * Only allows sign-up if the email was registered in advance by Admin!
   */
  async registerUser({ name, email, password }) {
    const cleanEmail = email?.trim().toLowerCase();

    // Pull latest registered accounts from remote database first
    if (isSupabaseConfigured) {
      try {
        await this.fetchUsersFromRemote();
      } catch {}
    }

    const existing = this.findUserByEmail(cleanEmail);

    if (!existing) {
      throw new Error(
        'Email not authorized. Only employee accounts registered by the Administrator can sign up.'
      );
    }

    const users = this.getUsers();
    let registeredUser = null;
    const updatedUsers = users.map((u) => {
      if (u.email && u.email.toLowerCase() === cleanEmail) {
        registeredUser = {
          ...u,
          name: name?.trim() || u.name,
          password: password,
          status: 'Active',
        };
        return registeredUser;
      }
      return u;
    });

    this.saveUsers(updatedUsers);

    if (registeredUser) {
      await this.syncUserToRemote(registeredUser);
    }

    return registeredUser || existing;
  },

  /**
   * Admin-only Employee Account Creation
   */
  async addUserByAdmin({ name, email, role = 'team_member' }) {
    const cleanEmail = email.trim().toLowerCase();

    // Refresh remote users to prevent duplicates
    if (isSupabaseConfigured) {
      try {
        await this.fetchUsersFromRemote();
      } catch {}
    }

    const users = this.getUsers();

    if (users.some((u) => u.email && u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email already exists.');
    }

    const uuid =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : '00000000-0000-0000-0000-' + Date.now().toString().padStart(12, '0');

    const newUser = {
      id: uuid,
      name: name.trim() || cleanEmail.split('@')[0],
      email: cleanEmail,
      password: 'password123',
      role: role.toLowerCase(),
      status: 'Active',
      avatar: (name ? name.substring(0, 2) : cleanEmail.substring(0, 2)).toUpperCase(),
      color: role === 'project_manager' ? '#0C66E4' : '#10B981',
    };

    const updated = [newUser, ...users];
    this.saveUsers(updated);

    // Sync to Supabase database so other browsers immediately see this employee
    await this.syncUserToRemote(newUser);

    return newUser;
  },

  updateRole(userId, newRole) {
    const users = this.getUsers();
    let updatedUser = null;
    const updated = users.map((u) => {
      if (u.id === userId) {
        updatedUser = { ...u, role: newRole.toLowerCase() };
        return updatedUser;
      }
      return u;
    });
    this.saveUsers(updated);
    if (updatedUser) {
      this.syncUserToRemote(updatedUser);
    }
  },

  updateUserProfile(identifier, updatedFields) {
    if (!identifier) return null;
    const cleanId = String(identifier).trim().toLowerCase();
    const users = this.getUsers();
    let updatedUser = null;
    const updated = users.map((u) => {
      if (
        (u.email && u.email.toLowerCase() === cleanId) ||
        (u.id && String(u.id).toLowerCase() === cleanId)
      ) {
        updatedUser = { ...u, ...updatedFields };
        return updatedUser;
      }
      return u;
    });
    this.saveUsers(updated);
    if (updatedUser) {
      this.syncUserToRemote(updatedUser);
    }
    return updatedUser;
  },

  getProjectManagers() {
    const raw = this.getUsers().filter(
      (u) =>
        u.role?.toLowerCase() === 'project_manager' ||
        u.role?.toLowerCase() === 'admin'
    );
    const seen = new Set();
    return raw.filter((u) => {
      if (!u.name || seen.has(u.name)) return false;
      seen.add(u.name);
      return true;
    });
  },

  getAllMembers() {
    const raw = this.getUsers().filter((u) => u.status !== 'Deactivated');
    const seen = new Set();
    return raw.filter((u) => {
      const key = (u.name || u.email || '').trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  },

  getTeamMembers() {
    const raw = this.getUsers().filter((u) => {
      if (u.status === 'Deactivated') return false;
      const r = (u.role || '').toLowerCase();
      return r === 'team_member' || r === 'member' || r === 'employee' || (!r.includes('admin') && !r.includes('manager'));
    });
    const seen = new Set();
    return raw.filter((u) => {
      const key = (u.name || u.email || '').trim().toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  },

  async deleteUser(userOrId) {
    let targetId = typeof userOrId === 'object' ? userOrId?.id : userOrId;
    let targetEmail = typeof userOrId === 'object' ? userOrId?.email : null;

    if (!targetEmail && targetId) {
      const found = this.findUserById(targetId);
      if (found) targetEmail = found.email;
    }

    const cleanEmail = targetEmail?.trim()?.toLowerCase();

    if (isSupabaseConfigured) {
      try {
        let remoteId = targetId;
        if (cleanEmail) {
          try {
            const { data: prof } = await supabase
              .from('profiles')
              .select('id')
              .eq('email', cleanEmail)
              .maybeSingle();
            if (prof?.id) remoteId = prof.id;
          } catch {}
        }

        // Step 1: Clear foreign keys first to prevent FK constraint violations!
        const fkOps = [];
        const idsToClean = Array.from(new Set([targetId, remoteId].filter(Boolean)));
        for (const uid of idsToClean) {
          fkOps.push(supabase.from('project_members').delete().eq('user_id', uid));
          fkOps.push(supabase.from('tasks').update({ assignee_id: null }).eq('assignee_id', uid));
          fkOps.push(supabase.from('tasks').update({ reporter_id: null }).eq('reporter_id', uid));
          fkOps.push(supabase.from('projects').update({ project_manager_id: null }).eq('project_manager_id', uid));
          fkOps.push(supabase.from('comments').delete().eq('user_id', uid));
          fkOps.push(supabase.from('notifications').delete().eq('user_id', uid));
        }
        await Promise.allSettled(fkOps);

        // Step 2: Delete from profiles and users tables
        const deleteOps = [];
        for (const uid of idsToClean) {
          deleteOps.push(supabase.from('profiles').delete().eq('id', uid));
          deleteOps.push(supabase.from('users').delete().eq('id', uid));
        }
        if (cleanEmail) {
          deleteOps.push(supabase.from('profiles').delete().eq('email', cleanEmail));
          deleteOps.push(supabase.from('users').delete().eq('email', cleanEmail));
        }
        await Promise.allSettled(deleteOps);
      } catch (err) {
        console.warn('Error deleting user from Supabase:', err);
      }
    }

    const users = this.getUsers();
    const updated = users.filter((u) => {
      if (targetId && u.id === targetId) return false;
      if (cleanEmail && u.email && u.email.toLowerCase() === cleanEmail) return false;
      return true;
    });
    this.saveUsers(updated);

    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('taskflow_users_updated', {
          detail: { id: targetId, email: cleanEmail, deleted: true, users: updated },
        })
      );
    }
    return true;
  },

  resolveUser(identifier) {
    if (!identifier || identifier === 'Unassigned' || identifier === 'unassigned') {
      return null;
    }
    const users = this.getUsers();
    const clean = String(identifier).trim().toLowerCase();

    let found = users.find((u) => u.id && u.id.toLowerCase() === clean);
    if (!found) {
      found = users.find((u) => u.name && u.name.toLowerCase() === clean);
    }
    if (!found) {
      found = users.find((u) => u.avatar && u.avatar.toLowerCase() === clean);
    }
    if (!found) {
      found = users.find((u) => u.email && u.email.toLowerCase() === clean);
    }

    if (found) {
      return {
        id: found.id,
        name: found.name,
        avatar:
          found.avatar ||
          found.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .substring(0, 2)
            .toUpperCase(),
        color: found.color || (found.name === 'Tharun R' ? '#7C3AED' : '#0C66E4'),
        role: found.role,
        email: found.email,
      };
    }

    const initials = String(identifier)
      .split(' ')
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    return {
      id: identifier,
      name: identifier,
      avatar: initials || 'U',
      color: '#0C66E4',
      role: 'Member',
    };
  },
};
