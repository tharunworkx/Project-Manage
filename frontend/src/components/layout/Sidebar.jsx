import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  User,
  Clock,
  Star,
  Grid,
  Layers,
  ChevronRight,
  ChevronLeft,
  Plus,
  MoreHorizontal,
  Sliders,
  LayoutDashboard,
  Box,
  Users2,
  ExternalLink,
  SlidersHorizontal,
  PanelLeftClose,
} from 'lucide-react';
import { useSidebar } from '../../context/SidebarContext';

export function Sidebar() {
  const { isOpen, toggle } = useSidebar();

  return (
    <div className="relative flex select-none shrink-0 z-30">
      {/* Sidebar Panel */}
      <aside
        className={`flex flex-col border-r border-[#282E33] bg-[#161A1D] text-[#9FADBC] text-sm h-[calc(100vh-3.5rem)] transition-all duration-200 ease-in-out overflow-hidden ${
          isOpen ? 'w-64 min-w-[256px]' : 'w-0 min-w-0 border-r-0'
        }`}
      >
        {/* Scrollable menu content */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3.5 space-y-1 w-64">
          {/* For you */}
          <button className="flex w-full items-center gap-3 px-3 py-2 rounded-md hover:bg-[#22272B] hover:text-[#DEE4EA] text-left transition cursor-pointer">
            <User className="h-4.5 w-4.5 shrink-0 text-[#9FADBC]" />
            <span className="font-medium text-[#DEE4EA] text-sm">For you</span>
          </button>

          {/* Recent */}
          <button className="flex w-full items-center justify-between px-3 py-2 rounded-md hover:bg-[#22272B] hover:text-[#DEE4EA] text-left transition cursor-pointer">
            <div className="flex items-center gap-3">
              <Clock className="h-4.5 w-4.5 shrink-0 text-[#9FADBC]" />
              <span className="font-medium text-sm">Recent</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#738496]" />
          </button>

          {/* Starred */}
          <button className="flex w-full items-center justify-between px-3 py-2 rounded-md hover:bg-[#22272B] hover:text-[#DEE4EA] text-left transition cursor-pointer">
            <div className="flex items-center gap-3">
              <Star className="h-4.5 w-4.5 shrink-0 text-[#9FADBC]" />
              <span className="font-medium text-sm">Starred</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#738496]" />
          </button>

          {/* Apps */}
          <button className="flex w-full items-center gap-3 px-3 py-2 rounded-md hover:bg-[#22272B] hover:text-[#DEE4EA] text-left transition cursor-pointer">
            <Grid className="h-4.5 w-4.5 shrink-0 text-[#9FADBC]" />
            <span className="font-medium text-sm">Apps</span>
          </button>

          {/* Plans */}
          <button className="flex w-full items-center justify-between px-3 py-2 rounded-md hover:bg-[#22272B] hover:text-[#DEE4EA] text-left transition cursor-pointer">
            <div className="flex items-center gap-3">
              <Layers className="h-4.5 w-4.5 shrink-0 text-[#9FADBC]" />
              <span className="font-medium text-sm">Plans</span>
            </div>
            <ChevronRight className="h-4 w-4 text-[#738496]" />
          </button>

          {/* Spaces Section Header */}
          <div className="pt-2">
            <div className="flex items-center justify-between px-3 py-1.5 group">
              <div className="flex items-center gap-3 font-semibold text-[#DEE4EA] text-sm">
                <svg className="h-4.5 w-4.5 text-[#9FADBC]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="M22 6l-10 7L2 6" />
                </svg>
                <span>Spaces</span>
              </div>
              <div className="flex items-center gap-1 text-[#738496]">
                <button title="Add space" className="p-1 hover:text-[#DEE4EA] rounded hover:bg-[#22272B] cursor-pointer">
                  <Plus className="h-4 w-4" />
                </button>
                <button title="More" className="p-1 hover:text-[#DEE4EA] rounded hover:bg-[#22272B] cursor-pointer">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Starred Spaces list */}
            <div className="pl-3 mt-1 space-y-0.5">
              <div className="px-2.5 py-1 text-xs font-semibold text-[#738496]">Starred</div>
              <button className="flex w-full items-center gap-3 px-2.5 py-2 rounded-md hover:bg-[#22272B] text-left text-sm transition cursor-pointer">
                <div className="h-4.5 w-4.5 rounded bg-[#8F4FDE] flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                  B
                </div>
                <span className="truncate text-[#9FADBC] hover:text-[#DEE4EA] text-sm">
                  (Example) Billing System Dev
                </span>
              </button>
            </div>

            {/* Recent Spaces list */}
            <div className="pl-3 mt-1 space-y-0.5">
              <div className="px-2.5 py-1 text-xs font-semibold text-[#738496]">Recent</div>

              {/* Active space: My Software Team */}
              <NavLink
                to="/board"
                className={({ isActive }) =>
                  `flex w-full items-center gap-3 px-2.5 py-2 rounded-md text-left text-sm transition cursor-pointer relative ${
                    isActive || true
                      ? 'bg-[#1C2B41] text-[#579DFF] font-medium'
                      : 'hover:bg-[#22272B] text-[#9FADBC]'
                  }`
                }
              >
                {/* Left active blue indicator bar */}
                <div className="absolute left-0 top-1 bottom-1 w-1 bg-[#579DFF] rounded-r" />

                {/* Colorful Space Icon */}
                <div className="h-5 w-5 rounded bg-[#1D7AFC] flex items-center justify-center text-white text-[10px] font-bold shrink-0 relative">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#E5493A] absolute -top-0.5 -right-0.5 ring-1 ring-[#161A1D]" />
                  <span className="text-[11px]">📱</span>
                </div>
                <span className="truncate text-[#DEE4EA] font-semibold text-sm">
                  My Software Team
                </span>
              </NavLink>

              {/* More spaces */}
              <button className="flex w-full items-center justify-between px-2.5 py-2 rounded-md hover:bg-[#22272B] text-left text-sm text-[#9FADBC] transition cursor-pointer">
                <span>More spaces</span>
                <ChevronRight className="h-4 w-4 text-[#738496]" />
              </button>
            </div>
          </div>

          {/* Lower section */}
          <div className="pt-3 border-t border-[#282E33]/60 space-y-1">
            <button className="flex w-full items-center gap-3 px-3 py-2 rounded-md hover:bg-[#22272B] text-[#9FADBC] hover:text-[#DEE4EA] text-left transition cursor-pointer">
              <Sliders className="h-4.5 w-4.5 shrink-0 text-[#9FADBC]" />
              <span className="text-sm">Filters</span>
            </button>

            <button className="flex w-full items-center gap-3 px-3 py-2 rounded-md hover:bg-[#22272B] text-[#9FADBC] hover:text-[#DEE4EA] text-left transition cursor-pointer">
              <LayoutDashboard className="h-4.5 w-4.5 shrink-0 text-[#9FADBC]" />
              <span className="text-sm">Dashboards</span>
            </button>

            <button className="flex w-full items-center justify-between px-3 py-2 rounded-md hover:bg-[#22272B] text-[#9FADBC] hover:text-[#DEE4EA] text-left transition cursor-pointer">
              <div className="flex items-center gap-3">
                <Box className="h-4.5 w-4.5 shrink-0 text-[#9FADBC]" />
                <span className="text-sm">Assets</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-[#738496]" />
            </button>

            <button className="flex w-full items-center justify-between px-3 py-2 rounded-md hover:bg-[#22272B] text-[#9FADBC] hover:text-[#DEE4EA] text-left transition cursor-pointer">
              <div className="flex items-center gap-3">
                <Users2 className="h-4.5 w-4.5 shrink-0 text-[#9FADBC]" />
                <span className="text-sm">Teams</span>
              </div>
              <ExternalLink className="h-3.5 w-3.5 text-[#738496]" />
            </button>
          </div>
        </div>

        {/* Footer: Customize sidebar */}
        <div className="p-2.5 border-t border-[#282E33] flex items-center justify-between">
          <button className="flex items-center gap-2.5 px-2 py-1.5 rounded hover:bg-[#22272B] text-[#9FADBC] hover:text-[#DEE4EA] text-sm transition cursor-pointer">
            <SlidersHorizontal className="h-4 w-4 text-[#738496]" />
            <span>Customize sidebar</span>
          </button>
          <button
            onClick={toggle}
            title="Collapse sidebar ([)"
            className="p-1 rounded hover:bg-[#22272B] text-[#738496] hover:text-[#DEE4EA] cursor-pointer"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>
      </aside>

    </div>
  );
}
