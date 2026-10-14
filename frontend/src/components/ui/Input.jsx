import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

export const Input = forwardRef(function Input(
  { label, error, helperText, icon: Icon, className = '', ...props },
  ref
) {
  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label className="block text-xs font-semibold text-[#DEE4EA]">
          {label}
        </label>
      )}
      <div className="relative rounded-xl shadow-xs">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-[#738496]">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          ref={ref}
          className={cn(
            'block w-full rounded-xl border border-[#333C44] bg-[#22272B] px-3.5 py-2 text-sm text-[#DEE4EA] placeholder-[#738496] transition-colors focus:border-[#579DFF] focus:outline-none focus:ring-1 focus:ring-[#579DFF]/30',
            Icon && 'pl-9',
            error && 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20',
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-500">{error}</p>}
      {helperText && !error && <p className="text-xs text-[#738496]">{helperText}</p>}
    </div>
  );
});
