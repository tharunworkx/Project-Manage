import React, { useState, useMemo } from 'react';
import {
  Plus,
  Calendar,
  MoreVertical,
  ArrowUpDown,
  ChevronDown,
  Check,
  ExternalLink,
  Trash2,
  FolderPlus,
  Bookmark,
  User,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DatePicker } from '../ui/date-picker';
import { useAuthContext } from '../../context/AuthContext';
import { toast } from 'sonner';

const INITIAL_PROJECTS = [
  {
    id: 'proj-1',
    key: 'PROJ-101',
    name: 'Newsletter Templates',
    status: 'on_hold',
    duration: 'Nov 12, 2026',
    description:
      'The goal of this project is to improve operational efficiency within the organization by implementing process automation.',
    avatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    ],
    moreCount: 3,
  },
  {
    id: 'proj-2',
    key: 'PROJ-102',
    name: 'Payment Gateway',
    status: 'in_progress',
    duration: 'Nov 18, 2026',
    description:
      'The goal of this project is to improve operational efficiency within the organization by implementing process automation.',
    avatars: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces',
    ],
    moreCount: 3,
  },
  {
    id: 'proj-3',
    key: 'PROJ-103',
    name: 'CRM Integration',
    status: 'complete',
    duration: 'Oct 30, 2026',
    description:
      'The goal of this project is to improve operational efficiency within the organization by implementing process automation.',
    avatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    ],
    moreCount: 3,
  },
  {
    id: 'proj-4',
    key: 'PROJ-104',
    name: 'Website Builder',
    status: 'in_progress',
    duration: 'Nov 22, 2026',
    description:
      'The goal of this project is to improve operational efficiency within the organization by implementing process automation.',
    avatars: [
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    ],
    moreCount: 3,
  },
  {
    id: 'proj-5',
    key: 'PROJ-105',
    name: 'Dashboard Design',
    status: 'on_hold',
    duration: 'Dec 05, 2026',
    description:
      'The goal of this project is to improve operational efficiency within the organization by implementing process automation.',
    avatars: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    ],
    moreCount: 3,
  },
  {
    id: 'proj-6',
    key: 'PROJ-106',
    name: 'Mobile App',
    status: 'cancelled',
    duration: 'Cancelled',
    description:
      'The goal of this project is to improve operational efficiency within the organization by implementing process automation.',
    avatars: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces',
    ],
    moreCount: 3,
  },
  {
    id: 'proj-7',
    key: 'PROJ-107',
    name: 'Bootstrap Framework',
    status: 'complete',
    duration: 'Oct 15, 2026',
    description:
      'The goal of this project is to improve operational efficiency within the organization by implementing process automation.',
    avatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    ],
    moreCount: 3,
  },
  {
    id: 'proj-8',
    key: 'PROJ-108',
    name: 'App Notification',
    status: 'in_progress',
    duration: 'Nov 08, 2026',
    description:
      'The goal of this project is to improve operational efficiency within the organization by implementing process automation.',
    avatars: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces',
    ],
    moreCount: 3,
  },
  {
    id: 'proj-9',
    key: 'PROJ-109',
    name: 'API Integration',
    status: 'on_hold',
    duration: 'Dec 12, 2026',
    description:
      'The goal of this project is to improve operational efficiency within the organization by implementing process automation.',
    avatars: [
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
    ],
    moreCount: 3,
  },
  {
    id: 'proj-10',
    key: 'PROJ-110',
    name: 'Website Redesign',
    status: 'in_progress',
    duration: 'Nov 28, 2026',
    description:
      'The goal of this project is to improve operational efficiency within the organization by implementing process automation.',
    avatars: [
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
    ],
    moreCount: 3,
  },
  {
    id: 'proj-11',
    key: 'PROJ-111',
    name: 'Website Maintenance',
    status: 'in_progress',
    duration: 'Nov 30, 2026',
    description:
      'The goal of this project is to improve operational efficiency within the organization by implementing process automation.',
    avatars: [
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
    ],
    moreCount: 3,
  },
  {
    id: 'proj-12',
    key: 'PROJ-112',
    name: 'Product Analytics',
    status: 'complete',
    duration: 'Oct 25, 2026',
    description:
      'The goal of this project is to improve operational efficiency within the organization by implementing process automation.',
    avatars: [
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
    ],
    moreCount: 3,
  },
];

const STATUS_CONFIG = {
  on_hold: {
    label: 'On Hold',
    color: '#F5CD47',
    badgeClass:
      'bg-[#FEF3C7] text-[#D97706] dark:bg-[#3D3319] dark:text-[#F5CD47]',
  },
  in_progress: {
    label: 'In Progress',
    color: '#579DFF',
    badgeClass:
      'bg-[#DBEAFE] text-[#2563EB] dark:bg-[#1C2B41] dark:text-[#579DFF]',
  },
  complete: {
    label: 'Complete',
    color: '#4BCE97',
    badgeClass:
      'bg-[#DCFCE7] text-[#16A34A] dark:bg-[#163828] dark:text-[#4BCE97]',
  },
  cancelled: {
    label: 'Cancelled',
    color: '#F87171',
    badgeClass:
      'bg-[#FEE2E2] text-[#DC2626] dark:bg-[#3B1D1D] dark:text-[#F87171]',
  },
};

export function ManageProjectsView() {
  const { isAdmin, isProjectManager, isTeamMember, canCreateProjects, canManageProjects } = useAuthContext();
  const [projects, setProjects] = useState(() => {
    try {
      const stored = localStorage.getItem('taskflow_manage_projects_list');
      if (stored) return JSON.parse(stored);
    } catch {}
    return INITIAL_PROJECTS;
  });

  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);

  // Form states for new project modal
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectStatus, setNewProjectStatus] = useState('in_progress');
  const [newProjectDuration, setNewProjectDuration] = useState('2026-11-20');
  const [newProjectDesc, setNewProjectDesc] = useState(
    'The goal of this project is to improve operational efficiency within the organization by implementing process automation.'
  );

  const saveProjects = (updated) => {
    setProjects(updated);
    try {
      localStorage.setItem(
        'taskflow_manage_projects_list',
        JSON.stringify(updated)
      );
    } catch {}
  };

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (!canCreateProjects) {
      toast.error('Permission denied: Only Admin and Project Managers can create projects.');
      return;
    }
    if (!newProjectName.trim()) {
      toast.error('Please enter a project title');
      return;
    }

    const created = {
      id: 'proj-' + Date.now(),
      key: 'PROJ-' + (projects.length + 101),
      name: newProjectName.trim(),
      status: newProjectStatus,
      duration: newProjectDuration || 'Nov 20, 2026',
      description:
        newProjectDesc.trim() ||
        'The goal of this project is to improve operational efficiency within the organization by implementing process automation.',
      avatars: [
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
      ],
      moreCount: 3,
    };

    saveProjects([created, ...projects]);
    setIsNewProjectOpen(false);
    setNewProjectName('');
    toast.success(`Project "${created.name}" created successfully!`);
  };

  const handleDeleteProject = (id, name) => {
    if (!canManageProjects) {
      toast.error('Permission denied: You do not have permission to delete projects.');
      return;
    }
    saveProjects(projects.filter((p) => p.id !== id));
    toast.success(`Project "${name}" removed`);
  };

  // Filter and sort logic
  const displayedProjects = useMemo(() => {
    let result = [...projects];

    if (filterStatus !== 'all') {
      result = result.filter((p) => p.status === filterStatus);
    }

    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortBy === 'status') {
      result.sort((a, b) => a.status.localeCompare(b.status));
    }

    return result;
  }, [projects, filterStatus, sortBy]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6 select-none transition-colors duration-150">
      {/* Top Header Row matching Reference Image */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-[#DEE4EA] tracking-tight">
            {isAdmin ? 'All Company Projects' : isProjectManager ? 'Manage Projects' : 'Assigned Projects'}
          </h1>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#9FADBC] mt-1 font-medium">
            <span>Workspace</span>
            <span className="text-slate-400 dark:text-[#738496]">&gt;</span>
            <span className="text-slate-700 dark:text-[#DEE4EA]">
              {isAdmin ? 'All Projects (Admin)' : isProjectManager ? 'Project Manager' : 'Team Member'}
            </span>
          </div>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          {/* Status Filter Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-9 items-center gap-2 px-3.5 rounded-lg border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#161A1D] text-xs font-semibold text-slate-700 dark:text-[#DEE4EA] hover:bg-slate-50 dark:hover:bg-[#22272B] shadow-2xs transition cursor-pointer">
                <span>
                  {filterStatus === 'all'
                    ? 'All Projects'
                    : STATUS_CONFIG[filterStatus]?.label || filterStatus}
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 dark:text-[#738496]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-1 shadow-lg min-w-[150px]"
            >
              {[
                { id: 'all', label: 'All Projects' },
                { id: 'in_progress', label: 'In Progress' },
                { id: 'on_hold', label: 'On Hold' },
                { id: 'complete', label: 'Complete' },
                { id: 'cancelled', label: 'Cancelled' },
              ].map((opt) => (
                <DropdownMenuItem
                  key={opt.id}
                  onClick={() => setFilterStatus(opt.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer ${
                    filterStatus === opt.id
                      ? 'bg-blue-50 text-[#0C66E4] dark:bg-[#1C2B41] dark:text-[#579DFF]'
                      : 'text-slate-700 dark:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#22272B]'
                  }`}
                >
                  <span>{opt.label}</span>
                  {filterStatus === opt.id && <Check className="h-3.5 w-3.5" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex h-9 items-center gap-2 px-3.5 rounded-lg border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#161A1D] text-xs font-semibold text-slate-700 dark:text-[#DEE4EA] hover:bg-slate-50 dark:hover:bg-[#22272B] shadow-2xs transition cursor-pointer">
                <ArrowUpDown className="h-3.5 w-3.5 text-slate-500 dark:text-[#9FADBC]" />
                <span>Sort</span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-400 dark:text-[#738496]" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-1 shadow-lg min-w-[150px]"
            >
              {[
                { id: 'default', label: 'Default' },
                { id: 'name-asc', label: 'Name (A to Z)' },
                { id: 'name-desc', label: 'Name (Z to A)' },
                { id: 'status', label: 'By Status' },
              ].map((s) => (
                <DropdownMenuItem
                  key={s.id}
                  onClick={() => setSortBy(s.id)}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium cursor-pointer ${
                    sortBy === s.id
                      ? 'bg-blue-50 text-[#0C66E4] dark:bg-[#1C2B41] dark:text-[#579DFF]'
                      : 'text-slate-700 dark:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#22272B]'
                  }`}
                >
                  <span>{s.label}</span>
                  {sortBy === s.id && <Check className="h-3.5 w-3.5" />}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* New Project Primary Button - Admin and PM only */}
          {canCreateProjects && (
            <button
              onClick={() => setIsNewProjectOpen(true)}
              className="flex h-9 items-center gap-1.5 px-4 rounded-lg bg-[#0C66E4] hover:bg-[#0055CC] text-white text-xs font-semibold shadow-xs transition active:scale-98 cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
              <span>New Project</span>
            </button>
          )}
        </div>
      </div>

      {/* Projects Responsive Grid (Unified with Column View Card UI) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayedProjects.map((project) => {
          const statusInfo = STATUS_CONFIG[project.status] || {
            label: project.status,
            color: '#579DFF',
            badgeClass: 'bg-slate-100 text-slate-700 dark:bg-[#22272B] dark:text-[#DEE4EA]',
          };

          return (
            <div
              key={project.id}
              className="rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#22272B] p-4 shadow-2xs hover:border-[#0C66E4] dark:hover:border-[#388BFF]/70 hover:shadow-md transition flex flex-col justify-between group cursor-pointer"
            >
              <div>
                {/* Header row: Project Title & More Options */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-slate-900 dark:text-[#DEE4EA] tracking-tight group-hover:text-[#0C66E4] dark:group-hover:text-[#579DFF] transition truncate">
                      {project.name}
                    </h3>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        title="Options"
                        className="p-1 -mr-1 rounded hover:bg-slate-100 dark:hover:bg-[#333C44] text-slate-400 dark:text-[#738496] hover:text-slate-700 dark:hover:text-[#DEE4EA] transition cursor-pointer"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-1 shadow-lg text-xs"
                    >
                      <DropdownMenuItem
                        onClick={() => {}}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-[#22272B] text-slate-700 dark:text-[#DEE4EA]"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>Open Project</span>
                      </DropdownMenuItem>
                      {canManageProjects && (
                        <DropdownMenuItem
                          onClick={() =>
                            handleDeleteProject(project.id, project.name)
                          }
                          className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-red-50 text-red-600 dark:hover:bg-[#3B1D1D] dark:text-[#F87171]"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete Project</span>
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Status Badge with colored dot matching Column View */}
                <div className="mt-2.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 dark:bg-[#161A1D] text-slate-700 dark:text-[#DEE4EA] border border-slate-200/80 dark:border-[#333C44]/50">
                    <span
                      className="h-2 w-2 rounded-full shadow-xs"
                      style={{ backgroundColor: statusInfo.color }}
                    />
                    <span>{statusInfo.label}</span>
                  </span>
                </div>

                {/* Description */}
                <p className="mt-3 text-xs text-slate-500 dark:text-[#9FADBC] leading-relaxed line-clamp-2">
                  {project.description}
                </p>
              </div>

              {/* Card Footer: Key + Duration on Left, Avatars on Right matching Column View */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#282E33]/60 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-[#9FADBC]">
                  <Bookmark className="h-3.5 w-3.5 text-[#4BCE97] fill-[#4BCE97]" />
                  <span>{project.key}</span>
                  <span className="text-slate-300 dark:text-[#333C44]">·</span>
                  <div className="flex items-center gap-1 font-normal text-slate-500 dark:text-[#9FADBC]">
                    <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-[#738496]" />
                    <span>{project.duration}</span>
                  </div>
                </div>

                {/* Right: Team avatars or TR avatar */}
                <div className="flex items-center -space-x-1.5">
                  {project.avatars?.slice(0, 3).map((imgUrl, i) => (
                    <img
                      key={i}
                      src={imgUrl}
                      alt="Team member"
                      className="h-6 w-6 rounded-full border-2 border-white dark:border-[#22272B] object-cover ring-1 ring-slate-100 dark:ring-transparent"
                    />
                  ))}
                  {project.moreCount && (
                    <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-[#333C44] border-2 border-white dark:border-[#22272B] text-[9px] font-bold text-slate-600 dark:text-[#9FADBC]">
                      +{project.moreCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: New Project with DatePicker */}
      {isNewProjectOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in-0 duration-150">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-6 shadow-2xl text-slate-800 dark:text-[#DEE4EA] space-y-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50 text-[#0C66E4] dark:bg-[#1C2B41] dark:text-[#579DFF]">
                  <FolderPlus className="h-4.5 w-4.5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-[#DEE4EA]">
                  Create New Project
                </h3>
              </div>
              <button
                onClick={() => setIsNewProjectOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-[#DEE4EA] text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#DEE4EA] mb-1.5">
                  Project Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mobile Banking Overhaul"
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50 dark:border-[#333C44] dark:bg-[#22272B] px-3 text-xs text-slate-800 dark:text-[#DEE4EA] focus:outline-none focus:border-[#0C66E4] dark:focus:border-[#579DFF]"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#DEE4EA] mb-1.5">
                    Status
                  </label>
                  <select
                    value={newProjectStatus}
                    onChange={(e) => setNewProjectStatus(e.target.value)}
                    className="w-full h-9 rounded-xl border border-slate-200 bg-slate-50 dark:border-[#333C44] dark:bg-[#22272B] px-3 text-xs text-slate-800 dark:text-[#DEE4EA] focus:outline-none focus:border-[#0C66E4] dark:focus:border-[#579DFF]"
                  >
                    <option value="in_progress">In Progress</option>
                    <option value="on_hold">On Hold</option>
                    <option value="complete">Complete</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-[#DEE4EA] mb-1.5">
                    Target Date
                  </label>
                  <DatePicker
                    value={newProjectDuration}
                    onChange={(val) => setNewProjectDuration(val)}
                    placeholder="Select target date"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#DEE4EA] mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={newProjectDesc}
                  onChange={(e) => setNewProjectDesc(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 dark:border-[#333C44] dark:bg-[#22272B] p-3 text-xs text-slate-800 dark:text-[#DEE4EA] focus:outline-none focus:border-[#0C66E4] dark:focus:border-[#579DFF] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewProjectOpen(false)}
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-600 dark:text-[#9FADBC] hover:bg-slate-100 dark:hover:bg-[#22272B] transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-[#0C66E4] hover:bg-[#0055CC] text-xs font-semibold text-white shadow-xs transition cursor-pointer"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageProjectsView;
