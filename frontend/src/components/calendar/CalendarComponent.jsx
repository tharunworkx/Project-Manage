import React, { useState, useMemo, useRef, useEffect } from 'react';
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
import { DatePicker } from '../ui/date-picker';
import { useTasks } from '../../hooks/useTasks';

// Sample events exactly matching the provided calendar screenshot
const INITIAL_EVENTS = [];


const COLOR_STYLES = {
  blue: 'bg-blue-50 dark:bg-[#1C2B41] text-blue-600 dark:text-[#579DFF] border border-blue-200 dark:border-[#579DFF]/30 hover:border-blue-400 dark:hover:border-[#579DFF]',
  pink: 'bg-pink-50 dark:bg-[#381B26] text-pink-600 dark:text-[#F472B6] border border-pink-200 dark:border-[#F472B6]/30 hover:border-pink-400 dark:hover:border-[#F472B6]',
  purple: 'bg-purple-50 dark:bg-[#282240] text-purple-600 dark:text-[#D3C5FF] border border-purple-200 dark:border-[#BA75FF]/30 hover:border-purple-400 dark:hover:border-[#BA75FF]',
  amber: 'bg-amber-50 dark:bg-[#352A12] text-amber-700 dark:text-[#F5CD47] border border-amber-200 dark:border-[#F5CD47]/30 hover:border-amber-400 dark:hover:border-[#F5CD47]',
  yellow: 'bg-amber-50 dark:bg-[#352A12] text-amber-700 dark:text-[#F5CD47] border border-amber-200 dark:border-[#F5CD47]/30 hover:border-amber-400 dark:hover:border-[#F5CD47]',
  green: 'bg-emerald-50 dark:bg-[#163828] text-emerald-700 dark:text-[#4ADE80] border border-emerald-200 dark:border-[#4ADE80]/30 hover:border-emerald-400 dark:hover:border-[#4ADE80]',
  gray: 'bg-slate-100 dark:bg-[#22272B] text-slate-700 dark:text-[#DEE4EA] border border-slate-200 dark:border-[#333C44] hover:border-slate-300 dark:hover:border-[#738496]',
};

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTH_NAMES_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function CalendarComponent() {
  const { tasks = [] } = useTasks();
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [currentView, setCurrentView] = useState('month'); // 'month', 'week', 'day'
  const [viewDropdownOpen, setViewDropdownOpen] = useState(false);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const monthDropdownRef = useRef(null);
  const viewDropdownRef = useRef(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(e.target)) {
        setMonthDropdownOpen(false);
      }
      if (viewDropdownRef.current && !viewDropdownRef.current.contains(e.target)) {
        setViewDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth(); // 0-11
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Expanded days for "+ more" links
  const [expandedDays, setExpandedDays] = useState({});

  // Add Event Modal
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventDate, setNewEventDate] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
  const [newEventTime, setNewEventTime] = useState('4:00 pm');
  const [newEventColor, setNewEventColor] = useState('blue');

  // Selected event details modal
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Navigation handlers
  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handlePrev = () => {
    if (currentView === 'day') {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 1));
    } else if (currentView === 'week') {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() - 7));
    } else {
      handlePrevMonth();
    }
  };

  const handleNext = () => {
    if (currentView === 'day') {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 1));
    } else if (currentView === 'week') {
      setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth(), prev.getDate() + 7));
    } else {
      handleNextMonth();
    }
  };

  const handleSelectMonth = (idx) => {
    setCurrentDate(new Date(currentYear, idx, 1));
    setMonthDropdownOpen(false);
  };

  const handleYearChange = (delta) => {
    setCurrentDate(new Date(currentYear + delta, currentMonth, 1));
  };

  // Dynamic Month grid generation (35 or 42 cells)
  const monthDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sun
    const totalDaysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const totalDaysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    const days = [];

    // Previous month trailing days
    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = totalDaysInPrevMonth - i;
      const prevM = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevY = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateStr = `${prevY}-${String(prevM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      days.push({
        day: d,
        month: prevM,
        year: prevY,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        date: dateStr,
      });
    }

    // Current month days
    for (let i = 1; i <= totalDaysInMonth; i++) {
      const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        day: i,
        month: currentMonth,
        year: currentYear,
        isCurrentMonth: true,
        isToday: dateStr === todayStr,
        date: dateStr,
      });
    }

    // Next month leading days to complete full grid (35 or 42)
    const targetLength = days.length <= 35 ? 35 : 42;
    const remaining = targetLength - days.length;
    for (let i = 1; i <= remaining; i++) {
      const nextM = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextY = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateStr = `${nextY}-${String(nextM + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({
        day: i,
        month: nextM,
        year: nextY,
        isCurrentMonth: false,
        isToday: dateStr === todayStr,
        date: dateStr,
      });
    }

    return days;
  }, [currentYear, currentMonth]);

  // Week View Days
  const weekDays = useMemo(() => {
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - currentDate.getDay());
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      return {
        day: d.getDate(),
        date: dateStr,
        isToday: dateStr === todayStr,
        dayName: DAYS_OF_WEEK[d.getDay()],
        monthName: MONTH_NAMES_SHORT[d.getMonth()],
      };
    });
  }, [currentDate]);

  // Merge workspace project tasks having due_dates into calendar
  const taskEvents = useMemo(() => {
    return tasks
      .filter((t) => t.due_date)
      .map((t) => ({
        id: `task-${t.id}`,
        title: t.title,
        date: t.due_date.includes('T') ? t.due_date.split('T')[0] : t.due_date,
        time: t.status === 'done' ? 'Completed' : 'Due date',
        color: t.status === 'done' ? 'green' : t.priority === 'urgent' ? 'pink' : t.priority === 'high' ? 'amber' : 'blue',
        isTask: true,
        key: t.key || `KAN-${t.id}`,
      }));
  }, [tasks]);

  const allEvents = useMemo(() => {
    return [...events, ...taskEvents.filter((te) => !events.some((e) => e.id === te.id))];
  }, [events, taskEvents]);

  // Filter events based on search
  const filteredEvents = allEvents.filter((e) => {
    if (!searchVal) return true;
    return e.title.toLowerCase().includes(searchVal.toLowerCase());
  });

  const selectedDateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(currentDate.getDate()).padStart(2, '0')}`;

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
  };

  const handleDeleteEvent = (id) => {
    setEvents(events.filter((e) => e.id !== id));
    setSelectedEvent(null);
  };

  const toggleExpand = (dateStr) => {
    setExpandedDays((prev) => ({ ...prev, [dateStr]: !prev[dateStr] }));
  };

  return (
    <div className="w-full h-full flex-1 min-h-0 flex flex-col rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] text-slate-900 dark:text-[#DEE4EA] overflow-hidden shadow-xl select-none">
      {/* 1. Header Toolbar with Dynamic Month/Year Navigation */}
      <div className="shrink-0 flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 md:p-3.5 border-b border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D]">
        {/* Left: Date Badge + Title + Week Pill */}
        <div className="flex items-center gap-3">
          {/* Current Month & Day Date Badge */}
          <div className="flex h-11 w-11 flex-col items-center justify-center rounded-xl border border-slate-200 dark:border-[#333C44] bg-slate-100 dark:bg-[#1D2125] shadow-xs">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-[#738496] leading-none">
              {MONTH_NAMES_SHORT[currentMonth]}
            </span>
            <span className="text-base font-extrabold text-[#7C3AED] dark:text-[#BA75FF] leading-none mt-0.5">
              {currentDate.getDate()}
            </span>
          </div>

          <div className="relative" ref={monthDropdownRef}>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
                className="flex items-center gap-1.5 text-base md:text-lg font-bold text-slate-900 dark:text-[#DEE4EA] tracking-tight hover:text-[#7C3AED] dark:hover:text-[#BA75FF] transition cursor-pointer group"
                title="Click to select month and year"
              >
                <span>{MONTH_NAMES[currentMonth]} {currentYear}</span>
                <ChevronDown className="h-4 w-4 text-slate-400 group-hover:text-[#7C3AED] dark:group-hover:text-[#BA75FF] transition" />
              </button>
              <span className="rounded-md border border-slate-200 dark:border-[#333C44] bg-slate-100 dark:bg-[#22272B] px-2 py-0.5 text-[11px] font-medium text-slate-600 dark:text-[#9FADBC]">
                {currentView === 'month'
                  ? `Week ${Math.ceil((currentDate.getDate() + new Date(currentYear, currentMonth, 1).getDay()) / 7)}`
                  : currentView === 'week'
                  ? 'Week View'
                  : 'Day View'}
              </span>
            </div>

            {/* Quick Month & Year Picker Dropdown */}
            {monthDropdownOpen && (
              <div className="absolute left-0 top-full mt-2 z-50 w-64 rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#1D2125] p-3 shadow-2xl animate-fade-in text-xs">
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100 dark:border-[#282E33]">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleYearChange(-1);
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#282E33] text-slate-600 dark:text-[#9FADBC] cursor-pointer"
                    title="Previous Year"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="font-bold text-slate-900 dark:text-[#DEE4EA] text-sm">{currentYear}</span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleYearChange(1);
                    }}
                    className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#282E33] text-slate-600 dark:text-[#9FADBC] cursor-pointer"
                    title="Next Year"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {MONTH_NAMES.map((m, idx) => (
                    <button
                      key={m}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectMonth(idx);
                      }}
                      className={`py-1.5 px-2 rounded-lg text-center transition cursor-pointer font-medium ${
                        currentMonth === idx
                          ? 'bg-[#7C3AED] text-white font-bold shadow-xs'
                          : 'text-slate-700 dark:text-[#9FADBC] hover:bg-slate-100 dark:hover:bg-[#282E33] hover:text-slate-900 dark:hover:text-[#DEE4EA]'
                      }`}
                    >
                      {m.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Search, Prev/Today/Next Nav, View Switcher, + Add event */}
        <div className="flex items-center gap-2 flex-wrap">
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
                  className="h-8.5 w-44 rounded-lg border border-black dark:border-white bg-white dark:bg-[#22272B] pl-8 pr-7 text-xs text-slate-900 dark:text-[#DEE4EA] placeholder-slate-400 dark:placeholder-[#738496] focus:border-black dark:focus:border-white focus:outline-none transition-colors"
                />
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 dark:text-[#738496]" />
                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchVal('');
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:text-[#738496] dark:hover:text-[#DEE4EA]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSearchOpen(true)}
                title="Search events"
                className="flex h-8.5 w-8.5 items-center justify-center rounded-lg border border-black dark:border-white bg-slate-100 dark:bg-[#22272B] text-slate-600 dark:text-[#9FADBC] hover:bg-slate-200 dark:hover:bg-[#282E33] hover:text-slate-900 dark:hover:text-[#DEE4EA] transition cursor-pointer"
              >
                <Search className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Grouped Nav: < Prev Month | Today | Next Month > */}
          <div className="flex items-center rounded-lg border border-slate-200 dark:border-[#282E33] bg-slate-100 dark:bg-[#22272B] overflow-hidden shadow-xs">
            <button
              onClick={handlePrev}
              title={currentView === 'month' ? 'Previous Month' : currentView === 'week' ? 'Previous Week' : 'Previous Day'}
              className="flex h-8.5 px-2.5 items-center gap-1 text-slate-600 dark:text-[#9FADBC] hover:bg-slate-200 dark:hover:bg-[#282E33] hover:text-slate-900 dark:hover:text-[#DEE4EA] transition cursor-pointer border-r border-slate-200 dark:border-[#282E33]"
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="text-xs font-semibold hidden sm:inline">Prev</span>
            </button>
            <button
              onClick={handleToday}
              className="px-3 h-8.5 text-xs font-semibold text-slate-700 dark:text-[#DEE4EA] hover:bg-slate-200 dark:hover:bg-[#282E33] transition cursor-pointer"
              title="Return to Current Month"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              title={currentView === 'month' ? 'Next Month' : currentView === 'week' ? 'Next Week' : 'Next Day'}
              className="flex h-8.5 px-2.5 items-center gap-1 text-slate-600 dark:text-[#9FADBC] hover:bg-slate-200 dark:hover:bg-[#282E33] hover:text-slate-900 dark:hover:text-[#DEE4EA] transition cursor-pointer border-l border-slate-200 dark:border-[#282E33]"
            >
              <span className="text-xs font-semibold hidden sm:inline">Next</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* View switcher dropdown */}
          <div className="relative" ref={viewDropdownRef}>
            <button
              onClick={() => setViewDropdownOpen(!viewDropdownOpen)}
              className="flex h-8.5 items-center gap-1.5 rounded-lg border border-slate-200 dark:border-[#282E33] bg-slate-100 dark:bg-[#22272B] px-3 text-xs font-medium text-slate-700 dark:text-[#DEE4EA] hover:bg-slate-200 dark:hover:bg-[#282E33] transition cursor-pointer shadow-xs"
            >
              <span className="capitalize">{currentView} view</span>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400 dark:text-[#738496]" />
            </button>

            {viewDropdownOpen && (
              <div className="absolute right-0 top-10 z-50 w-36 rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#1D2125] p-1 shadow-2xl animate-fade-in text-xs">
                {['month', 'week', 'day'].map((view) => (
                  <button
                    key={view}
                    onClick={() => {
                      setCurrentView(view);
                      setViewDropdownOpen(false);
                    }}
                    className={`flex w-full items-center justify-between px-3 py-1.5 rounded-lg capitalize transition cursor-pointer ${
                      currentView === view
                        ? 'bg-blue-50 dark:bg-[#1C2B41] text-[#0C66E4] dark:text-[#579DFF] font-semibold'
                        : 'text-slate-700 dark:text-[#9FADBC] hover:bg-slate-100 dark:hover:bg-[#22272B] hover:text-slate-900 dark:hover:text-[#DEE4EA]'
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
      <div className="shrink-0 grid grid-cols-7 border-b border-slate-200 dark:border-[#282E33] bg-slate-50 dark:bg-[#1D2125] text-center text-xs font-semibold text-slate-600 dark:text-[#9FADBC] py-2">
        {DAYS_OF_WEEK.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* 3. Month View Grid - Dynamic 5 or 6 rows */}
      {currentView === 'month' && (
        <div
          className={`grid grid-cols-7 ${
            monthDays.length > 35 ? 'grid-rows-6' : 'grid-rows-5'
          } flex-1 min-h-0 bg-slate-100 dark:bg-[#161A1D]`}
        >
          {monthDays.map((cell, idx) => {
            // Find single-day events for this cell
            const cellEvents = filteredEvents.filter((e) => e.date === cell.date && !e.isSpanning);
            const spanningEvents = filteredEvents.filter(
              (e) => e.isSpanning && e.startDate && e.endDate && cell.date >= e.startDate && cell.date <= e.endDate
            );
            const isSpanningDay = spanningEvents.length > 0;
            const isExpanded = !!expandedDays[cell.date];

            // Display limit before "+ more"
            const maxVisible = isSpanningDay ? 1 : 2;
            const visibleEvents = isExpanded ? cellEvents : cellEvents.slice(0, maxVisible);
            const hiddenCount = cellEvents.length - visibleEvents.length;

            return (
              <div
                key={idx}
                onClick={() => {
                  setNewEventDate(cell.date);
                  setIsAddEventOpen(true);
                }}
                className={`relative h-full border-b border-r border-slate-200 dark:border-[#282E33]/70 p-1 sm:p-1.5 transition hover:bg-slate-50 dark:hover:bg-[#1D2125]/40 flex flex-col justify-start overflow-hidden cursor-pointer ${
                  !cell.isCurrentMonth
                    ? 'bg-slate-50/70 dark:bg-[#101214]/40'
                    : 'bg-white dark:bg-[#161A1D]'
                }`}
              >
                {/* Day number header */}
                <div className="flex items-center justify-between mb-0.5 shrink-0">
                  {cell.isToday ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#7C3AED] text-white font-bold text-[11px] shadow-xs">
                      {cell.day}
                    </span>
                  ) : (
                    <span
                      className={`text-xs font-semibold pl-1 ${
                        cell.isCurrentMonth ? 'text-slate-700 dark:text-[#9FADBC]' : 'text-slate-400 dark:text-[#738496]'
                      }`}
                    >
                      {cell.day}
                    </span>
                  )}
                </div>

                {/* Multi-day Spanning Banner if any */}
                {spanningEvents.map((spanEv) => (
                  <div
                    key={spanEv.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(spanEv);
                    }}
                    className={`mb-0.5 px-1.5 py-0.5 text-[10px] font-semibold rounded bg-emerald-500/15 dark:bg-[#163828] text-emerald-700 dark:text-[#4ADE80] border border-emerald-500/30 dark:border-[#4BCE97]/40 truncate shadow-2xs cursor-pointer hover:border-[#4ADE80] ${
                      cell.date === spanEv.startDate
                        ? 'rounded-l-md mr-0'
                        : cell.date === spanEv.endDate
                        ? 'rounded-r-md ml-0'
                        : 'rounded-none mx-0'
                    }`}
                  >
                    {spanEv.title}
                  </div>
                ))}

                {/* Day Events List */}
                <div className="space-y-0.5 overflow-hidden">
                  {visibleEvents.map((ev) => (
                    <div
                      key={ev.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(ev);
                      }}
                      className={`flex items-center justify-between px-1.5 py-0.5 rounded text-[10px] font-medium leading-tight truncate transition cursor-pointer shadow-2xs ${
                        COLOR_STYLES[ev.color] || COLOR_STYLES.gray
                      }`}
                    >
                      <span className="truncate">{ev.title}</span>
                      {ev.time && (
                        <span className="text-[9px] opacity-75 shrink-0 ml-1">
                          {ev.time}
                        </span>
                      )}
                    </div>
                  ))}

                  {/* "+ more..." link */}
                  {hiddenCount > 0 && !isExpanded && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(cell.date);
                      }}
                      className="text-[9px] font-semibold text-[#7C3AED] dark:text-[#BA75FF] hover:underline pl-0.5 cursor-pointer block truncate"
                    >
                      {hiddenCount} more...
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 4. Week View */}
      {currentView === 'week' && (
        <div className="p-4 md:p-6 space-y-4 flex-1 overflow-y-auto">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#282E33] pb-3">
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#DEE4EA]">
              Schedule for {weekDays[0]?.monthName} {weekDays[0]?.day} – {weekDays[6]?.monthName} {weekDays[6]?.day}, {currentYear}
            </h3>
            <span className="text-xs text-slate-500 dark:text-[#738496]">7 days active</span>
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((cell) => {
              const dayEvs = filteredEvents.filter((e) => e.date === cell.date && !e.isSpanning);
              return (
                <div
                  key={cell.date}
                  className={`p-3 rounded-xl border border-slate-200 dark:border-[#282E33] bg-slate-50 dark:bg-[#1D2125] min-h-[220px] flex flex-col justify-between ${
                    cell.isToday ? 'ring-1 ring-[#7C3AED]' : ''
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-200 dark:border-[#282E33]">
                      <span className="text-xs font-semibold text-slate-600 dark:text-[#9FADBC]">
                        {cell.dayName}
                      </span>
                      {cell.isToday ? (
                        <span className="h-5 w-5 rounded-full bg-[#7C3AED] text-white flex items-center justify-center text-[11px] font-bold">
                          {cell.day}
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-slate-900 dark:text-[#DEE4EA]">{cell.day}</span>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      {dayEvs.map((ev) => (
                        <div
                          key={ev.id}
                          onClick={() => setSelectedEvent(ev)}
                          className={`p-1.5 rounded text-[11px] font-medium truncate cursor-pointer shadow-2xs ${
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
        <div className="p-4 md:p-6 max-w-2xl mx-auto space-y-4 flex-1 overflow-y-auto w-full">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-[#282E33] pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#DEE4EA]">
                {currentDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </h3>
            </div>
            <span className="h-7 w-7 rounded-full bg-[#7C3AED] text-white flex items-center justify-center font-bold text-xs">
              {currentDate.getDate()}
            </span>
          </div>

          <div className="space-y-2">
            {filteredEvents
              .filter((e) => e.date === selectedDateStr)
              .map((ev) => (
                <div
                  key={ev.id}
                  onClick={() => setSelectedEvent(ev)}
                  className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition shadow-xs ${
                    COLOR_STYLES[ev.color] || COLOR_STYLES.gray
                  }`}
                >
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-[#DEE4EA]">{ev.title}</h4>
                    <span className="text-xs opacity-75">{ev.date}</span>
                  </div>
                  <span className="text-xs font-bold px-2 py-1 rounded bg-black/10 dark:bg-black/30">{ev.time}</span>
                </div>
              ))}
            {filteredEvents.filter((e) => e.date === selectedDateStr).length === 0 && (
              <div className="p-8 text-center text-slate-400 dark:text-[#738496] border border-dashed border-slate-200 dark:border-[#282E33] rounded-xl">
                No events scheduled for this day. Click "+ Add event" to create one.
              </div>
            )}
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
        <form onSubmit={handleAddEventSubmit} className="space-y-4 text-xs text-slate-900 dark:text-[#DEE4EA]">
          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-[#9FADBC] mb-1">
              Event Title *
            </label>
            <input
              required
              autoFocus
              type="text"
              placeholder="e.g. Design review with leadership"
              value={newEventTitle}
              onChange={(e) => setNewEventTitle(e.target.value)}
              className="w-full rounded-md bg-white dark:bg-[#1D2125] border border-slate-200 dark:border-[#333C44] px-3 py-2 text-xs text-slate-900 dark:text-[#DEE4EA] focus:outline-none focus:border-[#7C3AED]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-[#9FADBC] mb-1">
                Date
              </label>
              <DatePicker
                value={newEventDate}
                onChange={(val) => setNewEventDate(val)}
                placeholder="Select event date"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 dark:text-[#9FADBC] mb-1">
                Time
              </label>
              <input
                type="text"
                placeholder="e.g. 4:00 pm"
                value={newEventTime}
                onChange={(e) => setNewEventTime(e.target.value)}
                className="w-full rounded-md bg-white dark:bg-[#1D2125] border border-slate-200 dark:border-[#333C44] px-3 py-2 text-xs text-slate-900 dark:text-[#DEE4EA] focus:outline-none focus:border-[#7C3AED]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 dark:text-[#9FADBC] mb-1.5">
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
                    newEventColor === c.id ? 'ring-2 ring-[#7C3AED] ring-offset-2 ring-offset-white dark:ring-offset-[#161A1D]' : 'opacity-70 hover:opacity-100'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-[#282E33]">
            <button
              type="button"
              onClick={() => setIsAddEventOpen(false)}
              className="px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-[#282E33] text-xs font-semibold text-slate-700 dark:text-[#DEE4EA] transition cursor-pointer"
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
          <div className="space-y-4 text-xs text-slate-900 dark:text-[#DEE4EA]">
            <div className="p-3 rounded-xl border bg-slate-50 dark:bg-[#1D2125] border-slate-200 dark:border-[#282E33]">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                    COLOR_STYLES[selectedEvent.color] || COLOR_STYLES.gray
                  }`}
                >
                  {selectedEvent.color}
                </span>
                <span className="text-xs text-slate-500 dark:text-[#738496]">
                  {selectedEvent.isSpanning
                    ? `${selectedEvent.startDate} – ${selectedEvent.endDate}`
                    : selectedEvent.date}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#DEE4EA] mt-2">
                {selectedEvent.title}
              </h3>
              {selectedEvent.key && (
                <p className="text-xs font-semibold text-[#0C66E4] dark:text-[#579DFF] mt-1">
                  Issue: {selectedEvent.key}
                </p>
              )}
              {selectedEvent.time && (
                <p className="text-xs text-slate-600 dark:text-[#9FADBC] mt-1 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#0C66E4] dark:text-[#579DFF]" />
                  <span>{selectedEvent.time}</span>
                </p>
              )}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-200 dark:border-[#282E33]">
              {!selectedEvent.isTask ? (
                <button
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-600 dark:text-rose-400 text-xs font-semibold transition cursor-pointer border border-rose-200 dark:border-rose-900/40"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>Delete</span>
                </button>
              ) : (
                <div />
              )}
              <button
                onClick={() => setSelectedEvent(null)}
                className="px-4 py-1.5 rounded-md bg-slate-100 dark:bg-[#22272B] hover:bg-slate-200 dark:hover:bg-[#282E33] text-xs font-semibold text-slate-700 dark:text-[#DEE4EA] transition cursor-pointer"
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

export default CalendarComponent;
