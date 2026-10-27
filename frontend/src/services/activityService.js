// Real-time Activity Service with Live Sync and Multi-Entity Tracking
import { userService } from './userService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const ACTIVITY_GLOBAL_KEY = 'taskflow_global_activities_v2';
const ACTIVITY_STORAGE_PREFIX = 'taskflow_activity_feed_v2_';

function formatRelativeTime(dateInput) {
  if (!dateInput) return 'Just now';
  const now = new Date();
  const date = new Date(dateInput);
  const diffMs = now - date;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHours = Math.floor(diffMin / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSec < 60) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

class ActivityService {
  constructor() {
    this.subscribers = new Set();

    // Listen to custom activity dispatch events from anywhere in the application
    if (typeof window !== 'undefined') {
      window.addEventListener('taskflow_activity_log', (e) => {
        if (e.detail) {
          this.logActivity(e.detail.workspaceId || 'all', e.detail);
        }
      });

      window.addEventListener('storage', (e) => {
        if (e.key && e.key.startsWith('taskflow_')) {
          this.notifySubscribers('all', this.getActivities('all'));
        }
      });
    }
  }

  getStorageKey(workspaceId) {
    if (!workspaceId || workspaceId === 'all') return ACTIVITY_GLOBAL_KEY;
    return `${ACTIVITY_STORAGE_PREFIX}${workspaceId}`;
  }

  getStoredList(key) {
    try {
      const raw = localStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  }

  saveStoredList(key, list) {
    try {
      localStorage.setItem(key, JSON.stringify(list.slice(0, 100)));
    } catch {}
  }

  /**
   * Return all real-time activities merged with live registered employees and tasks
   */
  getActivities(workspaceId = 'all', currentTasks = []) {
    const key = this.getStorageKey(workspaceId);
    let stored = this.getStoredList(key);

    // If global, also merge with global storage
    if (workspaceId !== 'all') {
      const globalList = this.getStoredList(ACTIVITY_GLOBAL_KEY);
      stored = [...stored, ...globalList.filter((g) => !stored.some((s) => s.id === g.id))];
    }

    // Auto-derive real activities from registered employees so ANY added employee appears immediately
    try {
      const allUsers = userService.getUsers();
      // Look for team members and managers added to the system
      const employeeActivities = allUsers
        .filter((u) => u.email && u.role !== 'admin')
        .map((u, idx) => ({
          id: `act-auto-user-${u.id || u.email}`,
          user: 'Admin',
          action: 'added employee account for',
          target: `${u.name} (${u.role === 'project_manager' ? 'Project Manager' : 'Team Member'})`,
          targetField: u.role,
          taskTitle: u.email,
          type: 'user',
          time: formatRelativeTime(u.createdAt || new Date(Date.now() - (idx + 1) * 3600000 * 2)),
          timestamp: u.createdAt || new Date(Date.now() - (idx + 1) * 3600000 * 2).toISOString(),
        }));

      for (const empAct of employeeActivities) {
        if (!stored.some((s) => s.id === empAct.id || (s.target && s.target.includes(empAct.target)))) {
          stored.push(empAct);
        }
      }
    } catch (e) {
      console.warn('Error syncing employees to activity log:', e);
    }

    // Auto-derive tasks if empty
    if (Array.isArray(currentTasks) && currentTasks.length > 0 && stored.length < 3) {
      currentTasks.slice(0, 6).forEach((t, index) => {
        const creator = t.reporter || t.created_by || 'Tharun R';
        const taskKey = t.key || `TASK-${(t.id || '').slice(0, 4) || index + 1}`;
        stored.push({
          id: `act-auto-task-${t.id || index}`,
          user: creator,
          action: t.status === 'done' ? 'completed task' : 'created task',
          target: `${taskKey}: ${t.title}`,
          taskTitle: t.title,
          taskKey,
          type: 'task',
          time: formatRelativeTime(t.created_at || new Date(Date.now() - (index + 1) * 7200000)),
          timestamp: t.created_at || new Date(Date.now() - (index + 1) * 7200000).toISOString(),
        });
      });
    }

    // Sort descending by timestamp (newest first)
    stored.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

    // Update relative time labels
    const updated = stored.map((act) => ({
      ...act,
      time: formatRelativeTime(act.timestamp),
    }));

    return updated;
  }

  logActivity(workspaceId, activityData) {
    try {
      const now = new Date().toISOString();
      const newActivity = {
        id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        user: activityData.user || 'Admin',
        action: activityData.action || 'updated',
        target: activityData.target || activityData.taskTitle || activityData.task?.title || 'item',
        targetField: activityData.targetField || null,
        type: activityData.type || 'task',
        task: activityData.task || null,
        taskKey: activityData.taskKey || activityData.task?.key || null,
        taskTitle: activityData.taskTitle || activityData.task?.title || null,
        statusLabel: activityData.statusLabel || null,
        time: 'Just now',
        timestamp: now,
      };

      // 1. Save to global feed
      const globalKey = ACTIVITY_GLOBAL_KEY;
      const currentGlobal = this.getStoredList(globalKey);
      const updatedGlobal = [newActivity, ...currentGlobal.filter((a) => a.id !== newActivity.id)].slice(0, 100);
      this.saveStoredList(globalKey, updatedGlobal);

      // 2. Save to workspace feed if provided
      if (workspaceId && workspaceId !== 'all') {
        const wsKey = this.getStorageKey(workspaceId);
        const currentWs = this.getStoredList(wsKey);
        const updatedWs = [newActivity, ...currentWs.filter((a) => a.id !== newActivity.id)].slice(0, 100);
        this.saveStoredList(wsKey, updatedWs);
      }

      // 3. Persist to Supabase notifications table for multi-device realtime visibility
      if (isSupabaseConfigured) {
        supabase
          .from('notifications')
          .insert([
            {
              title: `${newActivity.user} ${newActivity.action}`,
              message: String(newActivity.target),
              read: false,
            },
          ])
          .then(() => {})
          .catch(() => {});
      }

      // 4. Notify live subscribers and dispatch events across tabs
      this.notifySubscribers(workspaceId || 'all', updatedGlobal);
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('taskflow_activity_updated', { detail: newActivity }));
      }

      return newActivity;
    } catch (err) {
      console.warn('Error saving activity:', err);
    }
  }

  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  notifySubscribers(workspaceId, activities) {
    this.subscribers.forEach((cb) => {
      try {
        cb(workspaceId, activities);
      } catch {}
    });
  }
}

export const activityService = new ActivityService();
export default activityService;
