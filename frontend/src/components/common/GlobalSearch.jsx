import React, { useState } from 'react';
import { Search } from 'lucide-react';

export function GlobalSearch() {
  const [query, setQuery] = useState('');

  return (
    <div className="relative w-64 md:w-80">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
      <input
        type="text"
        placeholder="Quick search (tasks, projects)..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-slate-100/60 pl-9 pr-4 py-1.5 text-xs text-slate-900 placeholder-slate-400 transition focus:border-indigo-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-100 dark:focus:bg-slate-900"
      />
    </div>
  );
}
