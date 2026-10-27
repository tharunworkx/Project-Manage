import React, { useState, useEffect } from 'react';
import { CheckCircle2, MessageSquare, PlusCircle, UserPlus, FolderKanban, Activity } from 'lucide-react';
import { useWorkspaceContext } from '../../context/WorkspaceContext';
import { activityService } from '../../services/activityService';
import { useNavigate } from 'react-router-dom';

export function ActivityFeed({ workspaceId: propWorkspaceId }) {
  const { currentWorkspace } = useWorkspaceContext();
  const navigate = useNavigate();
  const activeWsId = propWorkspaceId || currentWorkspace?.id || 'all';

  const [activities, setActivities] = useState(() =>
    activityService.getActivities(activeWsId).slice(0, 5)
  );

  useEffect(() => {
    const refresh = () => {
      setActivities(activityService.getActivities(activeWsId).slice(0, 5));
    };
    refresh();

    const unsub = activityService.subscribe(refresh);
    window.addEventListener('taskflow_activity_updated', refresh);
    window.addEventListener('storage', refresh);

    return () => {
      unsub();
      window.removeEventListener('taskflow_activity_updated', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, [activeWsId]);

  const getIcon = (type) => {
    switch (type) {
      case 'user':
        return <UserPlus className="h-4 w-4 text-emerald-500" />;
      case 'project':
        return <FolderKanban className="h-4 w-4 text-blue-500" />;
      default:
        return <CheckCircle2 className="h-4 w-4 text-[#0C66E4] dark:text-[#579DFF]" />;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-[#DEE4EA]">
          Recent Activity
        </h3>
        <button
          onClick={() => navigate('/activity')}
          className="text-xs font-semibold text-[#0C66E4] dark:text-[#579DFF] hover:underline cursor-pointer"
        >
          View all
        </button>
      </div>

      {activities.length === 0 ? (
        <div className="py-6 text-center text-xs text-slate-400 dark:text-[#738496]">
          No recent activity yet.
        </div>
      ) : (
        <div className="space-y-3">
          {activities.map((a) => (
            <div key={a.id} className="flex items-start gap-3 text-sm">
              <div className="mt-0.5 p-1 rounded-md bg-slate-100 dark:bg-[#22272B]">
                {getIcon(a.type)}
              </div>
              <div className="flex-1 text-xs sm:text-sm">
                <span className="font-semibold text-slate-900 dark:text-[#DEE4EA]">{a.user}</span>{' '}
                <span className="text-slate-500 dark:text-[#9FADBC]">{a.action}</span>{' '}
                <span className="font-medium text-[#0C66E4] dark:text-[#579DFF]">{a.target}</span>
              </div>
              <span className="text-xs text-slate-400 dark:text-[#738496] shrink-0">{a.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ActivityFeed;
