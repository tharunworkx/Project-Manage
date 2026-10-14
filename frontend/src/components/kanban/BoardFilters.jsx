import React from 'react';
import { Filter } from 'lucide-react';

export function BoardFilters({ priorities = [], onSelectPriority }) {
  return (
    <div className="flex items-center gap-1.5">
      <Filter className="h-3.5 w-3.5 text-slate-400 mr-1" />
      {['all', 'urgent', 'high', 'medium', 'low'].map((p) => (
        <button
          key={p}
          onClick={() => onSelectPriority && onSelectPriority(p)}
          className="rounded-lg px-2 py-1 text-xs font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 capitalize cursor-pointer"
        >
          {p}
        </button>
      ))}
    </div>
  );
}
