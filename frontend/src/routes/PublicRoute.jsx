import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export function PublicRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-full w-full min-h-screen min-w-full items-center justify-center bg-slate-950">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/kanban" replace />;
  }

  return <Outlet />;
}
