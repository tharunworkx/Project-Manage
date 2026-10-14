import React from 'react';
import { CheckSquare, FolderKanban, Users, Clock } from 'lucide-react';
import { StatCard } from '../components/dashboard/StatCard';
import { TaskSummary } from '../components/dashboard/TaskSummary';
import { ProductivityChart } from '../components/dashboard/ProductivityChart';
import { ActivityFeed } from '../components/dashboard/ActivityFeed';
import { useTasks } from '../hooks/useTasks';
import { useProjects } from '../hooks/useProjects';

export default function Dashboard() {
  const { tasks } = useTasks();
  const { projects } = useProjects();

  return (
    <div className="p-8 space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-[#DEE4EA]">
          Executive Workspace Overview
        </h1>
        <p className="text-xs text-[#9FADBC] mt-1">
          Real-time metrics, active deliverables, and project progress.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Active Tasks" value={tasks.length} change="+12%" icon={CheckSquare} />
        <StatCard title="Projects" value={projects.length} change="+2" icon={FolderKanban} />
        <StatCard title="Team Members" value="8" change="Active" icon={Users} />
        <StatCard title="Completion Rate" value="76%" change="+4.5%" icon={Clock} />
      </div>

      <TaskSummary tasks={tasks} />

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
