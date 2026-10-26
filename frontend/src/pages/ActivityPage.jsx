import React from 'react';
import { Activity, Clock, CheckCircle2, UserPlus, FileEdit, AlertCircle } from 'lucide-react';

const ACTIVITIES = [
  { id: '1', user: 'Tharun R', action: 'promoted Alex Johnson to', target: 'Project Manager', time: '10 minutes ago', type: 'role' },
  { id: '2', user: 'Alex Johnson', action: 'created project', target: 'Payment Gateway Integration', time: '1 hour ago', type: 'project' },
  { id: '3', user: 'Maria Garcia', action: 'moved task to Done:', target: 'Implement OAuth callback', time: '2 hours ago', type: 'task' },
  { id: '4', user: 'David Chen', action: 'commented on', target: 'Database connection pooler configuration', time: '3 hours ago', type: 'comment' },
  { id: '5', user: 'Tharun R', action: 'updated workspace settings for', target: 'Acme Studio', time: '5 hours ago', type: 'settings' },
  { id: '6', user: 'Liam Wilson', action: 'accepted invite and joined as', target: 'Team Member', time: '1 day ago', type: 'join' },
];

export default function ActivityPage() {
  return (
    <div className="w-full p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div>
        <div className="flex items-center gap-2.5">
          <Activity className="h-6 w-6 text-[#0C66E4] dark:text-[#579DFF]" />
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">Workspace Activity</h1>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] divide-y divide-slate-100 dark:divide-[#282E33] p-1.5 sm:p-2">
        {ACTIVITIES.map((act) => (
          <div key={act.id} className="py-3 sm:py-4 px-3 sm:px-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-50/70 dark:hover:bg-[#22272B]/50 transition-colors rounded-xl">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <div className="h-9 sm:h-10.5 w-9 sm:w-10.5 shrink-0 rounded-full bg-slate-100 dark:bg-[#22272B] border border-slate-200 dark:border-[#333C44] flex items-center justify-center text-slate-700 dark:text-[#DEE4EA] text-xs sm:text-sm font-bold shadow-xs">
                {act.user.substring(0, 2).toUpperCase()}
              </div>
              <div className="text-xs sm:text-sm leading-relaxed min-w-0">
                <span className="font-bold text-slate-900 dark:text-[#DEE4EA]">{act.user}</span>{' '}
                <span className="text-slate-600 dark:text-[#9FADBC]">{act.action}</span>{' '}
                <span className="font-semibold text-[#0C66E4] dark:text-[#579DFF]">{act.target}</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#738496] shrink-0 pl-12 sm:pl-0">
              <Clock className="h-3.5 w-3.5" />
              <span>{act.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
