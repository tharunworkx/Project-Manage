import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, X } from 'lucide-react';
import { Calendar } from './calendar';
import { formatDate } from '../../lib/utils';

export function DatePicker({
  value,
  onChange,
  placeholder = 'Select date',
  className = '',
  disabled = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

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

  return (
    <div className={`relative inline-block w-full ${className}`} ref={containerRef}>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-full items-center justify-between rounded-md border border-slate-200 bg-white px-3 py-1 text-xs text-slate-800 transition hover:border-[#0C66E4] focus:border-[#0C66E4] focus:outline-none dark:border-[#333C44] dark:bg-[#22272B] dark:text-[#DEE4EA] dark:hover:border-[#579DFF] cursor-pointer disabled:opacity-50"
      >
        <div className="flex items-center gap-2 truncate">
          <CalendarIcon className="h-4 w-4 text-slate-400 dark:text-[#738496] shrink-0" />
          <span className={selectedDate ? 'font-medium' : 'text-slate-400 dark:text-[#738496]'}>
            {selectedDate && !isNaN(selectedDate.getTime())
              ? formatDate(selectedDate)
              : placeholder}
          </span>
        </div>

        {value && !disabled && (
          <span
            onClick={(e) => {
              e.stopPropagation();
              onChange && onChange('');
            }}
            className="p-0.5 rounded hover:bg-slate-100 dark:hover:bg-[#333C44] text-slate-400 hover:text-slate-600 dark:hover:text-[#DEE4EA] cursor-pointer"
          >
            <X className="h-3 w-3" />
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-50 animate-in fade-in-0 zoom-in-95 duration-100 shadow-2xl">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleSelect}
            captionLayout="dropdown"
          />
        </div>
      )}
    </div>
  );
}

export default DatePicker;
