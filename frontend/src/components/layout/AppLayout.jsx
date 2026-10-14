import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar6 } from './AppSidebar6';
import { Topbar } from './Topbar';

export function AppLayout() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-50 dark:bg-[#101214] text-slate-900 dark:text-[#DEE4EA] transition-colors duration-150">
      {/* Global Topbar */}
      <Topbar />

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Static In-Dashboard App Sidebar 6 */}
        <AppSidebar6 />

        {/* Main Content Area */}
        <main className="relative flex-1 flex flex-col overflow-y-auto bg-[#F8FAFC] dark:bg-[#101214] min-w-0 transition-colors duration-150">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
