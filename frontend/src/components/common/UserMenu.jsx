import React from 'react';
import { LogOut, Settings, User } from 'lucide-react';
import { Dropdown } from '../ui/Dropdown';
import { Avatar } from '../ui/Avatar';
import { useAuth } from '../../hooks/useAuth';

export function UserMenu() {
  const { user, signOut } = useAuth();

  return (
    <Dropdown
      trigger={
        <button className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-indigo-500/20 cursor-pointer">
          <Avatar name={user?.user_metadata?.full_name || 'Admin User'} size="sm" />
        </button>
      }
    >
      <div className="p-2 border-b border-slate-100 dark:border-slate-800">
        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
          {user?.user_metadata?.full_name || 'Admin User'}
        </p>
        <p className="text-[11px] text-slate-500 truncate">{user?.email || 'admin@taskflow.dev'}</p>
      </div>
      <div className="py-1">
        <button className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
          <User className="h-3.5 w-3.5" /> Profile
        </button>
        <button className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer">
          <Settings className="h-3.5 w-3.5" /> Workspace Settings
        </button>
        <button
          onClick={signOut}
          className="flex w-full items-center gap-2 px-3 py-1.5 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 rounded-lg cursor-pointer"
        >
          <LogOut className="h-3.5 w-3.5" /> Sign out
        </button>
      </div>
    </Dropdown>
  );
}
