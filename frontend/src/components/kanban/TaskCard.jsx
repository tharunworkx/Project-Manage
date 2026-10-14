import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CheckSquare, Bookmark, Bug, Edit3, MoreHorizontal, User } from 'lucide-react';
import { formatDate } from '../../lib/utils';

export function TaskCard({ task, onCardClick }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: task,
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50,
      }
    : undefined;

  // Icon based on Jira issue type - Normal neutral icons
  const renderTypeIcon = () => {
    if (task.type === 'story') {
      return (
        <span title="Story" className="text-slate-400 dark:text-[#9FADBC] flex items-center shrink-0">
          <Bookmark className="h-4 w-4 stroke-[1.8]" />
        </span>
      );
    }
    if (task.type === 'bug') {
      return (
        <span title="Bug" className="text-slate-400 dark:text-[#9FADBC] flex items-center shrink-0">
          <Bug className="h-4 w-4 stroke-[1.8]" />
        </span>
      );
    }
    return (
      <span title="Task" className="text-slate-400 dark:text-[#9FADBC] flex items-center shrink-0">
        <CheckSquare className="h-4 w-4 stroke-[1.8]" />
      </span>
    );
  };

  const handleClick = () => {
    if (!isDragging && onCardClick) {
      onCardClick(task);
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={`group relative rounded-lg border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#22272B] p-3.5 text-left transition hover:border-[#0C66E4] dark:hover:border-[#388BFF]/70 hover:shadow-xs shadow-2xs dark:hover:bg-[#282E33] cursor-pointer select-none ${
        isDragging ? 'opacity-40 ring-2 ring-[#0C66E4]' : ''
      }`}
    >
      {/* Top row: Title + quick action buttons */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-slate-900 dark:text-[#DEE4EA] leading-snug line-clamp-2">
          {task.title}
        </h4>
        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity shrink-0">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCardClick && onCardClick(task);
            }}
            title="Edit issue"
            className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA] dark:hover:bg-[#333C44]"
          >
            <Edit3 className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => e.stopPropagation()}
            title="More actions"
            className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA] dark:hover:bg-[#333C44]"
          >
            <MoreHorizontal className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Due Date */}
      {task.due_date && (
        <div className="mt-1 text-xs text-slate-500 dark:text-[#9FADBC]">
          {formatDate(task.due_date)}
        </div>
      )}

      {/* Bottom row: Type icon + Key & Assignee avatar */}
      <div className="mt-3.5 flex items-center justify-between pt-1">
        <div className="flex items-center gap-2">
          {renderTypeIcon()}
          <span className="text-xs font-semibold text-slate-500 dark:text-[#9FADBC] tracking-tight hover:underline">
            {task.key || `KAN-${task.id}`}
          </span>
        </div>

        {/* Assignee silhouette avatar or TR avatar */}
        {task.assignee === 'TR' ? (
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E8831D] text-[#0C162D] font-bold text-[10px]"
            title="Assignee: TR"
          >
            TR
          </div>
        ) : (
          <div
            className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-[#333C44] dark:text-[#9FADBC]"
            title="Unassigned"
          >
            <User className="h-4 w-4" />
          </div>
        )}
      </div>
    </div>
  );
}
