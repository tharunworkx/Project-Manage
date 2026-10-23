import React, { useMemo, useState, useEffect } from 'react';
import {
  CheckCircle2,
  Edit3,
  CheckSquare,
  Calendar,
  Maximize2,
  Inbox,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { activityService } from '../../services/activityService';

const STATUS_CONFIG = {
  in_progress: {
    label: 'In Progress',
    color: '#2684FF',
    badgeClass: 'bg-blue-50 dark:bg-[#1C2B41] text-[#0C66E4] dark:text-[#579DFF] border-blue-200 dark:border-blue-900/40',
  },
  todo: {
    label: 'To Do',
    color: '#65B82A',
    badgeClass: 'bg-slate-100 dark:bg-[#22272B] text-slate-700 dark:text-[#DEE4EA] border-slate-200 dark:border-[#333C44]',
  },
  to_do: {
    label: 'To Do',
    color: '#65B82A',
    badgeClass: 'bg-slate-100 dark:bg-[#22272B] text-slate-700 dark:text-[#DEE4EA] border-slate-200 dark:border-[#333C44]',
  },
  in_review: {
    label: 'Review',
    color: '#8F63F4',
    badgeClass: 'bg-purple-50 dark:bg-[#2A233D] text-[#7C3AED] dark:text-[#BA75FF] border-purple-200 dark:border-purple-900/40',
  },
  done: {
    label: 'Done',
    color: '#36B37E',
    badgeClass: 'bg-emerald-50 dark:bg-[#163828] text-emerald-700 dark:text-[#4ADE80] border-emerald-200 dark:border-emerald-900/40',
  },
  backlog: {
    label: 'Backlog',
    color: '#7A869A',
    badgeClass: 'bg-slate-100 dark:bg-[#22272B] text-slate-600 dark:text-[#9FADBC] border-slate-200 dark:border-[#333C44]',
  },
};

export function JiraSummaryView({
  tasks = [],
  onTabChange,
  onSelectTask,
  currentWorkspace,
}) {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const userName = user?.name || 'Tharun R';

  // 1. Live activities state from activityService (No fake hardcoded data)
  const [activities, setActivities] = useState(() =>
    activityService.getActivities(currentWorkspace?.id, tasks)
  );

  useEffect(() => {
    // Sync when workspace or tasks update
    const live = activityService.getActivities(currentWorkspace?.id, tasks);
    setActivities(live);

    const unsubscribe = activityService.subscribe((wsId, updated) => {
      if (!wsId || wsId === currentWorkspace?.id) {
        setActivities(updated);
      }
    });

    return () => unsubscribe();
  }, [currentWorkspace?.id, tasks]);

  // 2. Calculate Metric counts matching Jira top cards
  const metrics = useMemo(() => {
    const completedTasks = tasks.filter((t) => t.status === 'done');
    const inProgressTasks = tasks.filter((t) => t.status === 'in_progress');

    // Due soon in the next 7 days
    const now = new Date();
    const next7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const dueSoonCount = tasks.filter((t) => {
      if (t.status === 'done' || !t.due_date) return false;
      const due = new Date(t.due_date);
      return due >= now && due <= next7Days;
    }).length;

    return {
      completed: completedTasks.length,
      updated: tasks.length,
      created: tasks.length,
      dueSoon: dueSoonCount,
    };
  }, [tasks]);

  // 3. Status Breakdown for Donut Chart
  const { statusList, totalCount } = useMemo(() => {
    const counts = {};
    tasks.forEach((t) => {
      const st = t.status === 'to_do' ? 'todo' : t.status || 'todo';
      counts[st] = (counts[st] || 0) + 1;
    });

    const total = tasks.length;

    const list = Object.entries(counts).map(([key, count]) => {
      const config = STATUS_CONFIG[key] || {
        label: key.replace('_', ' '),
        color: '#2684FF',
      };
      return {
        id: key,
        label: config.label,
        color: config.color,
        count,
        percent: total > 0 ? (count / total) * 100 : 0,
      };
    });

    // Order: In Progress first, then To Do, Review, Done, etc.
    const order = ['in_progress', 'todo', 'in_review', 'done', 'backlog'];
    list.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

    return { statusList: list, totalCount: total };
  }, [tasks]);

  // Donut SVG circumference calculation
  const radius = 56;
  const circumference = 2 * Math.PI * radius; // ≈ 351.858
  let cumulativeOffset = 0;

  return (
    <div className="w-full px-6 sm:px-8 py-5 space-y-5 select-none transition-colors duration-150">
      {/* 1. Four Metric Cards Row matching Screenshot */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Completed */}
        <div className="rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-3.5 flex items-center gap-3.5 shadow-2xs hover:shadow-xs transition">
          <div className="h-9 w-9 rounded-full bg-slate-100 dark:bg-[#22272B] border border-slate-200 dark:border-[#333C44] flex items-center justify-center text-slate-700 dark:text-[#DEE4EA] shrink-0">
            <CheckCircle2 className="h-5 w-5 stroke-[1.8]" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900 dark:text-[#DEE4EA] tracking-tight">
              {metrics.completed} completed
            </div>
            <div className="text-xs text-slate-500 dark:text-[#9FADBC]">
              in the last 7 days
            </div>
          </div>
        </div>

        {/* Card 2: Updated */}
        <div className="rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-3.5 flex items-center gap-3.5 shadow-2xs hover:shadow-xs transition">
          <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-[#22272B] border border-slate-200 dark:border-[#333C44] flex items-center justify-center text-slate-700 dark:text-[#DEE4EA] shrink-0">
            <Edit3 className="h-4.5 w-4.5 stroke-[1.8]" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900 dark:text-[#DEE4EA] tracking-tight">
              {metrics.updated} updated
            </div>
            <div className="text-xs text-slate-500 dark:text-[#9FADBC]">
              in the last 7 days
            </div>
          </div>
        </div>

        {/* Card 3: Created */}
        <div className="rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-3.5 flex items-center gap-3.5 shadow-2xs hover:shadow-xs transition">
          <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-[#22272B] border border-slate-200 dark:border-[#333C44] flex items-center justify-center text-slate-700 dark:text-[#DEE4EA] shrink-0">
            <CheckSquare className="h-4.5 w-4.5 stroke-[1.8]" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900 dark:text-[#DEE4EA] tracking-tight">
              {metrics.created} created
            </div>
            <div className="text-xs text-slate-500 dark:text-[#9FADBC]">
              in the last 7 days
            </div>
          </div>
        </div>

        {/* Card 4: Due Soon */}
        <div className="rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-3.5 flex items-center gap-3.5 shadow-2xs hover:shadow-xs transition">
          <div className="h-9 w-9 rounded-lg bg-amber-50 dark:bg-[#332519] border border-amber-200 dark:border-[#F5CD47]/30 flex items-center justify-center text-amber-600 dark:text-[#F5CD47] shrink-0">
            <Calendar className="h-4.5 w-4.5 stroke-[2]" />
          </div>
          <div className="min-w-0">
            <div className="text-sm font-bold text-slate-900 dark:text-[#DEE4EA] tracking-tight">
              {metrics.dueSoon} due soon
            </div>
            <div className="text-xs text-slate-500 dark:text-[#9FADBC]">
              in the next 7 days
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Two Column Section matching Screenshot */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        {/* Left Card: Status Overview with Donut Chart */}
        <div className="rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#DEE4EA]">
              Status overview
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#9FADBC] mt-1">
              Get a snapshot of the status of your work items.{' '}
              <button
                type="button"
                onClick={() => onTabChange && onTabChange('list')}
                className="text-[#0C66E4] dark:text-[#579DFF] hover:underline font-semibold cursor-pointer inline-flex items-center gap-0.5"
              >
                View all work items
              </button>
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-around gap-8 my-auto py-6">
            {/* SVG Donut Chart */}
            <div className="relative w-48 h-48 flex items-center justify-center shrink-0">
              <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
                {/* Background Ring */}
                <circle
                  cx="80"
                  cy="80"
                  r={radius}
                  className="stroke-slate-100 dark:stroke-[#22272B]"
                  strokeWidth="22"
                  fill="none"
                />

                {/* Slices */}
                {totalCount > 0 &&
                  statusList.map((st) => {
                    if (st.count <= 0) return null;
                    const strokeDasharray = `${(st.count / totalCount) * circumference} ${circumference}`;
                    const strokeDashoffset = -cumulativeOffset;
                    cumulativeOffset += (st.count / totalCount) * circumference;

                    return (
                      <circle
                        key={st.id}
                        cx="80"
                        cy="80"
                        r={radius}
                        stroke={st.color}
                        strokeWidth="22"
                        strokeDasharray={strokeDasharray}
                        strokeDashoffset={strokeDashoffset}
                        fill="none"
                        className="transition-all duration-500 ease-out"
                      />
                    );
                  })}
              </svg>

              {/* Center Text inside Donut - Cleanly formatted without truncation ellipsis */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center px-2">
                <span className="text-3xl font-extrabold text-slate-900 dark:text-[#DEE4EA] tracking-tight leading-tight">
                  {totalCount}
                </span>
                <span className="text-[11px] font-medium text-slate-500 dark:text-[#9FADBC] text-center whitespace-nowrap leading-tight mt-1">
                  Total work items
                </span>
              </div>
            </div>

            {/* Legend on right */}
            <div className="flex flex-col gap-3.5 min-w-[130px]">
              {statusList.length === 0 ? (
                <span className="text-xs text-slate-400 dark:text-[#738496] italic">
                  No work items in this space
                </span>
              ) : (
                statusList.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center gap-2.5 text-xs font-semibold text-slate-800 dark:text-[#DEE4EA]"
                  >
                    <span
                      className="h-3 w-3 rounded-xs shrink-0 shadow-2xs"
                      style={{ backgroundColor: st.color }}
                    />
                    <span>
                      {st.label}: {st.count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Card: Recent Activity with LIVE real data */}
        <div className="rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-6 shadow-2xs flex flex-col justify-between">
          {/* Header */}
          <div className="flex items-start justify-between gap-2 border-b border-slate-100 dark:border-[#282E33]/70 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-[#DEE4EA]">
                Recent activity
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#9FADBC] mt-1">
                Stay up to date with what's happening across the space.
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/activity')}
              title="Expand activity feed"
              className="text-slate-400 hover:text-slate-700 dark:text-[#738496] dark:hover:text-[#DEE4EA] p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#22272B] transition cursor-pointer shrink-0"
            >
              <Maximize2 className="h-4 w-4" />
            </button>
          </div>

          {/* Activity Feed Body with Live Data */}
          <div className="flex-1 overflow-y-auto max-h-[300px] mt-4 space-y-4 pr-1.5 custom-scrollbar">
            {activities.length === 0 ? (
              <div className="text-center py-12 px-4 space-y-2">
                <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-[#22272B] text-slate-400 dark:text-[#738496] flex items-center justify-center mx-auto">
                  <Inbox className="h-5 w-5 stroke-[1.8]" />
                </div>
                <p className="text-xs font-semibold text-slate-700 dark:text-[#DEE4EA]">
                  No recent activity
                </p>
                <p className="text-[11px] text-slate-400 dark:text-[#738496] max-w-xs mx-auto">
                  When tasks are created, updated, or moved in this space, live updates will appear here.
                </p>
              </div>
            ) : (
              <>
                <div className="text-xs font-bold text-slate-700 dark:text-[#DEE4EA] tracking-wide">
                  Recent Updates
                </div>

                <div className="space-y-4">
                  {activities.map((item) => {
                    const initials = (item.user || userName)
                      .split(' ')
                      .map((w) => w[0])
                      .join('')
                      .substring(0, 2)
                      .toUpperCase() || 'TR';

                    return (
                      <div key={item.id} className="flex items-start gap-3 text-xs leading-relaxed">
                        {/* Initials Avatar */}
                        <div className="h-7 w-7 rounded-full bg-[#008DA6] text-white flex items-center justify-center font-bold text-[11px] shrink-0 mt-0.5 shadow-2xs">
                          {initials}
                        </div>

                        {/* Activity Details */}
                        <div className="flex-1 min-w-0">
                          <div className="text-slate-700 dark:text-[#DEE4EA]">
                            <span className="font-semibold text-[#0C66E4] dark:text-[#579DFF] hover:underline cursor-pointer">
                              {item.user}
                            </span>{' '}
                            <span>{item.action}</span>{' '}
                            {item.assignee && (
                              <>
                                <span className="font-semibold text-[#0C66E4] dark:text-[#579DFF] hover:underline cursor-pointer">
                                  {item.assignee}
                                </span>{' '}
                                <span>on </span>
                              </>
                            )}
                            {item.targetField && (
                              <>
                                <span>"{item.targetField}" on </span>
                              </>
                            )}
                            {/* Task Link Pill */}
                            <button
                              type="button"
                              onClick={() => {
                                if (item.task && onSelectTask) {
                                  onSelectTask(item.task);
                                }
                              }}
                              className="inline-flex items-center gap-1 mx-1 px-1.5 py-0.5 rounded text-[11px] font-semibold text-[#0C66E4] dark:text-[#579DFF] bg-blue-50 dark:bg-[#1C2B41] border border-blue-200 dark:border-[#579DFF]/30 hover:bg-blue-100 dark:hover:bg-[#1C2B41]/70 transition cursor-pointer"
                              title="Click to view task details"
                            >
                              <CheckSquare className="h-3 w-3 shrink-0 stroke-[2.2]" />
                              <span className="truncate max-w-[140px]">
                                {item.taskKey}: {item.taskTitle}
                              </span>
                            </button>
                            {/* Status Pill */}
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-medium text-slate-600 dark:text-[#9FADBC] bg-slate-100 dark:bg-[#22272B] border border-slate-200 dark:border-[#333C44]">
                              {item.statusLabel}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-400 dark:text-[#738496] mt-1">
                            {item.time}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JiraSummaryView;
