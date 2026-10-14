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
      className="group rounded-2xl border border-[#282E33] bg-[#161A1D] p-5 shadow-xs transition hover:border-[#579DFF]/50 flex flex-col justify-between"
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <div
            className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold"
            style={{ backgroundColor: project.color || '#0C66E4' }}
          >
            <FolderKanban className="h-5 w-5" />
          </div>
          <span className="text-xs font-semibold text-[#9FADBC]">
            {project.task_count || 0} tasks
          </span>
        </div>
        <h3 className="text-base font-bold text-[#DEE4EA] group-hover:text-[#579DFF] transition-colors">
          {project.name}
        </h3>
        <p className="mt-1 text-xs text-[#9FADBC] line-clamp-2">{project.description}</p>
      </div>

      <div className="mt-6 pt-4 border-t border-[#282E33]">
        <div className="flex justify-between text-xs font-medium text-[#9FADBC] mb-1.5">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-[#22272B] overflow-hidden">
          <div
            className="h-full rounded-full bg-[#579DFF] transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </Link>
  );
}
