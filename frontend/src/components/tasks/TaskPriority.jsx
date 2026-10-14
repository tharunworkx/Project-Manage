import React from 'react';
import { Badge } from '../ui/Badge';

export function TaskPriority({ priority = 'medium' }) {
  const map = {
    urgent: 'danger',
    high: 'warning',
    medium: 'primary',
    low: 'default',
  };

  return <Badge variant={map[priority] || 'default'}>{priority.toUpperCase()}</Badge>;
}
