'use client';

import * as React from 'react';
import { motion } from 'motion/react';
import {
  Tabs as TabsPrimitive,
  TabsList as TabsListPrimitive,
  TabsTrigger as TabsTriggerPrimitive,
  TabsContent as TabsContentPrimitive,
  TabsContents as TabsContentsPrimitive,
  useTabs,
} from '@/components/animate-ui/primitives/animate/tabs';
import { cn } from '@/lib/utils';

export function Tabs({ className, ...props }) {
  return (
    <TabsPrimitive
      className={cn('flex flex-col gap-3', className)}
      {...props}
    />
  );
}

export function TabsList({ className, ...props }) {
  return (
    <TabsListPrimitive
      className={cn(
        'bg-slate-100 dark:bg-[#161A1D] text-slate-600 dark:text-[#9FADBC] border border-slate-200 dark:border-[#282E33] inline-flex h-10 w-fit items-center justify-center rounded-xl p-1 relative select-none',
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({ className, children, ...props }) {
  const { activeValue } = useTabs();
  const isActive = activeValue === props.value;

  return (
    <TabsTriggerPrimitive
      className={cn(
        "data-[state=active]:text-slate-900 dark:data-[state=active]:text-[#DEE4EA] data-[state=active]:font-semibold text-slate-500 hover:text-slate-900 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA] inline-flex h-full items-center justify-center gap-2 rounded-lg px-3.5 py-1.5 text-xs sm:text-sm font-medium whitespace-nowrap transition-colors duration-150 cursor-pointer relative z-10 disabled:pointer-events-none disabled:opacity-50 select-none",
        className
      )}
      {...props}
    >
      {isActive && (
        <motion.div
          layoutId="tab-active-indicator"
          className="absolute inset-0 rounded-lg bg-white dark:bg-[#22272B] border border-slate-200 dark:border-[#333C44] shadow-xs -z-10 pointer-events-none"
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      )}
      {children}
    </TabsTriggerPrimitive>
  );
}

export function TabsContents(props) {
  return <TabsContentsPrimitive {...props} />;
}

export function TabsContent({ className, ...props }) {
  return (
    <TabsContentPrimitive
      className={cn('outline-none', className)}
      {...props}
    />
  );
}

export { useTabs };
