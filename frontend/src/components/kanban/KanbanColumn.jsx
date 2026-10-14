import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Plus, MoreHorizontal, ChevronsLeftRight, ChevronsRightLeft } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { useAuthContext } from '../../context/AuthContext';

export function KanbanColumn({ column, tasks = [], onNewTaskInColumn, onCardClick }) {
  const { canCreateTasks } = useAuthContext();
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [inlineCreating, setInlineCreating] = useState(false);
  const [inlineTitle, setInlineTitle] = useState('');

  const handleInlineSubmit = (e) => {
    e.preventDefault();
    if (!inlineTitle.trim()) {
      setInlineCreating(false);
      return;
    }
    onNewTaskInColumn && onNewTaskInColumn(column.id, inlineTitle);
    setInlineTitle('');
    setInlineCreating(false);
  };

  // If collapsed: show compact vertical bar
  if (isCollapsed) {
    return (
      <div
        ref={setNodeRef}
        onClick={() => setIsCollapsed(false)}
        title={`Expand column: ${column.label}`}
        className="flex flex-col items-center justify-between rounded-xl bg-[#161A1D] border border-[#282E33]/70 p-2.5 w-12 min-w-[48px] h-[540px] transition-all hover:border-[#579DFF] cursor-pointer select-none"
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed(false);
          }}
          className="p-1 rounded text-[#738496] hover:text-[#DEE4EA] hover:bg-[#22272B]"
        >
          <ChevronsRightLeft className="h-4 w-4" />
        </button>

        <div className="flex items-center gap-2.5 [writing-mode:vertical-rl] rotate-180 text-xs font-semibold text-[#9FADBC]">
          <span>{column.label}</span>
          <span className="rounded-full bg-[#22272B] px-1.5 py-0.5 text-[11px] text-[#738496]">
            {tasks.length}
          </span>
        </div>

        <span className="text-xs text-[#738496]">●</span>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col rounded-xl bg-slate-100/80 dark:bg-[#161A1D] border p-3 min-w-[280px] max-w-[300px] w-full transition-colors ${
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
          <span className="text-[11px] font-semibold text-slate-500 bg-slate-200 dark:text-[#738496] dark:bg-[#22272B] px-1.5 py-0.5 rounded-full">
            {tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-1 text-slate-400 dark:text-[#738496]">
          <button
            onClick={() => setIsCollapsed(true)}
            title="Collapse column"
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-[#22272B] hover:text-slate-800 dark:hover:text-[#DEE4EA] transition cursor-pointer"
          >
            <ChevronsLeftRight className="h-3.5 w-3.5" />
          </button>
          <button
            title="Column actions"
            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-[#22272B] hover:text-slate-800 dark:hover:text-[#DEE4EA] transition cursor-pointer"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Task Cards list */}
      <div className="flex-1 space-y-3 overflow-y-auto min-h-[140px]">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onCardClick={onCardClick} />
        ))}

        {/* Empty column placeholder (dashed slot with plus - Admin and PM only) */}
        {tasks.length === 0 && !inlineCreating && canCreateTasks && (
          <button
            onClick={() => setInlineCreating(true)}
            className="w-full h-14 rounded-lg border border-dashed border-slate-300 dark:border-[#282E33] hover:border-[#0C66E4] dark:hover:border-[#388BFF]/60 hover:bg-white dark:hover:bg-[#22272B]/60 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:text-[#738496] dark:hover:text-[#DEE4EA] transition cursor-pointer"
          >
            <Plus className="h-4.5 w-4.5" />
          </button>
        )}

        {/* Inline task creation input */}
        {inlineCreating && (
          <form onSubmit={handleInlineSubmit} className="p-3 rounded-lg bg-[#22272B] border border-[#333C44]">
            <input
              autoFocus
              type="text"
              placeholder="What needs to be done?"
              value={inlineTitle}
              onChange={(e) => setInlineTitle(e.target.value)}
              className="w-full bg-transparent text-sm text-[#DEE4EA] placeholder-[#738496] focus:outline-none mb-2.5"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setInlineCreating(false)}
                className="px-2.5 py-1 text-xs rounded text-[#9FADBC] hover:bg-[#282E33]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1 text-xs rounded bg-[#0C66E4] hover:bg-[#0055CC] text-white font-semibold"
              >
                Create
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Bottom + button for columns with items (Admin and PM only) */}
      {tasks.length > 0 && !inlineCreating && canCreateTasks && (
        <button
          onClick={() => setInlineCreating(true)}
          title="Create task"
          className="mt-2.5 flex w-full items-center justify-center py-1.5 rounded hover:bg-[#22272B] text-[#738496] hover:text-[#DEE4EA] text-sm transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
