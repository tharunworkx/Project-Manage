import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Calendar } from './calendar';

export function DatePicker({
  value,
  onChange,
  placeholder = 'dd/mm/yyyy',
  className = '',
  disabled = false,
  align = 'left',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [openUpwards, setOpenUpwards] = useState(false);
  const [alignRight, setAlignRight] = useState(align === 'right');
  const containerRef = useRef(null);

  // Auto-detect viewport boundary to flip upwards or align right
  useEffect(() => {
    if (isOpen && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const calendarHeight = 310;
      const calendarWidth = 280;
      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceRight = window.innerWidth - rect.left;

      setOpenUpwards(spaceBelow < calendarHeight);
      if (align === 'right' || spaceRight < calendarWidth) {
        setAlignRight(true);
      } else {
        setAlignRight(false);
      }
    }
  }, [isOpen, align]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const selectedDate = value
    ? typeof value === 'string'
      ? new Date(value + (value.includes('T') ? '' : 'T00:00:00'))
      : value
    : undefined;

  const handleSelect = (date) => {
    if (!date) {
      onChange && onChange('');
    } else {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, '0');
      const dd = String(date.getDate()).padStart(2, '0');
      onChange && onChange(`${yyyy}-${mm}-${dd}`);
    }
    setIsOpen(false);
  };

  const formatDisplay = (d) => {
    if (!d || isNaN(d.getTime())) return placeholder;
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  return (
    <div className={`relative inline-block w-full ${className}`} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9.5 w-full items-center justify-between rounded-lg border border-slate-200 bg-white px-3.5 text-xs text-slate-800 transition hover:border-[#2563EB] focus:border-[#2563EB] focus:outline-none dark:border-[#333C44] dark:bg-[#22272B] dark:text-[#DEE4EA] dark:hover:border-[#579DFF] cursor-pointer disabled:opacity-50"
      >
        <span
          className={
            selectedDate && !isNaN(selectedDate.getTime())
              ? 'font-medium text-slate-900 dark:text-white'
              : 'text-slate-400 dark:text-slate-500 font-normal'
          }
        >
          {formatDisplay(selectedDate)}
        </span>

        <div className="flex items-center gap-1.5 shrink-0">
          {value && !disabled && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                onChange && onChange('');
              }}
              className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-[#333C44] text-slate-400 hover:text-slate-600 dark:hover:text-[#DEE4EA] cursor-pointer"
              title="Clear date"
            >
              <X className="h-3 w-3" />
            </span>
          )}
          <CalendarIcon className="h-4 w-4 text-slate-400 dark:text-[#738496] shrink-0" />
        </div>
      </button>

      {isOpen && (
        <div
          className={`absolute ${
            alignRight ? 'right-0' : 'left-0'
          } ${
            openUpwards ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          } z-50 animate-in fade-in-0 zoom-in-95 duration-100 shadow-2xl`}
        >
          <Calendar
            selected={selectedDate}
            onSelect={handleSelect}
          />
        </div>
      )}
    </div>
  );
}

export default DatePicker;
