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

export default function Dashboard() {
  const { tasks } = useTasks();
  const { projects } = useProjects();
  const { isAdmin } = useAuthContext();

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Dynamic Role Header with Colored Logo */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          {isAdmin ? (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-[#0C66E4]/10 dark:bg-[#579DFF]/15 text-[#0C66E4] dark:text-[#579DFF] border border-[#0C66E4]/25 mb-2">
              <ShieldCheck className="h-4 w-4 stroke-[2.2]" />
              <span>Admin / Project Manager Dashboard</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 mb-2">
              <UserCheck className="h-4 w-4 stroke-[2.2]" />
              <span>Team Member Dashboard</span>
            </div>
          )}

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-[#DEE4EA]">
            {isAdmin ? 'Executive & Project Management Overview' : 'My Work & Assigned Tasks'}
          </h1>
          <p className="text-xs text-slate-500 dark:text-[#9FADBC] mt-1">
            {isAdmin
              ? 'Oversee all company projects, assign tasks to team members, manage deadlines, and track progress.'
              : 'View authorized projects, update task statuses, collaborate with team members, and manage deliverables.'}
          </p>
        </div>

        {/* Quick Role Actions: ONLY Kanban view (My Work Items removed) */}
        <div className="flex items-center gap-2">
          {isAdmin && (
            <>
              <Link to="/users">
                <Button size="sm" variant="outline" className="gap-1.5 text-xs h-9">
                  <ShieldCheck className="h-4 w-4 text-[#0C66E4]" />
                  <span>User Roles</span>
                </Button>
              </Link>
              <Link to="/projects">
                <Button size="sm" className="gap-1.5 text-xs h-9 bg-[#0C66E4] hover:bg-[#0055CC] text-white">
                  <Plus className="h-4 w-4" />
                  <span>Create Project</span>
                </Button>
              </Link>
            </>
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
        <StatCard title="Team Members" value="6" change="Active" icon={Users} />
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
