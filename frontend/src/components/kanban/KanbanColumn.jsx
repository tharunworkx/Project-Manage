import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Plus, ChevronsLeftRight, ChevronsRightLeft } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { useAuthContext } from '../../context/AuthContext';

export function KanbanColumn({
  column,
  tasks = [],
  onNewTaskInColumn,
  onOpenCreateDialog,
  onCardClick,
  onTaskUpdate,
}) {
  const { canCreateTasks, canMarkTaskDone } = useAuthContext();
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleTriggerCreate = () => {
    if (onOpenCreateDialog) {
      onOpenCreateDialog(column.id);
    } else if (onNewTaskInColumn) {
      onNewTaskInColumn(column.id);
    }
  };

  // If collapsed: show compact vertical bar
  if (isCollapsed) {
    return (
      <div
        ref={setNodeRef}
        onClick={() => setIsCollapsed(false)}
        title={`Expand column: ${column.label}`}
        className="flex flex-col items-center justify-between rounded-xl bg-slate-100/80 dark:bg-[#161A1D] border border-slate-200 dark:border-[#282E33]/70 p-2.5 w-12 min-w-[48px] h-[540px] transition-all hover:border-[#0C66E4] dark:hover:border-[#579DFF] cursor-pointer select-none"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed(false);
          }}
          className="p-1 rounded text-slate-500 hover:text-slate-900 hover:bg-slate-200 dark:text-[#738496] dark:hover:text-[#DEE4EA] dark:hover:bg-[#22272B]"
        >
          <ChevronsRightLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2.5 [writing-mode:vertical-rl] rotate-180 text-xs font-semibold text-slate-600 dark:text-[#9FADBC]">
          <span>{column.label}</span>
          <span className="rounded-full bg-slate-200 dark:bg-[#22272B] px-1.5 py-0.5 text-[11px] text-slate-600 dark:text-[#738496]">
            {tasks.length}
          </span>
        </div>

        <span className="text-xs text-slate-400 dark:text-[#738496]">●</span>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl bg-slate-100/80 dark:bg-[#161A1D] border p-3 min-w-[250px] max-w-[285px] w-full transition-colors ${
        isOver
          ? 'border-[#0C66E4] bg-blue-50/50 dark:bg-[#1C2B41]/30 ring-1 ring-[#0C66E4]'
          : 'border-slate-200 dark:border-[#282E33]/70'
      }`}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between px-1.5 py-1 mb-3 select-none">
        <div className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full shrink-0 shadow-xs"
            style={{ backgroundColor: column.color }}
          />
          <h3 className="text-[13px] font-semibold text-slate-800 dark:text-[#DEE4EA]">
            {column.label}
          </h3>
          {column.id === 'done' && !canMarkTaskDone && (
            <span
              title="Only Manager and Admin can review and mark tasks Done"
              className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/40"
            >
              Review Only
            </span>
          )}
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-200 dark:text-[#738496] dark:bg-[#22272B] px-1.5 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-400 dark:text-[#738496]">
          {canCreateTasks && (column.id !== 'done' || canMarkTaskDone) && (
            <button
              onClick={handleTriggerCreate}
              title={`Create task in ${column.label}`}
              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-[#22272B] hover:text-slate-800 dark:hover:text-[#DEE4EA] transition cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          )}
          <button
            onClick={() => setIsCollapsed(true)}
            title="Collapse column"
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-[#22272B] hover:text-slate-800 dark:hover:text-[#DEE4EA] transition cursor-pointer"
          >
            <ChevronsLeftRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Task Cards list */}
      <div className="flex-1 space-y-3 overflow-y-auto min-h-[140px]">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onCardClick={onCardClick}
            onTaskUpdate={onTaskUpdate}
          />
        ))}

        {/* Empty column placeholder (dashed slot with plus - Admin and PM only, or non-done columns) */}
        {tasks.length === 0 && canCreateTasks && (column.id !== 'done' || canMarkTaskDone) && (
          <button
            onClick={handleTriggerCreate}
            title={`Create task in ${column.label}`}
            className="w-full h-14 rounded-lg border border-dashed border-slate-300 dark:border-[#282E33] hover:border-[#0C66E4] dark:hover:border-[#388BFF]/60 hover:bg-white dark:hover:bg-[#22272B]/60 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:text-[#738496] dark:hover:text-[#DEE4EA] transition cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" />
          </button>
        )}
      </div>

      {/* Bottom + button for columns with items */}
      {tasks.length > 0 && canCreateTasks && (column.id !== 'done' || canMarkTaskDone) && (
        <button
          onClick={handleTriggerCreate}
          title={`Create task in ${column.label}`}
          className="mt-2.5 flex w-full items-center justify-center py-1.5 rounded hover:bg-slate-200/80 dark:hover:bg-[#22272B] text-slate-500 hover:text-slate-800 dark:text-[#738496] dark:hover:text-[#DEE4EA] text-sm transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
