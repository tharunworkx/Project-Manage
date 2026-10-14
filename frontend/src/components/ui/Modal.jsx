import React, { useEffect } from 'react';
import { X } from 'lucide-react';

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
      <div
        className={`relative w-full ${maxWidth} rounded-xl bg-[#22272B] p-6 shadow-2xl border border-[#333C44] text-[#DEE4EA]`}
      >
        <div className="flex items-center justify-between pb-3 border-b border-[#282E33]">
          <h3 className="text-base font-bold text-[#DEE4EA]">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#9FADBC] hover:text-[#DEE4EA] hover:bg-[#282E33] transition cursor-pointer"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
