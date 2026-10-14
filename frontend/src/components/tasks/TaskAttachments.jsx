import React from 'react';
import { Paperclip, Plus } from 'lucide-react';

export function TaskAttachments({ taskId }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-slate-100">
        <div className="flex items-center gap-2">
          <Paperclip className="h-4 w-4" /> Attachments
        </div>
        <button className="text-[11px] text-indigo-500 hover:underline flex items-center gap-1 cursor-pointer">
          <Plus className="h-3 w-3" /> Upload
        </button>
      </div>
      <div className="p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-center text-xs text-slate-400">
        No attachments yet.
      </div>
    </div>
  );
}
