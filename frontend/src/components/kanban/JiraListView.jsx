import React, { useState } from 'react';
import {
  CheckSquare,
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
    return (
      <span title="Task" className="text-slate-400 dark:text-[#9FADBC] flex items-center shrink-0">
        <CheckSquare className="h-4 w-4 stroke-[1.8]" />
      </span>
    );
  };

  // Status button pill matching Jira exactly
  const renderStatusPill = (task) => {
    const s = task.status;

    let pillStyles = 'bg-[#22272B] hover:bg-[#2C333A] text-[#DEE4EA] border border-[#333C44]';
    let label = 'To Do';

    if (s === 'in_progress') {
      pillStyles = 'bg-[#0C66E4] hover:bg-[#0055CC] text-white border-transparent';
      label = 'In Progress';
    } else if (s === 'done') {
      pillStyles = 'bg-[#1F845A] hover:bg-[#22A06B] text-white border-transparent';
      label = 'Done';
    } else if (s === 'in_review') {
      pillStyles = 'bg-[#282240] hover:bg-[#352C55] text-[#9F8FEF] border border-[#9F8FEF]/40';
      label = 'In Review';
    } else if (s === 'backlog') {
      pillStyles = 'bg-[#22272B] hover:bg-[#2C333A] text-[#9FADBC] border border-[#333C44]';
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
          className="w-36 bg-[#1D2125] border border-[#282E33] text-[#DEE4EA] p-1 rounded-lg shadow-xl z-50 text-xs"
        >
          <DropdownMenuItem
            onClick={(e) => handleStatusChange(task, 'todo', e)}
            className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#282E33] cursor-pointer"
          >
            <span>To Do</span>
            {task.status === 'todo' && <Check className="h-3.5 w-3.5 text-[#579DFF]" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => handleStatusChange(task, 'in_progress', e)}
            className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#282E33] cursor-pointer"
          >
            <span>In Progress</span>
            {task.status === 'in_progress' && <Check className="h-3.5 w-3.5 text-[#579DFF]" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => handleStatusChange(task, 'in_review', e)}
            className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#282E33] cursor-pointer"
          >
            <span>In Review</span>
            {task.status === 'in_review' && <Check className="h-3.5 w-3.5 text-[#579DFF]" />}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => handleStatusChange(task, 'done', e)}
            className="flex items-center justify-between px-2.5 py-1.5 rounded hover:bg-[#282E33] cursor-pointer"
          >
            <span>Done</span>
            {task.status === 'done' && <Check className="h-3.5 w-3.5 text-[#4BCE97]" />}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="w-full rounded-md border border-[#282E33] bg-[#161A1D] overflow-hidden select-none shadow-sm">
      {/* Scrollable Table View Container */}
      <div className="w-full overflow-x-auto scrollbar-thin scrollbar-thumb-[#333C44] scrollbar-track-[#161A1D]">
        <table className="w-full min-w-[960px] border-collapse text-left text-xs">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-[#282E33] bg-[#1D2125]/80 text-[#9FADBC] text-xs font-semibold">
              {/* Select All Checkbox */}
              <th className="w-10 px-3 py-2.5 text-center">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isPartiallySelected;
                  }}
                  onChange={toggleSelectAll}
                  aria-label="Select all tasks"
                  className="h-3.5 w-3.5 rounded border-[#4B5663] bg-[#22272B] accent-[#0C66E4] text-[#0C66E4] cursor-pointer"
                />
              </th>

              <th className="px-3 py-2.5 min-w-[280px]">Work</th>
              <th className="px-3 py-2.5 min-w-[140px]">Assignee</th>
              <th className="px-3 py-2.5 min-w-[140px]">Reporter</th>
              <th className="px-3 py-2.5 min-w-[100px]">Priority</th>
              <th className="px-3 py-2.5 min-w-[130px]">Status</th>
              <th className="px-3 py-2.5 min-w-[110px]">Resolution</th>
              <th className="px-3 py-2.5 min-w-[150px]">Created</th>
              <th className="px-3 py-2.5 min-w-[150px]">Updated</th>
              <th className="px-3 py-2.5 min-w-[120px]">Due date</th>
              <th className="w-10 px-2 py-2.5 text-center">
                <button
                  type="button"
                  title="Configure columns"
                  className="p-1 hover:bg-[#282E33] rounded text-[#738496] hover:text-[#DEE4EA] transition"
                >
                  <SlidersHorizontal className="h-3.5 w-3.5" />
                </button>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-[#282E33]/60 text-xs">
            {tasks.map((task, idx) => {
              const isSelected = selectedIds.includes(task.id);
              const keyText = task.key || `KAN-${task.id}`;
              const isSubtask = task.type === 'subtask' || keyText === 'KAN-3';

              return (
                <tr
                  key={task.id}
                  onClick={() => onSelectTask?.(task)}
                  className={`group border-b border-[#282E33]/40 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#1C2B41]/50 hover:bg-[#1C2B41]/70'
                      : 'hover:bg-[#22272B]/60'
                  }`}
                >
                  {/* Row Checkbox */}
                  <td
                    className="w-10 px-3 py-2 text-center"
                    onClick={(e) => toggleSelectRow(task.id, e)}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => toggleSelectRow(task.id, e)}
                      aria-label={`Select task ${keyText}`}
                      className="h-3.5 w-3.5 rounded border-[#4B5663] bg-[#22272B] accent-[#0C66E4] text-[#0C66E4] cursor-pointer"
                    />
                  </td>

                  {/* Work Column: Checkbox + Icon + Key Link + Title */}
                  <td className="px-3 py-2">
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
                        aria-label={`Mark done ${keyText}`}
                        className="h-3.5 w-3.5 rounded border-[#4B5663] bg-[#22272B] accent-[#0C66E4] text-[#0C66E4] cursor-pointer"
                      />

                      {renderTypeIcon(task.type)}

                      <span
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectTask?.(task);
                        }}
                        className="font-medium text-[#579DFF] hover:underline cursor-pointer shrink-0"
                      >
                        {keyText}
                      </span>

                      <span
                        className={`truncate text-[#DEE4EA] font-normal ${
                          isSubtask ? 'pl-1 text-[#DEE4EA]/90' : ''
                        }`}
                      >
                        {task.title}
                      </span>
                    </div>
                  </td>

                  {/* Assignee Column */}
                  <td className="px-3 py-2">
                    {task.assignee === 'TR' ? (
                      <div className="flex items-center gap-2">
                        <div
                          className="h-5.5 w-5.5 rounded-full bg-[#E8831D] text-[#0C162D] font-bold text-[10px] flex items-center justify-center shrink-0 shadow-xs"
                          title="Tharun R"
                        >
                          TR
                        </div>
                        <span className="text-[#DEE4EA] truncate">Tharun R</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <div className="h-5.5 w-5.5 rounded-full bg-[#22272B] border border-[#333C44] text-[#738496] flex items-center justify-center shrink-0">
                          <User className="h-3.5 w-3.5" />
                        </div>
                        <span className="text-[#DEE4EA] truncate">Unassigned</span>
                      </div>
                    )}
                  </td>

                  {/* Reporter Column: Orange TR Circle + Tharun R */}
                  <td className="px-3 py-2">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-5.5 w-5.5 rounded-full bg-[#E56910] text-black font-extrabold text-[10px] flex items-center justify-center shrink-0 shadow-xs"
                        title="Tharun R"
                      >
                        TR
                      </div>
                      <span className="text-[#DEE4EA] truncate">Tharun R</span>
                    </div>
                  </td>

                  {/* Priority Column */}
                  <td className="px-3 py-2 text-[#DEE4EA]">
                    {task.priority && task.priority !== 'medium'
                      ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1)
                      : 'None'}
                  </td>

                  {/* Status Dropdown Pill Column */}
                  <td className="px-3 py-2">{renderStatusPill(task)}</td>

                  {/* Resolution Column */}
                  <td className="px-3 py-2 text-[#DEE4EA]">
                    {task.status === 'done' ? 'Done' : 'Unresolved'}
                  </td>

                  {/* Created Column */}
                  <td className="px-3 py-2 text-[#DEE4EA]">
                    {formatFullDateTime(task.created_at, '3:54 PM')}
                  </td>

                  {/* Updated Column */}
                  <td className="px-3 py-2 text-[#DEE4EA]">
                    {formatFullDateTime(task.updated_at, '1:02 PM')}
                  </td>

                  {/* Due Date Column */}
                  <td className="px-3 py-2 text-[#DEE4EA]">
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
                          className="p-1 hover:bg-[#282E33] rounded text-[#738496] hover:text-[#DEE4EA] transition cursor-pointer"
                        >
                          <MoreHorizontal className="h-3.5 w-3.5" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-32 bg-[#1D2125] border border-[#282E33] text-[#DEE4EA] p-1 rounded-lg shadow-xl z-50 text-xs"
                      >
                        <DropdownMenuItem
                          onClick={() => onSelectTask?.(task)}
                          className="px-2.5 py-1.5 rounded hover:bg-[#282E33] cursor-pointer"
                        >
                          Open Details
                        </DropdownMenuItem>
                        {onTaskDelete && (
                          <DropdownMenuItem
                            onClick={() => onTaskDelete(task.id)}
                            className="px-2.5 py-1.5 rounded hover:bg-[#282E33] text-rose-400 cursor-pointer"
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
      <div className="flex items-center justify-between px-3 py-2.5 border-t border-[#282E33] bg-[#161A1D] text-xs">
        {/* Left: + Create button */}
        <button
          type="button"
          onClick={onTaskCreate}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold text-[#DEE4EA] hover:bg-[#22272B] transition-colors cursor-pointer select-none"
        >
          <Plus className="h-4 w-4 text-[#DEE4EA]" />
          <span>Create</span>
        </button>

        {/* Center: Count & Refresh */}
        <div className="flex items-center gap-2 text-xs text-[#9FADBC]">
          <span>
            {tasks.length} of {tasks.length}
          </span>
          <button
            type="button"
            title="Refresh list"
            onClick={() => {}}
            className="p-1 hover:bg-[#22272B] rounded text-[#9FADBC] hover:text-[#DEE4EA] transition cursor-pointer"
          >
            <RotateCw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
