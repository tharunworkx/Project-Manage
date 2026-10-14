import React from 'react';
import { Badge } from '../ui/Badge';

export function TaskLabels({ labels = [] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {labels.map((l, i) => (
        <Badge key={i} variant="default">
          {l.name || l}
        </Badge>
      ))}
    </div>
  );
}
