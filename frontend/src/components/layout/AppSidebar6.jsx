import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckSquare,
  FolderKanban,
  Repeat,
  Boxes,
  FileText,
  Calendar,
  Settings,
  Users2,
  Plus,
  ChevronsUpDown,
  Search,
  Bookmark,
} from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';
import { toast } from 'sonner';

export function AppSidebar6() {
  const { isOpen } = useSidebar();
  const [searchFilter, setSearchFilter] = useState('');

  // Track hovered item for smooth sliding pill animation that follows the cursor/arrow
  const [hoveredId, setHoveredId] = useState(null);

  // Main navigation items
  const primaryNav = [
    { label: 'Work Items', path: '/board', icon: CheckSquare },
    { label: 'Projects', path: '/projects', icon: FolderKanban },
    { label: 'Cycles', path: '/cycles', icon: Repeat },
    { label: 'Modules', path: '/modules', icon: Boxes },
    { label: 'Calendar', path: '/calendar', icon: Calendar },
    { label: 'Views', path: '/views', icon: Bookmark },
    { label: 'Pages', path: '/pages', icon: FileText },
    { label: 'Settings', path: '/settings', icon: Settings },
  ];

  // Teams sub-items
  const teamsList = [
    { name: 'Charlie', color: '#579DFF' }, // Soft blue
    { name: 'Bravo', color: '#F5CD47' },   // Soft amber/orange
    { name: 'Delta', color: '#BA75FF' },   // Soft purple
  ];

  const filteredNav = primaryNav.filter((item) =>
    item.label.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="relative flex select-none shrink-0 z-30">
      {/* Static In-Dashboard Sidebar Panel */}
      <aside
        className={`flex flex-col border-r border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] text-slate-800 dark:text-[#DEE4EA] h-[calc(100vh-3.5rem)] transition-all duration-200 ease-in-out overflow-hidden ${
          isOpen ? 'w-64 min-w-[256px]' : 'w-0 min-w-0 border-r-0'
        }`}
      >
        <div className="flex flex-col h-full w-64 p-3.5">
          {/* Workspace Switcher Header */}
          <div className="pb-3 border-b border-slate-200 dark:border-[#282E33]/70 shrink-0">
            <button
              onClick={() => toast.info('Workspace: Southern Rescue Services · Taskora')}
              className="flex w-full items-center justify-between p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-[#22272B] transition cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {/* Soft circular avatar with initial 'S' */}
                <div className="h-8 w-8 rounded-full bg-[#FCE8E6] text-[#C5221F] font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
                  S
                </div>
                <div className="min-w-0 text-left">
                  <h3 className="text-sm font-semibold tracking-tight text-slate-900 dark:text-[#DEE4EA] truncate leading-tight">
                    Southern Rescue Ser...
                  </h3>
                  <span className="text-[11px] text-slate-500 dark:text-[#738496]">Taskora Space</span>
                </div>
              </div>

              {/* Up-Down selector arrows */}
              <ChevronsUpDown className="h-4 w-4 text-slate-400 dark:text-[#738496] group-hover:text-slate-700 dark:group-hover:text-[#DEE4EA] shrink-0 transition" />
            </button>
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

          {/* Scrollable Navigation List */}
          <div
            onMouseLeave={() => setHoveredId(null)}
            className="flex-1 overflow-y-auto py-2 space-y-1"
          >
            {/* Primary Nav Items with Smooth Sliding Pill */}
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
                  {/* The smooth sliding animation background pill */}
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

            {/* Teams Section */}
            <div className="pt-4 mt-2 border-t border-slate-200 dark:border-[#282E33]/70">
              <div className="flex items-center justify-between px-3 pb-2 select-none">
                <span className="text-sm font-semibold text-slate-900 dark:text-[#DEE4EA]">
                  Teams
                </span>
                <button
                  onClick={() => toast.success('Add team modal')}
                  title="Add team"
                  className="p-1 rounded hover:bg-slate-100 dark:hover:bg-[#22272B] text-slate-400 hover:text-slate-700 dark:text-[#738496] dark:hover:text-[#DEE4EA] transition cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-0.5">
                {teamsList.map((team) => {
                  const isHovered = hoveredId === team.name;

                  return (
                    <button
                      key={team.name}
                      onMouseEnter={() => setHoveredId(team.name)}
                      onClick={() => {
                        toast.info(`Viewing team: ${team.name}`);
                      }}
                      className="relative flex w-full items-center gap-3.5 px-3.5 py-2 rounded-xl text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA] transition-colors duration-150 text-left cursor-pointer z-10 group"
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
                      <Users2
                        className="h-4.5 w-4.5 shrink-0 transition"
                        style={{ color: team.color }}
                      />
                      <span className="truncate group-hover:text-slate-900 dark:group-hover:text-[#DEE4EA]">
                        {team.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
export default AppSidebar6;
