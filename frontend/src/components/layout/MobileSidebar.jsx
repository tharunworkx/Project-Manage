import React from 'react';
import { X, LayoutDashboard, CheckSquare, FolderKanban, Columns3, Calendar, BarChart3, Settings } from 'lucide-react';
import { SidebarItem } from './SidebarItem';
import { WorkspaceSwitcher } from './WorkspaceSwitcher';

const NAV_ITEMS = [
  { label: 'Kanban Board', path: '/kanban', icon: Columns3 },
  { label: 'My Tasks', path: '/tasks', icon: CheckSquare },
  { label: 'Projects', path: '/projects', icon: FolderKanban },
  { label: 'Calendar', path: '/calendar', icon: Calendar },
  { label: 'Settings', path: '/settings', icon: Settings },
];

export function MobileSidebar({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={onClose} />
      <div className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 p-5 shadow-2xl flex flex-col z-50 animate-slide-in-right">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <img
              src="/logo.png"
              alt="Taskora Logo"
              className="h-8 w-8 rounded-full object-cover shadow-sm ring-1 ring-blue-500/20"
            />
            <span className="font-extrabold text-lg text-slate-900 dark:text-white">Taskora</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>
        <WorkspaceSwitcher />
        <div className="mt-6 flex-1 space-y-1">
          {NAV_ITEMS.map((item) => (
            <SidebarItem key={item.path} item={item} onClick={onClose} />
          ))}
        </div>
      </div>
    </div>
  );
}
