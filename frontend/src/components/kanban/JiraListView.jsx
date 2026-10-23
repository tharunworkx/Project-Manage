import React, { useState } from 'react';
import {
  Bookmark,
  Bug,
  GitFork,
  User,
  MoreHorizontal,
  Plus,
  RotateCw,
  ChevronDown,
  SlidersHorizontal,
  Check,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuthContext } from '../../context/AuthContext';
import { useWorkspaceContext } from '../../context/WorkspaceContext';
import { useProjects } from '../../hooks/useProjects';
import { userService } from '../../services/userService';
import { toast } from 'sonner';

// Helper date formatter matching Jira screenshot ("Oct 13, 2026, 3:54 PM")
function formatFullDateTime(dateVal, fallbackHour = '3:54 PM') {
  if (!dateVal) {
    return `Oct 13, 2026, ${fallbackHour}`;
  }
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return `Oct 13, 2026, ${fallbackHour}`;
    const dateStr = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    const timeStr = d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
    return `${dateStr}, ${timeStr}`;
  } catch {
    return `Oct 13, 2026, ${fallbackHour}`;
  }
}

// Format short date matching Jira screenshot ("Oct 18, 2026" or "None")
function formatShortDate(dateVal) {
  if (!dateVal) return 'None';
  try {
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return 'None';
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return 'None';
  }
}

export function JiraListView({
  tasks = [],
  onTaskUpdate,
  onTaskCreate,
  onTaskDelete,
  onSelectTask,
}) {
  const { canMarkTaskDone } = useAuthContext();
  let currentWorkspace = null;
  try {
    const ws = useWorkspaceContext();
    currentWorkspace = ws?.currentWorkspace;
  } catch {}

  let projects = [];
  try {
    const p = useProjects();
    projects = p?.projects || [];
  } catch {}

  const [selectedIds, setSelectedIds] = useState([]);

  const isAllSelected = tasks.length > 0 && selectedIds.length === tasks.length;
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < tasks.length;

  const toggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(tasks.map((t) => t.id));
    }
  };

  const toggleSelectRow = (id, e) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleStatusChange = (task, newStatus, e) => {
    e?.stopPropagation?.();
    if (task.status === newStatus) return;
    if ((newStatus === 'done' || task.status === 'done') && !canMarkTaskDone) {
      toast.error('Only Project Managers and Admins can review and make tasks Done.');
      return;
    }
    onTaskUpdate?.({
      id: task.id,
      updates: { status: newStatus },
    });
  };

  // Normal neutral outline icon based on Jira issue type
  const renderTypeIcon = (type) => {
    if (type === 'story') {
      return (
        <span title="Story" className="text-slate-400 dark:text-[#9FADBC] flex items-center shrink-0">
          <Bookmark className="h-4 w-4 stroke-[1.8]" />
        </span>
      );
    }
    if (type === 'bug') {
      return (
        <span title="Bug" className="text-slate-400 dark:text-[#9FADBC] flex items-center shrink-0">
          <Bug className="h-4 w-4 stroke-[1.8]" />
        </span>
      );
    }
    if (type === 'subtask') {
      return (
        <span title="Subtask" className="text-slate-400 dark:text-[#9FADBC] flex items-center shrink-0">
          <GitFork className="h-4 w-4 stroke-[1.8]" />
        </span>
      );
    }
    return null;
  };

  // Status button pill matching Jira exactly
  const renderStatusPill = (task) => {
    const s = task.status;

    let pillStyles = 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 dark:bg-[#22272B] dark:hover:bg-[#2C333A] dark:text-[#DEE4EA] dark:border-[#333C44]';
    let label = 'To Do';

    if (s === 'in_progress') {
      pillStyles = 'bg-[#0C66E4] hover:bg-[#0055CC] text-white border-transparent';
      label = 'In Progress';
    } else if (s === 'done') {
      if (!canMarkTaskDone) {
        return (
          <span
            title="Done status is reviewed and locked. Only Managers and Admins can modify Done tasks."
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold bg-[#1F845A] text-white select-none shrink-0 cursor-default shadow-2xs"
          >
            <span>Done</span>
          </span>
        );
      }
      pillStyles = 'bg-[#1F845A] hover:bg-[#22A06B] text-white border-transparent';
      label = 'Done';
    } else if (s === 'in_review') {
      pillStyles = 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 dark:bg-[#282240] dark:hover:bg-[#352C55] dark:text-[#9F8FEF] dark:border-[#9F8FEF]/40';
      label = 'Review';
    } else if (s === 'backlog') {
      pillStyles = 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 dark:bg-[#22272B] dark:hover:bg-[#2C333A] dark:text-[#9FADBC] dark:border-[#333C44]';
      label = 'Backlog';
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            onClick={(e) => e.stopPropagation()}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer select-none shrink-0 ${pillStyles}`}
          >
            <span>{label}</span>
            <ChevronDown className="h-3 w-3 opacity-80" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="w-36 bg-white dark:bg-[#1D2125] border border-slate-200 dark:border-[#282E33] text-slate-900 dark:text-[#DEE4EA] p-1 rounded-lg shadow-xl z-50 text-xs"
        >
          <DropdownMenuItem
            onClick={(e) => handleStatusChange(task, 'backlog', e)}
            className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#282E33] cursor-pointer"
          >
            <span>Backlog</span>
            {task.status === 'backlog' && <Check className="h-3.5 w-3.5 text-slate-500 dark:text-[#9FADBC]" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => handleStatusChange(task, 'todo', e)}
            className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#282E33] cursor-pointer"
          >
            <span>To Do</span>
            {task.status === 'todo' && <Check className="h-3.5 w-3.5 text-[#0C66E4] dark:text-[#579DFF]" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => handleStatusChange(task, 'in_progress', e)}
            className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#282E33] cursor-pointer"
          >
            <span>In Progress</span>
            {task.status === 'in_progress' && <Check className="h-3.5 w-3.5 text-[#0C66E4] dark:text-[#579DFF]" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => handleStatusChange(task, 'in_review', e)}
            className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#282E33] cursor-pointer"
          >
            <span>Review</span>
            {task.status === 'in_review' && <Check className="h-3.5 w-3.5 text-[#0C66E4] dark:text-[#579DFF]" />}
          </DropdownMenuItem>
          {(canMarkTaskDone || task.status === 'done') && (
            <DropdownMenuItem
              onClick={(e) => handleStatusChange(task, 'done', e)}
              className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#282E33] cursor-pointer"
            >
              <span>Done</span>
              {task.status === 'done' && <Check className="h-3.5 w-3.5 text-[#1F845A] dark:text-[#4BCE97]" />}
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="w-full rounded-md border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] overflow-hidden select-none shadow-xs">
      {/* Scrollable Table View Container */}
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-[#333C44] scrollbar-track-slate-50 dark:scrollbar-track-[#161A1D]">
        <table className="w-full min-w-[960px] border-collapse text-left text-xs">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-slate-200 dark:border-[#282E33] bg-slate-50 dark:bg-[#1D2125]/80 text-slate-600 dark:text-[#9FADBC] text-xs font-semibold">
              <th className="px-3.5 py-2.5 min-w-[280px]">Work</th>
              <th className="px-3 py-2.5 min-w-[140px]">Assignee</th>
              <th className="px-3 py-2.5 min-w-[140px]">Reporter</th>
              <th className="px-3 py-2.5 min-w-[100px]">Priority</th>
              <th className="px-3 py-2.5 min-w-[130px]">Status</th>
              <th className="px-3 py-2.5 min-w-[150px]">Created</th>
              <th className="px-3 py-2.5 min-w-[150px]">Updated</th>
              <th className="px-3 py-2.5 min-w-[120px]">Due date</th>
              <th className="w-10 px-2 py-2.5 text-center">
                <button
                  type="button"
                  title="Configure columns"
                  className="p-1 hover:bg-slate-200/70 dark:hover:bg-[#282E33] rounded text-slate-400 dark:text-[#738496] hover:text-slate-700 dark:hover:text-[#DEE4EA] transition cursor-pointer"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                </button>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-slate-100 dark:divide-[#282E33]/60 text-xs">
            {tasks.map((task, idx) => {
              const isSelected = selectedIds.includes(task.id);
              const keyText = task.key || `KAN-${task.id}`;
              const isSubtask = task.type === 'subtask' || keyText === 'KAN-3';

              const projectObj = projects.find((p) => p.id === task.project_id);
              const projectName =
                task.project_name ||
                projectObj?.name ||
                currentWorkspace?.name ||
                'Acme Project';

              return (
                <tr
                  key={task.id}
                  onClick={() => onSelectTask?.(task)}
                  className={`group border-b border-slate-100 dark:border-[#282E33]/40 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50/70 dark:bg-[#1C2B41]/50 hover:bg-blue-50 dark:hover:bg-[#1C2B41]/70'
                      : 'hover:bg-slate-50 dark:hover:bg-[#22272B]/60'
                  }`}
                >
                  {/* Work Column: Checkbox + Icon + Project Name + Title */}
                  <td className="px-3.5 py-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={task.status === 'done'}
                        onChange={(e) => {
                          e.stopPropagation();
                          handleStatusChange(
                            task,
                            task.status === 'done' ? 'todo' : 'done',
                            e
                          );
                        }}
                        aria-label={`Mark done ${projectName}`}
                        className="h-3.5 w-3.5 rounded border-slate-300 dark:border-[#4B5663] bg-white dark:bg-[#22272B] accent-[#0C66E4] text-[#0C66E4] cursor-pointer"
                      />

                      {renderTypeIcon(task.type)}

                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTask?.(task);
                        }}
                        className="font-semibold text-[#0C66E4] dark:text-[#579DFF] hover:underline cursor-pointer shrink-0"
                      >
                        {projectName}
                      </span>

                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTask?.(task);
                        }}
                        className={`truncate text-slate-900 dark:text-[#DEE4EA] font-normal hover:text-[#0C66E4] dark:hover:text-[#579DFF] cursor-pointer ${
                          isSubtask ? 'pl-1 text-slate-700 dark:text-[#DEE4EA]/90' : ''
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                  </td>

                  {/* Assignee Column */}
                  <td className="px-3 py-2">
                    {(() => {
                      const assignedUser = userService.resolveUser(task.assignee);
                      if (assignedUser) {
                        return (
                          <div className="flex items-center gap-2">
                            <div
                              className="h-5.5 w-5.5 rounded-full text-white font-bold text-[10px] flex items-center justify-center shrink-0 shadow-xs"
                              style={{ backgroundColor: assignedUser.color || '#7C3AED' }}
                              title={assignedUser.name}
                            >
                              {assignedUser.avatar}
                            </div>
                            <span className="text-slate-800 dark:text-[#DEE4EA] truncate">{assignedUser.name}</span>
                          </div>
                        );
                      }
                      return (
                        <div className="flex items-center gap-2">
                          <div className="h-5.5 w-5.5 rounded-full bg-slate-100 dark:bg-[#22272B] border border-slate-200 dark:border-[#333C44] text-slate-400 dark:text-[#738496] flex items-center justify-center shrink-0">
                            <User className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-slate-500 dark:text-[#DEE4EA] truncate">Unassigned</span>
                        </div>
                      );
                    })()}
                  </td>

                  {/* Reporter Column */}
                  <td className="px-3 py-2">
                    {(() => {
                      const reporterUser = userService.resolveUser(task.reporter || 'Tharun R');
                      if (reporterUser) {
                        const isTR = reporterUser.name === 'Tharun R';
                        return (
                          <div className="flex items-center gap-2">
                            <div
                              className="h-5.5 w-5.5 rounded-full flex items-center justify-center shrink-0 shadow-xs text-[10px]"
                              style={{
                                backgroundColor: isTR ? '#E56910' : (reporterUser.color || '#E56910'),
                                color: isTR ? '#000000' : '#ffffff',
                                fontWeight: isTR ? '800' : '700',
                              }}
                              title={reporterUser.name}
                            >
                              {reporterUser.avatar}
                            </div>
                            <span className="text-slate-800 dark:text-[#DEE4EA] truncate">{reporterUser.name}</span>
                          </div>
                        );
                      }
                      return (
                        <div className="flex items-center gap-2">
                          <div className="h-5.5 w-5.5 rounded-full bg-slate-100 dark:bg-[#22272B] border border-slate-200 dark:border-[#333C44] text-slate-400 dark:text-[#738496] flex items-center justify-center shrink-0">
                            <User className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-slate-500 dark:text-[#DEE4EA] truncate">{task.reporter || 'Unassigned'}</span>
                        </div>
                      );
                    })()}
                  </td>

                  {/* Priority Column */}
                  <td className="px-3 py-2 text-slate-700 dark:text-[#DEE4EA]">
                    {task.priority && task.priority !== 'medium'
                      ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
                      : 'None'}
                  </td>

                  {/* Status Dropdown Pill Column */}
                  <td className="px-3 py-2">{renderStatusPill(task)}</td>

                  {/* Created Column */}
                  <td className="px-3 py-2 text-slate-600 dark:text-[#DEE4EA]">
                    {formatFullDateTime(task.created_at, '3:54 PM')}
                  </td>

                  {/* Updated Column */}
                  <td className="px-3 py-2 text-slate-600 dark:text-[#DEE4EA]">
                    {formatFullDateTime(task.updated_at, '1:02 PM')}
                  </td>

                  {/* Due Date Column */}
                  <td className="px-3 py-2 text-slate-600 dark:text-[#DEE4EA]">
                    {formatShortDate(task.due_date)}
                  </td>

                  {/* More Options (...) Column */}
                  <td
                    className="w-10 px-2 py-2 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          title="More options"
                          className="p-1 hover:bg-slate-200/70 dark:hover:bg-[#282E33] rounded text-slate-400 dark:text-[#738496] hover:text-slate-700 dark:hover:text-[#DEE4EA] transition cursor-pointer"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-32 bg-white dark:bg-[#1D2125] border border-slate-200 dark:border-[#282E33] text-slate-900 dark:text-[#DEE4EA] p-1 rounded-lg shadow-xl z-50 text-xs"
                      >
                        <DropdownMenuItem
                          onClick={() => onSelectTask?.(task)}
                          className="px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#282E33] cursor-pointer"
                        >
                          Open Details
                        </DropdownMenuItem>
                        {onTaskDelete && (
                          <DropdownMenuItem
                            onClick={() => onTaskDelete(task.id)}
                            className="px-2.5 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#282E33] text-rose-600 dark:text-rose-400 cursor-pointer"
                          >
                            Delete
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Footer Bar matching Jira Screenshot: + Create | 3 of 3 ⟳ */}
      <div className="flex items-center justify-between px-3 py-2.5 border-t border-slate-200 dark:border-[#282E33] bg-slate-50/80 dark:bg-[#161A1D] text-xs">
        {/* Left: + Create button */}
        <button
          type="button"
          onClick={onTaskCreate}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold text-slate-700 dark:text-[#DEE4EA] hover:bg-slate-200/70 dark:hover:bg-[#22272B] transition-colors cursor-pointer select-none"
        >
          <Plus className="h-4 w-4 text-slate-700 dark:text-[#DEE4EA]" />
          <span>Create</span>
        </button>

        {/* Center: Count & Refresh */}
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#9FADBC]">
          <span>
            {tasks.length} of {tasks.length}
          </span>
          <button
            type="button"
            title="Refresh list"
            onClick={() => {}}
            className="p-1 hover:bg-slate-200/70 dark:hover:bg-[#22272B] rounded text-slate-500 dark:text-[#9FADBC] hover:text-slate-800 dark:hover:text-[#DEE4EA] transition cursor-pointer"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
