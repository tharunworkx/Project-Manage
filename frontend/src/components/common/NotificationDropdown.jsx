import React from 'react';
import { Bell } from 'lucide-react';
import { Dropdown } from '../ui/Dropdown';

export function NotificationDropdown() {
  return (
    <Dropdown
      trigger={
        <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition cursor-pointer">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-indigo-500 ring-2 ring-white dark:ring-slate-950" />
        </button>
      }
    >
      <div className="p-3">
        <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 mb-2">Notifications</h4>
        <div className="space-y-2 text-xs text-slate-500">
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <p className="font-medium text-slate-800 dark:text-slate-200">Task assigned to you</p>
            <p className="text-[11px]">Design onboarding flow · 2h ago</p>
          </div>
          <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <p className="font-medium text-slate-800 dark:text-slate-200">Project milestone reached</p>
            <p className="text-[11px]">Taskflow Core Web App · 5h ago</p>
          </div>
        </div>
      </div>
    </Dropdown>
  );
}
