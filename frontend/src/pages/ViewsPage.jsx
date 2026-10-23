import React, { useState } from 'react';
import {
  SlidersHorizontal,
  Plus,
  Search,
  Filter,
  Bookmark,
  CheckCircle2,
  Clock,
  User,
  Star,
  ChevronRight,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useWorkspaceContext } from '../context/WorkspaceContext';

export default function ViewsPage() {
  const { currentWorkspace } = useWorkspaceContext();
  const [searchVal, setSearchVal] = useState('');

  const views = [
    {
      id: 'v1',
      name: 'My Assigned Work Items',
      description: 'All work items assigned to you across active cycles',
      itemsCount: 4,
      starred: true,
      lastActive: '10m ago',
      path: '/tasks',
    },
    {
      id: 'v2',
      name: 'High Priority & Urgent Issues',
      description: 'Items with Priority set to Urgent or High in the current sprint',
      itemsCount: 3,
      starred: true,
      lastActive: '1h ago',
      path: '/board',
    },
    {
      id: 'v3',
      name: 'Ready for Review',
      description: 'Work items moved to the Review state group awaiting approval',
      itemsCount: 1,
      starred: false,
      lastActive: '3h ago',
      path: '/board',
    },
    {
      id: 'v4',
      name: 'Backlog Grooming Queue',
      description: 'Unscheduled backlog items ready for estimation and cycle assignment',
      itemsCount: 2,
      starred: false,
      lastActive: '1d ago',
      path: '/board',
    },
  ];

  const filteredViews = views.filter((v) =>
    v.name.toLowerCase().includes(searchVal.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] dark:bg-[#101214] text-slate-900 dark:text-[#DEE4EA] overflow-y-auto select-none transition-colors duration-150">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#101214] px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-[#9FADBC] mb-1">
              <span>{currentWorkspace?.name || 'Workspace'}</span>
              <span>/</span>
              <span className="text-slate-900 dark:text-[#DEE4EA]">Views</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-blue-500/10 dark:bg-[#579DFF]/15 text-[#0C66E4] dark:text-[#579DFF] flex items-center justify-center font-bold">
                <SlidersHorizontal className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-[#DEE4EA]">Saved Views</h1>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#282E33]/60 relative w-72">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 dark:text-[#738496]" />
          <input
            type="text"
            placeholder="Search views..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            className="w-full h-8 rounded-md border border-black dark:border-white bg-white dark:bg-[#22272B] pl-8 pr-3 text-xs text-slate-900 dark:text-[#DEE4EA] placeholder-slate-400 dark:placeholder-[#738496] focus:border-black dark:focus:border-white focus:outline-none transition-colors"
          />
        </div>
      </div>

      {/* Views List */}
      <div className="w-full px-6 py-6 space-y-3">
        {filteredViews.map((view) => (
          <NavLink
            key={view.id}
            to={view.path}
            className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] hover:border-[#0C66E4] dark:hover:border-[#388BFF]/60 hover:bg-slate-50 dark:hover:bg-[#1C2127] transition group cursor-pointer shadow-xs"
          >
            <div className="flex items-start gap-3.5">
              <div className="p-2 rounded-lg bg-slate-100 dark:bg-[#22272B] text-[#0C66E4] dark:text-[#579DFF] group-hover:bg-blue-50 dark:group-hover:bg-[#1C2B41] transition">
                <Bookmark className="h-4 w-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-[#DEE4EA] group-hover:text-[#0C66E4] dark:group-hover:text-[#579DFF] transition">
                    {view.name}
                  </h3>
                  {view.starred && (
                    <Star className="h-3.5 w-3.5 fill-[#F5CD47] text-[#F5CD47]" />
                  )}
                </div>
                <p className="text-xs text-slate-500 dark:text-[#9FADBC] mt-0.5">{view.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 dark:text-[#738496]">
              <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-[#22272B] text-slate-600 dark:text-[#9FADBC] font-medium">
                {view.itemsCount} issues
              </span>
              <ChevronRight className="h-4 w-4 text-slate-400 dark:text-[#738496] group-hover:text-slate-900 dark:group-hover:text-[#DEE4EA] transition" />
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}
