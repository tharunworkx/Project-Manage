import { supabase, isSupabaseConfigured } from '../lib/supabase';

const NOTIFICATIONS_STORAGE_KEY = 'taskflow_notifications_cache_v2';
const NOTIFICATIONS_INIT_FLAG = 'taskflow_notifications_initialized_v2';
const NOTIFICATIONS_DELETED_KEY = 'taskflow_notifications_deleted_ids_v2';

export const DEFAULT_NOTIFICATIONS = [
  {
    id: 'notif-1',
    title: 'Task Assigned',
    message: 'You have been assigned to "Design Mobile Sidebar Layout"',
    desc: 'You have been assigned to "Design Mobile Sidebar Layout"',
    time: '20 minutes ago',
    unread: true,
    created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-2',
    title: 'Deadline Approaching',
    message: 'Task "Implement JWT Filter" is due tomorrow at 5:00 PM',
    desc: 'Task "Implement JWT Filter" is due tomorrow at 5:00 PM',
    time: '2 hours ago',
    unread: true,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-3',
    title: 'Project Status Updated',
    message: 'Project "Core Platform Revamp" moved to Active',
    desc: 'Project "Core Platform Revamp" moved to Active',
    time: '1 day ago',
    unread: false,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-4',
    title: 'New Comment',
    message: 'Alex Johnson commented on "Supabase Connection Pooler Setup"',
    desc: 'Alex Johnson commented on "Supabase Connection Pooler Setup"',
    time: '2 days ago',
    unread: false,
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

function formatRelativeTime(isoDate) {
  if (!isoDate) return 'Just now';
  try {
    const now = new Date();
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return 'Recently';
    const diffSec = Math.floor((now - date) / 1000);
    if (diffSec < 60) return 'Just now';
    const diffMin = Math.floor(diffSec / 60);
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return 'Recently';
  }
}

function getDeletedIds() {
  try {
    const raw = localStorage.getItem(NOTIFICATIONS_DELETED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
}

function saveDeletedId(id) {
  try {
    const set = getDeletedIds();
    set.add(id);
    localStorage.setItem(NOTIFICATIONS_DELETED_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

function saveAllDeletedIds(ids) {
  try {
    const set = getDeletedIds();
    ids.forEach(id => set.add(id));
    localStorage.setItem(NOTIFICATIONS_DELETED_KEY, JSON.stringify(Array.from(set)));
  } catch {}
}

const listeners = new Set();
function notifySubscribers(notifs) {
  listeners.forEach(fn => {
    try { fn(notifs); } catch {}
  });
  try {
    window.dispatchEvent(new CustomEvent('taskflow:notifications_updated', { detail: notifs }));
  } catch {}
}

function getStoredNotifications() {
  try {
    const deleted = getDeletedIds();
    const stored = localStorage.getItem(NOTIFICATIONS_STORAGE_KEY);
    const hasInitialized = localStorage.getItem(NOTIFICATIONS_INIT_FLAG);

    if (stored !== null) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed.filter(n => !deleted.has(n.id));
      }
    }

    if (!hasInitialized) {
      localStorage.setItem(NOTIFICATIONS_INIT_FLAG, 'true');
      localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(DEFAULT_NOTIFICATIONS));
      return DEFAULT_NOTIFICATIONS.filter(n => !deleted.has(n.id));
    }

    return [];
  } catch {
    return DEFAULT_NOTIFICATIONS;
  }
}

function saveStoredNotifications(notifications) {
  try {
    localStorage.setItem(NOTIFICATIONS_INIT_FLAG, 'true');
    localStorage.setItem(NOTIFICATIONS_STORAGE_KEY, JSON.stringify(notifications));
  } catch {}
  notifySubscribers(notifications);
}

export const notificationService = {
  subscribe(callback) {
    listeners.add(callback);
    return () => listeners.delete(callback);
  },

  getNotifications() {
    return getStoredNotifications();
  },

  async fetchNotifications() {
    const items = getStoredNotifications();
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && Array.isArray(data) && data.length > 0) {
          const deleted = getDeletedIds();
          const supabaseItems = data
            .filter(n => !deleted.has(n.id))
            .map(n => ({
              id: n.id,
              title: n.title,
              message: n.message,
              desc: n.message,
              unread: !n.read,
              created_at: n.created_at,
              time: formatRelativeTime(n.created_at),
            }));

          // Merge without deleted items
          const merged = [...supabaseItems];
          items.forEach(loc => {
            if (!merged.some(m => m.id === loc.id) && !deleted.has(loc.id)) {
              merged.push(loc);
            }
          });
          saveStoredNotifications(merged);
          return merged;
        }
      } catch (err) {
        console.warn('Supabase fetch notifications warning:', err);
      }
    }
    return items;
  },

  async markAsRead(id) {
    const current = getStoredNotifications();
    const updated = current.map(n => (n.id === id ? { ...n, unread: false } : n));
    saveStoredNotifications(updated);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('notifications').update({ read: true }).eq('id', id);
      } catch {}
    }
    try {
      fetch(`/api/v1/notifications/${id}/read`, { method: 'PATCH' }).catch(() => {});
    } catch {}
    return updated;
  },

  async markAllAsRead() {
    const current = getStoredNotifications();
    const updated = current.map(n => ({ ...n, unread: false }));
    saveStoredNotifications(updated);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('notifications').update({ read: true }).neq('id', '00000000-0000-0000-0000-000000000000');
      } catch {}
    }
    try {
      fetch('/api/v1/notifications/read-all', { method: 'PATCH' }).catch(() => {});
    } catch {}
    return updated;
  },

  async deleteNotification(id) {
    saveDeletedId(id);
    const current = getStoredNotifications();
    const updated = current.filter(n => n.id !== id);
    saveStoredNotifications(updated);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('notifications').delete().eq('id', id);
      } catch {}
    }
    try {
      fetch(`/api/v1/notifications/${id}`, { method: 'DELETE' }).catch(() => {});
    } catch {}
    return updated;
  },

  async clearAll() {
    const current = getStoredNotifications();
    saveAllDeletedIds(current.map(n => n.id));
    saveStoredNotifications([]);

    if (isSupabaseConfigured) {
      try {
        await supabase.from('notifications').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      } catch {}
    }
    try {
      fetch('/api/v1/notifications', { method: 'DELETE' }).catch(() => {});
    } catch {}
    return [];
  },

  async createNotification({ title, message }) {
    const newNotif = {
      id: 'notif-' + Date.now(),
      title,
      message,
      desc: message,
      unread: true,
      created_at: new Date().toISOString(),
      time: 'Just now',
    };
    const current = getStoredNotifications();
    const updated = [newNotif, ...current];
    saveStoredNotifications(updated);

    if (isSupabaseConfigured) {
      try {
        const { data } = await supabase
          .from('notifications')
          .insert([{ title, message, read: false }])
          .select()
          .single();
        if (data) {
          newNotif.id = data.id;
          saveStoredNotifications([newNotif, ...current.filter(n => n.id !== newNotif.id)]);
        }
      } catch {}
    }
    try {
      fetch('/api/v1/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, message }),
      }).catch(() => {});
    } catch {}
    return newNotif;
  },
};
