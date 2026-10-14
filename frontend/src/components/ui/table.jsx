"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Cell as CellPrimitive,
  Column as ColumnPrimitive,
  Row as RowPrimitive,
  TableBody as TableBodyPrimitive,
  TableFooter as TableFooterPrimitive,
  TableHeader as TableHeaderPrimitive,
  Table as TablePrimitive,
} from "react-aria-components";

function Table({ className, ...props }) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <TablePrimitive
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

function TableHeader({ className, children, ...props }) {
  // react-aria-components TableHeader expects Column (TableHead) children directly.
  // If wrapped in a TableRow or tr, unwrap its children so column count matches cell count.
  let content = children;
  if (React.Children.count(children) === 1) {
    const onlyChild = React.Children.toArray(children)[0];
    if (React.isValidElement(onlyChild) && onlyChild.props?.children) {
      content = onlyChild.props.children;
    }
  }

  return (
    <TableHeaderPrimitive
      data-slot="table-header"
      className={cn("[&_tr]:border-b border-slate-200 dark:border-[#282E33]", className)}
      {...props}
    >
      {content}
    </TableHeaderPrimitive>
  );
}

function TableBody({ className, ...props }) {
  return (
    <TableBodyPrimitive
      data-slot="table-body"
      className={cn(
        "data-empty:h-24 data-empty:text-center [&_tr:last-child]:border-0 divide-y divide-slate-100 dark:divide-[#282E33]",
        className
      )}
      {...props}
    />
  );
}

function TableFooter({ className, ...props }) {
  return (
    <TableFooterPrimitive
      data-slot="table-footer"
      className={cn(
        "border-t border-slate-200 dark:border-[#282E33] bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className
      )}
      {...props}
    />
  );
}

function TableRow({ className, ...props }) {
  return (
    <RowPrimitive
      data-slot="table-row"
      className={cn(
        "border-b border-slate-200 dark:border-[#282E33] transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted data-selected:bg-muted cursor-pointer",
        className
      )}
      {...props}
    />
  );
}

function TableHead({ className, ...props }) {
  return (
    <ColumnPrimitive
      data-slot="table-head"
      className={cn(
        "h-10 px-4 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([data-slot=checkbox])]:pr-0 [&:has([role=checkbox])]:pr-0",
        className
      )}
      {...props}
    />
  );
}

function TableCell({ className, ...props }) {
  return (
    <CellPrimitive
      data-slot="table-cell"
      className={cn(
        "p-4 align-middle whitespace-nowrap [&:has([data-slot=checkbox])]:pr-0 [&:has([role=checkbox])]:pr-0 text-foreground",
        className
      )}
      {...props}
    />
  );
}

function TableCaption({
  className,
  ...props
}) {
  return (
    <figcaption
      data-slot="table-caption"
      className={cn(
        "mt-4 text-center text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  );
}

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};
