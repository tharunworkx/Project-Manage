import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Plus,
  Calendar,
  MoreVertical,
  MoreHorizontal,
  Zap,
  ArrowUpDown,
  ChevronDown,
  Check,
  ExternalLink,
  Trash2,
  FolderPlus,
  Bookmark,
  User,
  FolderCode,
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DatePicker } from '../ui/date-picker';
import { useAuthContext } from '../../context/AuthContext';
import { useWorkspaceContext } from '../../context/WorkspaceContext';
import { CreateProjectModal } from './CreateProjectModal';
import { ProjectDetailModal } from './ProjectDetailModal';
import { projectService, isProjectAssignedToEmail } from '../../services/projectService';
import { userService } from '../../services/userService';
import { ConfirmDialog } from '../common/ConfirmDialog';
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyMedia,
} from '@/components/ui/empty';

const STATUS_CONFIG = {
  on_hold: {
    label: 'On Hold',
    color: '#F5CD47',
    badgeClass:
      'bg-slate-100 text-slate-900 dark:bg-[#22272B] dark:text-white border border-slate-200/80 dark:border-[#333C44]',
  },
  in_progress: {
    label: 'In Progress',
    color: '#579DFF',
    badgeClass:
      'bg-slate-100 text-slate-900 dark:bg-[#22272B] dark:text-white border border-slate-200/80 dark:border-[#333C44]',
  },
  complete: {
    label: 'Complete',
    color: '#4BCE97',
    badgeClass:
      'bg-slate-100 text-slate-900 dark:bg-[#22272B] dark:text-white border border-slate-200/80 dark:border-[#333C44]',
  },
  cancelled: {
    label: 'Cancelled',
    color: '#F87171',
    badgeClass:
      'bg-slate-100 text-slate-900 dark:bg-[#22272B] dark:text-white border border-slate-200/80 dark:border-[#333C44]',
  },
};

export function ManageProjectsView() {
  const { user, isAdmin, isProjectManager, isTeamMember, canCreateProjects, canManageProjects } = useAuthContext();
  const { currentWorkspace } = useWorkspaceContext();
  const [projects, setProjects] = useState(() => {
    try {
      const stored = localStorage.getItem('taskflow_manage_projects_list_v4');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.filter(
            (p) =>
              !p.id?.toString().startsWith('SRS-') &&
              !p.id?.toString().startsWith('00000000-0000-0000-0000-000000000') &&
              !['proj-101', 'proj-102', 'proj-201', 'proj-301', 'proj-302'].includes(p.id)
          );
        }
      }
    } catch {}
    return projectService.getInitialProjects();
  });

  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('default');
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectToDelete, setProjectToDelete] = useState(null);

  // Sync projects with Supabase whenever active workspace changes
  useEffect(() => {
    let isMounted = true;
    projectService.fetchProjects(currentWorkspace?.id).then((data) => {
      if (isMounted) {
        setProjects(data || []);
      }
    });
    return () => {
      isMounted = false;
    };
  }, [currentWorkspace?.id]);

  const saveProjects = (updated) => {
    setProjects(updated);
    try {
      localStorage.setItem(
        'taskflow_manage_projects_list_v4',
        JSON.stringify(updated)
      );
    } catch {}
  };

  const handleCreateProject = async (createdProject) => {
    if (!canCreateProjects) {
      return;
    }
    const withWs = {
      workspace_id: currentWorkspace?.id,
      ...createdProject,
    };
    try {
      const saved = await projectService.createProject(withWs);
      setProjects((prev) => [saved, ...prev.filter((p) => p.id !== saved.id)]);
      setIsNewProjectOpen(false);
      toast.success(`Project "${saved.name}" created successfully!`);
    } catch (err) {
      console.error('Create project error:', err);
      toast.error(err?.message || 'Failed to create project');
    }
  };

  const handleDeleteProject = (id, name) => {
    if (!canManageProjects) {
      return;
    }
    setProjectToDelete({ id, name });
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      await projectService.deleteProject(projectToDelete.id);
      setProjects((prev) => prev.filter((p) => p.id !== projectToDelete.id));
      if (selectedProject?.id === projectToDelete.id) {
        setSelectedProject(null);
      }
      toast.success(`Project "${projectToDelete.name || 'Project'}" deleted`);
    } catch (err) {
      console.error('Delete project error:', err);
    } finally {
      setProjectToDelete(null);
    }
  };

  const handleUpdateProjectStatus = (projectId, newStatus) => {
    const updated = projects.map((p) =>
      p.id === projectId ? { ...p, status: newStatus } : p
    );
    saveProjects(updated);
    projectService.updateProject(projectId, { status: newStatus });
    if (selectedProject?.id === projectId) {
      setSelectedProject((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  // Helper to render real project member profile badges instead of Unsplash stock images
  const renderProjectMembers = (proj) => {
    const allUsers = userService.getUsers();
    let membersList = [];

    if (Array.isArray(proj.members) && proj.members.length > 0) {
      membersList = proj.members
        .map((m) => {
          if (typeof m === 'object' && m !== null) {
            const matched = allUsers.find((u) => u.id === m.id || u.email === m.email);
            return matched || m;
          }
          return allUsers.find((u) => u.id === m || u.employee_id === m) || { id: m, name: String(m) };
        })
        .filter(Boolean);
    } else if (Array.isArray(proj.member_ids) && proj.member_ids.length > 0) {
      membersList = proj.member_ids
        .map((id) => allUsers.find((u) => u.id === id || u.employee_id === id))
        .filter(Boolean);
    } else if (Array.isArray(proj.memberIds) && proj.memberIds.length > 0) {
      membersList = proj.memberIds
        .map((id) => allUsers.find((u) => u.id === id || u.employee_id === id))
        .filter(Boolean);
    } else if (proj.project_manager_id) {
      const pm = allUsers.find((u) => u.id === proj.project_manager_id || u.employee_id === proj.project_manager_id);
      if (pm) membersList = [pm];
    }

    if (membersList.length === 0) {
      return (
        <span className="text-[10px] text-slate-400 dark:text-[#738496] italic">
          No members
        </span>
      );
    }

    const visible = membersList.slice(0, 3);
    const extraCount = membersList.length > 3 ? membersList.length - 3 : 0;

    return (
      <div className="flex items-center -space-x-1.5">
        {visible.map((mem, idx) => {
          const initials =
            mem.avatar ||
            (mem.name
              ? mem.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase()
              : 'TR');
          const color = mem.color || '#7C3AED';

          if (mem.avatar_url && !mem.avatar_url.includes('unsplash.com')) {
            return (
              <img
                key={mem.id || idx}
                src={mem.avatar_url}
                alt={mem.name || 'Member'}
                title={mem.name || 'Team member'}
                className="h-6 w-6 rounded-full border-2 border-white dark:border-[#161A1D] object-cover shadow-xs"
              />
            );
          }

          return (
            <div
              key={mem.id || idx}
              title={mem.name || 'Team member'}
              className="h-6 w-6 rounded-full flex items-center justify-center font-bold text-[9px] text-white border-2 border-white dark:border-[#161A1D] shadow-xs shrink-0 select-none"
              style={{ backgroundColor: color }}
            >
              {initials}
            </div>
          );
        })}
        {extraCount > 0 && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-100 dark:bg-[#282E33] border-2 border-white dark:border-[#161A1D] text-[9px] font-bold text-slate-600 dark:text-[#9FADBC] shadow-xs">
            +{extraCount}
          </div>
        )}
      </div>
    );
  };

  // Filter and sort logic - partitioned by active workspace
  const displayedProjects = useMemo(() => {
    let result = projects.filter(
      (p) => !p.workspace_id || p.workspace_id === currentWorkspace?.id
    );

    // If Team Member role, only show projects assigned to this member verified by email/ID
    if (isTeamMember) {
      result = result.filter((p) => isProjectAssignedToEmail(p, user?.email, user?.id));
    }

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
  }, [projects, filterStatus, sortBy, currentWorkspace?.id, isTeamMember, user?.email, user?.id]);

  return (
    <div className="w-full px-6 sm:px-8 py-6 space-y-6 select-none transition-colors duration-150">
      {/* Top Header Row matching Reference Image */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-[#DEE4EA] tracking-tight">
            {isAdmin ? 'All Company Projects' : isProjectManager ? 'Manage Projects' : 'Assigned Projects'}
          </h1>
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

          {/* New Project Primary Button - hidden when projects are empty */}
          {canCreateProjects && displayedProjects.length > 0 && (
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

      {/* Projects Responsive Grid or Empty State matching Image */}
      {displayedProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-[52vh] py-16">
          <Empty className="max-w-md w-full border-0 bg-transparent">
            <EmptyHeader>
              <EmptyMedia
                variant="icon"
                className="h-14 w-14 rounded-2xl bg-[#181B1F] dark:bg-[#181B1F] border border-slate-700/60 shadow-lg mb-2"
              >
                <FolderCode className="h-7 w-7 text-white stroke-[1.8]" />
              </EmptyMedia>
              <EmptyTitle className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white mt-1">
                {isTeamMember ? 'No Assigned Projects' : 'No Projects Yet'}
              </EmptyTitle>
              <EmptyDescription className="text-sm text-slate-500 dark:text-[#9FADBC] max-w-sm text-center leading-relaxed mt-1">
                {isTeamMember
                  ? 'You do not have any projects assigned to you in this workspace yet. Your project manager or administrator will assign you projects.'
                  : "You haven't created any projects yet.\nGet started by creating your first project."}
              </EmptyDescription>
            </EmptyHeader>
            {canCreateProjects && (
              <EmptyContent>
                <div className="flex items-center justify-center mt-3 w-full">
                  <button
                    type="button"
                    onClick={() => setIsNewProjectOpen(true)}
                    className="inline-flex items-center gap-2 bg-[#0C66E4] hover:bg-[#0055CC] text-white px-5 py-2.5 rounded-xl font-semibold text-sm shadow-md transition active:scale-95 cursor-pointer"
                  >
                    <Plus className="h-4 w-4 stroke-[2.5]" />
                    <span>Create Project</span>
                  </button>
                </div>
              </EmptyContent>
            )}
          </Empty>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
        {displayedProjects.map((project) => {
          const statusInfo = STATUS_CONFIG[project.status] || {
            label: project.status || 'In Progress',
            color: '#579DFF',
            badgeClass: 'bg-slate-100 text-slate-900 dark:bg-[#22272B] dark:text-white border border-slate-200/80 dark:border-[#333C44]',
          };

          return (
            <div
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="group rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-5 shadow-xs hover:border-[#0C66E4] dark:hover:border-[#579DFF] hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header: Status badge, Key & More options */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusInfo.badgeClass}`}>
                    <span
                      className="h-1.5 w-1.5 rounded-full shrink-0 shadow-xs"
                      style={{ backgroundColor: statusInfo.color }}
                    />
                    <span>{statusInfo.label}</span>
                  </span>

                  <div className="flex items-center gap-1.5">
                    {project.key && (
                      <span className="font-mono text-[11px] font-semibold text-slate-500 dark:text-[#9FADBC] px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#22272B]">
                        {project.key}
                      </span>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          title="Options"
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-[#22272B] text-slate-400 hover:text-slate-700 dark:text-[#738496] dark:hover:text-[#DEE4EA] transition cursor-pointer"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-1 shadow-lg text-xs z-50"
                      >
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedProject(project);
                          }}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-[#22272B] text-slate-700 dark:text-[#DEE4EA]"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>View Project Details</span>
                        </DropdownMenuItem>
                        {canManageProjects && (
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.id, project.name);
                            }}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-red-50 text-red-600 dark:hover:bg-[#3B1D1D] dark:text-[#F87171]"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Delete Project</span>
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Project Title */}
                <h3 className="text-base font-bold text-slate-900 dark:text-[#DEE4EA] tracking-tight group-hover:text-[#0C66E4] dark:group-hover:text-[#579DFF] transition-colors line-clamp-1">
                  {project.name}
                </h3>

                {/* Description */}
                <p className="text-xs sm:text-[13px] text-slate-500 dark:text-[#9FADBC] leading-relaxed line-clamp-2 mt-1.5 min-h-[36px]">
                  {project.description || 'No description provided.'}
                </p>

                {/* Tags / Metadata */}
                {(project.client || project.tag || project.budget) && (
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    {project.client && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-[#22272B] border border-slate-200/80 dark:border-[#333C44] text-slate-900 dark:text-white">
                        {project.client}
                      </span>
                    )}
                    {project.tag && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-[#22272B] border border-slate-200/80 dark:border-[#333C44] text-slate-900 dark:text-white">
                        {project.tag}
                      </span>
                    )}
                    {project.budget && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-[#22272B] border border-slate-200/80 dark:border-[#333C44] text-slate-900 dark:text-white">
                        {project.budget}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Sub-footer: Date & Team Avatars */}
              <div className="pt-3.5 mt-4 border-t border-slate-100 dark:border-[#22272B] flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-[#738496]">
                  <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-[#738496]" />
                  <span>{project.duration || 'No date set'}</span>
                </div>

                <div className="shrink-0">
                  {renderProjectMembers(project)}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      )}

      {/* Modal: Create New Project matching User Design Image */}
      <CreateProjectModal
        isOpen={isNewProjectOpen}
        onClose={() => setIsNewProjectOpen(false)}
        onCreate={handleCreateProject}
      />

      {/* Modal: Project Details Popup when clicking any project card */}
      <ProjectDetailModal
        project={selectedProject}
        isOpen={Boolean(selectedProject)}
        onClose={() => setSelectedProject(null)}
        onUpdateStatus={handleUpdateProjectStatus}
        onDelete={handleDeleteProject}
        canManageProjects={canManageProjects}
      />

      {/* Custom In-app Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!projectToDelete}
        onClose={() => setProjectToDelete(null)}
        onConfirm={confirmDeleteProject}
        title="Delete Project"
        description={`Are you sure you want to permanently delete project "${projectToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Project"
      />
    </div>
  );
}

export default ManageProjectsView;
