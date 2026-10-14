import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Plus,
  Bell,
  HelpCircle,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { TaskDialog } from '../tasks/TaskDialog';
import { useTasks } from '../../hooks/useTasks';
import { useSidebar } from '../../context/SidebarContext';
import { Profile1 } from '../profile-1';

export function Topbar() {
  const navigate = useNavigate();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { createTask } = useTasks();
  const { isDrawerOpen, toggleDrawer } = useSidebar();

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#1D2125] px-4 select-none text-slate-800 dark:text-[#DEE4EA] z-40 transition-colors duration-150">
        {/* Left: Sidebar Toggle Icon & Taskora Logo */}
        <div className="flex items-center gap-2">
          {/* Sidebar Toggle Button to collapse/expand static sidebar */}
          <button
            onClick={toggleDrawer}
            title={isDrawerOpen ? 'Collapse sidebar ( [ )' : 'Expand sidebar ( [ )'}
            className="flex h-8.5 w-8.5 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-[#9FADBC] dark:hover:bg-[#282E33] dark:hover:text-[#DEE4EA] transition cursor-pointer"
          >
            {isDrawerOpen ? (
              <PanelLeftClose className="h-5 w-5 text-[#0C66E4] dark:text-[#579DFF]" />
            ) : (
              <PanelLeft className="h-5 w-5 text-slate-500 dark:text-[#9FADBC]" />
            )}
          </button>

          {/* Taskora Logo */}
          <div className="flex items-center gap-2 px-1 cursor-pointer">
            <svg
              className="h-5.5 w-5.5 text-[#0C66E4]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M11.53 2c0 2.4-1.97 4.35-4.4 4.35H2.8V2h8.73zm-4.36 4.36c2.4 0 4.36 1.95 4.36 4.35v4.36H7.17V6.36zm4.36 4.36c0-2.4 1.97-4.36 4.4-4.36h4.34v4.36h-8.74zM16 15.08c-2.4 0-4.36-1.96-4.36-4.36V6.36H16v8.72z" />
            </svg>
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-[#DEE4EA]">
              Taskora
            </span>
          </div>
        </div>

        {/* Center: Search & + Create button */}
        <div className="flex items-center gap-3">
          <div className="relative w-72 md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-[#738496]" />
            <input
              type="text"
              placeholder="Search"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full h-9 rounded-md border border-slate-200 bg-slate-100 dark:border-[#333C44] dark:bg-[#22272B] pl-9 pr-3 text-sm text-slate-900 dark:text-[#DEE4EA] placeholder-slate-400 dark:placeholder-[#738496] transition focus:border-[#0C66E4] dark:focus:border-[#579DFF] focus:bg-white dark:focus:bg-[#1D2125] focus:outline-none"
            />
          </div>

          <button
            onClick={() => setIsCreateOpen(true)}
            className="flex h-9 items-center gap-1.5 rounded-md bg-[#0C66E4] hover:bg-[#0055CC] px-3.5 text-sm font-semibold text-white shadow-xs transition cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Create</span>
          </button>
        </div>

        {/* Right: Fullscreen, Notifications, Help, Avatar */}
        <div className="flex items-center gap-1.5">
          {/* Full Screen Button near Notifications */}
          <button
            onClick={handleToggleFullscreen}
            title={isFullscreen ? 'Exit full screen' : 'Full screen'}
            className="flex h-8.5 w-8.5 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-[#9FADBC] dark:hover:bg-[#282E33] dark:hover:text-[#DEE4EA] transition cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="h-4.5 w-4.5" /> : <Maximize2 className="h-4.5 w-4.5" />}
          </button>

          {/* Notifications */}
          <button
            title="Notifications"
            className="relative flex h-8.5 w-8.5 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-[#9FADBC] dark:hover:bg-[#282E33] dark:hover:text-[#DEE4EA] transition cursor-pointer"
          >
            <Bell className="h-4.5 w-4.5" />
          </button>

          {/* Help with 3+ badge */}
          <div className="relative">
            <button
              title="Help"
              className="flex h-8.5 w-8.5 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-[#9FADBC] dark:hover:bg-[#282E33] dark:hover:text-[#DEE4EA] transition cursor-pointer"
            >
              <HelpCircle className="h-4.5 w-4.5" />
            </button>
            <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4.5 items-center justify-center rounded-full bg-[#1D7AFC] text-[10px] font-bold text-white pointer-events-none">
              3+
            </span>
          </div>

          {/* Interactive Profile Popup Menu (contains Account Settings) */}
          <Profile1 />
        </div>
      </header>

      {/* Create Issue Dialog */}
      <TaskDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={(data) => {
          createTask({
            ...data,
            project_id: 'p1',
          });
          setIsCreateOpen(false);
        }}
      />
    </>
  );
}
