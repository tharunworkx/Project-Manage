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

const DATA = [
  { day: 'Mon', completed: 4, created: 6 },
  { day: 'Tue', completed: 7, created: 5 },
  { day: 'Wed', completed: 5, created: 8 },
  { day: 'Thu', completed: 9, created: 4 },
  { day: 'Fri', completed: 12, created: 7 },
  { day: 'Sat', completed: 6, created: 2 },
  { day: 'Sun', completed: 8, created: 3 },
];

export function ProductivityChart() {
  return (
    <div className="rounded-2xl border border-[#282E33] bg-[#161A1D] p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#DEE4EA]">Weekly Task Velocity</h3>
          <p className="text-xs text-[#9FADBC]">Tasks completed vs. new tasks logged</p>
        </div>
        <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-md border border-emerald-800/40">
          +18.4% velocity
        </span>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#579DFF" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#579DFF" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#282E33" opacity={0.6} />
            <XAxis dataKey="day" stroke="#738496" fontSize={11} tickLine={false} />
            <YAxis stroke="#738496" fontSize={11} tickLine={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1D2125',
                borderRadius: '0.75rem',
                border: '1px solid #282E33',
                color: '#DEE4EA',
                fontSize: '12px',
              }}
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="#579DFF"
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
