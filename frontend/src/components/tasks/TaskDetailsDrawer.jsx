import React, { useState } from 'react';
import {
  X,
  Share2,
  MoreHorizontal,
  Trash2,
  Calendar,
  User,
  MessageSquare,
  Send,
  Bookmark,
  Bug,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { DatePicker } from '../ui/date-picker';
import { Select } from '../ui/Select';
import { useAuthContext } from '../../context/AuthContext';
import { useWorkspaceContext } from '../../context/WorkspaceContext';
import { userService } from '../../services/userService';
import { ConfirmDialog } from '../common/ConfirmDialog';

export function TaskDetailsDrawer({ task, isOpen = true, onClose, onUpdate, onDelete }) {
  if (isOpen === false || !task) return null;

  const { canDeleteTasks, canManageTaskMetadata, canMarkTaskDone } = useAuthContext();
  const { currentWorkspace } = useWorkspaceContext();
  const projectManagers = React.useMemo(() => userService.getProjectManagers(), []);
  const teamMembers = React.useMemo(() => userService.getTeamMembers(), []);

  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status || 'todo');
  const [priority, setPriority] = useState(task.priority || 'medium');
  const [type, setType] = useState(task.type || 'task');
  const [assignee, setAssignee] = useState(task.assignee || 'Unassigned');
  const [reporter, setReporter] = useState(task.reporter || 'Tharun R');
  const [startDate, setStartDate] = useState(task.start_date || '');
  const [dueDate, setDueDate] = useState(task.due_date || '');

  React.useEffect(() => {
    if (task) {
      setTitle(task.title || '');
      setDescription(task.description || '');
      setStatus(task.status || 'todo');
      setPriority(task.priority || 'medium');
      setType(task.type || 'task');
      setAssignee(task.assignee || 'Unassigned');
      setReporter(task.reporter || 'Tharun R');
      setStartDate(task.start_date || '');
      setDueDate(task.due_date || '');
    }
  }, [task?.id, task?.title, task?.status, task?.priority, task?.assignee]);

  const [comments, setComments] = useState([
    { id: 1, author: 'Tharun S.', text: 'Created this deliverable for the sprint.', time: '2h ago' },
  ]);
  const [newComment, setNewComment] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleFieldChange = (field, value) => {
    const updates = { [field]: value };
    if (onUpdate) {
      onUpdate(updates, task.id);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      { id: Date.now(), author: 'TR', text: newComment.trim(), time: 'Just now' },
    ]);
    setNewComment('');
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(true);
  };

  const statusOptions = [
    { id: 'backlog', label: 'Backlog', color: 'bg-slate-100 dark:bg-[#22272B] text-slate-700 dark:text-[#738496] border-slate-200 dark:border-[#333C44]' },
    { id: 'todo', label: 'To Do', color: 'bg-blue-50 dark:bg-[#1C2B41] text-[#0C66E4] dark:text-[#579DFF] border-blue-200/80 dark:border-[#579DFF]/40' },
    { id: 'in_progress', label: 'In Progress', color: 'bg-amber-50 dark:bg-[#3F3112] text-amber-700 dark:text-[#F5CD47] border-amber-200/80 dark:border-[#F5CD47]/40' },
    { id: 'in_review', label: 'Review', color: 'bg-purple-50 dark:bg-[#282240] text-purple-700 dark:text-[#9F8FEF] border-purple-200/80 dark:border-[#9F8FEF]/40' },
    { id: 'done', label: 'Done', color: 'bg-emerald-50 dark:bg-[#163828] text-emerald-700 dark:text-[#4BCE97] border-emerald-200/80 dark:border-[#4BCE97]/40' },
    { id: 'cancelled', label: 'Cancelled', color: 'bg-rose-50 dark:bg-[#3C1E22] text-rose-700 dark:text-[#F87171] border-rose-200/80 dark:border-[#F87171]/40' },
  ];

  return (
    <div className="fixed inset-0 top-14 z-50 flex justify-end select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 top-14 bg-black/40 dark:bg-black/60 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <div className="relative w-full max-w-2xl h-full bg-white dark:bg-[#1D2125] border-l border-slate-200 dark:border-[#282E33] text-slate-900 dark:text-[#DEE4EA] p-6 overflow-y-auto flex flex-col z-50 shadow-2xl animate-slide-in-right">
        {/* Top bar header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-[#282E33]">
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-[#9FADBC]">
            <span className="hover:underline cursor-pointer font-medium">{task.project_name || currentWorkspace?.name || 'Project'}</span>
            <span className="text-slate-400 dark:text-[#738496]">/</span>
            <span className="font-bold text-[#0C66E4] dark:text-[#579DFF]">{task.key || `KAN-${task.id}`}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-500 dark:text-[#9FADBC]">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
              title="Share"
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#282E33] hover:text-slate-900 dark:hover:text-[#DEE4EA] cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
            </button>
            {canDeleteTasks && (
              <button
                onClick={handleDelete}
                title="Delete issue"
                className="p-1.5 rounded hover:bg-rose-50 dark:hover:bg-[#282E33] hover:text-rose-600 dark:hover:text-rose-400 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              title="Close drawer"
              className="p-1.5 rounded hover:bg-slate-100 dark:hover:bg-[#282E33] hover:text-slate-900 dark:hover:text-[#DEE4EA] cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="mt-5 flex-1 space-y-6">
          {/* Title */}
          <div>
            <input
              type="text"
              value={title}
              readOnly={!canManageTaskMetadata}
              onChange={(e) => {
                if (!canManageTaskMetadata) return;
                setTitle(e.target.value);
                handleFieldChange('title', e.target.value);
              }}
              className={`w-full text-xl font-bold bg-transparent text-slate-900 dark:text-[#DEE4EA] border border-transparent ${
                canManageTaskMetadata ? 'hover:border-slate-300 dark:hover:border-[#333C44] focus:border-[#0C66E4] dark:focus:border-[#579DFF] focus:bg-slate-50 dark:focus:bg-[#22272B]' : 'cursor-default'
              } rounded-md px-2 py-1 focus:outline-none transition`}
            />
          </div>

          {/* Quick Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 p-3.5 rounded-xl bg-slate-50 dark:bg-[#161A1D] border border-slate-200 dark:border-[#282E33] text-xs">
            {/* Status Dropdown - Available to all roles including Team Members */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-[#738496] block mb-1">Status</span>
              <Select
                disabled={status === 'done' && !canMarkTaskDone}
                value={status}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  if ((newStatus === 'done' || status === 'done') && !canMarkTaskDone) {
                    toast.error('Only Project Managers and Admins can review and make tasks Done.');
                    return;
                  }
                  setStatus(newStatus);
                  handleFieldChange('status', newStatus);
                }}
                className={`w-full h-8 px-2 py-1 text-xs font-semibold ${
                  status === 'done' && !canMarkTaskDone ? 'opacity-80 cursor-not-allowed' : ''
                }`}
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">Review</option>
                {(canMarkTaskDone || status === 'done') && <option value="done">Done</option>}
              </Select>
            </div>

            {/* Issue Type */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-[#738496] block mb-1">Issue Type</span>
              <Select
                disabled={!canManageTaskMetadata}
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  handleFieldChange('type', e.target.value);
                }}
                className={`w-full h-8 px-2 py-1 text-xs font-medium ${
                  !canManageTaskMetadata ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <option value="task">Task</option>
                <option value="story">Story</option>
                <option value="bug">Bug</option>
              </Select>
            </div>

            {/* Priority */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-[#738496] block mb-1">Priority</span>
              <Select
                disabled={!canManageTaskMetadata}
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value);
                  handleFieldChange('priority', e.target.value);
                }}
                className={`w-full h-8 px-2 py-1 text-xs font-medium capitalize ${
                  !canManageTaskMetadata ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </Select>
            </div>

            {/* Assignee */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-[#738496] block mb-1">Assignee</span>
              <Select
                disabled={!canManageTaskMetadata}
                value={assignee}
                onChange={(e) => {
                  setAssignee(e.target.value);
                  handleFieldChange('assignee', e.target.value === 'Unassigned' ? null : e.target.value);
                }}
                className={`w-full h-8 px-2 py-1 text-xs font-medium ${
                  !canManageTaskMetadata ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <option value="Unassigned">Unassigned</option>
                {teamMembers.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name}
                  </option>
                ))}
              </Select>
            </div>

            {/* Reporter */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 dark:text-[#738496] block mb-1">Reporter</span>
              <Select
                disabled={!canManageTaskMetadata}
                value={reporter}
                onChange={(e) => {
                  setReporter(e.target.value);
                  handleFieldChange('reporter', e.target.value);
                }}
                className={`w-full h-8 px-2 py-1 text-xs font-medium ${
                  !canManageTaskMetadata ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {projectManagers.map((u) => (
                  <option key={u.id} value={u.name}>
                    {u.name} ({u.role === 'admin' ? 'Admin' : 'Project Manager'})
                  </option>
                ))}
              </Select>
            </div>
          </div>

          {/* Start Date & Due Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-[#738496] block mb-1">Start Date</span>
              <DatePicker
                disabled={!canManageTaskMetadata}
                value={startDate}
                onChange={(val) => {
                  if (!canManageTaskMetadata) return;
                  setStartDate(val);
                  handleFieldChange('start_date', val);
                }}
                placeholder="No start date"
              />
            </div>

            <div>
              <span className="text-xs font-semibold text-slate-500 dark:text-[#738496] block mb-1">Due Date</span>
              <DatePicker
                disabled={!canManageTaskMetadata}
                value={dueDate}
                onChange={(val) => {
                  if (!canManageTaskMetadata) return;
                  setDueDate(val);
                  handleFieldChange('due_date', val);
                }}
                placeholder="No due date"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-[#DEE4EA] mb-1.5">Description</h4>
            <textarea
              rows={4}
              placeholder="Add a more detailed description..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                handleFieldChange('description', e.target.value);
              }}
              className="w-full rounded-lg bg-slate-50 dark:bg-[#161A1D] border border-slate-200 dark:border-[#282E33] p-3 text-xs text-slate-900 dark:text-[#DEE4EA] placeholder-slate-400 dark:placeholder-[#738496] focus:outline-none focus:border-[#0C66E4] dark:focus:border-[#579DFF] transition"
            />
          </div>

          {/* Activity / Comments Stream */}
          <div className="pt-2 border-t border-slate-200 dark:border-[#282E33] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-[#DEE4EA]">
              <MessageSquare className="h-4 w-4 text-[#0C66E4] dark:text-[#579DFF]" />
              <span>Activity & Comments</span>
            </div>

            {/* Existing comments */}
            <div className="space-y-2.5">
              {comments.map((c) => (
                <div key={c.id} className="p-3 rounded-lg bg-slate-50 dark:bg-[#161A1D] border border-slate-200 dark:border-[#282E33] text-xs">
                  <div className="flex items-center justify-between font-semibold text-slate-900 dark:text-[#DEE4EA] mb-1">
                    <span>{c.author}</span>
                    <span className="text-[10px] text-slate-400 dark:text-[#738496] font-normal">{c.time}</span>
                  </div>
                  <p className="text-slate-600 dark:text-[#9FADBC]">{c.text}</p>
                </div>
              ))}
            </div>

            {/* Comment input form */}
            <form onSubmit={handleAddComment} className="flex gap-2 pt-1">
              <input
                type="text"
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 rounded-lg bg-white dark:bg-[#161A1D] border border-slate-200 dark:border-[#282E33] px-3 py-1.5 text-xs text-slate-900 dark:text-[#DEE4EA] placeholder-slate-400 dark:placeholder-[#738496] focus:outline-none focus:border-[#0C66E4] dark:focus:border-[#579DFF]"
              />
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-lg bg-[#0C66E4] hover:bg-[#0055CC] px-3 py-1.5 text-xs font-semibold text-white shadow-xs cursor-pointer"
              >
                <Send className="h-3 w-3" />
                <span>Save</span>
              </button>
            </form>
          </div>
        </div>

        {/* In-app Confirmation Modal for Deletion */}
        <ConfirmDialog
          isOpen={isDeleteDialogOpen}
          onClose={() => setIsDeleteDialogOpen(false)}
          onConfirm={() => {
            onDelete && onDelete(task.id);
            onClose();
          }}
          title="Delete Issue"
          description={`Are you sure you want to delete issue "${task.title || 'this issue'}"? This action cannot be undone.`}
          confirmText="Delete Issue"
        />
      </div>
    </div>
  );
}
