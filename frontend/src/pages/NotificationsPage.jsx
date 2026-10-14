import React, { useState } from 'react';
import { Bell, Check, Trash2, Clock, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

const INITIAL_NOTIFICATIONS = [
  { id: '1', title: 'Task Assigned', message: 'You have been assigned to "Design Mobile Sidebar Layout"', time: '20 minutes ago', unread: true },
  { id: '2', title: 'Deadline Approaching', message: 'Task "Implement JWT Filter" is due tomorrow at 5:00 PM', time: '2 hours ago', unread: true },
  { id: '3', title: 'Project Status Updated', message: 'Project "Core Platform Revamp" moved to Active', time: '1 day ago', unread: false },
  { id: '4', title: 'New Comment', message: 'Alex Johnson commented on "Supabase Connection Pooler Setup"', time: '2 days ago', unread: false },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, unread: false })));
    toast.success('All notifications marked as read');
  };

  const clearAll = () => {
    setNotifications([]);
    toast.success('All notifications cleared');
  };

  return (
    <div className="w-full p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <Bell className="h-6 w-6 text-[#0C66E4] dark:text-[#579DFF]" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">Notifications</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#9FADBC] mt-1">
            Real-time updates, task assignments, and mentions.
          </p>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllRead} className="text-xs h-8">
            <Check className="h-3.5 w-3.5 mr-1" />
            Mark all read
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll} className="text-xs h-8 text-rose-500 hover:text-rose-600">
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Clear all
          </Button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 dark:border-[#282E33] p-12 text-center space-y-3">
          <Inbox className="h-10 w-10 text-slate-400 mx-auto" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-[#DEE4EA]">No notifications</h3>
          <p className="text-xs text-slate-400">You are all caught up!</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] divide-y divide-slate-100 dark:divide-[#282E33] p-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 flex items-start justify-between rounded-xl transition-colors ${
                n.unread ? 'bg-indigo-50/50 dark:bg-[#1C2B41]/40' : 'hover:bg-slate-50 dark:hover:bg-[#22272B]/50'
              }`}
            >
              <div className="flex items-start gap-3">
                <span className={`mt-1 h-2 w-2 rounded-full shrink-0 ${n.unread ? 'bg-[#0C66E4]' : 'bg-transparent'}`} />
                <div className="space-y-0.5">
                  <h4 className="text-xs font-semibold text-slate-900 dark:text-[#DEE4EA]">{n.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-[#9FADBC]">{n.message}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-[#738496] shrink-0 ml-4">
                <Clock className="h-3 w-3" />
                <span>{n.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
