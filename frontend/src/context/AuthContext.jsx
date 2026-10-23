import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ROLES } from '../lib/constants';
import { userService } from '../services/userService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // Current logged in user object
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('taskflow_logged_in_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch {}
    return null;
  });

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(false);

  // Check if current user is the actual administrator account
  const isActualAdmin = Boolean(
    user &&
      (user.email?.toLowerCase() === 'tharun@gmail.com' ||
        user.email?.toLowerCase() === 'tharun.workx@gmail.com' ||
        user.accountRole === ROLES.ADMIN ||
        user.role === ROLES.ADMIN)
  );

  // Active role mode (Admin can simulate other roles; managers and members are locked)
  const [role, setRoleState] = useState(() => {
    try {
      const savedUser = localStorage.getItem('taskflow_logged_in_user');
      const parsed = savedUser ? JSON.parse(savedUser) : null;
      if (parsed) {
        if (parsed.email?.toLowerCase().includes('tharun') || parsed.role === ROLES.ADMIN) {
          const savedRole = localStorage.getItem('taskora_active_role');
          return savedRole || ROLES.ADMIN;
        }
        return parsed.role || ROLES.TEAM_MEMBER;
      }
    } catch {}
    return null;
  });

  // Only the actual Admin is permitted to switch active role mode
  const setRole = (newRole) => {
    if (!isActualAdmin) {
      // Locked: Manager and Member cannot switch roles
      return;
    }
    let target = ROLES.TEAM_MEMBER;
    if (newRole === ROLES.ADMIN) target = ROLES.ADMIN;
    else if (newRole === ROLES.PROJECT_MANAGER) target = ROLES.PROJECT_MANAGER;

    setRoleState(target);
    localStorage.setItem('taskora_active_role', target);
  };

  const signIn = async (email, password) => {
    const cleanEmail = email?.trim().toLowerCase();
    const authenticatedUser = userService.authenticate(cleanEmail, password);

    setUser(authenticatedUser);
    localStorage.setItem('taskflow_logged_in_user', JSON.stringify(authenticatedUser));

    // If Admin, restore active role or default to admin; if Manager/Member, lock to their designated role
    if (cleanEmail.includes('tharun') || authenticatedUser.role === ROLES.ADMIN) {
      setRoleState(ROLES.ADMIN);
      localStorage.setItem('taskora_active_role', ROLES.ADMIN);
    } else {
      setRoleState(authenticatedUser.role || ROLES.TEAM_MEMBER);
      localStorage.setItem('taskora_active_role', authenticatedUser.role || ROLES.TEAM_MEMBER);
    }

    return { data: { user: authenticatedUser }, error: null };
  };

  useEffect(() => {
    userService.fetchUsersFromRemote().catch(() => {});
  }, []);

  const signUp = async (email, password, fullName) => {
    const rawName =
      typeof fullName === 'string'
        ? fullName
        : fullName?.full_name || fullName?.name || '';

    try {
      const registeredUser = await userService.registerUser({
        name: rawName,
        email,
        password,
      });

      setUser(registeredUser);
      localStorage.setItem('taskflow_logged_in_user', JSON.stringify(registeredUser));

      if (registeredUser.email.toLowerCase().includes('tharun') || registeredUser.role === ROLES.ADMIN) {
        setRoleState(ROLES.ADMIN);
        localStorage.setItem('taskora_active_role', ROLES.ADMIN);
      } else {
        setRoleState(registeredUser.role || ROLES.TEAM_MEMBER);
        localStorage.setItem('taskora_active_role', registeredUser.role || ROLES.TEAM_MEMBER);
      }

      return { data: { user: registeredUser }, error: null };
    } catch (err) {
      return { data: null, error: err };
    }
  };

  const updateUser = (updatedFields) => {
    setUser((prevUser) => {
      const updated = {
        ...prevUser,
        ...updatedFields,
      };
      try {
        localStorage.setItem('taskflow_logged_in_user', JSON.stringify(updated));
      } catch (err) {
        console.error('Error saving user to localStorage', err);
      }
      try {
        if (updated.email) {
          userService.updateUserProfile(updated.email, updatedFields);
        } else if (updated.id) {
          userService.updateUserProfile(updated.id, updatedFields);
        }
      } catch (err) {
        console.error('Error updating userService', err);
      }
      return updated;
    });
  };

  const signOut = () => {
    localStorage.removeItem('taskflow_logged_in_user');
    localStorage.removeItem('taskora_active_role');
    setUser(null);
    setRoleState(null);
  };

  const isAdmin = Boolean(user && role === ROLES.ADMIN);
  const isProjectManager = Boolean(user && role === ROLES.PROJECT_MANAGER);
  const isTeamMember = Boolean(user && role === ROLES.TEAM_MEMBER);

  const value = {
    user,
    updateUser,
    session,
    loading,
    role,
    setRole,
    isActualAdmin, // true only for tharun@gmail.com
    canSwitchRoles: isActualAdmin,
    isAdmin,
    isProjectManager,
    isTeamMember,
    // Granular permissions
    canManageUsers: isAdmin,
    canManageWorkspace: isAdmin,
    canViewAllProjects: isAdmin,
    canAssignProjectManagers: isAdmin,
    canViewCompanyReports: isAdmin,
    canCreateProjects: isAdmin || isProjectManager, // Members cannot create projects
    canManageProjects: isAdmin || isProjectManager, // Members cannot delete or manage projects
    canCreateTasks: true, // Members can add tasks
    canManageTaskMetadata: true, // Members can edit task details and metadata
    canDeleteTasks: true, // Members can delete tasks
    canUpdateTaskStatus: true, // Admin, PM, and Member can update status
    canMarkTaskDone: isAdmin || isProjectManager, // ONLY Done status is restricted to PM and Admin
    canManageMembers: isAdmin || isProjectManager,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within an AuthProvider');
  return context;
}
