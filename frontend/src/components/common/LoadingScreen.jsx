import React from 'react';

export function LoadingScreen({ message = 'Loading Taskflow...' }) {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-slate-950">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent mb-4" />
      <p className="text-sm font-medium text-slate-400">{message}</p>
    </div>
  );
}
