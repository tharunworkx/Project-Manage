import React from 'react';
import { motion } from 'motion/react';
import {
  Globe,
  ListFilter,
  Columns3,
  FolderKanban,
  FileText,
  Code2,
  Plus,
  Share2,
  Zap,
  Link2,
  MoreHorizontal,
  Users2,
} from 'lucide-react';

export function SpaceHeader({ activeTab, onTabChange }) {

  const tabs = [
    { id: 'summary', label: 'Summary', icon: Globe },
    { id: 'list', label: 'List', icon: ListFilter },
    { id: 'board', label: 'Board', icon: Columns3 },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'docs', label: 'Docs', icon: FileText },
    { id: 'development', label: 'Development', icon: Code2 },
  ];

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="border-b border-slate-200 dark:border-[#282E33] bg-[#F8FAFC] dark:bg-[#101214] px-8 pt-6 select-none transition-colors duration-150">
      {/* Breadcrumb */}
      <div className="text-xs font-medium text-slate-500 dark:text-[#9FADBC] mb-2 flex items-center gap-1.5">
        <span>Spaces</span>
        <span className="text-slate-400 dark:text-[#738496]">/</span>
        <span className="text-slate-900 dark:text-[#DEE4EA]">My Software Team</span>
      </div>

      {/* Title & Action Tools */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          {/* Space Icon */}
          <div className="h-7 w-7 rounded-md bg-slate-100 dark:bg-[#22272B] border border-slate-200 dark:border-[#333C44] flex items-center justify-center text-slate-700 dark:text-[#DEE4EA] shrink-0 shadow-2xs">
            <FolderKanban className="h-4 w-4 stroke-[1.8]" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#DEE4EA]">
            My Software Team
          </h1>

          {/* Team icon */}
          <button
            title="Team members"
            className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-[#22272B] text-slate-500 hover:text-slate-900 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA] transition cursor-pointer"
          >
            <Users2 className="h-4 w-4" />
          </button>

          {/* More options */}
          <button
            title="More space options"
            className="flex h-7 w-7 items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-[#22272B] text-slate-500 hover:text-slate-900 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA] transition cursor-pointer"
          >
            <MoreHorizontal className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Right utility buttons */}
        <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#9FADBC]">
          <button
            onClick={handleShare}
            title="Share board link"
            className="flex h-8 w-8 items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-[#22272B] hover:text-slate-900 dark:hover:text-[#DEE4EA] transition cursor-pointer"
          >
            <Share2 className="h-4.5 w-4.5" />
          </button>
          <button
            title="Automation rules"
            className="flex h-8 w-8 items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-[#22272B] hover:text-slate-900 dark:hover:text-[#DEE4EA] transition cursor-pointer"
          >
            <Zap className="h-4.5 w-4.5" />
          </button>
          <button
            onClick={handleShare}
            title="Copy link"
            className="flex h-8 w-8 items-center justify-center rounded hover:bg-slate-200 dark:hover:bg-[#22272B] hover:text-slate-900 dark:hover:text-[#DEE4EA] transition cursor-pointer"
          >
            <Link2 className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Tabs navigation row */}
      <div className="mt-4 flex items-center gap-6 text-sm font-medium">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`relative flex items-center gap-2 pb-2.5 transition cursor-pointer select-none ${
                isActive
                  ? 'text-[#0C66E4] dark:text-[#579DFF] font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA]'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="spaceheader-tab-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0C66E4] dark:bg-[#579DFF] rounded-full"
                  transition={{
                    type: 'spring',
                    stiffness: 600,
                    damping: 36,
                    mass: 0.5,
                  }}
                />
              )}
            </button>
          );
        })}

        <button
          title="Add view"
          className="flex items-center pb-2.5 text-slate-400 hover:text-slate-700 dark:text-[#738496] dark:hover:text-[#DEE4EA] transition cursor-pointer"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
