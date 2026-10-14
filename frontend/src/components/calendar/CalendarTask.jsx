import React from 'react';
import { getPriorityColor } from '../../lib/utils';

export function CalendarTask({ title, priority }) {
  return (
    <div className={`mt-1 truncate rounded px-1.5 py-0.5 text-[10px] font-semibold border ${getPriorityColor(priority)}`}>
      {title}
    </div>
  );
}
