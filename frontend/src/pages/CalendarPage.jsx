import React from 'react';
import { CalendarComponent } from '../components/calendar/CalendarComponent';

export default function CalendarPage() {
  return (
    <div className="w-full h-full flex flex-col p-3 md:p-4 overflow-hidden select-none">
      <CalendarComponent />
    </div>
  );
}
