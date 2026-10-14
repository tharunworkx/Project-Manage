import React, { useState, useEffect } from 'react';
import {
  ChevronDown,
  ArrowUp,
  ArrowDown,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

const DAYS_OF_WEEK = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

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

export function Calendar({
  selected,
  onSelect,
  className = '',
  captionLayout = 'dropdown',
  mode = 'single',
}) {
  // Parse selected date
  const selectedDate = selected
    ? typeof selected === 'string'
      ? new Date(selected + (selected.includes('T') ? '' : 'T00:00:00'))
      : selected
    : undefined;

  const today = new Date();

  // Current viewed month and year
  const [currentMonth, setCurrentMonth] = useState(() => {
    return selectedDate ? selectedDate.getMonth() : today.getMonth();
  });
  const [currentYear, setCurrentYear] = useState(() => {
    return selectedDate ? selectedDate.getFullYear() : today.getFullYear();
  });

  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);

  // Sync viewed month when selected date changes externally
  useEffect(() => {
    if (selectedDate && !isNaN(selectedDate.getTime())) {
      setCurrentMonth(selectedDate.getMonth());
      setCurrentYear(selectedDate.getFullYear());
    }
  }, [selected]);

  // Navigate to previous month
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  // Navigate to next month
  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  // Build 42-day calendar matrix (6 weeks)
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInCurrentMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

  const days = [];

  // Trailing days from previous month
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    days.push({
      day: daysInPrevMonth - i,
      month: currentMonth - 1,
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

  // Leading days of next month to complete 35 or 42 grid cells
  const remaining = (7 - (days.length % 7)) % 7;
  const totalNeeded = days.length + remaining < 35 ? 35 - days.length : remaining;
  for (let i = 1; i <= totalNeeded; i++) {
    days.push({
      day: i,
      month: currentMonth + 1,
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
    onSelect && onSelect(clickedDate);
  };

  const handleClear = () => {
    onSelect && onSelect(undefined);
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
    onSelect && onSelect(now);
  };

  // Generate Year options
  const years = [];
  const startYear = today.getFullYear() - 10;
  for (let y = startYear; y <= startYear + 20; y++) {
    years.push(y);
  }

  return (
    <div
      className={`w-72 select-none rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-3 text-slate-800 dark:text-[#DEE4EA] shadow-xl ${className}`}
    >
      {/* Header: Month/Year Dropdown & Nav Arrows */}
      <div className="flex items-center justify-between pb-2 mb-1 relative">
        {/* Caption layout: dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md text-sm font-bold text-slate-900 dark:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#22272B] transition cursor-pointer"
          >
            <span>
              {MONTH_NAMES[currentMonth]}, {currentYear}
            </span>
            <ChevronDown className="h-4 w-4 text-slate-500 dark:text-[#9FADBC]" />
          </button>

          {/* Month / Year picker dropdown */}
          {isMonthDropdownOpen && (
            <div className="absolute left-0 top-full mt-1 w-56 rounded-xl border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] p-2 shadow-2xl z-50 text-xs">
              <div className="grid grid-cols-2 gap-2 mb-2">
                <select
                  value={currentMonth}
                  onChange={(e) => setCurrentMonth(Number(e.target.value))}
                  className="rounded-lg border border-slate-200 bg-slate-50 dark:border-[#333C44] dark:bg-[#161A1D] p-1.5 text-xs text-slate-800 dark:text-[#DEE4EA] focus:outline-none"
                >
                  {MONTH_NAMES.map((m, idx) => (
                    <option key={m} value={idx}>
                      {m}
                    </option>
                  ))}
                </select>
                <select
                  value={currentYear}
                  onChange={(e) => setCurrentYear(Number(e.target.value))}
                  className="rounded-lg border border-slate-200 bg-slate-50 dark:border-[#333C44] dark:bg-[#161A1D] p-1.5 text-xs text-slate-800 dark:text-[#DEE4EA] focus:outline-none"
                >
                  {years.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
              <button
                type="button"
                onClick={() => setIsMonthDropdownOpen(false)}
                className="w-full py-1 rounded bg-[#0C66E4] text-white font-semibold text-center hover:bg-[#0055CC]"
              >
                Done
              </button>
            </div>
          )}
        </div>

        {/* Up / Down Navigation Arrows matching Image 2 */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={handlePrevMonth}
            title="Previous month"
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA] dark:hover:bg-[#22272B] transition cursor-pointer"
          >
            <ArrowUp className="h-4 w-4 stroke-[2.2]" />
          </button>
          <button
            type="button"
            onClick={handleNextMonth}
            title="Next month"
            className="flex h-7 w-7 items-center justify-center rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA] dark:hover:bg-[#22272B] transition cursor-pointer"
          >
            <ArrowDown className="h-4 w-4 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* Weekdays Header */}
      <div className="grid grid-cols-7 text-center mb-1.5">
        {DAYS_OF_WEEK.map((w) => (
          <div
            key={w}
            className="text-xs font-semibold text-slate-700 dark:text-[#9FADBC] py-1"
          >
            {w}
          </div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((item, idx) => {
          const itemDate = new Date(item.year, item.month, item.day);
          const isSelected = selectedDate && isSameDay(itemDate, selectedDate);
          const isToday = isSameDay(itemDate, today);

          return (
            <button
              key={idx}
              type="button"
              onClick={() => handleDayClick(item)}
              className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-medium transition cursor-pointer mx-auto ${
                isSelected
                  ? 'bg-[#0C66E4] text-white font-bold shadow-xs'
                  : isToday
                  ? 'border border-slate-400 dark:border-[#579DFF] text-slate-900 dark:text-white font-semibold'
                  : item.isCurrentMonth
                  ? 'text-slate-800 dark:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#22272B]'
                  : 'text-slate-400 dark:text-[#738496]/70 hover:bg-slate-50 dark:hover:bg-[#22272B]/50'
              }`}
            >
              {item.day}
            </button>
          );
        })}
      </div>

      {/* Footer: Clear & Today Action Buttons matching Image 2 */}
      <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100 dark:border-[#282E33]/70 px-1">
        <button
          type="button"
          onClick={handleClear}
          className="text-xs font-semibold text-[#0C66E4] dark:text-[#579DFF] hover:underline cursor-pointer"
        >
          Clear
        </button>
        <button
          type="button"
          onClick={handleToday}
          className="text-xs font-semibold text-[#0C66E4] dark:text-[#579DFF] hover:underline cursor-pointer"
        >
          Today
        </button>
      </div>
    </div>
  );
}

export default Calendar;
