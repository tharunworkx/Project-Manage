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
  CheckSquare,
  Bookmark,
  Bug,
  ChevronDown,
} from 'lucide-react';
import { toast } from 'sonner';
import { DatePicker } from '../ui/date-picker';
import { useAuthContext } from '../../context/AuthContext';

export function TaskDetailsDrawer({ task, isOpen, onClose, onUpdate, onDelete }) {
  if (!isOpen || !task) return null;

  const { canDeleteTasks, canManageTaskMetadata } = useAuthContext();

  const [title, setTitle] = useState(task.title || '');
  const [description, setDescription] = useState(task.description || '');
  const [status, setStatus] = useState(task.status || 'todo');
  const [priority, setPriority] = useState(task.priority || 'medium');
  const [type, setType] = useState(task.type || 'task');
  const [assignee, setAssignee] = useState(task.assignee || 'Unassigned');
  const [dueDate, setDueDate] = useState(task.due_date || '');

  const [comments, setComments] = useState([
    { id: 1, author: 'Tharun S.', text: 'Created this deliverable for the sprint.', time: '2h ago' },
  ]);
  const [newComment, setNewComment] = useState('');

  const handleFieldChange = (field, value) => {
    onUpdate && onUpdate(task.id, { [field]: value });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    setComments([
      ...comments,
      { id: Date.now(), author: 'TR', text: newComment.trim(), time: 'Just now' },
    ]);
    setNewComment('');
    toast.success('Comment added');
  };

  const handleDelete = () => {
    if (confirm('Delete this issue?')) {
      onDelete && onDelete(task.id);
      onClose();
      toast.success('Issue deleted');
    }
  };

  const statusOptions = [
    { id: 'backlog', label: 'Backlog', color: 'bg-[#22272B] text-[#738496] border-[#333C44]' },
    { id: 'todo', label: 'To Do', color: 'bg-[#1C2B41] text-[#579DFF] border-[#579DFF]/40' },
    { id: 'in_progress', label: 'In Progress', color: 'bg-[#3F3112] text-[#F5CD47] border-[#F5CD47]/40' },
    { id: 'in_review', label: 'In Review', color: 'bg-[#282240] text-[#9F8FEF] border-[#9F8FEF]/40' },
    { id: 'done', label: 'Done', color: 'bg-[#163828] text-[#4BCE97] border-[#4BCE97]/40' },
    { id: 'cancelled', label: 'Cancelled', color: 'bg-[#3C1E22] text-[#F87171] border-[#F87171]/40' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex justify-end select-none">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Slide-out Drawer */}
      <div className="relative w-full max-w-2xl bg-[#1D2125] border-l border-[#282E33] text-[#DEE4EA] p-6 overflow-y-auto flex flex-col z-50 shadow-2xl animate-slide-in-right">
        {/* Top bar header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#282E33]">
          <div className="flex items-center gap-2 text-xs text-[#9FADBC]">
            <span className="hover:underline cursor-pointer">My Software Team</span>
            <span>/</span>
            <span className="font-bold text-[#579DFF]">{task.key || `KAN-${task.id}`}</span>
          </div>

          <div className="flex items-center gap-1.5 text-[#9FADBC]">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                toast.success('Issue link copied to clipboard');
              }}
              title="Share"
              className="p-1.5 rounded hover:bg-[#282E33] hover:text-[#DEE4EA] cursor-pointer"
            >
              <Share2 className="h-4 w-4" />
            </button>
            {canDeleteTasks && (
              <button
                onClick={handleDelete}
                title="Delete issue"
                className="p-1.5 rounded hover:bg-[#282E33] hover:text-rose-400 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              title="Close drawer"
              className="p-1.5 rounded hover:bg-[#282E33] hover:text-[#DEE4EA] cursor-pointer"
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
              className={`w-full text-xl font-bold bg-transparent text-[#DEE4EA] border border-transparent ${
                canManageTaskMetadata ? 'hover:border-[#333C44] focus:border-[#579DFF] focus:bg-[#22272B]' : 'cursor-default'
              } rounded-md px-2 py-1 focus:outline-none transition`}
            />
          </div>

          {/* Quick Details Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#161A1D] border border-[#282E33] text-xs">
            {/* Status Dropdown - Available to all roles including Team Members */}
            <div>
              <span className="text-[11px] font-semibold text-[#738496] block mb-1">Status</span>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  handleFieldChange('status', e.target.value);
                  toast.success(`Moved to ${e.target.value.replace('_', ' ')}`);
                }}
                className="w-full rounded bg-[#22272B] border border-[#333C44] px-2 py-1 text-xs font-semibold text-[#DEE4EA] focus:outline-none focus:border-[#579DFF]"
              >
                <option value="todo">To Do</option>
                <option value="in_progress">In Progress</option>
                <option value="in_review">In Review</option>
                <option value="done">Done</option>
              </select>
            </div>

            {/* Issue Type */}
            <div>
              <span className="text-[11px] font-semibold text-[#738496] block mb-1">Issue Type</span>
              <select
                disabled={!canManageTaskMetadata}
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  handleFieldChange('type', e.target.value);
                }}
                className={`w-full rounded bg-[#22272B] border border-[#333C44] px-2 py-1 text-xs font-medium text-[#DEE4EA] focus:outline-none focus:border-[#579DFF] ${
                  !canManageTaskMetadata ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <option value="task">✓ Task</option>
                <option value="story">🔖 Story</option>
                <option value="bug">● Bug</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <span className="text-[11px] font-semibold text-[#738496] block mb-1">Assignee</span>
              <select
                disabled={!canManageTaskMetadata}
                value={assignee}
                onChange={(e) => {
                  setAssignee(e.target.value);
                  handleFieldChange('assignee', e.target.value);
                }}
                className={`w-full rounded bg-[#22272B] border border-[#333C44] px-2 py-1 text-xs font-medium text-[#DEE4EA] focus:outline-none focus:border-[#579DFF] ${
                  !canManageTaskMetadata ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <option value="Unassigned">Unassigned</option>
                <option value="TR">TR (Tharun S.)</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <span className="text-[11px] font-semibold text-[#738496] block mb-1">Priority</span>
              <select
                disabled={!canManageTaskMetadata}
                value={priority}
                onChange={(e) => {
                  setPriority(e.target.value);
                  handleFieldChange('priority', e.target.value);
                }}
                className={`w-full rounded bg-[#22272B] border border-[#333C44] px-2 py-1 text-xs font-medium text-[#DEE4EA] capitalize focus:outline-none focus:border-[#579DFF] ${
                  !canManageTaskMetadata ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-[#738496] w-20 shrink-0">Due Date:</span>
            <div className="w-48">
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
            <h4 className="text-xs font-bold text-[#DEE4EA] mb-1.5">Description</h4>
            <textarea
              rows={4}
              placeholder="Add a more detailed description..."
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                handleFieldChange('description', e.target.value);
              }}
              className="w-full rounded-lg bg-[#161A1D] border border-[#282E33] p-3 text-xs text-[#DEE4EA] placeholder-[#738496] focus:outline-none focus:border-[#579DFF] transition"
            />
          </div>

          {/* Activity / Comments Stream */}
          <div className="pt-2 border-t border-[#282E33] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#DEE4EA]">
              <MessageSquare className="h-4 w-4 text-[#579DFF]" />
              <span>Activity & Comments</span>
            </div>

            {/* Existing comments */}
            <div className="space-y-2.5">
              {comments.map((c) => (
                <div key={c.id} className="p-3 rounded-lg bg-[#161A1D] border border-[#282E33] text-xs">
                  <div className="flex items-center justify-between font-semibold text-[#DEE4EA] mb-1">
                    <span>{c.author}</span>
                    <span className="text-[10px] text-[#738496] font-normal">{c.time}</span>
                  </div>
                  <p className="text-[#9FADBC]">{c.text}</p>
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
                className="flex-1 rounded-lg bg-[#161A1D] border border-[#282E33] px-3 py-1.5 text-xs text-[#DEE4EA] placeholder-[#738496] focus:outline-none focus:border-[#579DFF]"
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
      </div>
    </div>
  );
}
