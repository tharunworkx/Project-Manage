import React, { useEffect } from 'react';
import { Trash2, X } from 'lucide-react';
import { Button } from '../ui/Button';

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Issue',
  description = 'Are you sure you want to delete this? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  variant = 'danger',
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 select-none animate-in fade-in-0 duration-150">
      <div className="relative w-full max-w-md rounded-2xl bg-white dark:bg-[#1D2125] p-6 shadow-2xl border border-slate-200 dark:border-[#282E33] text-slate-900 dark:text-[#DEE4EA] animate-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#282E33] transition cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-rose-50 dark:bg-[#3C1E22] text-rose-600 dark:text-[#F87171] border border-rose-200/80 dark:border-[#F87171]/30 flex items-center justify-center shrink-0">
            <Trash2 className="h-5 w-5 stroke-[1.8]" />
          </div>

          <div className="space-y-1.5 flex-1 pr-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-[#DEE4EA] leading-snug">
              {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-[#9FADBC] leading-relaxed">
              {description}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2.5 mt-6 pt-3 border-t border-slate-100 dark:border-[#282E33]/70">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            className="rounded-lg text-xs"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant}
            size="sm"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="rounded-lg text-xs font-semibold px-4"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
