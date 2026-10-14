import React from 'react';
import { cn } from '../../lib/utils';

export function Skeleton({ className = '' }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800',
        className
      )}
    />
  );
}
