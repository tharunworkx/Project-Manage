import React, { useState } from 'react';
import { CheckSquare, Bookmark, Bug } from 'lucide-react';
import { TASK_STATUSES } from '../../lib/constants';
import { DatePicker } from '../ui/date-picker';

export function TaskForm({ initialData, onSubmit, onCancel }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [status, setStatus] = useState(initialData?.status || 'todo');
  const [type, setType] = useState(initialData?.type || 'task');
  const [dueDate, setDueDate] = useState(initialData?.due_date || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({
      title,
      description,
      status,
      type,
      due_date: dueDate,
      priority: initialData?.priority || 'medium',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 text-xs text-[#DEE4EA]">
      {/* Project & Issue Type Row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[#9FADBC] mb-1">
            Project
          </label>
          <div className="flex items-center gap-2 px-3 py-2 rounded-md bg-[#1D2125] border border-[#333C44] text-xs font-medium text-[#DEE4EA]">
            <span>📱</span>
            <span className="truncate">My Software Team (KAN)</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#9FADBC] mb-1">
            Issue Type
          </label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full rounded-md bg-[#1D2125] border border-[#333C44] px-3 py-2 text-xs font-medium text-[#DEE4EA] focus:outline-none focus:border-[#579DFF]"
          >
            <option value="task">✓ Task</option>
            <option value="story">🔖 Story</option>
            <option value="bug">● Bug</option>
          </select>
        </div>
      </div>

      {/* Summary / Title */}
      <div>
        <label className="block text-xs font-semibold text-[#9FADBC] mb-1">
          Summary *
        </label>
        <input
          required
          autoFocus
          type="text"
          placeholder="e.g. Implement user authentication workflow"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded-md bg-[#1D2125] border border-[#333C44] px-3 py-2 text-xs text-[#DEE4EA] placeholder-[#738496] focus:outline-none focus:border-[#579DFF]"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-xs font-semibold text-[#9FADBC] mb-1">
          Description
        </label>
        <textarea
          rows={3}
          placeholder="Add detailed task notes or acceptance criteria..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-md bg-[#1D2125] border border-[#333C44] p-3 text-xs text-[#DEE4EA] placeholder-[#738496] focus:outline-none focus:border-[#579DFF]"
        />
      </div>

      {/* Status & Due Date */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-[#9FADBC] mb-1">
            Status
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full rounded-md bg-[#1D2125] border border-[#333C44] px-3 py-2 text-xs text-[#DEE4EA] focus:outline-none focus:border-[#579DFF]"
          >
            {TASK_STATUSES.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#9FADBC] mb-1">
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
      <div className="flex justify-end gap-2 pt-3 border-t border-[#282E33]">
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-md hover:bg-[#282E33] text-xs font-semibold text-[#DEE4EA] transition cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-1.5 rounded-md bg-[#0C66E4] hover:bg-[#0055CC] text-xs font-semibold text-white shadow-xs transition cursor-pointer"
        >
          {initialData ? 'Save Changes' : 'Create'}
        </button>
      </div>
    </form>
  );
}
