import React, { useState, useMemo } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from './motion/dropdown-menu';
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

  // Parse options from either `options` prop or `children` (<option> tags)
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
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
          const val = child.props.value !== undefined ? String(child.props.value) : '';
          const label = child.props.children || val;
          parsed.push({ value: val, label, disabled: child.props.disabled });
        }
      });
      return parsed;
    }

    return [];
  }, [optionsProp, children]);

  // Find the selected option's label
  const selectedOption = useMemo(() => {
    const stringVal = value !== undefined && value !== null ? String(value) : '';
    return options.find((opt) => opt.value === stringVal);
  }, [options, value]);

  const displayLabel = selectedOption ? selectedOption.label : placeholder;

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

  // Filter out placeholder options from the rendered dropdown menu items
  const menuOptions = useMemo(() => {
    return options.filter((opt) => {
      if (!opt.value || String(opt.value).trim() === '') return false;
      const lower = String(opt.label).toLowerCase().trim();
      if (lower.startsWith('select ') || lower === 'select') return false;
      return true;
    });
  }, [options]);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <button
          type="button"
          id={id}
          name={name}
          disabled={disabled}
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
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        className={cn(
          "w-[var(--anchor-width)] min-w-[200px] max-h-64 overflow-y-auto p-1.5 rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] shadow-2xl z-50",
          contentClassName
        )}
      >
        {menuOptions.map((opt, idx) => {
          const isSelected = String(opt.value) === (value !== undefined && value !== null ? String(value) : '');
          return (
            <DropdownMenuItem
              key={`${opt.value}-${idx}`}
              disabled={opt.disabled}
              onClick={() => handleSelect(opt.value)}
              className={cn(
                "flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-medium cursor-pointer transition select-none",
                isSelected
                  ? "bg-blue-50 text-[#0C66E4] dark:bg-[#1C2B41] dark:text-[#579DFF] font-semibold"
                  : "text-slate-700 dark:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#22272B]"
              )}
            >
              <span className="truncate">{opt.label}</span>
              {isSelected && (
                <Check className="h-3.5 w-3.5 shrink-0 text-[#0C66E4] dark:text-[#579DFF]" />
              )}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Select;
