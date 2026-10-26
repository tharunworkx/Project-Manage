import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Calendar,
  Activity,
  Bell,
  Users2,
  BarChart3,
  Settings,
  ShieldCheck,
  Briefcase,
  UserCheck,
  Sliders,
  Plus,
  Check,
  Building2,
  X,
} from 'lucide-react';
import { clientService } from '../../services/clientService';
import { toast } from 'sonner';
import { useSidebar } from '../../context/SidebarContext';
import { useAuthContext } from '../../context/AuthContext';
import { useWorkspaceContext } from '../../context/WorkspaceContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROLES } from '../../lib/constants';
import { CreateWorkspaceModal } from '../workspace/CreateWorkspaceModal';

export function AppSidebar6() {
  const { isOpen, close } = useSidebar();
  const { user, role, isAdmin, isProjectManager, isTeamMember } = useAuthContext();
  const { workspaces, currentWorkspace, switchWorkspace } = useWorkspaceContext();
  const [hoveredId, setHoveredId] = useState(null);
  const [isNewWorkspaceOpen, setIsNewWorkspaceOpen] = useState(false);

  // Navigation items customized per role
  const getNavItemsForRole = () => {
    if (isAdmin) {
      // 1. ADMIN (Full workspace & company-wide control)
      return [
        { label: 'Kanban Board', path: '/kanban', icon: FolderKanban },
        { label: 'All Tasks', path: '/tasks', icon: CheckSquare },
        { label: 'All Projects', path: '/projects', icon: Briefcase },
        { label: 'Clients', path: '/clients', icon: Building2 },
        { label: 'Calendar', path: '/calendar', icon: Calendar },
        { label: 'Activity Log', path: '/activity', icon: Activity },
        { label: 'Employee Accounts & Roles', path: '/users', icon: ShieldCheck },
        { label: 'Workspace Settings', path: '/settings', icon: Settings },
        { label: 'Notifications', path: '/notifications', icon: Bell },
        { label: 'Preferences', path: '/preferences', icon: Sliders },
      ];
    } else if (isProjectManager) {
      // 2. PROJECT MANAGER (Project management & team assignments)
      return [
        { label: 'Kanban Board', path: '/kanban', icon: FolderKanban },
        { label: 'My Tasks', path: '/tasks', icon: CheckSquare },
        { label: 'Projects', path: '/projects', icon: Briefcase },
        { label: 'Clients', path: '/clients', icon: Building2 },
        { label: 'Project Members', path: '/team', icon: Users2 },
        { label: 'Calendar', path: '/calendar', icon: Calendar },
        { label: 'Notifications', path: '/notifications', icon: Bell },
        { label: 'Preferences', path: '/preferences', icon: Sliders },
      ];
    } else {
      // 3. TEAM MEMBER (Assigned projects & tasks)
      return [
        { label: 'Kanban Board', path: '/kanban', icon: FolderKanban },
        { label: 'My Tasks', path: '/tasks', icon: CheckSquare },
        { label: 'Assigned Projects', path: '/projects', icon: Briefcase },
        { label: 'Clients', path: '/clients', icon: Building2 },
        { label: 'Calendar', path: '/calendar', icon: Calendar },
        { label: 'Notifications', path: '/notifications', icon: Bell },
        { label: 'Preferences', path: '/preferences', icon: Sliders },
      ];
    }
  };

  const navItems = getNavItemsForRole();
  const filteredNav = navItems;

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          onClick={close}
          className="fixed inset-0 bg-black/40 dark:bg-black/60 z-40 md:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      <div className="select-none shrink-0 z-50 md:z-30">
        {/* Sidebar Panel - overlay drawer on mobile, in-flow column on desktop */}
        <aside
          className={`flex flex-col border-r border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] text-slate-800 dark:text-[#DEE4EA] h-full transition-all duration-200 ease-in-out overflow-hidden fixed inset-y-0 left-0 md:relative shadow-2xl md:shadow-none ${
            isOpen
              ? 'w-72 sm:w-64 min-w-[256px] translate-x-0'
              : 'w-0 min-w-0 border-r-0 -translate-x-full md:translate-x-0 pointer-events-none md:pointer-events-auto'
          }`}
        >
          <div className="flex flex-col h-full w-72 sm:w-64 p-3.5">
            {/* User Name Header & Active Role Indicator */}
            <div className="pb-3 border-b border-slate-200 dark:border-[#282E33]/70 shrink-0 space-y-2">
              <div className="flex items-center justify-between p-1 rounded-xl">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="h-8.5 w-8.5 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-2xs"
                    style={{ backgroundColor: user?.color || '#7C3AED' }}
                  >
                    {user?.avatar || (user?.name ? user.name.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() : 'TR')}
                  </div>
                  <div className="min-w-0 text-left flex-1">
                    <h3 className="text-sm font-bold tracking-tight text-slate-900 dark:text-[#DEE4EA] truncate leading-tight">
                      {user?.name || 'Tharun R'}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {isAdmin && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#282E33] text-slate-700 dark:text-[#DEE4EA] border border-slate-200 dark:border-[#333C44]">
                          <ShieldCheck className="h-3 w-3 stroke-[1.8]" />
                          <span>Admin</span>
                        </span>
                      )}
                      {isProjectManager && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#282E33] text-slate-700 dark:text-[#DEE4EA] border border-slate-200 dark:border-[#333C44]">
                          <Briefcase className="h-3 w-3 stroke-[1.8]" />
                          <span>Project Manager</span>
                        </span>
                      )}
                      {isTeamMember && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#282E33] text-slate-700 dark:text-[#DEE4EA] border border-slate-200 dark:border-[#333C44]">
                          <UserCheck className="h-3 w-3 stroke-[1.8]" />
                          <span>Team Member</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Mobile close button */}
                <button
                  onClick={close}
                  className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#282E33] transition"
                  title="Close sidebar"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Workspace Switcher & Creator */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    title="Switch or create workspace"
                    className="flex w-full items-center justify-between px-2.5 py-1.5 rounded-lg border border-slate-200/80 dark:border-[#333C44]/70 bg-slate-50 dark:bg-[#22272B] hover:bg-slate-100 dark:hover:bg-[#282E33] transition cursor-pointer text-left"
                  >
                  <div className="flex items-center gap-2 min-w-0">
                    <div
                      className="h-4.5 w-4.5 rounded flex items-center justify-center text-white text-[9px] font-bold shrink-0"
                      style={{ backgroundColor: currentWorkspace?.color || '#0C66E4' }}
                    >
                      {currentWorkspace?.initial || 'W'}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-[#DEE4EA] truncate">
                      {currentWorkspace?.name || 'Workspace'}
                    </span>
                  </div>
                  <Building2 className="h-3.5 w-3.5 text-slate-400 dark:text-[#738496] shrink-0 ml-1" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-56 rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-1.5 shadow-xl text-xs z-50"
              >
                <div className="px-2 py-1 text-[10px] font-bold text-slate-400 dark:text-[#738496] uppercase tracking-wider">
                  Workspaces
                </div>
                {workspaces.map((ws) => {
                  const isCurrent = ws.id === currentWorkspace?.id;
                  return (
                    <DropdownMenuItem
                      key={ws.id}
                      onClick={() => switchWorkspace(ws.id)}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg cursor-pointer transition ${
                        isCurrent
                          ? 'bg-blue-50 dark:bg-[#1C2B41] text-[#0C66E4] dark:text-[#579DFF]'
                          : 'hover:bg-slate-100 dark:hover:bg-[#22272B] text-slate-700 dark:text-[#DEE4EA]'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <div
                          className="h-4 w-4 rounded flex items-center justify-center text-white text-[8px] font-bold shrink-0"
                          style={{ backgroundColor: ws.color || '#0C66E4' }}
                        >
                          {ws.initial || 'W'}
                        </div>
                        <span className="truncate font-medium">{ws.name}</span>
                      </div>
                      {isCurrent && <Check className="h-3.5 w-3.5 shrink-0 ml-1 text-[#0C66E4] dark:text-[#579DFF]" />}
                    </DropdownMenuItem>
                  );
                })}

                <DropdownMenuSeparator className="my-1 border-slate-200 dark:border-[#282E33]" />

                <DropdownMenuItem
                  onClick={() => setIsNewWorkspaceOpen(true)}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[#0C66E4] dark:text-[#579DFF] hover:bg-blue-50 dark:hover:bg-[#1C2B41] font-semibold cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>Create New Workspace</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>



          {/* Navigation Items List with Smooth Sliding Pill */}
          <div
            onMouseLeave={() => setHoveredId(null)}
            className="flex-1 overflow-y-auto py-2 space-y-1"
          >
            {filteredNav.map((item) => {
              const Icon = item.icon;
              const isHovered = hoveredId === item.path;

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      close();
                    }
                  }}
                  onMouseEnter={() => setHoveredId(item.path)}
                  className={({ isActive }) =>
                    `relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 z-10 group ${
                      isActive
                        ? 'text-[#0C66E4] dark:text-[#579DFF] font-semibold'
                        : 'text-slate-600 hover:text-slate-900 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA]'
                    }`
                  }
                >
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        layoutId="sidebar-hover-pill"
                        className="absolute inset-0 rounded-xl bg-slate-100 dark:bg-[#22272B] -z-10 shadow-xs border border-slate-200 dark:border-[#333C44]/40"
                        transition={{
                          type: 'spring',
                          stiffness: 420,
                          damping: 34,
                          mass: 0.8,
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      />
                    )}
                  </AnimatePresence>

                  <div className="flex items-center gap-3.5 min-w-0">
                    <Icon className="h-4.5 w-4.5 shrink-0 stroke-[1.8]" />
                    <span className="truncate">{item.label}</span>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Modal to Create New Workspace */}
      <CreateWorkspaceModal
        isOpen={isNewWorkspaceOpen}
        onClose={() => setIsNewWorkspaceOpen(false)}
      />
    </div>
    </>
  );
}

export default AppSidebar6;
