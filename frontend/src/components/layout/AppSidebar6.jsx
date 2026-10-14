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
  UserCheck,
  Sliders,
  ChevronsUpDown,
  Search,
} from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';
import { useAuthContext } from '../../context/AuthContext';
import { ROLES } from '../../lib/constants';
import { toast } from 'sonner';

export function AppSidebar6() {
  const { isOpen } = useSidebar();
  const { role, isAdmin } = useAuthContext();
  const [searchFilter, setSearchFilter] = useState('');
  const [hoveredId, setHoveredId] = useState(null);

  // Navigation items for the 2 user roles (Dashboard removed, Kanban is primary)
  const getNavItemsForRole = () => {
    if (isAdmin) {
      // User 1 — Admin / Project Manager (10 items)
      return [
        { label: 'Kanban Board', path: '/kanban', icon: FolderKanban },
        { label: 'My Tasks', path: '/tasks', icon: CheckSquare },
        { label: 'Projects', path: '/projects', icon: LayoutDashboard },
        { label: 'Calendar', path: '/calendar', icon: Calendar },
        { label: 'Activity', path: '/activity', icon: Activity },
        { label: 'Notifications', path: '/notifications', icon: Bell },
        { label: 'Team Members', path: '/team', icon: Users2 },
        { label: 'Reports & Analytics', path: '/reports', icon: BarChart3 },
        { label: 'Workspace Settings', path: '/settings', icon: Settings },
        { label: 'User Management', path: '/users', icon: ShieldCheck },
        { label: 'Preferences', path: '/preferences', icon: Sliders },
      ];
    } else {
      // User 2 — Team Member (6 items)
      return [
        { label: 'Kanban Board', path: '/kanban', icon: FolderKanban },
        { label: 'My Tasks', path: '/tasks', icon: CheckSquare },
        { label: 'Projects', path: '/projects', icon: LayoutDashboard },
        { label: 'Calendar', path: '/calendar', icon: Calendar },
        { label: 'Notifications', path: '/notifications', icon: Bell },
        { label: 'Preferences', path: '/preferences', icon: Sliders },
      ];
    }
  };

  const navItems = getNavItemsForRole();
  const filteredNav = navItems.filter((item) =>
    item.label.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="relative flex select-none shrink-0 z-30">
      {/* Sidebar Panel */}
      <aside
        className={`flex flex-col border-r border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] text-slate-800 dark:text-[#DEE4EA] h-[calc(100vh-3.5rem)] transition-all duration-200 ease-in-out overflow-hidden ${
          isOpen ? 'w-64 min-w-[256px]' : 'w-0 min-w-0 border-r-0'
        }`}
      >
        <div className="flex flex-col h-full w-64 p-3.5">
          {/* Workspace Switcher Header & Active Role Indicator */}
          <div className="pb-3 border-b border-slate-200 dark:border-[#282E33]/70 shrink-0">
            <div
              className="flex w-full items-center justify-between p-2 rounded-xl"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="h-8 w-8 rounded-full bg-[#FCE8E6] text-[#C5221F] font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                  S
                </div>
                <div className="min-w-0 text-left">
                  <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-[#DEE4EA] truncate leading-tight">
                    Southern Rescue Ser...
                  </h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    {/* Coloured Logo Badge with Sidebar-style Icon */}
                    {isAdmin ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#0C66E4]/10 dark:bg-[#579DFF]/15 text-[#0C66E4] dark:text-[#579DFF] border border-[#0C66E4]/25">
                        <ShieldCheck className="h-3 w-3 stroke-[2.2]" />
                        <span>Admin / PM</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
                        <UserCheck className="h-3 w-3 stroke-[2.2]" />
                        <span>Team Member</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <ChevronsUpDown className="h-4 w-4 text-slate-400 dark:text-[#738496] shrink-0" />
            </div>
          </div>

          {/* Quick Filter Search */}
          <div className="pt-2.5 pb-1 shrink-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 dark:text-[#738496]" />
              <input
                type="text"
                placeholder="Search menu..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full h-8.5 rounded-xl border border-slate-200 bg-slate-50 dark:border-[#333C44] dark:bg-[#22272B] pl-8.5 pr-3 text-xs text-slate-800 dark:text-[#DEE4EA] placeholder-slate-400 dark:placeholder-[#738496] transition focus:border-[#0C66E4] dark:focus:border-[#579DFF] focus:outline-none"
              />
            </div>
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
                  onMouseEnter={() => setHoveredId(item.path)}
                  className={({ isActive }) =>
                    `relative flex items-center gap-3.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150 z-10 ${
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

                  <Icon className="h-4.5 w-4.5 shrink-0 stroke-[1.8]" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}

export default AppSidebar6;
