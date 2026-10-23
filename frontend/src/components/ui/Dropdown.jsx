import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from './motion/dropdown-menu';

export function Dropdown({ trigger, children, align = 'right' }) {
  const resolvedAlign = align === 'right' ? 'end' : align === 'left' ? 'start' : align;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={resolvedAlign} className="w-56 p-1.5">
        {children}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
