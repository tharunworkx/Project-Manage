import React from 'react';
import { CheckCircle2, MessageSquare, PlusCircle } from 'lucide-react';

const ACTIVITIES = [
  { id: 1, user: 'Alex', action: 'completed task', target: 'Design onboarding flow', time: '10m ago', icon: CheckCircle2, color: 'text-emerald-500' },
  { id: 2, user: 'Sarah', action: 'commented on', target: 'Kanban drag-and-drop', time: '45m ago', icon: MessageSquare, color: 'text-indigo-500' },
  { id: 3, user: 'Elena', action: 'created project', target: 'Marketing Redesign', time: '2h ago', icon: PlusCircle, color: 'text-blue-500' },
];

export function ActivityFeed() {
  return (
    <div className="rounded-2xl border border-[#282E33] bg-[#161A1D] p-5">
      <h3 className="text-sm font-bold text-[#DEE4EA] mb-4">Recent Activity</h3>
      <div className="space-y-3">
        {ACTIVITIES.map((a) => (
          <div key={a.id} className="flex items-start gap-3 text-xs">
            <div className={`mt-0.5 p-1 rounded-md bg-[#22272B] ${a.color}`}>
              <a.icon className="h-3.5 w-3.5" />
            </div>
            <div className="flex-1">
              <span className="font-semibold text-[#DEE4EA]">{a.user}</span>{' '}
              <span className="text-[#9FADBC]">{a.action}</span>{' '}
              <span className="font-medium text-[#579DFF]">{a.target}</span>
            </div>
            <span className="text-[11px] text-[#738496]">{a.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
