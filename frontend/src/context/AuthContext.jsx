import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ROLES } from '../lib/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Role state: 'admin', 'project_manager', or 'team_member'
  const [role, setRoleState] = useState(() => {
    const saved = localStorage.getItem('taskora_role');
    if (saved === ROLES.PROJECT_MANAGER) return ROLES.PROJECT_MANAGER;
    if (saved === ROLES.TEAM_MEMBER) return ROLES.TEAM_MEMBER;
    return ROLES.ADMIN;
  });

  const setRole = (newRole) => {
    let target = ROLES.TEAM_MEMBER;
    if (newRole === ROLES.ADMIN) target = ROLES.ADMIN;
    else if (newRole === ROLES.PROJECT_MANAGER) target = ROLES.PROJECT_MANAGER;
    setRoleState(target);
    localStorage.setItem('taskora_role', target);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const userEmail = currentUser.email?.toLowerCase() || '';
        const metaRole = currentUser.user_metadata?.role;

        if (userEmail.includes('tharun')) {
          setRole(ROLES.ADMIN);
        } else if (metaRole === 'project_manager') {
          setRole(ROLES.PROJECT_MANAGER);
        } else if (metaRole === 'admin') {
          setRole(ROLES.ADMIN);
        } else {
          setRole(ROLES.TEAM_MEMBER);
        }
      }
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        const userEmail = currentUser.email?.toLowerCase() || '';
        const metaRole = currentUser.user_metadata?.role;
        if (userEmail.includes('tharun')) {
          setRole(ROLES.ADMIN);
        } else if (metaRole === 'project_manager') {
          setRole(ROLES.PROJECT_MANAGER);
        } else if (metaRole === 'admin') {
          setRole(ROLES.ADMIN);
        } else {
          setRole(ROLES.TEAM_MEMBER);
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });

  // Automatically assign 'team_member' to all new users
  const signUp = (email, password, metadata = {}) => {
    return supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: ROLES.TEAM_MEMBER,
          ...metadata,
        },
      },
    });
  };

  const signOut = () => supabase.auth.signOut();

  const isAdmin = role === ROLES.ADMIN;
  const isProjectManager = role === ROLES.PROJECT_MANAGER;
  const isTeamMember = role === ROLES.TEAM_MEMBER;

  const value = {
    user,
    session,
    loading,
    role,
    setRole,
    isAdmin,
    isProjectManager,
    isTeamMember,
    // Granular permission helpers
    canManageUsers: isAdmin,
    canManageWorkspace: isAdmin,
    canViewAllProjects: isAdmin,
    canAssignProjectManagers: isAdmin,
    canViewCompanyReports: isAdmin,
    canCreateProjects: isAdmin || isProjectManager,
    canManageProjects: isAdmin || isProjectManager,
    canCreateTasks: isAdmin || isProjectManager,
    canManageTaskMetadata: isAdmin || isProjectManager,
    canDeleteTasks: isAdmin || isProjectManager,
    canUpdateTaskStatus: true, // Admin, PM, and Team Member can all update status
    canManageMembers: isAdmin || isProjectManager,
    signIn,
    signUp,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext must be used within an AuthProvider');
  return context;
}
