import React, { useState, useEffect } from 'react';
import { Bell, Check, Trash2, Clock, Inbox, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { notificationService } from '../services/notificationService';
import { toast } from 'sonner';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(() => notificationService.getNotifications());

  useEffect(() => {
    notificationService.fetchNotifications().then((data) => {
      if (Array.isArray(data)) {
        setNotifications(data);
      }
    });

    const unsubscribe = notificationService.subscribe((updated) => {
      setNotifications(updated);
    });

    return () => unsubscribe();
  }, []);

  const handleMarkAllRead = async () => {
    await notificationService.markAllAsRead();
    toast.success('All notifications marked as read');
  };

  const handleClearAll = async () => {
    await notificationService.clearAll();
    toast.success('All notifications cleared');
  };

  const handleToggleRead = async (id, isUnread) => {
    if (isUnread) {
      await notificationService.markAsRead(id);
    }
  };

  const handleDeleteOne = async (e, id) => {
    e.stopPropagation();
    await notificationService.deleteNotification(id);
    toast.success('Notification removed');
  };

  const unreadCount = notifications.filter((n) => n.unread).length;

  return (
    <div className="w-full p-6 space-y-4 select-none transition-colors duration-150">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#0C66E4] text-white">
                {unreadCount} new
              </span>
            )}
          </div>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllRead}
                className="text-xs h-8 font-medium text-slate-700 dark:text-[#DEE4EA]"
              >
                <CheckCheck className="h-3.5 w-3.5 mr-1 text-[#0C66E4] dark:text-[#579DFF]" />
                Mark all read
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="text-xs h-8 font-medium text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/30 border-rose-200 dark:border-rose-900/50"
            >
              <Trash2 className="h-3.5 w-3.5 mr-1" />
              Clear all
            </Button>
          </div>
        )}
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="rounded-xl border border-dashed border-slate-200 dark:border-[#282E33] p-12 text-center space-y-2.5 bg-white dark:bg-[#161A1D]">
          <Inbox className="h-9 w-9 text-slate-400 dark:text-[#738496] mx-auto" />
          <h3 className="text-sm font-semibold text-slate-700 dark:text-[#DEE4EA]">No notifications</h3>
          <p className="text-xs text-slate-400 dark:text-[#738496] max-w-sm mx-auto">
            You are completely caught up! New workspace updates and task assignments will appear here.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] divide-y divide-slate-100 dark:divide-[#282E33] shadow-xs overflow-hidden">
          {notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => handleToggleRead(n.id, n.unread)}
              className={`px-4 py-3.5 sm:px-5 sm:py-3.5 flex items-start justify-between gap-3 transition-colors cursor-pointer group ${
                n.unread
                  ? 'bg-blue-50/50 dark:bg-[#1C2B41]/30 hover:bg-blue-50/80 dark:hover:bg-[#1C2B41]/50'
                  : 'hover:bg-slate-50 dark:hover:bg-[#22272B]/50'
              }`}
            >
              <div className="flex items-start gap-3 min-w-0 flex-1">
                <span
                  className={`mt-1.5 h-2 w-2 rounded-full shrink-0 transition-colors ${
                    n.unread ? 'bg-[#0C66E4] dark:bg-[#579DFF]' : 'bg-transparent'
                  }`}
                />
                <div className="space-y-0.5 min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-[#DEE4EA] leading-snug">
                    {n.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-[#9FADBC] leading-relaxed">
                    {n.message || n.desc}
                  </p>
                  <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 dark:text-[#738496] pt-0.5">
                    <Clock className="h-3 w-3" />
                    <span>{n.time || 'Recently'}</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1 shrink-0 ml-2">
                {n.unread && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleToggleRead(n.id, true);
                    }}
                    title="Mark as read"
                    className="p-1.5 rounded-md text-slate-400 hover:text-[#0C66E4] hover:bg-blue-50 dark:hover:bg-[#1C2B41] dark:hover:text-[#579DFF] transition cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={(e) => handleDeleteOne(e, n.id)}
                  title="Delete notification"
                  className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 dark:hover:text-rose-400 transition cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
