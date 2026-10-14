import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  ChevronDown,
  Trash2,
  X,
  Filter,
} from 'lucide-react';
import { Modal } from '../ui/Modal';
import { toast } from 'sonner';
import { DatePicker } from '../ui/date-picker';

// Sample events exactly matching the provided calendar screenshot
const INITIAL_EVENTS = [
  // Day 5
  { id: 'e1', title: 'Coffee with Ali', time: '5:00 pm', date: '2026-10-05', color: 'gray' },
  { id: 'e2', title: 'Marketing sit...', time: '8:00 pm', date: '2026-10-05', color: 'gray' },

  // Day 8
  { id: 'e3', title: 'All-hands me...', time: '9:30 pm', date: '2026-10-08', color: 'gray' },

  // Day 9
  { id: 'e4', title: 'Dinner with C...', time: '12:00 am', date: '2026-10-09', color: 'gray' },
  { id: 'e5', title: 'Friday standup', time: '2:30 pm', date: '2026-10-09', color: 'gray' },
  { id: 'e6', title: 'Olivia x Riley', time: '3:30 pm', date: '2026-10-09', color: 'purple' },
  { id: 'e6b', title: 'Client check-in', time: '5:00 pm', date: '2026-10-09', color: 'blue', hiddenByDefault: true },

  // Day 10
  { id: 'e7', title: 'House inspec...', time: '4:30 pm', date: '2026-10-10', color: 'amber' },

  // Day 11
  { id: 'e8', title: "Ava's engagm...", time: '6:30 pm', date: '2026-10-11', color: 'purple' },

  // Day 12
  { id: 'e9', title: 'Monday stand...', time: '2:30 pm', date: '2026-10-12', color: 'gray' },
  { id: 'e10', title: 'Content plann...', time: '4:30 pm', date: '2026-10-12', color: 'blue' },

  // Day 13 (TODAY)
  { id: 'e11', title: 'Product demo', time: '4:00 pm', date: '2026-10-13', color: 'blue' },
  { id: 'e12', title: 'Catch up w/ A...', time: '8:00 pm', date: '2026-10-13', color: 'pink' },

  // Day 14
  { id: 'e13', title: 'Deep work', time: '2:30 pm', date: '2026-10-14', color: 'blue' },
  { id: 'e14', title: 'One-on-one ...', time: '3:30 pm', date: '2026-10-14', color: 'pink' },
  { id: 'e15', title: 'Design sync', time: '4:00 pm', date: '2026-10-14', color: 'blue' },
  { id: 'e15b', title: 'Sprint retro', time: '5:30 pm', date: '2026-10-14', color: 'gray', hiddenByDefault: true },
  { id: 'e15c', title: 'API deployment', time: '6:30 pm', date: '2026-10-14', color: 'green', hiddenByDefault: true },

  // Day 15
  { id: 'e16', title: 'Lunch with Oli...', time: '5:30 pm', date: '2026-10-15', color: 'green' },

  // Day 16
  { id: 'e17', title: 'Coffee w/ Am...', time: '3:00 pm', date: '2026-10-16', color: 'pink' },
  { id: 'e18', title: 'Design feedb...', time: '8:00 pm', date: '2026-10-16', color: 'pink' },

  // Day 17
  { id: 'e19', title: 'Half marathon', time: '12:30 pm', date: '2026-10-17', color: 'green' },

  // Day 19
  { id: 'e20', title: 'Team lunch', time: '5:45 pm', date: '2026-10-19', color: 'pink' },

  // Day 21
  { id: 'e21', title: 'Product plann...', time: '3:00 pm', date: '2026-10-21', color: 'blue' },

  // Day 22
  { id: 'e22', title: "Amélie's first ...", time: '3:30 pm', date: '2026-10-22', color: 'pink' },
  { id: 'e23', title: 'All-hands me...', time: '9:30 pm', date: '2026-10-22', color: 'gray' },

  // Day 23
  { id: 'e24', title: 'Accountant', time: '7:15 pm', date: '2026-10-23', color: 'yellow' },
  { id: 'e25', title: 'Marketing sit...', time: '8:00 pm', date: '2026-10-23', color: 'gray' },

  // Multi-day banner: Team offsite (Days 26, 27, 28)
  { id: 'span-offsite', title: 'Team offsite', startDate: '2026-10-26', endDate: '2026-10-28', color: 'green', isSpanning: true },

  // Day 26
  { id: 'e26', title: 'Deep work', time: '2:45 pm', date: '2026-10-26', color: 'blue' },

  // Day 27
  { id: 'e27', title: 'Quarterly revi...', time: '5:00 pm', date: '2026-10-27', color: 'amber' },
  { id: 'e28', title: 'Lunch with Za...', time: '6:30 pm', date: '2026-10-27', color: 'green' },

  // Day 28
  { id: 'e29', title: 'Deep work', time: '2:30 pm', date: '2026-10-28', color: 'blue' },
  { id: 'e30', title: 'Design sync', time: '8:00 pm', date: '2026-10-28', color: 'blue' },

  // Day 29
  { id: 'e31', title: 'Amélie coffee', time: '3:30 pm', date: '2026-10-29', color: 'pink' },

  // Day 30
  { id: 'e32', title: 'Dinner with C...', time: '12:30 am', date: '2026-10-30', color: 'gray' },
];

const COLOR_STYLES = {
  blue: 'bg-[#1C2B41] text-[#579DFF] border border-[#579DFF]/30 hover:border-[#579DFF]',
  pink: 'bg-[#381B26] text-[#F472B6] border border-[#F472B6]/30 hover:border-[#F472B6]',
  purple: 'bg-[#282240] text-[#D3C5FF] border border-[#BA75FF]/30 hover:border-[#BA75FF]',
  amber: 'bg-[#352A12] text-[#F5CD47] border border-[#F5CD47]/30 hover:border-[#F5CD47]',
  yellow: 'bg-[#352A12] text-[#F5CD47] border border-[#F5CD47]/30 hover:border-[#F5CD47]',
  green: 'bg-[#163828] text-[#4ADE80] border border-[#4ADE80]/30 hover:border-[#4ADE80]',
  gray: 'bg-[#22272B] text-[#DEE4EA] border border-[#333C44] hover:border-[#738496]',
};

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarComponent() {
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [currentView, setCurrentView] = useState('month'); // 'month', 'week', 'day'
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Expanded days for "+ more" links
  const [expandedDays, setExpandedDays] = useState({});

  // Add Event Modal
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState('2026-10-13');
  const [newEventTime, setNewEventTime] = useState('4:00 pm');
  const [newEventColor, setNewEventColor] = useState('blue');

  // Selected event details modal
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Month grid definition (35 cells: Sep 27 - Oct 31, 2026)
  const monthDays = [
    { day: 27, isCurrentMonth: false, date: '2026-09-27' },
    { day: 28, isCurrentMonth: false, date: '2026-09-28' },
    { day: 29, isCurrentMonth: false, date: '2026-09-29' },
    { day: 30, isCurrentMonth: false, date: '2026-09-30' },
    { day: 1, isCurrentMonth: true, date: '2026-10-01' },
    { day: 2, isCurrentMonth: true, date: '2026-10-02' },
    { day: 3, isCurrentMonth: true, date: '2026-10-03' },
    { day: 4, isCurrentMonth: true, date: '2026-10-04' },
    { day: 5, isCurrentMonth: true, date: '2026-10-05' },
    { day: 6, isCurrentMonth: true, date: '2026-10-06' },
    { day: 7, isCurrentMonth: true, date: '2026-10-07' },
    { day: 8, isCurrentMonth: true, date: '2026-10-08' },
    { day: 9, isCurrentMonth: true, date: '2026-10-09' },
    { day: 10, isCurrentMonth: true, date: '2026-10-10' },
    { day: 11, isCurrentMonth: true, date: '2026-10-11' },
    { day: 12, isCurrentMonth: true, date: '2026-10-12' },
    { day: 13, isCurrentMonth: true, isToday: true, date: '2026-10-13' },
    { day: 14, isCurrentMonth: true, date: '2026-10-14' },
    { day: 15, isCurrentMonth: true, date: '2026-10-15' },
    { day: 16, isCurrentMonth: true, date: '2026-10-16' },
    { day: 17, isCurrentMonth: true, date: '2026-10-17' },
    { day: 18, isCurrentMonth: true, date: '2026-10-18' },
    { day: 19, isCurrentMonth: true, date: '2026-10-19' },
    { day: 20, isCurrentMonth: true, date: '2026-10-20' },
    { day: 21, isCurrentMonth: true, date: '2026-10-21' },
    { day: 22, isCurrentMonth: true, date: '2026-10-22' },
    { day: 23, isCurrentMonth: true, date: '2026-10-23' },
    { day: 24, isCurrentMonth: true, date: '2026-10-24' },
    { day: 25, isCurrentMonth: true, date: '2026-10-25' },
    { day: 26, isCurrentMonth: true, date: '2026-10-26' },
    { day: 27, isCurrentMonth: true, date: '2026-10-27' },
    { day: 28, isCurrentMonth: true, date: '2026-10-28' },
    { day: 29, isCurrentMonth: true, date: '2026-10-29' },
    { day: 30, isCurrentMonth: true, date: '2026-10-30' },
    { day: 31, isCurrentMonth: true, date: '2026-10-31' },
  ];

  const handleAddEventSubmit = (e) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const newEvent = {
      id: `ev-${Date.now()}`,
      title: newEventTitle.trim(),
      date: newEventDate,
      time: newEventTime,
      color: newEventColor,
    };

    setEvents([...events, newEvent]);
    setIsAddEventOpen(false);
    setNewEventTitle('');
    toast.success('Event added successfully!');
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((e) => e.id !== id));
    setSelectedEvent(null);
    toast.success('Event deleted');
  };

  const toggleExpand = (dateStr) => {
    setExpandedDays((prev) => ({ ...prev, [dateStr]: !prev[dateStr] }));
  };

  // Filter events based on search
  const filteredEvents = events.filter((e) => {
    if (!searchVal) return true;
    return e.title.toLowerCase().includes(searchVal.toLowerCase());
  });

  return (
    <div className="rounded-2xl border border-[#282E33] bg-[#161A1D] text-[#DEE4EA] overflow-hidden shadow-xl select-none">
      {/* 1. Header Toolbar matching screenshot */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 border-b border-[#282E33] bg-[#161A1D]">
        {/* Left: Date Badge + Title + Week Pill */}
        <div className="flex items-center gap-3.5">
          {/* OCT 13 Date Badge */}
          <div className="flex h-12 w-12 flex-col items-center justify-center rounded-xl border border-[#333C44] bg-[#1D2125] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#738496] leading-none">
              OCT
            </span>
            <span className="text-base font-extrabold text-[#BA75FF] leading-none mt-1">
              13
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-[#DEE4EA] tracking-tight">
                October 2026
              </h2>
              <span className="rounded-md border border-[#333C44] bg-[#22272B] px-2 py-0.5 text-xs font-medium text-[#9FADBC]">
                Week 2
              </span>
            </div>
            <p className="text-xs text-[#738496] mt-0.5">
              1 Oct 2026 – 31 Oct 2026
            </p>
          </div>
        </div>

        {/* Right: Search, Prev/Today/Next Nav, View Switcher, + Add event */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Search Toggle */}
          <div className="relative">
            {isSearchOpen ? (
              <div className="flex items-center relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="Filter events..."
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  className="h-8.5 w-44 rounded-lg border border-[#333C44] bg-[#22272B] pl-8 pr-7 text-xs text-[#DEE4EA] placeholder-[#738496] focus:border-[#BA75FF] focus:outline-none"
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#738496]" />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchVal('');
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-[#738496] hover:text-[#DEE4EA]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                title="Search events"
                className="flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-[#282E33] bg-[#22272B] text-[#9FADBC] hover:bg-[#282E33] hover:text-[#DEE4EA] transition cursor-pointer"
              >
                <Search className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Grouped Nav: < Today > */}
          <div className="flex items-center rounded-lg border border-[#282E33] bg-[#22272B] overflow-hidden shadow-xs">
            <button
              onClick={() => toast.info('Previous month')}
              title="Previous"
              className="flex h-8.5 w-8 items-center justify-center text-[#9FADBC] hover:bg-[#282E33] hover:text-[#DEE4EA] transition cursor-pointer border-r border-[#282E33]"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => toast.success('Viewing Today (Oct 13)')}
              className="px-3.5 h-8.5 text-xs font-semibold text-[#DEE4EA] hover:bg-[#282E33] transition cursor-pointer"
            >
              Today
            </button>
            <button
              onClick={() => toast.info('Next month')}
              title="Next"
              className="flex h-8.5 w-8 items-center justify-center text-[#9FADBC] hover:bg-[#282E33] hover:text-[#DEE4EA] transition cursor-pointer border-l border-[#282E33]"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* View switcher dropdown */}
          <div className="relative">
            <button
              onClick={() => setViewDropdownOpen(!viewDropdownOpen)}
              className="flex h-8.5 items-center gap-1.5 rounded-lg border border-[#282E33] bg-[#22272B] px-3 text-xs font-medium text-[#DEE4EA] hover:bg-[#282E33] transition cursor-pointer shadow-xs"
            >
              <span className="capitalize">{currentView} view</span>
              <ChevronDown className="h-3.5 w-3.5 text-[#738496]" />
            </button>

            {viewDropdownOpen && (
              <div className="absolute right-0 top-10 z-50 w-36 rounded-xl border border-[#282E33] bg-[#1D2125] p-1 shadow-2xl animate-fade-in text-xs">
                {['month', 'week', 'day'].map((view) => (
                  <button
                    key={view}
                    onClick={() => {
                      setCurrentView(view);
                      setViewDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-1.5 rounded-lg capitalize transition cursor-pointer ${
                      currentView === view
                        ? 'bg-[#1C2B41] text-[#579DFF] font-semibold'
                        : 'text-[#9FADBC] hover:bg-[#22272B] hover:text-[#DEE4EA]'
                    }`}
                  >
                    <span>{view} view</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* + Add Event primary purple button */}
          <button
            onClick={() => setIsAddEventOpen(true)}
            className="flex h-8.5 items-center gap-1.5 rounded-lg bg-[#7C3AED] hover:bg-[#6D28D9] px-3.5 text-xs font-semibold text-white shadow-md transition cursor-pointer"
          >
            <Plus className="h-4 w-4 stroke-[2.5]" />
            <span>Add event</span>
          </button>
        </div>
      </div>

      {/* 2. Days of week header */}
      <div className="grid grid-cols-7 border-b border-[#282E33] bg-[#1D2125] text-center text-xs font-semibold text-[#9FADBC] py-2.5">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* 3. Month View Grid */}
      {currentView === 'month' && (
        <div className="grid grid-cols-7 auto-rows-fr bg-[#161A1D]">
          {monthDays.map((cell, idx) => {
            // Find single-day events for this cell
            const cellEvents = filteredEvents.filter((e) => e.date === cell.date && !e.isSpanning);
            const isSpanningDay = ['2026-10-26', '2026-10-27', '2026-10-28'].includes(cell.date);
            const isExpanded = !!expandedDays[cell.date];

            // Display limit before "+ more"
            const visibleEvents = isExpanded ? cellEvents : cellEvents.filter((e) => !e.hiddenByDefault);
            const hasHidden = cellEvents.some((e) => e.hiddenByDefault);

            return (
              <div
                key={idx}
                onClick={() => {
                  setNewEventDate(cell.date);
                  setIsAddEventOpen(true);
                }}
                className={`relative min-h-[110px] md:min-h-[125px] border-b border-r border-[#282E33]/70 p-1.5 transition hover:bg-[#1D2125]/40 flex flex-col justify-between cursor-pointer ${
                  !cell.isCurrentMonth ? 'bg-[#101214]/40' : ''
                }`}
              >
                <div>
                  {/* Day number */}
                  <div className="flex items-center justify-between mb-1.5">
                    {cell.isToday ? (
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7C3AED] text-white font-bold text-xs shadow-xs">
                        {cell.day}
                      </span>
                    ) : (
                      <span
                        className={`text-xs font-semibold pl-1 ${
                          cell.isCurrentMonth ? 'text-[#9FADBC]' : 'text-[#738496]'
                        }`}
                      >
                        {cell.day}
                      </span>
                    )}
                  </div>

                  {/* Multi-day Spanning Banner: Team offsite (Day 26, 27, 28) */}
                  {isSpanningDay && (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(INITIAL_EVENTS.find((ev) => ev.id === 'span-offsite'));
                      }}
                      className={`mb-1 px-2 py-0.5 text-[11px] font-semibold rounded bg-[#163828] text-[#4ADE80] border border-[#4BCE97]/40 truncate shadow-xs cursor-pointer hover:border-[#4ADE80] ${
                        cell.date === '2026-10-26'
                          ? 'rounded-l-md mr-0'
                          : cell.date === '2026-10-28'
                          ? 'rounded-r-md ml-0'
                          : 'rounded-none mx-0'
                      }`}
                    >
                      Team offsite
                    </div>
                  )}

                  {/* Day Events List */}
                  <div className="space-y-1">
                    {visibleEvents.map((ev) => (
                      <div
                        key={ev.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedEvent(ev);
                        }}
                        className={`flex items-center justify-between px-2 py-1 rounded text-[11px] font-medium leading-tight truncate transition cursor-pointer shadow-xs ${
                          COLOR_STYLES[ev.color] || COLOR_STYLES.gray
                        }`}
                      >
                        <span className="truncate">{ev.title}</span>
                        {ev.time && (
                          <span className="text-[10px] opacity-75 shrink-0 ml-1">
                            {ev.time}
                          </span>
                        )}
                      </div>
                    ))}

                    {/* "+ more..." link */}
                    {hasHidden && !isExpanded && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExpand(cell.date);
                        }}
                        className="text-[10px] font-semibold text-[#BA75FF] hover:underline pl-1 cursor-pointer"
                      >
                        {cellEvents.filter((e) => e.hiddenByDefault).length} more...
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Week View */}
      {currentView === 'week' && (
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-[#282E33] pb-3">
            <h3 className="text-sm font-bold text-[#DEE4EA]">
              Week 2 Schedule (Oct 11 – Oct 17)
            </h3>
            <span className="text-xs text-[#738496]">7 days active</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {monthDays.slice(14, 21).map((cell) => {
              const dayEvs = filteredEvents.filter((e) => e.date === cell.date && !e.isSpanning);
              return (
                <div
                  key={cell.date}
                  className={`p-3 rounded-xl border border-[#282E33] bg-[#1D2125] min-h-[220px] flex flex-col justify-between ${
                    cell.isToday ? 'ring-1 ring-[#7C3AED]' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2 pb-1 border-b border-[#282E33]">
                      <span className="text-xs font-semibold text-[#9FADBC]">
                        {DAYS_OF_WEEK[new Date(cell.date).getDay()]}
                      </span>
                      {cell.isToday ? (
                        <span className="h-5 w-5 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-[11px] font-bold">
                          {cell.day}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-[#DEE4EA]">{cell.day}</span>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      {dayEvs.map((ev) => (
                        <div
                          key={ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          className={`p-1.5 rounded text-[11px] font-medium truncate cursor-pointer ${
                            COLOR_STYLES[ev.color] || COLOR_STYLES.gray
                          }`}
                        >
                          <p className="truncate font-semibold">{ev.title}</p>
                          <p className="text-[10px] opacity-75">{ev.time}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Day View */}
      {currentView === 'day' && (
        <div className="p-6 max-w-2xl mx-auto space-y-4">
          <div className="flex items-center justify-between border-b border-[#282E33] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#DEE4EA]">Tuesday, October 13, 2026</h3>
              <p className="text-xs text-[#738496]">Today's schedule & delivery timeline</p>
            </div>
            <span className="h-7 w-7 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-xs">
              13
            </span>
          </div>

          <div className="space-y-2">
            {filteredEvents
              .filter((e) => e.date === '2026-10-13')
              .map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition ${
                    COLOR_STYLES[ev.color] || COLOR_STYLES.gray
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-bold text-[#DEE4EA]">{ev.title}</h4>
                    <span className="text-xs opacity-75">{ev.date}</span>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-black/20">{ev.time}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* 6. Add Event Modal */}
      <Modal
        isOpen={isAddEventOpen}
        onClose={() => setIsAddEventOpen(false)}
        title="Add Calendar Event"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAddEventSubmit} className="space-y-4 text-xs text-[#DEE4EA]">
          <div>
            <label className="block text-xs font-semibold text-[#9FADBC] mb-1">
              Event Title *
            </label>
            <input
              required
              autoFocus
              type="text"
              placeholder="e.g. Design review with leadership"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="w-full rounded-md bg-[#1D2125] border border-[#333C44] px-3 py-2 text-xs text-[#DEE4EA] focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#9FADBC] mb-1">
                Date
              </label>
              <DatePicker
                value={newEventDate}
                onChange={(val) => setNewEventDate(val)}
                placeholder="Select event date"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9FADBC] mb-1">
                Time
              </label>
              <input
                type="text"
                placeholder="e.g. 4:00 pm"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
                className="w-full rounded-md bg-[#1D2125] border border-[#333C44] px-3 py-2 text-xs text-[#DEE4EA] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9FADBC] mb-1.5">
              Category Color
            </label>
            <div className="flex items-center gap-2">
              {[
                { id: 'blue', label: 'Work', bg: 'bg-[#579DFF]' },
                { id: 'pink', label: 'Social', bg: 'bg-[#F472B6]' },
                { id: 'purple', label: 'Personal', bg: 'bg-[#BA75FF]' },
                { id: 'amber', label: 'Review', bg: 'bg-[#F5CD47]' },
                { id: 'green', label: 'Health', bg: 'bg-[#4ADE80]' },
                { id: 'gray', label: 'Meeting', bg: 'bg-[#9FADBC]' },
              ].map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setNewEventColor(c.id)}
                  title={c.label}
                  className={`h-7 w-7 rounded-full ${c.bg} flex items-center justify-center transition cursor-pointer ${
                    newEventColor === c.id ? 'ring-2 ring-white ring-offset-2 ring-offset-[#161A1D]' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#282E33]">
            <button
              type="button"
              onClick={() => setIsAddEventOpen(false)}
              className="px-3 py-1.5 rounded-md hover:bg-[#282E33] text-xs font-semibold text-[#DEE4EA] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-md bg-[#7C3AED] hover:bg-[#6D28D9] text-xs font-semibold text-white shadow-xs transition cursor-pointer"
            >
              Add Event
            </button>
          </div>
        </form>
      </Modal>

      {/* 7. Selected Event Inspector Modal */}
      {selectedEvent && (
        <Modal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          title="Event Details"
          maxWidth="max-w-md"
        >
          <div className="space-y-4 text-xs text-[#DEE4EA]">
            <div className="p-3 rounded-xl border bg-[#1D2125] border-[#282E33]">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    COLOR_STYLES[selectedEvent.color] || COLOR_STYLES.gray
                  }`}
                >
                  {selectedEvent.color}
                </span>
                <span className="text-xs text-[#738496]">
                  {selectedEvent.isSpanning
                    ? `${selectedEvent.startDate} – ${selectedEvent.endDate}`
                    : selectedEvent.date}
                </span>
              </div>
              <h3 className="text-base font-bold text-[#DEE4EA] mt-2">
                {selectedEvent.title}
              </h3>
              {selectedEvent.time && (
                <p className="text-xs text-[#9FADBC] mt-1 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#579DFF]" />
                  <span>{selectedEvent.time}</span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#282E33]">
              <button
                onClick={() => handleDeleteEvent(selectedEvent.id)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 text-xs font-semibold transition cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-1.5 rounded-md bg-[#22272B] hover:bg-[#282E33] text-xs font-semibold text-[#DEE4EA] transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
