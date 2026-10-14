export const TASK_STATUSES = [
  { id: 'backlog', label: 'Backlog', group: 'backlog', color: '#738496' },
  { id: 'todo', label: 'To Do', group: 'unstarted', color: '#579DFF' },
  { id: 'in_progress', label: 'In Progress', group: 'started', color: '#F5CD47' },
  { id: 'in_review', label: 'In Review', group: 'started', color: '#9F8FEF' },
  { id: 'done', label: 'Done', group: 'completed', color: '#4BCE97' },
  { id: 'cancelled', label: 'Cancelled', group: 'cancelled', color: '#F87171' },
];

export const TASK_PRIORITIES = [
  { id: 'low', label: 'Low', color: 'slate' },
  { id: 'medium', label: 'Medium', color: 'blue' },
  { id: 'high', label: 'High', color: 'amber' },
  { id: 'urgent', label: 'Urgent', color: 'rose' },
];

export const ROLES = {
  ADMIN: 'admin',
  PROJECT_MANAGER: 'project_manager',
  TEAM_MEMBER: 'team_member',
};

export const WORKSPACE_ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  PROJECT_MANAGER: 'project_manager',
  MEMBER: 'member',
  TEAM_MEMBER: 'team_member',
  VIEWER: 'viewer',
};
