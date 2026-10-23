import React, { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AppSidebar6 } from './AppSidebar6';
import { Topbar } from './Topbar';
import { useAuthContext } from '../../context/AuthContext';
import { useWorkspaceContext } from '../../context/WorkspaceContext';
import { RequiredWorkspaceModal } from '../workspace/RequiredWorkspaceModal';

export function AppLayout() {
  const { isAdmin } = useAuthContext();
  const { workspaces, currentWorkspace } = useWorkspaceContext();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname.startsWith('/users') && !isAdmin) {
      navigate('/kanban', { replace: true });
    }
  }, [location.pathname, isAdmin, navigate]);

  const hasNoWorkspaces = !workspaces || workspaces.length === 0 || !currentWorkspace;

  return (
    <div className="flex h-full w-full min-h-full min-w-full flex-col overflow-hidden bg-slate-50 dark:bg-[#101214] text-slate-900 dark:text-[#DEE4EA] transition-colors duration-150">
      {/* Global Topbar */}
      <Topbar />

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Static In-Dashboard App Sidebar 6 */}
        <AppSidebar6 />

        {/* Main Content Area */}
        <main className="relative flex-1 flex flex-col overflow-y-auto bg-[#F8FAFC] dark:bg-[#101214] min-w-0 transition-colors duration-150">
          <Outlet />
        </main>
      </div>

      {/* Mandatory Workspace Creation Modal when all workspaces are deleted */}
      {hasNoWorkspaces && <RequiredWorkspaceModal />}
    </div>
  );
}

export default AppLayout;
