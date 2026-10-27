import React, { useState, useEffect } from 'react';
import { Bookmark, Bug, FolderKanban, User, UserCheck } from 'lucide-react';
import { TASK_STATUSES } from '../../lib/constants';
import { DatePicker } from '../ui/date-picker';
import { Select } from '../ui/Select';
import { useWorkspaceContext } from '../../context/WorkspaceContext';
import { useAuthContext } from '../../context/AuthContext';
import { useProjects } from '../../hooks/useProjects';
import { userService } from '../../services/userService';

export function TaskForm({ initialData, onSubmit, onCancel }) {
  const { currentWorkspace } = useWorkspaceContext();
  const { canMarkTaskDone, user, isTeamMember } = useAuthContext();
  const { projects = [] } = useProjects(currentWorkspace?.id);

  const projectManagers = React.useMemo(() => userService.getProjectManagers(), []);
  const teamMembers = React.useMemo(() => userService.getTeamMembers(), []);

  const [projectId, setProjectId] = useState(initialData?.project_id || '');

  useEffect(() => {
    if (!projectId && projects.length > 0) {
      setProjectId(projects[0].id);
    }
  }, [projects, projectId]);

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState(initialData?.status || 'todo');
  const [type, setType] = useState(initialData?.type || 'task');
  const [priority, setPriority] = useState(initialData?.priority || 'medium');
  const [assignee, setAssignee] = useState(() => {
    if (isTeamMember && user?.name) {
      return user.name;
    }
    return initialData?.assignee || 'Unassigned';
  });
  const [reporter, setReporter] = useState(() => {
    if (initialData?.reporter && projectManagers.some((pm) => pm.name === initialData.reporter)) {
      return initialData.reporter;
    }
    if (user?.name && projectManagers.some((pm) => pm.name === user.name)) {
      return user.name;
    }
    return projectManagers[0]?.name || 'Alex Johnson';
  });
  const [startDate, setStartDate] = useState(initialData?.start_date || '');
  const [dueDate, setDueDate] = useState(initialData?.due_date || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const chosenProject = projects.find((p) => p.id === projectId) || projects[0];
    const finalAssignee = isTeamMember
      ? (user?.name || assignee)
      : (assignee === 'Unassigned' ? null : assignee);

    onSubmit({
      project_id: projectId || chosenProject?.id || null,
      project_name: chosenProject?.name || null,
      workspace_id: currentWorkspace?.id,
      title: title.trim(),
      description: description.trim(),
      status,
      type,
      priority,
      assignee: finalAssignee,
      assignee_id: isTeamMember ? (user?.id || null) : null,
      reporter: user?.name || reporter || 'Admin',
      reporter_id: user?.id || null,
      created_by: initialData?.created_by || user?.name || 'Admin',
      created_by_id: initialData?.created_by_id || user?.id || null,
      created_by_email: initialData?.created_by_email || (user?.email ? user.email.toLowerCase() : null),
      created_by_role: initialData?.created_by_role || user?.role || 'team_member',
      start_date: startDate || null,
      due_date: dueDate || null,
    });
  };

  const currentProjectName =
    projects.find((p) => p.id === projectId)?.name ||
    projects[0]?.name ||
    initialData?.project_name ||
    'Project';

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs text-slate-900 dark:text-[#DEE4EA]">
      {/* Project & Issue Type Row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-[#9FADBC] mb-1">
            Project
          </label>
          {projects.length > 1 ? (
            <Select
              value={projectId || projects[0]?.id || ''}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full h-9"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-slate-50 dark:bg-[#1D2125] border border-slate-200 dark:border-[#333C44] text-xs font-medium text-slate-800 dark:text-[#DEE4EA]">
              <FolderKanban className="h-4 w-4 text-[#0C66E4] dark:text-[#579DFF] stroke-[1.8]" />
              <span className="truncate">{currentProjectName}</span>
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-[#9FADBC] mb-1">
            Issue Type
          </label>
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full h-9"
          >
            <option value="task">Task</option>
            <option value="story">Story</option>
            <option value="bug">Bug</option>
          </Select>
        </div>
      </div>

      {/* Summary / Title */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-[#9FADBC] mb-1">
          Summary *
        </label>
        <input
          required
          autoFocus
          type="text"
          placeholder="e.g. Implement user authentication workflow"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md bg-white dark:bg-[#1D2125] border border-slate-200 dark:border-[#333C44] px-3 py-2 text-xs text-slate-900 dark:text-[#DEE4EA] placeholder-slate-400 dark:placeholder-[#738496] focus:outline-none focus:border-[#0C66E4] dark:focus:border-[#579DFF]"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-slate-700 dark:text-[#9FADBC] mb-1">
          Description
        </label>
        <textarea
          rows={3}
          placeholder="Add detailed task notes or acceptance criteria..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md bg-white dark:bg-[#1D2125] border border-slate-200 dark:border-[#333C44] p-3 text-xs text-slate-900 dark:text-[#DEE4EA] placeholder-slate-400 dark:placeholder-[#738496] focus:outline-none focus:border-[#0C66E4] dark:focus:border-[#579DFF]"
        />
      </div>

      {/* Assignee & Reporter Row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-[#9FADBC] mb-1">
            Assignee (Team Member)
          </label>
          <Select
            value={isTeamMember ? (user?.name || assignee) : assignee}
            onChange={(e) => setAssignee(e.target.value)}
            disabled={isTeamMember}
            className={`w-full h-9 ${isTeamMember ? 'opacity-85 cursor-not-allowed bg-slate-50 dark:bg-[#1D2125]' : ''}`}
          >
            {isTeamMember ? (
              <option value={user?.name || assignee}>
                {user?.name || assignee} (You)
              </option>
            ) : (
              <>
                <option value="Unassigned">Unassigned</option>
                {teamMembers.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </>
            )}
          </Select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-[#9FADBC] mb-1">
            Reporter (Project Manager)
          </label>
          <Select
            value={reporter}
            onChange={(e) => setReporter(e.target.value)}
            className="w-full h-9"
          >
            {projectManagers.map((u) => (
              <option key={u.id} value={u.name}>
                {u.name} ({u.role === 'admin' ? 'Admin' : 'Project Manager'})
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Status & Priority Row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-[#9FADBC] mb-1">
            Status
          </label>
          <Select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full h-9"
          >
            {TASK_STATUSES.filter(
              (s) => canMarkTaskDone || s.id !== 'done' || initialData?.status === 'done'
            ).map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-[#9FADBC] mb-1">
            Priority
          </label>
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full h-9 capitalize"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </Select>
        </div>
      </div>

      {/* Dates: Start Date & Due Date */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-[#9FADBC] mb-1">
            Start Date
          </label>
          <DatePicker
            value={startDate}
            onChange={(val) => setStartDate(val)}
            placeholder="Select start date"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-[#9FADBC] mb-1">
            Due Date
          </label>
          <DatePicker
            value={dueDate}
            onChange={(val) => setDueDate(val)}
            placeholder="Select due date"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-[#282E33]">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-[#282E33] text-xs font-semibold text-slate-700 dark:text-[#DEE4EA] transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-1.5 rounded-md bg-[#0C66E4] hover:bg-[#0055CC] text-xs font-semibold text-white shadow-xs transition cursor-pointer"
        >
          {initialData?.id ? 'Save Changes' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
