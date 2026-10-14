import React from 'react';
import {
  CheckSquare,
  FolderKanban,
  Users,
  Clock,
  ShieldCheck,
  Briefcase,
  User,
  ArrowRight,
  Plus,
  Calendar as CalendarIcon,
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
import { ROLES } from '../lib/constants';

export default function Dashboard() {
  const { tasks } = useTasks();
  const { projects } = useProjects();
  const { role, isAdmin, isProjectManager } = useAuthContext();

  const getDashboardHeader = () => {
    if (isAdmin) {
      return {
        badge: '👑 Workspace Administrator',
        badgeColor: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
        title: 'Executive Admin Dashboard',
        description: 'Global workspace metrics, user permission controls, and organizational oversight.',
      };
    }
    if (role === ROLES.PROJECT_MANAGER) {
      return {
        badge: '💼 Project Manager',
        badgeColor: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
        title: 'Project Management Dashboard',
        description: 'Track project delivery, allocate team tasks, and monitor Kanban progress.',
      };
    }
    return {
      badge: '👤 Team Member',
      badgeColor: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      title: 'My Workspace Overview',
      description: 'Your assigned work items, upcoming deadlines, and project collaboration.',
    };
  };

  const header = getDashboardHeader();

  return (
    <div className="p-8 space-y-6 max-w-7xl mx-auto">
      {/* Dynamic Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border mb-2 ${header.badgeColor}`}>
            {header.badge}
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-[#DEE4EA]">
            {header.title}
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#9FADBC] mt-1">
            {header.description}
          </p>
        </div>

        {/* Quick Role Actions */}
        <div className="flex items-center gap-2">
          {isAdmin && (
            <Link to="/users">
              <Button size="sm" variant="outline" className="gap-1.5 text-xs h-9">
                <ShieldCheck className="h-4 w-4 text-[#0C66E4]" />
                <span>User Roles</span>
              </Button>
            </Link>
          )}

          {isProjectManager && (
            <Link to="/projects">
              <Button size="sm" className="gap-1.5 text-xs h-9">
                <Plus className="h-4 w-4" />
                <span>New Project</span>
              </Button>
            </Link>
          )}

          <Link to="/board">
            <Button size="sm" variant="outline" className="gap-1.5 text-xs h-9">
              <span>View Kanban</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Tasks" value={tasks.length} change="+12%" icon={CheckSquare} />
        <StatCard title="Projects" value={projects.length} change="+2" icon={FolderKanban} />
        <StatCard title="Team Members" value="8" change="Active" icon={Users} />
        <StatCard title="Completion Rate" value="76%" change="+4.5%" icon={Clock} />
      </div>

      {/* Task Summary */}
      <TaskSummary tasks={tasks} />

      {/* Analytics & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProductivityChart />
        </div>
        <div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
}
