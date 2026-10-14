import React, { useState } from 'react';
import { Columns3, ListFilter, Calendar } from 'lucide-react';

export function BoardViewSwitcher() {
  const [view, setView] = useState('board');

  return (
    <div className="flex items-center rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
      <button
        onClick={() => setView('board')}
        className={`rounded-lg p-1.5 transition ${
          view === 'board'
            ? 'bg-white shadow-xs text-indigo-600 dark:bg-slate-900 dark:text-indigo-400'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
        }`}
        title="Board View"
      >
        <Columns3 className="h-4 w-4" />
      </button>
      <button
        onClick={() => setView('list')}
        className={`rounded-lg p-1.5 transition ${
          view === 'list'
            ? 'bg-white shadow-xs text-indigo-600 dark:bg-slate-900 dark:text-indigo-400'
            : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
        }`}
        title="List View"
      >
        <ListFilter className="h-4 w-4" />
      </button>
    </div>
  );
}
