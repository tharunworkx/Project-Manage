import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { Bookmark, Bug, Edit3, MoreHorizontal, User, ArrowRight } from 'lucide-react';
import { formatDate } from '../../lib/utils';
import { userService } from '../../services/userService';
import { useAuthContext } from '../../context/AuthContext';
import { TASK_STATUSES } from '../../lib/constants';
import { useTasks } from '../../hooks/useTasks';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export function TaskCard({ task, onCardClick, onTaskUpdate, isOverlay = false }) {
  const { canMarkTaskDone, isAdmin, isProjectManager, role } = useAuthContext();
  const isManagerOrAdmin = isAdmin || isProjectManager || role === 'admin' || role === 'project_manager';
  const { updateTask } = useTasks();

  const creatorName = task.created_by || task.creator || 'Maria Garcia';
  const creatorUser = userService.resolveUser(creatorName);

  const handleMoveStatus = (targetStatus, e) => {
    e?.stopPropagation?.();
    if (targetStatus === task.status) return;
    if (targetStatus === 'done' && !canMarkTaskDone) {
      toast.error('Only Project Managers and Admins can review and make tasks Done.');
      return;
    }
    if (onTaskUpdate) {
      onTaskUpdate(task.id, { status: targetStatus });
    }
    updateTask({ id: task.id, updates: { status: targetStatus } });
    const targetCol = TASK_STATUSES.find((s) => s.id === targetStatus);
    toast.success(`Moved to ${targetCol?.label || targetStatus}`);
  };

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: task,
    disabled: isOverlay,
  });

  const handleClick = () => {
    if (!isDragging && onCardClick && !isOverlay) {
      onCardClick(task);
    }
  };

  // Icon based on Jira issue type
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
    return null;
  };

  // While dragging, show a sleek placeholder in the source column
  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        className="rounded-xl border-2 border-dashed border-[#0C66E4]/50 dark:border-[#579DFF]/50 bg-blue-50/15 dark:bg-[#1C2B41]/15 p-3.5 h-[105px] opacity-40 select-none pointer-events-none"
      />
    );
  }

  return (
    <div
      ref={!isOverlay ? setNodeRef : undefined}
      {...(!isOverlay ? listeners : {})}
      {...(!isOverlay ? attributes : {})}
      onClick={handleClick}
      className={`group relative rounded-xl border text-left select-none p-3.5 ${
        isOverlay
          ? 'border-[#0C66E4] dark:border-[#579DFF] bg-white dark:bg-[#22272B] shadow-2xl ring-2 ring-[#0C66E4]/30 dark:ring-[#579DFF]/30 rotate-2 scale-[1.03] cursor-grabbing z-50 pointer-events-none'
          : 'border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#22272B] hover:border-[#0C66E4] dark:hover:border-[#388BFF]/70 hover:shadow-xs shadow-2xs dark:hover:bg-[#282E33] cursor-grab transition-colors duration-150'
      }`}
    >
      {/* Top row: Title + quick action buttons */}
      <div className="flex items-start justify-between gap-2">
        <h4 className="text-sm font-medium text-slate-900 dark:text-[#DEE4EA] leading-snug line-clamp-2">
          {task.title}
        </h4>
        {!isOverlay && (
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity shrink-0">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onCardClick && onCardClick(task);
              }}
              title="Edit issue"
              className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA] dark:hover:bg-[#333C44] cursor-pointer"
            >
              <Edit3 className="h-3.5 w-3.5" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  onClick={(e) => e.stopPropagation()}
                  title="Move / More actions"
                  className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA] dark:hover:bg-[#333C44] cursor-pointer outline-none"
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-48 p-1.5 rounded-xl bg-white dark:bg-[#1D2125] border border-slate-200 dark:border-[#282E33] shadow-xl z-50 select-none"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#738496]">
                  Move to
                </div>
                {TASK_STATUSES.filter((s) => s.id !== task.status).map((s) => (
                  <DropdownMenuItem
                    key={s.id}
                    onClick={(e) => handleMoveStatus(s.id, e)}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer text-slate-700 dark:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#282E33] transition"
                  >
                    <span
                      className="h-2 w-2 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: s.color }}
                    />
                    <span className="truncate">{s.label}</span>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-[#282E33]" />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    onCardClick && onCardClick(task);
                  }}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer text-slate-700 dark:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#282E33] transition"
                >
                  <Edit3 className="h-3.5 w-3.5 text-slate-400" />
                  <span>View Details</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>

      {/* Due Date */}
      {task.due_date && (
        <div className="mt-1 text-xs text-slate-500 dark:text-[#9FADBC]">
          {formatDate(task.due_date)}
        </div>
      )}

      {/* Creator Display for Manager and Admin */}
      {isManagerOrAdmin && (
        <div className="mt-2.5 flex items-center justify-between gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50/90 dark:bg-[#161A1D] border border-slate-200/80 dark:border-[#282E33] text-[11px]">
          <span className="text-[10px] font-semibold text-slate-400 dark:text-[#738496] uppercase tracking-wider">
            Created by
          </span>
          <div className="flex items-center gap-1.5 font-medium text-slate-800 dark:text-[#DEE4EA] truncate">
            <span
              className="h-4.5 w-4.5 rounded-full text-white text-[9px] font-bold flex items-center justify-center shrink-0 shadow-2xs"
              style={{ backgroundColor: creatorUser?.color || '#10B981' }}
              title={creatorUser?.name || creatorName}
            >
              {creatorUser?.avatar || 'TM'}
            </span>
            <span className="truncate max-w-[110px] text-xs">
              {creatorUser?.name || creatorName}
            </span>
          </div>
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


        {/* Assignee silhouette avatar or initials avatar */}
        {(() => {
          const assignedUser = userService.resolveUser(task.assignee);
          if (assignedUser) {
            return (
              <div
                className="flex h-6 w-6 items-center justify-center rounded-full text-white font-bold text-[10px] shadow-xs"
                style={{ backgroundColor: assignedUser.color || '#7C3AED' }}
                title={`Assignee: ${assignedUser.name}`}
              >
                {assignedUser.avatar}
              </div>
            );
          }
          return (
            <div
              className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 text-slate-400 dark:bg-[#333C44] dark:text-[#9FADBC]"
              title="Unassigned"
            >
              <User className="h-4 w-4" />
            </div>
          );
        })()}
      </div>
    </div>
  );
}
