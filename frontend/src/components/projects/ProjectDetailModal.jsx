import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  Calendar,
  Building2,
  DollarSign,
  Clock,
  Tag as TagIcon,
  ShieldCheck,
  Briefcase,
  UserCheck,
  Bookmark,
  ExternalLink,
  Trash2,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { userService } from '../../services/userService';
import { Select } from '../ui/Select';
import { ConfirmDialog } from '../common/ConfirmDialog';

const STATUS_CONFIG = {
  on_hold: {
    label: 'On Hold',
    color: '#F5CD47',
    badgeClass: 'bg-[#FEF3C7] text-[#D97706] dark:bg-[#3D3319] dark:text-[#F5CD47]',
  },
  in_progress: {
    label: 'In Progress',
    color: '#579DFF',
    badgeClass: 'bg-[#DBEAFE] text-[#2563EB] dark:bg-[#1C2B41] dark:text-[#579DFF]',
  },
  complete: {
    label: 'Complete',
    color: '#4BCE97',
    badgeClass: 'bg-[#DCFCE7] text-[#16A34A] dark:bg-[#163828] dark:text-[#4BCE97]',
  },
  cancelled: {
    label: 'Cancelled',
    color: '#F87171',
    badgeClass: 'bg-[#FEE2E2] text-[#DC2626] dark:bg-[#3B1D1D] dark:text-[#F87171]',
  },
};

export function ProjectDetailModal({
  project,
  isOpen,
  onClose,
  onUpdateStatus,
  onDelete,
  canManageProjects,
}) {
  const navigate = useNavigate();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (!isOpen || !project) return null;

  const allUsers = userService.getUsers();

  // Find project manager
  const projectManager =
    (project.project_manager_id
      ? allUsers.find((u) => u.id === project.project_manager_id || u.employee_id === project.project_manager_id)
      : null) ||
    (project.projectManagerId ? allUsers.find((u) => u.id === project.projectManagerId) : null) ||
    (project.projectManager
      ? typeof project.projectManager === 'object'
        ? project.projectManager
        : allUsers.find((u) => u.name === project.projectManager)
      : null) ||
    null;

  // Find assigned team members
  let assignedMembers = [];
  const memberIdList = project.member_ids || project.memberIds || [];

  if (Array.isArray(project.members) && project.members.length > 0) {
    assignedMembers = project.members
      .map((m) => {
        if (typeof m === 'object' && m !== null) {
          const matched = allUsers.find((u) => u.id === m.id || u.email === m.email);
          return matched || m;
        }
        return allUsers.find((u) => u.id === m || u.employee_id === m) || { id: m, name: String(m) };
      })
      .filter(Boolean);
  } else if (Array.isArray(memberIdList) && memberIdList.length > 0) {
    assignedMembers = memberIdList
      .map((id) => allUsers.find((u) => u.id === id || u.employee_id === id))
      .filter(Boolean);
  }

  const statusInfo = STATUS_CONFIG[project.status] || {
    label: project.status || 'Active',
    color: '#579DFF',
    badgeClass: 'bg-blue-50 text-[#0C66E4] dark:bg-[#1C2B41] dark:text-[#579DFF]',
  };

  const handleOpenBoard = () => {
    onClose();
    navigate('/kanban');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs select-none animate-in fade-in-0 duration-150">
      <div className="w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] text-slate-900 dark:text-[#DEE4EA] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {project.imageUrl ? (
              <img
                src={project.imageUrl}
                alt={project.name}
                className="h-10 w-10 rounded-xl object-cover border border-slate-200 dark:border-[#333C44] shrink-0 shadow-xs"
              />
            ) : (
              <div className="h-10 w-10 rounded-xl bg-slate-100 dark:bg-[#22272B] text-slate-800 dark:text-[#DEE4EA] flex items-center justify-center font-bold text-sm shrink-0 border border-slate-200 dark:border-[#333C44] shadow-xs">
                {project.key?.substring(0, 4) || 'PRJ'}
              </div>
            )}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 dark:text-[#9FADBC]">
                  <Bookmark className="h-3 w-3 stroke-[2]" />
                  <span>{project.key || 'PROJ'}</span>
                </span>
                <span className="text-slate-300 dark:text-[#333C44]">·</span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-[#22272B] text-slate-800 dark:text-[#DEE4EA] border border-slate-200/80 dark:border-[#333C44]">
                  <span
                    className="h-1.5 w-1.5 rounded-full shrink-0 shadow-xs"
                    style={{ backgroundColor: statusInfo.color || '#579DFF' }}
                  />
                  <span>{statusInfo.label}</span>
                </span>
              </div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-[#DEE4EA] truncate leading-tight mt-0.5">
                {project.name}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            title="Close popup"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#22272B] transition cursor-pointer shrink-0 ml-2"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
          {/* Key Metric Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Client */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#22272B]/60 border border-slate-200/80 dark:border-[#333C44]/50">
              <span className="text-[10px] font-bold text-slate-400 dark:text-[#738496] uppercase tracking-wider block mb-1">
                Client
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-[#DEE4EA] truncate">
                <Building2 className="h-3.5 w-3.5 text-slate-400 dark:text-[#738496] shrink-0" />
                <span className="truncate">{project.client || 'Southern Rescue Services'}</span>
              </div>
            </div>

            {/* Timeline */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#22272B]/60 border border-slate-200/80 dark:border-[#333C44]/50">
              <span className="text-[10px] font-bold text-slate-400 dark:text-[#738496] uppercase tracking-wider block mb-1">
                Timeline
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-[#DEE4EA] truncate">
                <Calendar className="h-3.5 w-3.5 text-slate-400 dark:text-[#738496] shrink-0" />
                <span className="truncate">{project.duration || project.end_date || 'Ongoing'}</span>
              </div>
            </div>

            {/* Budget */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#22272B]/60 border border-slate-200/80 dark:border-[#333C44]/50">
              <span className="text-[10px] font-bold text-slate-400 dark:text-[#738496] uppercase tracking-wider block mb-1">
                Budget
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-[#DEE4EA] truncate">
                <DollarSign className="h-3.5 w-3.5 text-slate-400 dark:text-[#738496] shrink-0" />
                <span className="truncate">{project.budget ? `$${project.budget}` : '$45,000'}</span>
              </div>
            </div>

            {/* Estimated Hours */}
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#22272B]/60 border border-slate-200/80 dark:border-[#333C44]/50">
              <span className="text-[10px] font-bold text-slate-400 dark:text-[#738496] uppercase tracking-wider block mb-1">
                Est. Hours
              </span>
              <div className="flex items-center gap-1.5 font-semibold text-slate-800 dark:text-[#DEE4EA] truncate">
                <Clock className="h-3.5 w-3.5 text-slate-400 dark:text-[#738496] shrink-0" />
                <span className="truncate">
                  {project.estimatedHours ? `${project.estimatedHours} hrs` : '180 hrs'}
                </span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-[#22272B]/40 border border-slate-200/80 dark:border-[#333C44]/40">
            <h4 className="text-xs font-bold text-slate-800 dark:text-[#DEE4EA] mb-1.5 flex items-center gap-1.5">
              <span>About Project</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-[#9FADBC] leading-relaxed">
              {project.description ||
                'The goal of this project is to improve operational efficiency within the organization by implementing process automation and agile delivery.'}
            </p>
          </div>

          {/* People & Roles: Project Manager + Assigned Employees */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project Manager Card */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-[#333C44]/60 bg-white dark:bg-[#1E2327]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-slate-400 dark:text-[#738496] uppercase tracking-wider">
                  Project Manager
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#282E33] text-slate-700 dark:text-[#DEE4EA] border border-slate-200/80 dark:border-[#333C44]">
                  <Briefcase className="h-3 w-3 text-slate-400 dark:text-[#738496]" />
                  <span>Lead</span>
                </span>
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="h-9 w-9 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: projectManager?.color || '#0C66E4' }}
                >
                  {projectManager?.avatar || projectManager?.name?.substring(0, 2).toUpperCase() || 'PM'}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 dark:text-[#DEE4EA] text-xs truncate">
                    {projectManager?.name || 'Project Manager'}
                  </p>
                  <p className="text-[11px] text-slate-400 dark:text-[#738496] truncate">
                    {projectManager?.email || 'manager@company.com'}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Change Selector (if allowed) */}
            <div className="p-3.5 rounded-xl border border-slate-200 dark:border-[#333C44]/60 bg-white dark:bg-[#1E2327] flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-[#738496] uppercase tracking-wider block mb-1.5">
                  Update Project Status
                </span>
                <Select
                  value={project.status || 'in_progress'}
                  onChange={(e) => onUpdateStatus?.(project.id, e.target.value)}
                  className="w-full h-9 bg-slate-50 dark:bg-[#22272B]"
                >
                  <option value="in_progress">In Progress</option>
                  <option value="on_hold">On Hold</option>
                  <option value="complete">Complete</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-[#738496] mt-2 block">
                Status changes are updated immediately across team boards.
              </span>
            </div>
          </div>

          {/* Assigned Team Members / Employees */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-800 dark:text-[#DEE4EA] flex items-center gap-1.5">
                <UserCheck className="h-4 w-4 text-slate-400 dark:text-[#738496]" />
                <span>Assigned Team Members ({assignedMembers.length})</span>
              </h4>
            </div>

            {assignedMembers.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-[#738496] italic p-3 rounded-xl bg-slate-50 dark:bg-[#22272B]/60 border border-slate-200/60 dark:border-[#333C44]/40">
                No team members assigned to this project.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {assignedMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 dark:bg-[#22272B]/60 border border-slate-200/60 dark:border-[#333C44]/40"
                  >
                    <div
                      className="h-7 w-7 rounded-full flex items-center justify-center font-bold text-[10px] text-white shrink-0 shadow-2xs"
                      style={{ backgroundColor: member.color || '#10B981' }}
                    >
                      {member.avatar || member.name?.substring(0, 2).toUpperCase() || 'U'}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-slate-800 dark:text-[#DEE4EA] text-xs truncate">
                        {member.name}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-[#738496] truncate">
                        {member.email}
                      </p>
                    </div>
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-[#333C44] text-slate-600 dark:text-[#9FADBC] capitalize shrink-0">
                      {member.role?.replace('_', ' ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Tags */}
          {project.tag && (
            <div>
              <span className="text-[10px] font-bold text-slate-400 dark:text-[#738496] uppercase tracking-wider block mb-1.5">
                Project Tag
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 dark:bg-[#22272B] text-slate-800 dark:text-[#DEE4EA] border border-slate-200 dark:border-[#333C44]">
                <TagIcon className="h-3.5 w-3.5 text-slate-400 dark:text-[#738496]" />
                <span>{project.tag}</span>
              </span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] shrink-0">
          <div>
            {canManageProjects && (
              <button
                type="button"
                onClick={() => setIsDeleteDialogOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-[#3B1D1D] dark:text-[#F87171] transition cursor-pointer"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>Delete</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-[#2C333A] dark:hover:bg-[#353D45] text-slate-700 dark:text-[#DEE4EA] transition cursor-pointer"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleOpenBoard}
              className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#0C66E4] hover:bg-[#0055CC] text-xs font-semibold text-white shadow-xs transition cursor-pointer"
            >
              <span>Open in Kanban</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={() => {
            onDelete?.(project.id, project.name);
            onClose();
          }}
          title="Delete Project"
          description={`Are you sure you want to delete project "${project.name}"? This action cannot be undone.`}
          confirmText="Delete Project"
        />
      </div>
    </div>
  );
}

export default ProjectDetailModal;
