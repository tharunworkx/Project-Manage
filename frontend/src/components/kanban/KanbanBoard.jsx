import React, { useState } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  Plus,
  TrendingUp,
  Bookmark,
  Bug,
  User,
  Edit3,
  MoreHorizontal,
} from 'lucide-react';
import { KanbanColumn } from './KanbanColumn';
import { BoardToolbar } from './BoardToolbar';
import { TaskCard } from './TaskCard';
import { TaskDetailsDrawer } from '../tasks/TaskDetailsDrawer';
import { TaskDialog } from '../tasks/TaskDialog';
import { TASK_STATUSES } from '../../lib/constants';
import { formatDate } from '../../lib/utils';
import { useAuthContext } from '../../context/AuthContext';
import { isTaskCreatedByUser } from '../../services/taskService';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export function KanbanBoard({ tasks = [], onTaskUpdate, onTaskCreate, onTaskDelete }) {
  const { user, canCreateTasks, canMarkTaskDone } = useAuthContext();
  const [viewMode, setViewMode] = useState(() => {
    try {
      return localStorage.getItem('taskflow_board_view_mode') || 'grid';
    } catch {
      return 'grid';
    }
  });

  const handleViewModeChange = (mode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('taskflow_board_view_mode', mode);
    } catch {}
  };

  const [searchVal, setSearchVal] = useState('');
  const [onlyMe, setOnlyMe] = useState(false);
  const [filterType, setFilterType] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [groupBy, setGroupBy] = useState('none');
  const [showInsights, setShowInsights] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [createDialogStatus, setCreateDialogStatus] = useState('todo');

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor)
  );

  const dropAnimationConfig = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.4',
        },
      },
    }),
    duration: 220,
    easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
  };

  // Apply filters
  const filteredTasks = tasks.filter((t) => {
    // 1. Search text filter
    const matchesSearch =
      t.title.toLowerCase().includes(searchVal.toLowerCase()) ||
      (t.key && t.key.toLowerCase().includes(searchVal.toLowerCase()));
    if (!matchesSearch) return false;

    // 2. Only my issues filter
    if (onlyMe && !isTaskCreatedByUser(t, user)) return false;

    // 3. Dropdown filter type
    if (filterType === 'my' && !isTaskCreatedByUser(t, user)) return false;
    if (filterType === 'incomplete' && t.status === 'done') return false;
    if (filterType === 'done' && t.status !== 'done') return false;
    if (filterType === 'high' && !['high', 'urgent'].includes(t.priority)) return false;

    // 4. Status filter in grid view
    if (statusFilter !== 'all' && t.status !== statusFilter) return false;

    return true;
  });

  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find((t) => t.id === active.id) || active.data?.current;
    setActiveTask(task || null);
  };

  const handleDragCancel = () => {
    setActiveTask(null);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const taskId = active.id;
    let newStatus = over.id;

    // If dropped over another task card, resolve its column status
    const overTask = tasks.find((t) => t.id === over.id);
    if (overTask) {
      newStatus = overTask.status;
    }

    if ((newStatus === 'done' || active.data?.current?.status === 'done') && !canMarkTaskDone) {
      toast.error('Only Project Managers and Admins can review and make tasks Done.');
      return;
    }

    if (active.data?.current?.status !== newStatus && onTaskUpdate) {
      onTaskUpdate(taskId, { status: newStatus });
    }
  };

  const handleNewTaskInColumn = (status, title, extra = {}) => {
    if (onTaskCreate) {
      onTaskCreate({
        ...extra,
        title: title || extra.title,
        status: status || extra.status || 'todo',
        type: extra.type || 'task',
        priority: extra.priority || 'medium',
        due_date: extra.due_date || new Date().toISOString().split('T')[0],
      });
      toast.success(`Created "${title || extra.title || 'Task'}" successfully`);
    }
  };

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
    return null;
  };

  const statusMap = TASK_STATUSES.reduce((acc, col) => {
    acc[col.id] = col;
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full select-none">
      {/* Board Search, Quick Filters & Grouping Toolbar (Unified across Grid & Columns) */}
      <BoardToolbar
        searchVal={searchVal}
        onSearchChange={setSearchVal}
        onlyMe={onlyMe}
        onToggleOnlyMe={() => setOnlyMe(!onlyMe)}
        filterType={filterType}
        onFilterTypeChange={setFilterType}
        groupBy={groupBy}
        onGroupByChange={setGroupBy}
        onToggleInsights={() => setShowInsights(!showInsights)}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        user={user}
      />

      {/* Optional Insights Banner */}
      {showInsights && (
        <div className="mx-6 mb-3 p-4 rounded-xl bg-white dark:bg-[#161A1D] border border-slate-200 dark:border-[#282E33] flex items-center justify-between animate-fade-in text-sm shadow-xs">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-blue-500/10 dark:bg-[#0C66E4]/20 text-[#0C66E4] dark:text-[#579DFF] flex items-center justify-center">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-[#DEE4EA]">Active Sprint Health: 100%</p>
              <p className="text-xs text-slate-500 dark:text-[#9FADBC]">
                {tasks.filter((t) => t.status === 'done').length} of {tasks.length} issues completed on schedule.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowInsights(false)}
            className="text-xs text-slate-400 hover:text-slate-700 dark:text-[#738496] dark:hover:text-[#DEE4EA] cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* VIEW MODE 1: GRID VIEW (Down) - EXACT SAME UI AS COLUMN VIEW CARDS */}
      {viewMode === 'grid' && (
        <div className="flex-1 flex flex-col overflow-hidden px-3.5 sm:px-8 pb-6 pt-1">
          {/* Status Quick Filter Chips */}
          <div className="flex items-center gap-2 mb-3.5 overflow-x-auto pb-1 scrollbar-none no-scrollbar">
            <button
              onClick={() => setStatusFilter('all')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                statusFilter === 'all'
                  ? 'bg-[#0C66E4] text-white shadow-xs'
                  : 'bg-white dark:bg-[#161A1D] border border-slate-200 dark:border-[#282E33] text-slate-600 dark:text-[#9FADBC] hover:bg-slate-50 dark:hover:bg-[#22272B]'
              }`}
            >
              <span>All Issues</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                statusFilter === 'all'
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 dark:bg-[#22272B] text-slate-500 dark:text-[#738496]'
              }`}>
                {tasks.length}
              </span>
            </button>

            {TASK_STATUSES.map((col) => {
              const count = tasks.filter((t) => t.status === col.id).length;
              const isActive = statusFilter === col.id;

              return (
                <button
                  key={col.id}
                  onClick={() => setStatusFilter(col.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-[#0C66E4] text-white shadow-xs'
                      : 'bg-white dark:bg-[#161A1D] border border-slate-200 dark:border-[#282E33] text-slate-600 dark:text-[#9FADBC] hover:bg-slate-50 dark:hover:bg-[#22272B]'
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: col.color }}
                  />
                  <span>{col.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                    isActive
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-[#22272B] text-slate-500 dark:text-[#738496]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Grid of Work Item Cards scrolling vertically down */}
          <div className="flex-1 overflow-y-auto pr-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredTasks.map((task) => {
                const colInfo = statusMap[task.status] || {
                  label: task.status,
                  color: '#579DFF',
                };

                return (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="group relative rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#22272B] p-4 text-left transition hover:border-[#0C66E4] dark:hover:border-[#388BFF]/70 hover:shadow-md shadow-2xs cursor-pointer select-none flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Row: Status badge with colored dot + actions on hover */}
                      <div className="flex items-center justify-between gap-2 mb-2.5">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-[#161A1D] text-slate-700 dark:text-[#DEE4EA] border border-slate-200/80 dark:border-[#282E33]">
                          <span
                            className="h-2 w-2 rounded-full shadow-xs"
                            style={{ backgroundColor: colInfo.color }}
                          />
                          <span>{colInfo.label}</span>
                        </span>

                        <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTask(task);
                            }}
                            title="Edit issue"
                            className="p-1 rounded text-slate-400 hover:text-slate-800 hover:bg-slate-100 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA] dark:hover:bg-[#333C44]"
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (s.id === 'done' && !canMarkTaskDone) {
                                      toast.error('Only Project Managers and Admins can review and make tasks Done.');
                                      return;
                                    }
                                    onTaskUpdate && onTaskUpdate(task.id, { status: s.id });
                                    toast.success(`Moved to ${s.label}`);
                                  }}
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
                                  setSelectedTask(task);
                                }}
                                className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer text-slate-700 dark:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#282E33] transition"
                              >
                                <Edit3 className="h-3.5 w-3.5 text-slate-400" />
                                <span>View Details</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>

                      {/* Title matching Column View */}
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-[#DEE4EA] leading-snug line-clamp-2 mb-1.5 group-hover:text-[#0C66E4] dark:group-hover:text-[#579DFF] transition">
                        {task.title}
                      </h4>

                      {/* Due Date matching Column View */}
                      {task.due_date && (
                        <div className="text-xs text-slate-500 dark:text-[#9FADBC] mb-2 font-medium">
                          {formatDate(task.due_date)}
                        </div>
                      )}
                    </div>

                    {/* Bottom Row: Type Icon + Key on Left, Assignee Avatar on Right */}
                    <div className="mt-3.5 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#282E33]/60">
                      <div className="flex items-center gap-2">
                        {renderTypeIcon(task.type)}
                        <span className="text-xs font-semibold text-slate-500 dark:text-[#9FADBC] tracking-tight hover:underline">
                          {task.key || `KAN-${task.id}`}
                        </span>
                      </div>

                      {/* Assignee Avatar */}
                      {task.assignee === 'TR' ? (
                        <div
                          className="flex h-6 w-6 items-center justify-center rounded-full bg-[#7C3AED] text-white font-bold text-[10px] shadow-xs"
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
              })}

              {/* Slot to create a new task in grid */}
              {canCreateTasks && (
                <button
                  type="button"
                  onClick={() => {
                    setCreateDialogStatus(statusFilter !== 'all' ? statusFilter : 'todo');
                    setIsCreateDialogOpen(true);
                  }}
                  className="h-44 rounded-xl border-2 border-dashed border-slate-300 dark:border-[#282E33] hover:border-[#0C66E4] dark:hover:border-[#579DFF]/60 hover:bg-blue-50/20 dark:hover:bg-[#1C2125]/50 flex flex-col items-center justify-center gap-2 text-slate-400 hover:text-[#0C66E4] dark:text-[#738496] dark:hover:text-[#579DFF] transition cursor-pointer p-4 group"
                >
                  <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-[#22272B] flex items-center justify-center text-slate-500 group-hover:bg-[#0C66E4] group-hover:text-white transition">
                    <Plus className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-semibold">Create issue</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* VIEW MODE 2: COLUMN VIEW (Row) */}
      {viewMode === 'columns' && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="flex-1 flex gap-3 sm:gap-4 overflow-x-auto px-3.5 sm:px-8 pb-6 pt-1 items-start snap-x snap-mandatory scroll-smooth no-scrollbar">
            {TASK_STATUSES.map((col) => (
              <KanbanColumn
                key={col.id}
                column={col}
                tasks={filteredTasks.filter((t) => t.status === col.id)}
                onNewTaskInColumn={(status) => {
                  setCreateDialogStatus(status);
                  setIsCreateDialogOpen(true);
                }}
                onOpenCreateDialog={(status) => {
                  setCreateDialogStatus(status);
                  setIsCreateDialogOpen(true);
                }}
                onCardClick={(task) => setSelectedTask(task)}
                onTaskUpdate={onTaskUpdate}
              />
            ))}
          </div>

          <DragOverlay dropAnimation={dropAnimationConfig}>
            {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
          </DragOverlay>
        </DndContext>
      )}

      {/* Jira Issue Details Slide-out Drawer */}
      <TaskDetailsDrawer
        task={selectedTask}
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        onUpdate={(taskId, updates) => {
          onTaskUpdate && onTaskUpdate(taskId, updates);
          setSelectedTask((prev) => (prev ? { ...prev, ...updates } : null));
        }}
        onDelete={(taskId) => {
          onTaskDelete && onTaskDelete(taskId);
          setSelectedTask(null);
        }}
      />

      {/* Create Task Dialog with all fields */}
      <TaskDialog
        isOpen={isCreateDialogOpen}
        initialData={{
          status: createDialogStatus || (statusFilter !== 'all' ? statusFilter : 'todo'),
        }}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={(data) => {
          handleNewTaskInColumn(data.status, data.title, data);
          setIsCreateDialogOpen(false);
        }}
      />
    </div>
  );
}

export default KanbanBoard;
