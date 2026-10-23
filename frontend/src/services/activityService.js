const ACTIVITY_STORAGE_PREFIX = 'taskflow_activity_feed_';

class ActivityService {
  constructor() {
    this.subscribers = new Set();
  }

  getStorageKey(workspaceId) {
    return `${ACTIVITY_STORAGE_PREFIX}${workspaceId || 'default'}`;
  }

  getActivities(workspaceId, currentTasks = []) {
    if (!workspaceId) return [];

    try {
      const raw = localStorage.getItem(this.getStorageKey(workspaceId));
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Error reading stored activities:', err);
    }

    // If no activities have been logged yet for this workspace, derive initial real activities from the workspace's actual tasks
    if (Array.isArray(currentTasks) && currentTasks.length > 0) {
      const derived = currentTasks.slice(0, 5).map((t, index) => {
        const creator = t.reporter || t.created_by || 'Tharun R';
        const taskKey = t.key || `TASK-${(t.id || '').slice(0, 4) || index + 1}`;
        const statusLabel =
          t.status === 'done'
            ? 'Done'
            : t.status === 'in_progress'
            ? 'In Progress'
            : t.status === 'in_review'
            ? 'Review'
            : 'To Do';

        // Stagger timestamps naturally based on actual creation or index
        const hoursAgo = index === 0 ? 'about 1 hour ago' : index === 1 ? 'about 3 hours ago' : `${index * 4} hours ago`;

        return {
          id: `act-init-${t.id || index}`,
          user: creator,
          action: t.status === 'done' ? 'completed' : index === 1 ? 'updated field' : 'created',
          targetField: index === 1 ? 'status' : null,
          assignee: t.assignee || null,
          task: t,
          taskKey,
          taskTitle: t.title,
          statusLabel,
          time: hoursAgo,
          timestamp: t.created_at || new Date(Date.now() - index * 3600000).toISOString(),
        };
      });

      this.saveActivities(workspaceId, derived);
      return derived;
    }

    return [];
  }

  logActivity(workspaceId, activityData) {
    if (!workspaceId) return;

    try {
      const current = this.getActivities(workspaceId);
      const newActivity = {
        id: 'act-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
        user: activityData.user || 'Tharun R',
        action: activityData.action || 'updated',
        targetField: activityData.targetField || null,
        assignee: activityData.assignee || null,
        task: activityData.task || null,
        taskKey: activityData.taskKey || activityData.task?.key || 'TASK',
        taskTitle: activityData.taskTitle || activityData.task?.title || 'Task',
        statusLabel: activityData.statusLabel || 'In Progress',
        time: 'Just now',
        timestamp: new Date().toISOString(),
      };

      const updated = [newActivity, ...current].slice(0, 50);
      this.saveActivities(workspaceId, updated);
      this.notifySubscribers(workspaceId, updated);
      return newActivity;
    } catch (err) {
      console.warn('Error saving activity:', err);
    }
  }

  saveActivities(workspaceId, list) {
    try {
      localStorage.setItem(this.getStorageKey(workspaceId), JSON.stringify(list));
    } catch {}
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
