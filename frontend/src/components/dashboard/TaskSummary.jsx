import React from 'react';
import { CheckCircle2, Clock, AlertTriangle, ListTodo } from 'lucide-react';

export function TaskSummary({ tasks = [] }) {
  const stats = [
    { label: 'To Do', count: tasks.filter(t => t.status === 'todo').length, icon: ListTodo, color: 'text-slate-500' },
    { label: 'In Progress', count: tasks.filter(t => t.status === 'in_progress').length, icon: Clock, color: 'text-blue-500' },
    { label: 'In Review', count: tasks.filter(t => t.status === 'in_review').length, icon: AlertTriangle, color: 'text-amber-500' },
    { label: 'Completed', count: tasks.filter(t => t.status === 'done').length, icon: CheckCircle2, color: 'text-emerald-500' },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((item) => (
        <div key={item.label} className="p-4 rounded-xl bg-[#161A1D] border border-[#282E33]">
          <div className="flex items-center gap-2 mb-1">
            <item.icon className={`h-4 w-4 ${item.color}`} />
            <span className="text-xs text-[#9FADBC] font-medium">{item.label}</span>
          </div>
          <span className="text-xl font-bold text-[#DEE4EA]">{item.count}</span>
        </div>
      ))}
    </div>
  );
}
