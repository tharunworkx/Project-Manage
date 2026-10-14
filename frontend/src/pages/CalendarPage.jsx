import React from 'react';
import { CalendarComponent } from '../components/calendar/CalendarComponent';

export default function CalendarPage() {
  return (
    <div className="p-8 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-[#DEE4EA]">
          Calendar Roadmap & Schedule
        </h1>
        <p className="text-sm text-[#9FADBC] mt-1">
          Plan work item timelines, sprint milestones, and team delivery dates.
        </p>
      </div>

      <CalendarComponent />
    </div>
  );
}
