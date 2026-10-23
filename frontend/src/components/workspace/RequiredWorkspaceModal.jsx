import React, { useState } from 'react';
import { Building2, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useWorkspaceContext } from '../../context/WorkspaceContext';
import { toast } from 'sonner';

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

export function RequiredWorkspaceModal() {
  const { createWorkspace } = useWorkspaceContext();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0].hex);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      const created = await createWorkspace({
        name: name.trim(),
        description: description.trim(),
        color: selectedColor,
      });

      if (created) {
        toast.success(`Workspace "${created.name}" created! Welcome to your space.`);
      }
    } catch (err) {
      console.error('Error creating workspace:', err);
      toast.error('Could not create workspace. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md select-none animate-in fade-in-0 duration-200">
      <div className="w-full max-w-lg rounded-3xl border border-slate-200/80 dark:border-[#282E33] bg-white dark:bg-[#161A1D] text-slate-900 dark:text-[#DEE4EA] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header Hero Banner */}
        <div className="p-6 sm:p-7 pb-5 bg-gradient-to-b from-blue-50/70 to-transparent dark:from-[#1C2B41]/40 dark:to-transparent border-b border-slate-100 dark:border-[#282E33]/70">
          <div className="flex items-center gap-3.5 mb-3">
            <div
              className="h-12 w-12 rounded-2xl flex items-center justify-center text-white text-base font-bold shadow-md transition-colors"
              style={{ backgroundColor: selectedColor }}
            >
              {initial}
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-blue-100/80 dark:bg-blue-950/50 text-[10px] font-bold text-blue-700 dark:text-blue-300 mb-1">
                <Sparkles className="h-3 w-3" />
                <span>Workspace Setup Required</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-[#DEE4EA] tracking-tight leading-tight">
                Create Your Workspace
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#9FADBC] leading-relaxed">
            All workspaces were removed. You need at least one workspace to organize projects, boards, and team members. Create your new workspace below to continue.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-4 text-xs">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-[#DEE4EA] mb-1.5">
              Workspace Name <span className="text-rose-500">*</span>
            </label>
            <input
              autoFocus
              required
              type="text"
              placeholder="e.g. Acme Corporation, Product Labs, Design Studio"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10.5 rounded-xl border border-slate-200 bg-white dark:border-[#333C44] dark:bg-[#22272B] px-3.5 text-xs text-slate-900 dark:text-[#DEE4EA] placeholder-slate-400 dark:placeholder-[#738496] focus:outline-none focus:border-[#0C66E4] dark:focus:border-[#579DFF] shadow-2xs transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-[#DEE4EA] mb-1.5">
              Workspace Description (Optional)
            </label>
            <textarea
              rows={2}
              placeholder="What kind of projects and teams will operate in this workspace?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white dark:border-[#333C44] dark:bg-[#22272B] p-3 text-xs text-slate-900 dark:text-[#DEE4EA] placeholder-slate-400 dark:placeholder-[#738496] focus:outline-none focus:border-[#0C66E4] dark:focus:border-[#579DFF] shadow-2xs transition resize-none"
            />
          </div>

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
                    selectedColor === c.hex
                      ? 'ring-2 ring-offset-2 ring-slate-700 dark:ring-white scale-110 shadow-sm'
                      : 'hover:scale-105 opacity-85 hover:opacity-100'
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

          <div className="pt-3 border-t border-slate-100 dark:border-[#282E33]/70">
            <button
              type="submit"
              disabled={!name.trim() || isSubmitting}
              className="w-full flex items-center justify-center gap-2 h-10.5 rounded-xl bg-[#0C66E4] hover:bg-[#0055CC] disabled:opacity-50 disabled:cursor-not-allowed text-xs font-semibold text-white shadow-md hover:shadow-lg transition cursor-pointer"
            >
              <span>{isSubmitting ? 'Creating Workspace...' : 'Create Workspace & Access Taskora'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RequiredWorkspaceModal;
