import React from 'react';
import { Badge } from '../ui/Badge';

export function TaskStatus({ status = 'todo' }) {
  const map = {
    todo: { label: 'To Do', variant: 'default' },
    in_progress: { label: 'In Progress', variant: 'primary' },
    in_review: { label: 'In Review', variant: 'warning' },
    done: { label: 'Done', variant: 'success' },
  };

  const item = map[status] || map.todo;
  return <Badge variant={item.variant}>{item.label}</Badge>;
}
