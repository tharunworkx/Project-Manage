import React from 'react';
import { CheckCircle2, MessageSquare, PlusCircle } from 'lucide-react';
import { useWorkspaceContext } from '../../context/WorkspaceContext';

const WORKSPACE_ACTIVITIES = {
  'ws-1': [
    { id: 1, user: 'Tharun R', action: 'completed task', target: 'Automated casualty triage classification', time: '12m ago', icon: CheckCircle2, color: 'text-emerald-500' },
    { id: 2, user: 'Sarah', action: 'updated status on', target: 'Helicopter evacuation route safety audit', time: '35m ago', icon: MessageSquare, color: 'text-blue-500' },
    { id: 3, user: 'Elena', action: 'created project', target: 'Search & Rescue Drone Fleet', time: '2h ago', icon: PlusCircle, color: 'text-indigo-500' },
    { id: 4, user: 'David', action: 'dispatched unit on', target: 'Emergency Field Dispatch', time: '4h ago', icon: CheckCircle2, color: 'text-emerald-500' },
  ],
  'ws-2': [
    { id: 1, user: 'Alex', action: 'completed task', target: 'Implement Plane 5-state drag-n-drop workflow', time: '10m ago', icon: CheckCircle2, color: 'text-emerald-500' },
    { id: 2, user: 'Sarah', action: 'commented on', target: 'OAuth 2.0 & WorkOS SSO Provider', time: '45m ago', icon: MessageSquare, color: 'text-indigo-500' },
    { id: 3, user: 'Elena', action: 'created project', target: 'Taskflow Core Web App', time: '2h ago', icon: PlusCircle, color: 'text-blue-500' },
    { id: 4, user: 'Tharun R', action: 'merged pull request for', target: 'Dark mode design tokens unification', time: '5h ago', icon: CheckCircle2, color: 'text-emerald-500' },
  ],
  'ws-3': [
    { id: 1, user: 'Tharun R', action: 'completed task', target: 'Push notification payload routing via FCM', time: '15m ago', icon: CheckCircle2, color: 'text-emerald-500' },
    { id: 2, user: 'David', action: 'commented on', target: 'SwiftUI NavigationStack rewrite for iOS 18', time: '50m ago', icon: MessageSquare, color: 'text-indigo-500' },
    { id: 3, user: 'Elena', action: 'created project', target: 'Android Jetpack App', time: '3h ago', icon: PlusCircle, color: 'text-blue-500' },
    { id: 4, user: 'Alex', action: 'reviewed PR on', target: 'SQLite local sync queue', time: '6h ago', icon: CheckCircle2, color: 'text-emerald-500' },
  ],
};

export function ActivityFeed({ workspaceId: propWorkspaceId }) {
  const { currentWorkspace } = useWorkspaceContext();
  const activeWsId = propWorkspaceId || currentWorkspace?.id || 'ws-1';
  const activities = WORKSPACE_ACTIVITIES[activeWsId] || WORKSPACE_ACTIVITIES['ws-2'];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-5 shadow-xs transition-colors">
      <h3 className="text-sm font-bold text-slate-900 dark:text-[#DEE4EA] mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {activities.map((a) => (
          <div key={a.id} className="flex items-start gap-3 text-sm">
            <div className={`mt-0.5 p-1 rounded-md bg-slate-100 dark:bg-[#22272B] ${a.color}`}>
              <a.icon className="h-4 w-4" />
            </div>
            <div className="flex-1 text-sm">
              <span className="font-semibold text-slate-900 dark:text-[#DEE4EA]">{a.user}</span>{' '}
              <span className="text-slate-500 dark:text-[#9FADBC]">{a.action}</span>{' '}
              <span className="font-medium text-[#0C66E4] dark:text-[#579DFF]">{a.target}</span>
            </div>
            <span className="text-xs text-slate-400 dark:text-[#738496]">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
