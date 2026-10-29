import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Select({
  value,
  onChange,
  onValueChange,
  options: optionsProp,
  children,
  placeholder = 'Select an option',
  disabled = false,
  className,
  contentClassName,
  name,
  id,
  required,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const [openUpwards, setOpenUpwards] = useState(false);

  // Recursively extract options supporting React.Fragment, arrays, and standard <option> tags
  const options = useMemo(() => {
    if (Array.isArray(optionsProp)) {
      return optionsProp.map((opt) => {
        if (typeof opt === 'string' || typeof opt === 'number') {
          return { value: String(opt), label: String(opt) };
        }
        return { value: String(opt.value ?? ''), label: opt.label ?? String(opt.value ?? '') };
      });
    }

    if (children) {
      const parsed = [];
      const extractOptions = (node) => {
        React.Children.forEach(node, (child) => {
          if (!child) return;
          if (React.isValidElement(child)) {
            // Unpack React.Fragment (e.g. <> <option .../> </>)
            if (child.type === React.Fragment) {
              extractOptions(child.props?.children);
            } else if (Array.isArray(child)) {
              extractOptions(child);
            } else {
              const val = child.props?.value !== undefined ? String(child.props.value) : '';
              const label = child.props?.children !== undefined ? child.props.children : val;
              parsed.push({ value: val, label, disabled: child.props?.disabled });
            }
          }
        });
      };
      extractOptions(children);
      return parsed;
    }

    return [];
  }, [optionsProp, children]);

  // Find the selected option's label
  const selectedOption = useMemo(() => {
    const stringVal = value !== undefined && value !== null ? String(value) : '';
    return options.find((opt) => opt.value === stringVal);
  }, [options, value]);

  const displayLabel = selectedOption ? selectedOption.label : (placeholder || 'Select an option');

  // Handle outside click & escape key
  useEffect(() => {
    if (!open) return;
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  // Toggle dropdown with dynamic position detection
  const handleToggle = () => {
    if (disabled) return;
    if (!open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setOpenUpwards(spaceBelow < 220 && rect.top > 220);
    }
    setOpen((prev) => !prev);
  };

  const handleSelect = (optVal) => {
    if (disabled) return;
    const syntheticEvent = {
      target: { value: optVal, name, id },
      currentTarget: { value: optVal, name, id },
      value: optVal,
      toString: () => optVal,
      valueOf: () => optVal,
    };
    onChange?.(syntheticEvent);
    onValueChange?.(optVal);
    setOpen(false);
  };

  // Filter out placeholder prompts from rendered options list
  const menuOptions = useMemo(() => {
    return options.filter((opt) => {
      const lower = String(opt.label || '').toLowerCase().trim();
      if ((!opt.value || String(opt.value).trim() === '') && (lower.startsWith('select') || lower === '')) {
        return false;
      }
      return true;
    });
  }, [options]);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        type="button"
        id={id}
        name={name}
        disabled={disabled}
        onClick={handleToggle}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-medium text-slate-800 transition hover:bg-slate-50 focus:border-[#0C66E4] focus:outline-none dark:border-[#333C44] dark:bg-[#1E2227] dark:text-[#DEE4EA] dark:hover:bg-[#282E33] dark:focus:border-[#579DFF] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 select-none shadow-2xs",
          className
        )}
      >
        <span className={cn("truncate text-left", !selectedOption && "text-slate-400 dark:text-[#738496]")}>
          {displayLabel}
        </span>
        <ChevronDown
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-slate-400 transition-transform duration-200 dark:text-[#738496]",
            open && "rotate-180"
          )}
        />
      </button>

      {open && (
        <div
          className={cn(
            "absolute left-0 w-full min-w-[200px] max-h-60 overflow-y-auto p-1.5 rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] shadow-2xl z-50",
            openUpwards ? "bottom-full mb-1.5" : "top-full mt-1.5",
            contentClassName
          )}
        >
          {menuOptions.length === 0 ? (
            <div className="px-3 py-2 text-xs text-slate-400 dark:text-[#738496] italic text-center">
              No options available
            </div>
          ) : (
            menuOptions.map((opt, idx) => {
              const isSelected = String(opt.value) === (value !== undefined && value !== null ? String(value) : '');
              return (
                <button
                  type="button"
                  key={`${opt.value}-${idx}`}
                  disabled={opt.disabled}
                  onClick={() => handleSelect(opt.value)}
                  className={cn(
                    "flex w-full items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition select-none text-left",
                    isSelected
                      ? "bg-blue-50 text-[#0C66E4] dark:bg-[#1C2B41] dark:text-[#579DFF] font-semibold"
                      : "text-slate-700 dark:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#22272B]",
                    opt.disabled && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <span className="truncate">{opt.label}</span>
                  {isSelected && (
                    <Check className="h-3.5 w-3.5 shrink-0 text-[#0C66E4] dark:text-[#579DFF]" />
                  )}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default Select;
