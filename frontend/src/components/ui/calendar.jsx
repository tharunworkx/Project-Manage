import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

const MONTH_SHORT_NAMES = [
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

const YEARS = Array.from({ length: 35 }, (_, i) => 2015 + i);

export function Calendar({
  selected,
  onSelect,
  className = '',
}) {
  const selectedDate = selected
    ? typeof selected === 'string'
      ? new Date(selected + (selected.includes('T') ? '' : 'T00:00:00'))
      : selected
    : undefined;

  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(() => {
    return selectedDate && !isNaN(selectedDate.getTime()) ? selectedDate.getMonth() : today.getMonth();
  });
  const [currentYear, setCurrentYear] = useState(() => {
    return selectedDate && !isNaN(selectedDate.getTime()) ? selectedDate.getFullYear() : today.getFullYear();
  });

  useEffect(() => {
    if (selectedDate && !isNaN(selectedDate.getTime())) {
      setCurrentMonth(selectedDate.getMonth());
      setCurrentYear(selectedDate.getFullYear());
    }
  }, [selected]);

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Build calendar matrix
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const days = [];

  // Trailing days from previous month
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      month: currentMonth === 0 ? 11 : currentMonth - 1,
      year: currentMonth === 0 ? currentYear - 1 : currentYear,
      isCurrentMonth: false,
    });
  }

  // Days of current month
  for (let i = 1; i <= daysInCurrentMonth; i++) {
    days.push({
      day: i,
      month: currentMonth,
      year: currentYear,
      isCurrentMonth: true,
    });
  }

  // Leading days of next month to complete standard 35 or 42 grid
  const totalCells = days.length <= 35 ? 35 : 42;
  const remaining = totalCells - days.length;
  for (let i = 1; i <= remaining; i++) {
    days.push({
      day: i,
      month: currentMonth === 11 ? 0 : currentMonth + 1,
      year: currentMonth === 11 ? currentYear + 1 : currentYear,
      isCurrentMonth: false,
    });
  }

  const isSameDay = (d1, d2) => {
    if (!d1 || !d2) return false;
    return (
      d1.getDate() === d2.getDate() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getFullYear() === d2.getFullYear()
    );
  };

  const handleDayClick = (item) => {
    const clickedDate = new Date(item.year, item.month, item.day);
    if (!item.isCurrentMonth) {
      setCurrentMonth(item.month);
      setCurrentYear(item.year);
    }
    onSelect && onSelect(clickedDate);
  };

  // Ensure current year is in list
  const yearOptions = YEARS.includes(currentYear)
    ? YEARS
    : [...YEARS, currentYear].sort((a, b) => a - b);

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`w-[272px] select-none rounded-2xl border border-slate-200 dark:border-zinc-800/90 bg-white dark:bg-[#0C0D10] p-4 text-slate-900 dark:text-white shadow-2xl transition-colors ${className}`}
    >
      {/* Header: ChevronLeft, Month Dropdown, Year Dropdown, ChevronRight */}
      <div className="flex items-center justify-between mb-3 px-0.5">
        <button
          type="button"
          onClick={handlePrevMonth}
          title="Previous month"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 transition cursor-pointer"
        >
          <ChevronLeft className="h-4 w-4 stroke-[2.2]" />
        </button>

        {/* Center: Month Dropdown & Year Dropdown matching "Oct ˅ 2026 ˅" */}
        <div className="flex items-center gap-1.5">
          {/* Month Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1 font-semibold text-sm text-slate-900 dark:text-white px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer outline-none"
              >
                <span>{MONTH_SHORT_NAMES[currentMonth]}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="max-h-56 overflow-y-auto min-w-[100px] p-1 rounded-xl">
              {MONTH_SHORT_NAMES.map((m, idx) => (
                <DropdownMenuItem
                  key={m}
                  onClick={() => setCurrentMonth(idx)}
                  className={`cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                    currentMonth === idx ? 'bg-slate-100 dark:bg-zinc-800 font-bold text-slate-900 dark:text-white' : ''
                  }`}
                >
                  {m}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Year Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="flex items-center gap-1 font-semibold text-sm text-slate-900 dark:text-white px-2 py-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition cursor-pointer outline-none"
              >
                <span>{currentYear}</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 dark:text-zinc-400" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="max-h-56 overflow-y-auto min-w-[90px] p-1 rounded-xl">
              {yearOptions.map((y) => (
                <DropdownMenuItem
                  key={y}
                  onClick={() => setCurrentYear(y)}
                  className={`cursor-pointer rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                    currentYear === y ? 'bg-slate-100 dark:bg-zinc-800 font-bold text-slate-900 dark:text-white' : ''
                  }`}
                >
                  {y}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <button
          type="button"
          onClick={handleNextMonth}
          title="Next month"
          className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-300 dark:hover:text-white dark:hover:bg-zinc-800 transition cursor-pointer"
        >
          <ChevronRight className="h-4 w-4 stroke-[2.2]" />
        </button>
      </div>

      {/* Weekdays Header: Su Mo Tu We Th Fr Sa */}
      <div className="grid grid-cols-7 text-center mb-2">
        {DAYS_OF_WEEK.map((w) => (
          <div
            key={w}
            className="text-xs font-semibold text-slate-400 dark:text-zinc-400 py-0.5"
          >
            {w}
          </div>
        ))}
      </div>

      {/* Days Grid matching screenshot */}
      <div className="grid grid-cols-7 gap-y-1 text-center">
        {days.map((item, idx) => {
          const itemDate = new Date(item.year, item.month, item.day);
          const isSelected = selectedDate && isSameDay(itemDate, selectedDate);
          const isToday = isSameDay(itemDate, today);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleDayClick(item)}
              className={`flex h-8.5 w-8.5 items-center justify-center text-xs transition cursor-pointer mx-auto ${
                isSelected
                  ? 'bg-[#0C66E4] text-white dark:bg-white dark:text-black font-bold rounded-xl shadow-xs'
                  : item.isCurrentMonth
                  ? isToday
                    ? 'text-[#0C66E4] dark:text-white font-bold rounded-xl ring-1 ring-[#0C66E4]/40 dark:ring-white/30 hover:bg-blue-50 dark:hover:bg-zinc-800'
                    : 'text-slate-800 dark:text-white font-medium hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-xl'
                  : 'text-slate-400/80 dark:text-zinc-500 font-normal hover:bg-slate-100/60 dark:hover:bg-zinc-800/50 rounded-xl'
              }`}
            >
              {item.day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Calendar;
