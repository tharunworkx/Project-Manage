'use client';

import * as React from 'react';
import {
  Tabs as TabsPrimitive,
  TabsList as TabsListPrimitive,
  TabsTrigger as TabsTriggerPrimitive,
  TabsContent as TabsContentPrimitive,
  TabsContents as TabsContentsPrimitive,
  TabsHighlight as TabsHighlightPrimitive,
  TabsHighlightItem as TabsHighlightItemPrimitive,
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
    <TabsHighlightPrimitive className="absolute z-0 inset-0 rounded-lg bg-[#22272B] border border-[#333C44] shadow-xs">
      <TabsListPrimitive
        className={cn(
          'bg-[#161A1D] text-[#9FADBC] border border-[#282E33] inline-flex h-10 w-fit items-center justify-center rounded-xl p-1 relative select-none',
          className
        )}
        {...props}
      />
    </TabsHighlightPrimitive>
  );
}

export function TabsTrigger({ className, ...props }) {
  return (
    <TabsHighlightItemPrimitive value={props.value} className="flex-1">
      <TabsTriggerPrimitive
        className={cn(
          "data-[state=active]:text-[#DEE4EA] data-[state=active]:font-semibold text-[#9FADBC] hover:text-[#DEE4EA] inline-flex h-full flex-1 items-center justify-center gap-2 rounded-lg w-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap transition-colors duration-200 ease-in-out cursor-pointer relative z-10 disabled:pointer-events-none disabled:opacity-50",
          className
        )}
        {...props}
      />
    </TabsHighlightItemPrimitive>
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
