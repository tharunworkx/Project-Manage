import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ROLES } from '../lib/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Role state: 'admin' (Admin / Project Manager) or 'team_member' (Team Member)
  const [role, setRoleState] = useState(() => {
    const saved = localStorage.getItem('taskora_role');
    if (saved === 'team_member') return ROLES.TEAM_MEMBER;
    return ROLES.ADMIN;
  });

  const setRole = (newRole) => {
    const targetRole = newRole === 'team_member' ? ROLES.TEAM_MEMBER : ROLES.ADMIN;
    setRoleState(targetRole);
    localStorage.setItem('taskora_role', targetRole);
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
        } else if (metaRole === 'admin' || metaRole === 'project_manager') {
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
        } else if (metaRole === 'admin' || metaRole === 'project_manager') {
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

  const value = {
    user,
    session,
    loading,
    role,
    setRole,
    isAdmin: role === ROLES.ADMIN,
    isProjectManager: role === ROLES.ADMIN, // Admin / Project Manager are unified
    isTeamMember: role === ROLES.TEAM_MEMBER,
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
