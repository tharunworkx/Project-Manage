import React from 'react';
import {
  CheckSquare,
  FolderKanban,
  Users,
  Clock,
  ShieldCheck,
  UserCheck,
  ArrowRight,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StatCard } from '../components/dashboard/StatCard';
import { TaskSummary } from '../components/dashboard/TaskSummary';
import { ProductivityChart } from '../components/dashboard/ProductivityChart';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { Button } from '@/components/ui/Button';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';
import { useAuthContext } from '../context/AuthContext';
import { useWorkspaceContext } from '../context/WorkspaceContext';

export default function Dashboard() {
  const { currentWorkspace } = useWorkspaceContext();
  const { tasks } = useTasks(null, currentWorkspace?.id);
  const { projects } = useProjects(currentWorkspace?.id);
  const { isAdmin } = useAuthContext();

  const activeTasksCount = tasks.filter(
    (t) => t.status !== 'done' && t.status !== 'cancelled'
  ).length;

  const completedTasksCount = tasks.filter((t) => t.status === 'done').length;
  const completionRate =
    tasks.length > 0 ? Math.round((completedTasksCount / tasks.length) * 100) + '%' : '0%';

  const teamMembersCount =
    currentWorkspace?.id === 'ws-1' ? '8' : currentWorkspace?.id === 'ws-3' ? '4' : '6';

  return (
    <div className="p-6 sm:px-8 space-y-6 w-full select-none transition-colors duration-150">
      {/* Workspace Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-5 rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] shadow-xs">
        <div className="flex items-start sm:items-center gap-3.5">
          <div
            className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shrink-0 shadow-sm"
            style={{ backgroundColor: currentWorkspace?.color || '#0C66E4' }}
          >
            {currentWorkspace?.initial || 'W'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#22272B] text-slate-700 dark:text-[#DEE4EA] border border-slate-200 dark:border-[#333C44]">
                Active Workspace
              </span>
              {isAdmin ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Admin Overview
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-[#579DFF]">
                  <UserCheck className="h-3.5 w-3.5" />
                  Member View
                </span>
              )}
            </div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-[#DEE4EA]">
              {currentWorkspace?.name || 'Workspace Dashboard'}
            </h1>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <Link to="/kanban">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-9">
              <span>View Kanban</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          {isAdmin && (
            <Link to="/projects">
              <Button size="sm" className="gap-1.5 text-xs h-9 bg-[#0C66E4] hover:bg-[#0055CC] text-white">
                <Plus className="h-4 w-4" />
                <span>Create Project</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {/* Metrics Row - Scoped specifically to currentWorkspace */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Tasks" value={activeTasksCount} change={`${tasks.length} total`} icon={CheckSquare} />
        <StatCard title="Projects" value={projects.length} change="In workspace" icon={FolderKanban} />
        <StatCard title="Team Members" value={teamMembersCount} change="Active" icon={Users} />
        <StatCard title="Completion Rate" value={completionRate} change={`${completedTasksCount} done`} icon={Clock} />
      </div>

      {/* Task Summary */}
      <TaskSummary tasks={tasks} />

      {/* Analytics & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductivityChart workspaceId={currentWorkspace?.id} />
        </div>
        <div>
          <ActivityFeed workspaceId={currentWorkspace?.id} />
        </div>
      </div>
    </div>
  );
}
