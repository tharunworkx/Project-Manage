import React from 'react';
import { ChevronsUpDown, Building2 } from 'lucide-react';
import { useWorkspace } from '../../hooks/useWorkspace';

export function WorkspaceSwitcher() {
  const { currentWorkspace } = useWorkspace();

  return (
    <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-slate-300 dark:hover:border-slate-700 transition">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="h-7 w-7 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
          <Building2 className="h-4 w-4" />
        </div>
        <div className="truncate">
          <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
            {currentWorkspace?.name || 'Workspace'}
          </p>
          <p className="text-[10px] text-slate-500 capitalize">{currentWorkspace?.role || 'member'}</p>
        </div>
      </div>
      <ChevronsUpDown className="h-4 w-4 text-slate-400 shrink-0" />
    </div>
  );
}
