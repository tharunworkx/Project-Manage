import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../ui/Button';

export function CalendarHeader({ currentDate = new Date(), onPrev, onNext }) {
  return (
    <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
      <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
        October 2026
      </h2>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={onPrev}><ChevronLeft className="h-4 w-4" /></Button>
        <Button variant="outline" size="sm" onClick={onNext}><ChevronRight className="h-4 w-4" /></Button>
      </div>
    </div>
  );
}
