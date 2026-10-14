import React from 'react';
import { CalendarTask } from './CalendarTask';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarGrid({ tasks = [] }) {
  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="mt-4 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
      <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-center py-2 text-xs font-bold text-slate-500">
        {DAYS.map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 auto-rows-fr">
        {dates.map((day) => (
          <div key={day} className="min-h-[90px] border-b border-r border-slate-100 dark:border-slate-800/60 p-2 text-xs">
            <span className="font-semibold text-slate-400">{day}</span>
            {day === 15 && <CalendarTask title="Supabase Auth RLS" priority="urgent" />}
            {day === 20 && <CalendarTask title="Onboarding UI Flow" priority="high" />}
            {day === 22 && <CalendarTask title="Kanban Drag & Drop" priority="high" />}
          </div>
        ))}
      </div>
    </div>
  );
}
