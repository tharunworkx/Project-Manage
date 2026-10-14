import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function StatCard({ title, value, change, trend = 'up', icon: Icon, color = 'indigo' }) {
  return (
    <div className="rounded-2xl border border-[#282E33] bg-[#161A1D] p-5 shadow-xs">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#9FADBC] uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="h-8 w-8 rounded-xl bg-[#22272B] text-[#579DFF] flex items-center justify-center">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-extrabold text-[#DEE4EA]">{value}</span>
        {change && (
          <span
            className={`inline-flex items-center text-xs font-semibold ${
              trend === 'up' ? 'text-emerald-500' : 'text-rose-500'
            }`}
          >
            {trend === 'up' ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
