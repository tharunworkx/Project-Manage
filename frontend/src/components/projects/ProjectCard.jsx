import React from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, CheckCircle2 } from 'lucide-react';

export function ProjectCard({ project }) {
  const progress = project.task_count
    ? Math.round((project.completed_count / project.task_count) * 100)
    : 0;

  return (
    <Link
      to={`/projects/${project.id}`}
      className="group rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-3.5 shadow-xs transition hover:border-[#0C66E4] dark:hover:border-[#579DFF]/50 flex flex-col justify-between max-w-[320px] w-full"
    >
      <div>
        <div className="flex items-center justify-between mb-2">
          <div
            className="h-8 w-8 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: project.color || '#0C66E4' }}
          >
            <FolderKanban className="h-4 w-4" />
          </div>
          <span className="text-[11px] font-semibold text-slate-500 dark:text-[#9FADBC]">
            {project.task_count || 0} tasks
          </span>
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-[#DEE4EA] group-hover:text-[#0C66E4] dark:group-hover:text-[#579DFF] transition-colors truncate">
          {project.name}
        </h3>
        <p className="mt-1 text-[11px] text-slate-500 dark:text-[#9FADBC] line-clamp-2">{project.description}</p>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#282E33]">
        <div className="flex justify-between text-xs font-medium text-slate-500 dark:text-[#9FADBC] mb-1.5">
          <span>Progress</span>
          <span className="text-slate-900 dark:text-[#DEE4EA] font-semibold">{progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-[#22272B] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#0C66E4] dark:bg-[#579DFF] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
