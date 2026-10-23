import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function StatCard({ title, value, change, trend = 'up', icon: Icon, color = 'indigo' }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-5 shadow-xs transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-500 dark:text-[#9FADBC] uppercase tracking-wider">{title}</span>
        {Icon && (
          <div className="h-8 w-8 rounded-xl bg-slate-100 dark:bg-[#22272B] text-[#0C66E4] dark:text-[#579DFF] flex items-center justify-center">
            <Icon className="h-4 w-4" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">{value}</span>
        {change && (
          <span
            className={`inline-flex items-center text-xs font-semibold ${
              trend === 'up' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
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
