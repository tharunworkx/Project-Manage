import React from 'react';
import { ProductivityChart } from '../components/dashboard/ProductivityChart';
import { StatCard } from '../components/dashboard/StatCard';
import { TrendingUp, Award, Zap } from 'lucide-react';

export default function Reports() {
  return (
    <div className="w-full p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-[#DEE4EA]">Analytics & Reports</h1>
        <p className="text-sm text-slate-500 dark:text-[#9FADBC] mt-1">Sprint velocity, cycle times, and operational performance.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Sprint Velocity" value="48 pts" change="+14%" icon={Zap} />
        <StatCard title="Cycle Time" value="2.4 days" change="-0.8d" icon={TrendingUp} />
        <StatCard title="On-Time Delivery" value="94.2%" change="+3.1%" icon={Award} />
      </div>

      <ProductivityChart />
    </div>
  );
}
