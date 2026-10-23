import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Plus,
  Bell,
  Maximize2,
  Minimize2,
  PanelLeftClose,
  PanelLeft,
  Check,
  ExternalLink,
  Clock,
} from 'lucide-react';
import { TaskDialog } from '../tasks/TaskDialog';
import { useTasks } from '../../hooks/useTasks';
import { useSidebar } from '../../context/SidebarContext';
import { useWorkspaceContext } from '../../context/WorkspaceContext';
import { Profile1 } from '../profile-1';
import { notificationService } from '../../services/notificationService';

export function Topbar() {
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspaceContext();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const notifRef = useRef(null);
  const [searchVal, setSearchVal] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [notifications, setNotifications] = useState(() => notificationService.getNotifications());
  const { createTask } = useTasks(null, currentWorkspace?.id);
  const { isDrawerOpen, toggleDrawer } = useSidebar();

  useEffect(() => {
    notificationService.fetchNotifications().then((data) => {
      if (Array.isArray(data)) setNotifications(data);
    });
    const unsub = notificationService.subscribe((updated) => {
      setNotifications(updated);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsNotifOpen(false);
      }
    }
    if (isNotifOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isNotifOpen]);

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

  const markAllRead = () => {
    notificationService.markAllAsRead();
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#1D2125] px-4 select-none text-slate-800 dark:text-[#DEE4EA] z-40 transition-colors duration-150">
        {/* Left: Sidebar Toggle Icon & Taskora Logo */}
        <div className="flex items-center gap-2">
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
          <Link to="/kanban" className="flex items-center gap-2.5 px-1 cursor-pointer">
            <img
              src="/logo.png"
              alt="Taskora Logo"
              className="h-6.5 w-6.5 rounded-full object-cover shadow-xs ring-1 ring-blue-500/20"
            />
            <span className="font-bold text-base tracking-tight text-slate-900 dark:text-[#DEE4EA]">
              Taskora
            </span>
          </Link>
        </div>

        {/* Center: Search & + Create button */}
        <div className="flex items-center gap-3">
          <div className="relative w-72 md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-[#738496]" />
            <input
              type="text"
              placeholder="Search"
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full h-9 rounded-md border border-black dark:border-white bg-slate-100 dark:bg-[#22272B] pl-9 pr-3 text-sm text-slate-900 dark:text-[#DEE4EA] placeholder-slate-400 dark:placeholder-[#738496] transition focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-[#1D2125] focus:outline-none"
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

        {/* Right: Fullscreen, Responsive Notifications, Help, Avatar */}
        <div className="flex items-center gap-1.5">
          {/* Full Screen Button */}
          <button
            onClick={handleToggleFullscreen}
            title={isFullscreen ? 'Exit full screen' : 'Full screen'}
            className="flex h-8.5 w-8.5 items-center justify-center rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-[#9FADBC] dark:hover:bg-[#282E33] dark:hover:text-[#DEE4EA] transition cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="h-4.5 w-4.5" /> : <Maximize2 className="h-4.5 w-4.5" />}
          </button>

          {/* Fully Responsive Notifications Dropdown Menu */}
          <div className="relative inline-flex items-center" ref={notifRef}>
            <button
              onClick={() => setIsNotifOpen((prev) => !prev)}
              title="Notifications"
              aria-label="Open notifications"
              aria-expanded={isNotifOpen}
              className={`relative flex h-8.5 w-8.5 items-center justify-center rounded-md transition cursor-pointer focus:outline-none ${
                isNotifOpen
                  ? 'bg-blue-50 dark:bg-[#1C2B41] text-[#0C66E4] dark:text-[#579DFF]'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-[#9FADBC] dark:hover:bg-[#282E33] dark:hover:text-[#DEE4EA]'
              }`}
            >
              <Bell className="h-4.5 w-4.5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-[#0C66E4] ring-2 ring-white dark:ring-[#1D2125]" />
              )}
            </button>

            <AnimatePresence>
              {isNotifOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -4 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -4 }}
                  transition={{ type: 'spring', stiffness: 450, damping: 28 }}
                  className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-3 text-slate-900 dark:text-[#DEE4EA] shadow-2xl backdrop-blur-md select-none z-50"
                >
                  {/* Notifications Header */}
                  <div className="flex items-center justify-between pb-2.5 mb-2 border-b border-slate-100 dark:border-[#282E33]">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-slate-900 dark:text-[#DEE4EA]">Notifications</h4>
                      {unreadCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#0C66E4]/10 text-[#0C66E4] dark:bg-[#579DFF]/15 dark:text-[#579DFF]">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] font-medium text-[#0C66E4] dark:text-[#579DFF] hover:underline cursor-pointer flex items-center gap-1"
                      >
                        <Check className="h-3 w-3" />
                        <span>Mark all read</span>
                      </button>
                    )}
                  </div>

                  {/* Notification Items List */}
                  <div className="space-y-1.5 max-h-72 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          if (n.unread) {
                            notificationService.markAsRead(n.id);
                          }
                        }}
                        className={`p-2.5 rounded-xl transition cursor-pointer ${
                          n.unread
                            ? 'bg-blue-50/70 dark:bg-[#1C2B41]/50 border border-[#0C66E4]/20'
                            : 'hover:bg-slate-50 dark:hover:bg-[#22272B]/60'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5 min-w-0">
                            <p className="text-xs font-semibold text-slate-900 dark:text-[#DEE4EA] leading-tight truncate">
                              {n.title}
                            </p>
                            <p className="text-[11px] text-slate-500 dark:text-[#9FADBC] leading-tight">
                              {n.desc}
                            </p>
                          </div>
                          {n.unread && (
                            <span className="h-1.5 w-1.5 rounded-full bg-[#0C66E4] dark:bg-[#579DFF] shrink-0 mt-1" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-slate-100 dark:bg-[#282E33] my-2" />

                  {/* Footer Link to full notifications page */}
                  <Link
                    to="/notifications"
                    onClick={() => setIsNotifOpen(false)}
                    className="flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold text-[#0C66E4] dark:text-[#579DFF] hover:underline cursor-pointer"
                  >
                    <span>View all notifications</span>
                    <ExternalLink className="h-3 w-3" />
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Interactive Profile Popup Menu */}
          <Profile1 />
        </div>
      </header>

      {/* Create Issue Dialog */}
      <TaskDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={async (data) => {
          try {
            await createTask({
              workspace_id: currentWorkspace?.id,
              ...data,
            });
          } catch (err) {
            console.error('Failed to create task:', err);
          }
          setIsCreateOpen(false);
        }}
      />
    </>
  );
}
