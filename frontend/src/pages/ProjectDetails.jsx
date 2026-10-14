import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { KanbanBoard } from '../components/kanban/KanbanBoard';
import { ProjectMembers } from '../components/projects/ProjectMembers';
import { useTasks } from '../hooks/useTasks';

export default function ProjectDetails() {
  const { id } = useParams();
  const { tasks, updateTask, createTask } = useTasks(id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/projects" className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">Project Workspace</h1>
            <p className="text-xs text-slate-500">ID: {id} · Sprint tracking and deliverables</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <KanbanBoard tasks={tasks} onTaskUpdate={(taskId, updates) => updateTask({ id: taskId, updates })} />
        </div>
        <div>
          <ProjectMembers />
        </div>
      </div>
    </div>
  );
}
