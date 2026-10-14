import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { ROLES } from '../lib/constants';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Role state: defaults to 'admin' for Tharun/initial admin, persisted in localStorage
  const [role, setRoleState] = useState(() => {
    return localStorage.getItem('taskora_role') || ROLES.ADMIN;
  });

  const setRole = (newRole) => {
    setRoleState(newRole);
    localStorage.setItem('taskora_role', newRole);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      // Determine role from profile or metadata
      if (currentUser) {
        const userEmail = currentUser.email?.toLowerCase() || '';
        const metaRole = currentUser.user_metadata?.role;

        if (userEmail.includes('tharun')) {
          setRole(ROLES.ADMIN);
        } else if (metaRole) {
          setRole(metaRole);
        } else {
          // New user default
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
        } else if (metaRole) {
          setRole(metaRole);
        } else {
          setRole(ROLES.TEAM_MEMBER);
        }
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = (email, password) => supabase.auth.signInWithPassword({ email, password });

  // Automatically assign 'team_member' role to all newly registered users
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
    isProjectManager: role === ROLES.PROJECT_MANAGER || role === ROLES.ADMIN,
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
