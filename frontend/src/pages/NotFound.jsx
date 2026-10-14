import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center p-4 text-center bg-slate-50 dark:bg-slate-950">
      <h1 className="text-6xl font-extrabold text-indigo-600">404</h1>
      <h2 className="mt-2 text-xl font-bold text-slate-900 dark:text-slate-100">Page Not Found</h2>
      <p className="mt-1 text-xs text-slate-500 max-w-sm">The route you requested does not exist or has been moved.</p>
      <Link to="/dashboard" className="mt-6">
        <Button>Return to Dashboard</Button>
      </Link>
    </div>
  );
}
