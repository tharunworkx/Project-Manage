// User and Employee Account Service with Role Enforcement

const USERS_STORAGE_KEY = 'taskflow_authorized_users_v2';

const INITIAL_AUTHORIZED_USERS = [
  {
    id: 'usr-admin',
    name: 'Tharun R',
    email: 'tharun@gmail.com',
    password: '12345678',
    role: 'admin',
    status: 'Active',
    avatar: 'TR',
    color: '#7C3AED',
  },
  {
    id: 'usr-admin-alias',
    name: 'Tharun R',
    email: 'tharun.workx@gmail.com',
    password: '12345678',
    role: 'admin',
    status: 'Active',
    avatar: 'TR',
    color: '#7C3AED',
  },
  {
    id: 'usr-2',
    name: 'Alex Johnson',
    email: 'alex.j@company.com',
    password: '12345678',
    role: 'project_manager',
    status: 'Active',
    avatar: 'AJ',
    color: '#0C66E4',
  },
  {
    id: 'usr-3',
    name: 'Sarah Miller',
    email: 'sarah.m@company.com',
    password: '12345678',
    role: 'project_manager',
    status: 'Active',
    avatar: 'SM',
    color: '#0284C7',
  },
  {
    id: 'usr-4',
    name: 'Maria Garcia',
    email: 'maria.g@company.com',
    password: '12345678',
    role: 'team_member',
    status: 'Active',
    avatar: 'MG',
    color: '#10B981',
  },
  {
    id: 'usr-5',
    name: 'David Chen',
    email: 'david.c@company.com',
    password: '12345678',
    role: 'team_member',
    status: 'Active',
    avatar: 'DC',
    color: '#059669',
  },
  {
    id: 'usr-6',
    name: 'Sophie Taylor',
    email: 'sophie.t@company.com',
    password: '12345678',
    role: 'team_member',
    status: 'Active',
    avatar: 'ST',
    color: '#64748B',
  },
  {
    id: 'usr-7',
    name: 'Liam Wilson',
    email: 'liam.w@company.com',
    password: '12345678',
    role: 'team_member',
    status: 'Active',
    avatar: 'LW',
    color: '#F59E0B',
  },
];

export const userService = {
  getUsers() {
    try {
      const stored = localStorage.getItem(USERS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {}
    this.saveUsers(INITIAL_AUTHORIZED_USERS);
    return INITIAL_AUTHORIZED_USERS;
  },

  saveUsers(users) {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch {}
  },

  findUserByEmail(email) {
    if (!email) return null;
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getUsers();
    return users.find((u) => u.email.toLowerCase() === cleanEmail) || null;
  },

  isEmailAuthorized(email) {
    return Boolean(this.findUserByEmail(email));
  },

  authenticate(email, password) {
    const user = this.findUserByEmail(email);
    if (!user) {
      throw new Error('Account does not exist. Please ask your Admin to register your email.');
    }
    // Check password
    if (user.password && user.password !== password) {
      throw new Error('Invalid credentials. Please verify your email and password.');
    }
    return user;
  },

  registerUser({ name, email, password }) {
    const cleanEmail = email?.trim().toLowerCase();
    const existing = this.findUserByEmail(cleanEmail);

    if (!existing) {
      throw new Error(
        'Email not authorized. Only employee accounts created by the Administrator (tharun@gmail.com) can sign up.'
      );
    }

    const users = this.getUsers();
    const updatedUsers = users.map((u) => {
      if (u.email.toLowerCase() === cleanEmail) {
        return {
          ...u,
          name: name?.trim() || u.name,
          password: password,
          status: 'Active',
        };
      }
      return u;
    });

    this.saveUsers(updatedUsers);
    return this.findUserByEmail(cleanEmail);
  },

  addUserByAdmin({ name, email, role = 'team_member' }) {
    const cleanEmail = email.trim().toLowerCase();
    const users = this.getUsers();

    if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('An account with this email already exists.');
    }

    const newUser = {
      id: 'usr-' + Date.now(),
      name: name.trim(),
      email: cleanEmail,
      password: 'password123', // Default temporary password
      role: role,
      status: 'Active',
      avatar: name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .substring(0, 2)
        .toUpperCase(),
      color: role === 'project_manager' ? '#0C66E4' : '#10B981',
    };

    const updated = [newUser, ...users];
    this.saveUsers(updated);
    return newUser;
  },

  updateRole(userId, newRole) {
    const users = this.getUsers();
    const updated = users.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
    this.saveUsers(updated);
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

  getTeamMembers() {
    const raw = this.getUsers().filter(
      (u) => u.role?.toLowerCase() === 'team_member'
    );
    const seen = new Set();
    return raw.filter((u) => {
      if (!u.name || seen.has(u.name)) return false;
      seen.add(u.name);
      return true;
    });
  },

  deleteUser(userId) {
    const users = this.getUsers();
    const updated = users.filter((u) => u.id !== userId);
    this.saveUsers(updated);
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

