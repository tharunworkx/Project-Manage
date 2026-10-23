import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { useThemeContext } from '../../context/ThemeContext';
import { useWorkspaceContext } from '../../context/WorkspaceContext';

const WORKSPACE_DATA = {
  'ws-1': {
    velocity: '+24.5%',
    data: [
      { day: 'Mon', completed: 6, created: 8 },
      { day: 'Tue', completed: 9, created: 5 },
      { day: 'Wed', completed: 11, created: 7 },
      { day: 'Thu', completed: 14, created: 4 },
      { day: 'Fri', completed: 10, created: 6 },
      { day: 'Sat', completed: 12, created: 3 },
      { day: 'Sun', completed: 8, created: 2 },
    ],
  },
  'ws-2': {
    velocity: '+18.4%',
    data: [
      { day: 'Mon', completed: 4, created: 6 },
      { day: 'Tue', completed: 7, created: 5 },
      { day: 'Wed', completed: 5, created: 8 },
      { day: 'Thu', completed: 9, created: 4 },
      { day: 'Fri', completed: 12, created: 7 },
      { day: 'Sat', completed: 6, created: 2 },
      { day: 'Sun', completed: 8, created: 3 },
    ],
  },
  'ws-3': {
    velocity: '+15.2%',
    data: [
      { day: 'Mon', completed: 3, created: 5 },
      { day: 'Tue', completed: 6, created: 4 },
      { day: 'Wed', completed: 8, created: 6 },
      { day: 'Thu', completed: 5, created: 7 },
      { day: 'Fri', completed: 11, created: 5 },
      { day: 'Sat', completed: 4, created: 2 },
      { day: 'Sun', completed: 7, created: 2 },
    ],
  },
};

export function ProductivityChart({ workspaceId: propWorkspaceId }) {
  const { theme } = useThemeContext();
  const { currentWorkspace } = useWorkspaceContext();
  const isDark = theme === 'dark';

  const activeWsId = propWorkspaceId || currentWorkspace?.id || 'ws-1';
  const config = WORKSPACE_DATA[activeWsId] || WORKSPACE_DATA['ws-2'];

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#DEE4EA]">Weekly Task Velocity</h3>
          <p className="text-xs text-slate-500 dark:text-[#9FADBC]">Tasks completed vs. new tasks logged</p>
        </div>
        <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1 rounded-md border border-emerald-200 dark:border-emerald-800/40">
          {config.velocity} velocity
        </span>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={config.data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0C66E4" stopOpacity={isDark ? 0.4 : 0.25} />
                <stop offset="95%" stopColor="#0C66E4" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#282E33' : '#E2E8F0'} opacity={0.8} />
            <XAxis dataKey="day" stroke={isDark ? '#738496' : '#94A3B8'} fontSize={11} tickLine={false} />
            <YAxis stroke={isDark ? '#738496' : '#94A3B8'} fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: isDark ? '#1D2125' : '#FFFFFF',
                borderRadius: '0.75rem',
                border: isDark ? '1px solid #282E33' : '1px solid #E2E8F0',
                color: isDark ? '#DEE4EA' : '#0F172A',
                fontSize: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
              }}
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke={isDark ? '#579DFF' : '#0C66E4'}
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorCompleted)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
