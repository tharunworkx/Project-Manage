import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Gauge,
  Workflow,
  Box,
  Database,
  LayoutGrid,
  Shield,
  Activity,
  Rocket,
  SlidersHorizontal,
  KeyRound,
  LifeBuoy,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

export function AppSidebar2() {
  const [hoveredId, setHoveredId] = useState(null);
  const [activeId, setActiveId] = useState('connect');

  const navItems = [
    {
      id: 'kanban',
      icon: Gauge,
      label: 'Kanban Board',
      subtitle: 'Active space & board',
      path: '/kanban',
      links: [
        { label: 'Kanban Board', path: '/kanban' },
        { label: 'Task Velocity', path: '/reports' },
        { label: 'Sprint Analytics', path: '/reports' },
      ],
    },
    {
      id: 'connect',
      icon: Workflow,
      label: 'My Software Team',
      subtitle: 'Active space & board',
      path: '/board',
      links: [
        { label: 'Kanban Board', path: '/board', badge: 'Active' },
        { label: 'All Tasks', path: '/tasks' },
        { label: 'Delivery Calendar', path: '/calendar' },
        { label: 'Project Settings', path: '/settings' },
      ],
    },
    {
      id: 'packages',
      icon: Box,
      label: 'Packages & Artifacts',
      subtitle: 'Versioned assets & builds',
      path: '/projects',
      links: [
        { label: 'All Projects', path: '/projects' },
        { label: 'Release Bundles', path: '/projects' },
        { label: 'Changelog', path: '/projects' },
      ],
    },
    {
      id: 'database',
      icon: Database,
      label: 'Database & Storage',
      subtitle: 'Supabase instance',
      path: '/settings',
      links: [
        { label: 'Tables & Schemas', path: '/settings' },
        { label: 'SQL Migrations (001-009)', path: '/settings' },
        { label: 'Storage Buckets', path: '/settings' },
      ],
    },
    {
      id: 'workspaces',
      icon: LayoutGrid,
      label: 'Spaces & Workspaces',
      subtitle: 'Cross-functional teams',
      path: '/projects',
      links: [
        { label: 'My Software Team', path: '/board' },
        { label: '(Example) Billing System Dev', path: '/projects' },
        { label: 'Create New Space', path: '/projects' },
      ],
    },
    {
      id: 'security',
      icon: Shield,
      label: 'Security & Access',
      subtitle: 'Row Level Security & policies',
      path: '/settings',
      links: [
        { label: 'RLS Policies', path: '/settings' },
        { label: 'Team Roles & Permissions', path: '/settings' },
        { label: 'Audit Trail', path: '/settings' },
      ],
    },
    {
      id: 'activity',
      icon: Activity,
      label: 'Health & Activity',
      subtitle: 'Real-time monitoring',
      path: '/reports',
      links: [
        { label: 'Live Activity Stream', path: '/dashboard' },
        { label: 'Operational Metrics', path: '/reports' },
        { label: 'System Status', path: '/reports' },
      ],
    },
    {
      id: 'deployments',
      icon: Rocket,
      label: 'Deployments & Sprints',
      subtitle: 'Release pipelines',
      path: '/projects',
      links: [
        { label: 'Production Releases', path: '/projects' },
        { label: 'Feature Flags', path: '/settings' },
        { label: 'Webhooks & Automation', path: '/settings' },
      ],
    },
    {
      id: 'settings',
      icon: SlidersHorizontal,
      label: 'System Settings',
      subtitle: 'Workspace preferences',
      path: '/settings',
      links: [
        { label: 'General Configuration', path: '/settings' },
        { label: 'Theme & Appearance', path: '/settings' },
        { label: 'Integrations', path: '/settings' },
      ],
    },
    {
      id: 'auth',
      icon: KeyRound,
      label: 'Authentication & Keys',
      subtitle: 'Credentials & tokens',
      path: '/settings',
      links: [
        { label: 'Supabase API Keys', path: '/settings' },
        { label: 'OAuth Credentials', path: '/settings' },
        { label: 'Session Management', path: '/settings' },
      ],
    },
  ];

  const bottomItems = [
    {
      id: 'help',
      icon: LifeBuoy,
      label: 'Documentation & Help',
      subtitle: 'Guides & references',
      links: [
        { label: 'Taskflow Documentation', path: '#' },
        { label: 'Keyboard Shortcuts', path: '#' },
        { label: 'React Bits Pro UI Components', path: '#' },
      ],
    },
  ];

  return (
    <aside className="relative flex flex-col items-center justify-between w-14 border-r border-[#22272B] bg-[#0A0C0E] py-3.5 select-none z-40 shrink-0">
      {/* Top: Brand Logo Badge 'A' */}
      <div className="flex flex-col items-center gap-4 w-full">
        <NavLink
          to="/kanban"
          className="flex h-9 w-9 items-center justify-center rounded-xl overflow-hidden shadow-md hover:scale-105 active:scale-95 transition-transform ring-1 ring-white/10"
          title="Taskora"
        >
          <img src="/logo.png" alt="Taskora" className="h-full w-full object-cover" />
        </NavLink>

        {/* Primary Icon Rail */}
        <nav className="flex flex-col items-center gap-1 w-full px-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeId === item.id;
            const isHovered = hoveredId === item.id;

            return (
              <div
                key={item.id}
                className="relative flex items-center justify-center w-full"
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <NavLink
                  to={item.path}
                  onClick={() => setActiveId(item.id)}
                  className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all duration-150 ${
                    isActive
                      ? 'bg-[#1D2125] text-white shadow-xs'
                      : isHovered
                      ? 'bg-[#181B1F] text-[#DEE4EA]'
                      : 'text-[#738496] hover:text-[#9FADBC]'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </NavLink>

                {/* Hover Flyout Menu */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, x: 8, scale: 0.98 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 8, scale: 0.98 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute left-12 top-0 z-50 min-w-56 rounded-xl border border-[#282E33] bg-[#161A1D]/95 p-3 shadow-2xl backdrop-blur-md pointer-events-auto"
                    >
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#22272B]">
                        <div>
                          <h4 className="text-xs font-bold text-[#DEE4EA]">
                            {item.label}
                          </h4>
                          <p className="text-[10px] text-[#738496]">
                            {item.subtitle}
                          </p>
                        </div>
                        <Icon className="h-3.5 w-3.5 text-[#579DFF]" />
                      </div>

                      <div className="space-y-1">
                        {item.links.map((link, idx) => (
                          <NavLink
                            key={idx}
                            to={link.path}
                            className="flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-medium text-[#9FADBC] hover:bg-[#22272B] hover:text-[#DEE4EA] transition"
                          >
                            <span>{link.label}</span>
                            {link.badge ? (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#1D7AFC]/20 text-[#579DFF]">
                                {link.badge}
                              </span>
                            ) : (
                              <ChevronRight className="h-3 w-3 text-[#738496] opacity-0 hover:opacity-100" />
                            )}
                          </NavLink>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Bottom: Help & TS Avatar */}
      <div className="flex flex-col items-center gap-2 w-full px-2">
        {bottomItems.map((item) => {
          const Icon = item.icon;
          const isHovered = hoveredId === item.id;

          return (
            <div
              key={item.id}
              className="relative flex items-center justify-center w-full"
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <button
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition ${
                  isHovered
                    ? 'bg-[#181B1F] text-[#DEE4EA]'
                    : 'text-[#738496] hover:text-[#9FADBC]'
                }`}
              >
                <Icon className="h-4 w-4" />
              </button>

              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    initial={{ opacity: 0, x: 8, scale: 0.98 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 8, scale: 0.98 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-12 bottom-0 z-50 min-w-48 rounded-xl border border-[#282E33] bg-[#161A1D]/95 p-3 shadow-2xl backdrop-blur-md"
                  >
                    <h4 className="text-xs font-bold text-[#DEE4EA] mb-1">
                      {item.label}
                    </h4>
                    <p className="text-[10px] text-[#738496] mb-2">
                      {item.subtitle}
                    </p>
                    <div className="space-y-1">
                      {item.links.map((link, idx) => (
                        <NavLink
                          key={idx}
                          to={link.path}
                          className="block px-2 py-1 rounded text-xs text-[#9FADBC] hover:bg-[#22272B] hover:text-[#DEE4EA]"
                        >
                          {link.label}
                        </NavLink>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}

        {/* User avatar circle 'TS' */}
        <div
          className="relative flex items-center justify-center w-full pt-1"
          onMouseEnter={() => setHoveredId('user')}
          onMouseLeave={() => setHoveredId(null)}
        >
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1D2125] border border-[#282E33] text-white font-bold text-xs hover:ring-2 hover:ring-[#579DFF]/40 transition">
            TS
          </button>

          <AnimatePresence>
            {hoveredId === 'user' && (
              <motion.div
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 8 }}
                transition={{ duration: 0.15 }}
                className="absolute left-12 bottom-0 z-50 min-w-48 rounded-xl border border-[#282E33] bg-[#161A1D]/95 p-3 shadow-2xl backdrop-blur-md"
              >
                <div className="pb-2 border-b border-[#22272B]">
                  <p className="text-xs font-bold text-[#DEE4EA]">Tharun S.</p>
                  <p className="text-[10px] text-[#738496]">Workspace Admin</p>
                </div>
                <div className="mt-2 space-y-1">
                  <NavLink to="/settings" className="block px-2 py-1 text-xs text-[#9FADBC] hover:bg-[#22272B] rounded">
                    Profile & Account
                  </NavLink>
                  <NavLink to="/settings" className="block px-2 py-1 text-xs text-[#9FADBC] hover:bg-[#22272B] rounded">
                    Workspace Roles
                  </NavLink>
                  <NavLink to="/login" className="block px-2 py-1 text-xs text-rose-400 hover:bg-rose-950/40 rounded">
                    Sign Out
                  </NavLink>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
}
