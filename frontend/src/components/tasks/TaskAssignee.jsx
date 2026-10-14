import React from 'react';
import { Avatar } from '../ui/Avatar';

export function TaskAssignee({ assignee }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar name={assignee?.full_name || 'Unassigned'} size="sm" src={assignee?.avatar_url} />
      <span className="text-xs text-slate-700 dark:text-slate-300 font-medium">
        {assignee?.full_name || 'Unassigned'}
      </span>
    </div>
  );
}
