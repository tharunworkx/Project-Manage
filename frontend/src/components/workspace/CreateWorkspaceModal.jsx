import React, { useState } from 'react';
import { X, Building2, Check } from 'lucide-react';
import { useWorkspaceContext } from '../../context/WorkspaceContext';

const COLOR_OPTIONS = [
  { hex: '#0C66E4', name: 'Blue' },
  { hex: '#7C3AED', name: 'Purple' },
  { hex: '#10B981', name: 'Emerald' },
  { hex: '#F59E0B', name: 'Amber' },
  { hex: '#EC4899', name: 'Pink' },
  { hex: '#06B6D4', name: 'Cyan' },
  { hex: '#6366F1', name: 'Indigo' },
  { hex: '#E11D48', name: 'Rose' },
];

export function CreateWorkspaceModal({ isOpen, onClose }) {
  const { createWorkspace } = useWorkspaceContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].hex);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const initial = name.trim()
    ? name
        .trim()
        .split(' ')
        .map((w) => w[0])
        .join('')
        .substring(0, 2)
        .toUpperCase()
    : 'W';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await createWorkspace({
        name: name.trim(),
        description: description.trim(),
        color: selectedColor,
      });

      setName('');
      setDescription('');
      setSelectedColor(COLOR_OPTIONS[0].hex);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-in fade-in-0 duration-150">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] text-slate-900 dark:text-[#DEE4EA] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-[#282E33] shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className="h-8 w-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 transition-colors"
              style={{ backgroundColor: selectedColor }}
            >
              {initial}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-[#DEE4EA] leading-tight">
                Create New Workspace
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-[#9FADBC]">
                Collaborative space for your team & projects
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            title="Close"
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#22272B] transition cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Workspace Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-[#DEE4EA] mb-1.5">
              Workspace Name<span className="text-rose-500">*</span>
            </label>
            <input
              autoFocus
              required
              type="text"
              placeholder="e.g. Acme Studio, Operations Alpha"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 rounded-lg border border-slate-200 bg-white dark:border-[#333C44] dark:bg-[#22272B] px-3.5 text-xs text-slate-800 dark:text-[#DEE4EA] placeholder-slate-400 dark:placeholder-[#738496] focus:outline-none focus:border-[#0C66E4] dark:focus:border-[#579DFF] transition"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-[#DEE4EA] mb-1.5">
              Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="Brief summary of projects in this workspace"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white dark:border-[#333C44] dark:bg-[#22272B] p-3 text-xs text-slate-800 dark:text-[#DEE4EA] placeholder-slate-400 dark:placeholder-[#738496] focus:outline-none focus:border-[#0C66E4] dark:focus:border-[#579DFF] transition resize-none"
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-[#DEE4EA] mb-2">
              Workspace Theme Color
            </label>
            <div className="flex items-center gap-2.5 flex-wrap">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  title={c.name}
                  onClick={() => setSelectedColor(c.hex)}
                  className={`h-7 w-7 rounded-full flex items-center justify-center transition cursor-pointer ${
                    selectedColor === c.hex ? 'ring-2 ring-offset-2 ring-slate-600 dark:ring-white scale-110' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                >
                  {selectedColor === c.hex && (
                    <Check className="h-3.5 w-3.5 text-white stroke-[2.5]" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100 dark:border-[#282E33]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-[#2C333A] dark:hover:bg-[#353D45] text-slate-700 dark:text-[#DEE4EA] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="px-5 py-2 rounded-lg bg-[#0C66E4] hover:bg-[#0055CC] disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold text-white shadow-xs transition cursor-pointer"
            >
              Create Workspace
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateWorkspaceModal;
