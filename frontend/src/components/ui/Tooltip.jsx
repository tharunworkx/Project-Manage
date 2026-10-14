import React, { useState } from 'react';

export function Tooltip({ text, children }) {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 rounded bg-slate-900 text-white text-xs whitespace-nowrap shadow-md z-50 animate-fade-in pointer-events-none">
          {text}
        </div>
      )}
    </div>
  );
}
