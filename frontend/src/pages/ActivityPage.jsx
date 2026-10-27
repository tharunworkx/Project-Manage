import React, { useState, useEffect } from 'react';
import {
  Activity,
  Clock,
  CheckCircle2,
  UserPlus,
  FileEdit,
  FolderKanban,
  ShieldCheck,
  Search,
  Radio,
  Building2,
  Trash2,
} from 'lucide-react';
import { activityService } from '../services/activityService';
import { useWorkspaceContext } from '../context/WorkspaceContext';

export default function ActivityPage() {
  const { currentWorkspace } = useWorkspaceContext();
  const [activities, setActivities] = useState(() =>
    activityService.getActivities(currentWorkspace?.id || 'all')
  );
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const refreshActivities = () => {
    setActivities(activityService.getActivities(currentWorkspace?.id || 'all'));
  };

  useEffect(() => {
    refreshActivities();

    const unsub = activityService.subscribe(() => {
      refreshActivities();
    });

    const handleUpdate = () => refreshActivities();
    window.addEventListener('taskflow_activity_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    // Live heartbeat every 5 seconds to update relative times ("Just now", "2m ago")
    const interval = setInterval(refreshActivities, 5000);

    return () => {
      unsub();
      window.removeEventListener('taskflow_activity_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
      clearInterval(interval);
    };
  }, [currentWorkspace?.id]);

  const filtered = activities.filter((act) => {
    if (filter !== 'all' && act.type !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchUser = act.user?.toLowerCase().includes(q);
      const matchAction = act.action?.toLowerCase().includes(q);
      const matchTarget = act.target?.toLowerCase().includes(q);
      return matchUser || matchAction || matchTarget;
    }
    return true;
  });

  const getIconForType = (type) => {
    switch (type) {
      case 'user':
        return <UserPlus className="h-4 w-4 text-emerald-500" />;
      case 'role':
        return <ShieldCheck className="h-4 w-4 text-indigo-500" />;
      case 'project':
        return <FolderKanban className="h-4 w-4 text-blue-500" />;
      case 'client':
        return <Building2 className="h-4 w-4 text-amber-500" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-[#0C66E4] dark:text-[#579DFF]" />;
    }
  };

  return (
    <div className="w-full p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header with Live Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-[#1C2B41] border border-blue-200 dark:border-[#283E5E] flex items-center justify-center text-[#0C66E4] dark:text-[#579DFF] shadow-xs">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">
                Workspace Activity Log
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Live Real-Time
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#9FADBC] mt-0.5">
              Instant chronological record of employee additions, role updates, and task activity.
            </p>
          </div>
        </div>

        {/* Filter Chips & Search */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="h-3.5 w-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search activity..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 pl-8 pr-3 text-xs rounded-lg border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#161A1D] text-slate-900 dark:text-[#DEE4EA] focus:outline-none focus:border-[#0C66E4]"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#22272B] p-0.5 rounded-lg border border-slate-200 dark:border-[#333C44] text-xs">
            {['all', 'user', 'task', 'project', 'role'].map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-semibold capitalize transition cursor-pointer ${
                  filter === t
                    ? 'bg-white dark:bg-[#161A1D] text-slate-900 dark:text-[#DEE4EA] shadow-xs'
                    : 'text-slate-600 dark:text-[#9FADBC] hover:text-slate-900 dark:hover:text-[#DEE4EA]'
                }`}
              >
                {t === 'all' ? 'All Activities' : t === 'user' ? 'Employees' : t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity Stream Container */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] divide-y divide-slate-100 dark:divide-[#282E33] p-1.5 sm:p-2 shadow-xs">
        {filtered.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Activity className="h-8 w-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-[#DEE4EA]">
              No activity recorded yet
            </p>
            <p className="text-xs text-slate-400 dark:text-[#738496]">
              New employee registrations and task operations will stream here live.
            </p>
          </div>
        ) : (
          filtered.map((act) => (
            <div
              key={act.id}
              className="py-3 sm:py-3.5 px-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-50/80 dark:hover:bg-[#22272B]/60 transition-colors rounded-xl"
            >
              <div className="flex items-center gap-3 min-w-0">
                {/* User Avatar */}
                <div className="h-9 w-9 shrink-0 rounded-full bg-slate-100 dark:bg-[#22272B] border border-slate-200 dark:border-[#333C44] flex items-center justify-center text-slate-700 dark:text-[#DEE4EA] text-xs font-bold shadow-xs">
                  {act.user ? act.user.substring(0, 2).toUpperCase() : 'AD'}
                </div>

                {/* Event Description */}
                <div className="text-xs sm:text-sm leading-relaxed min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-bold text-slate-900 dark:text-[#DEE4EA]">
                      {act.user}
                    </span>
                    <span className="text-slate-600 dark:text-[#9FADBC]">
                      {act.action}
                    </span>
                    <span className="font-semibold text-[#0C66E4] dark:text-[#579DFF] break-words">
                      {act.target}
                    </span>
                  </div>
                </div>
              </div>

              {/* Timestamp & Type Badge */}
              <div className="flex items-center gap-3 shrink-0 pl-12 sm:pl-0 self-end sm:self-auto">
                <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-[#738496]">
                  {getIconForType(act.type)}
                  <Clock className="h-3 w-3 ml-1" />
                  <span>{act.time}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
