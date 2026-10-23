import * as React from 'react';
import { cn } from '@/lib/utils';

export function Label({ className, ...props }) {
  return (
    <label
      className={cn(
        'text-xs font-semibold leading-none text-slate-800 dark:text-[#DEE4EA] peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
        className
      )}
      {...props}
    />
  );
}
