import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Repeat,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle,
  PlayCircle,
  Search,
  Filter,
  TrendingUp,
  MoreHorizontal,
  ChevronRight,
  ArrowUpRight,
  CheckSquare,
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { DatePicker } from '../components/ui/date-picker';

export default function CyclesPage() {
  const [filter, setFilter] = useState('all'); // all, active, upcoming, completed
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  // Initial Plane-style Cycles
  const [cycles, setCycles] = useState([
    {
      id: 'cycle-14',
      number: 14,
      name: 'Cycle 14 · Sprint Alpha (Foundation & Workflows)',
      description: 'Implement core state workflow groups, Kanban drag-and-drop mechanics, and workspace navigation.',
      startDate: '2026-10-01',
      endDate: '2026-10-28',
      status: 'active',
      totalIssues: 14,
      completedIssues: 9,
      inProgressIssues: 3,
      backlogIssues: 2,
      points: 42,
      completedPoints: 28,
      items: [
        { id: '1', key: 'KAN-4', title: 'Implement Plane 5-state drag-n-drop workflow', status: 'in_progress', priority: 'urgent' },
        { id: '2', key: 'KAN-5', title: 'Burndown velocity chart calculation & cycle progress bar', status: 'in_review', priority: 'high' },
        { id: '3', key: 'KAN-6', title: 'Initialize Taskora dark theme design system', status: 'done', priority: 'medium' },
        { id: '4', key: 'KAN-3', title: 'Architecture RFC for Cycles & Timebox Engine', status: 'todo', priority: 'high' },
      ],
    },
    {
      id: 'cycle-15',
      number: 15,
      name: 'Cycle 15 · API & Realtime Sync Engine',
      description: 'Connect Supabase realtime change events and automated Webhook dispatcher.',
      startDate: '2026-10-29',
      endDate: '2026-11-12',
      status: 'upcoming',
      totalIssues: 8,
      completedIssues: 0,
      inProgressIssues: 0,
      backlogIssues: 8,
      points: 26,
      completedPoints: 0,
      items: [
        { id: '5', key: 'KAN-1', title: 'OAuth 2.0 & WorkOS SSO Authentication Provider', status: 'backlog', priority: 'medium' },
        { id: '6', key: 'KAN-2', title: 'Database index tuning & query caching for work items', status: 'backlog', priority: 'low' },
      ],
    },
    {
      id: 'cycle-13',
      number: 13,
      name: 'Cycle 13 · Project Scaffolding & Setup',
      description: 'Setup build system, Tailwind tokens, and initial board layout structure.',
      startDate: '2026-09-15',
      endDate: '2026-09-30',
      status: 'completed',
      totalIssues: 12,
      completedIssues: 12,
      inProgressIssues: 0,
      backlogIssues: 0,
      points: 34,
      completedPoints: 34,
      items: [],
    },
  ]);

  // New cycle form state
  const [newCycleName, setNewCycleName] = useState('');
  const [newCycleDesc, setNewCycleDesc] = useState('');
  const [newCycleStart, setNewCycleStart] = useState('');
  const [newCycleEnd, setNewCycleEnd] = useState('');

  const handleCreateCycle = (e) => {
    e.preventDefault();
    if (!newCycleName.trim()) return;

    const newCycle = {
      id: `cycle-${Date.now()}`,
      number: cycles.length + 13,
      name: newCycleName.trim(),
      description: newCycleDesc.trim(),
      startDate: newCycleStart || '2026-11-01',
      endDate: newCycleEnd || '2026-11-15',
      status: 'upcoming',
      totalIssues: 0,
      completedIssues: 0,
      inProgressIssues: 0,
      backlogIssues: 0,
      points: 0,
      completedPoints: 0,
      items: [],
    };

    setCycles([newCycle, ...cycles]);
    setIsCreateOpen(false);
    setNewCycleName('');
    setNewCycleDesc('');
  };

  const filteredCycles = cycles.filter((c) => {
    if (filter !== 'all' && c.status !== filter) return false;
    if (searchVal && !c.name.toLowerCase().includes(searchVal.toLowerCase())) return false;
    return true;
  });

  const activeCycle = cycles.find((c) => c.status === 'active');

  return (
    <div className="flex flex-col h-full bg-[#101214] text-[#DEE4EA] overflow-y-auto">
      {/* Header */}
      <div className="border-b border-[#282E33] bg-[#101214] px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#9FADBC] mb-1">
              <span>My Software Team</span>
              <span>/</span>
              <span className="text-[#DEE4EA]">Cycles</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#579DFF]/15 text-[#579DFF] flex items-center justify-center font-bold">
                <Repeat className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-[#DEE4EA]">Cycles</h1>
                <p className="text-xs text-[#9FADBC]">
                  Time-boxed sprints to plan, pace, and measure team velocity.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCreateOpen(true)}
              className="flex h-9 items-center gap-1.5 rounded-md bg-[#0C66E4] hover:bg-[#0055CC] px-3.5 text-xs font-semibold text-white shadow-xs transition cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>Create Cycle</span>
            </button>
          </div>
        </div>

        {/* Filters and search row */}
        <div className="flex items-center justify-between gap-4 mt-5 pt-3 border-t border-[#282E33]/60">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All Cycles' },
              { id: 'active', label: 'Active' },
              { id: 'upcoming', label: 'Upcoming' },
              { id: 'completed', label: 'Completed' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id)}
                className={`relative px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer select-none ${
                  filter === tab.id
                    ? 'text-[#579DFF] font-semibold'
                    : 'text-[#9FADBC] hover:text-[#DEE4EA]'
                }`}
              >
                {filter === tab.id && (
                  <motion.div
                    layoutId="cycles-tab-pill"
                    className="absolute inset-0 rounded-lg bg-[#1C2B41] border border-[#579DFF]/40 -z-10 shadow-xs"
                    transition={{
                      type: 'spring',
                      stiffness: 600,
                      damping: 36,
                      mass: 0.5,
                    }}
                  />
                )}
                <span className="relative z-10">{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="relative w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#738496]" />
            <input
              type="text"
              placeholder="Search cycles..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full h-8 rounded-md border border-[#333C44] bg-[#22272B] pl-8 pr-3 text-xs text-[#DEE4EA] placeholder-[#738496] focus:border-[#579DFF] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full px-6 py-6 space-y-6">
        {/* Active Cycle Spotlight Hero */}
        {activeCycle && (filter === 'all' || filter === 'active') && (
          <div className="rounded-xl border border-[#282E33] bg-[#161A1D] p-5 shadow-sm space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#163828] text-[#4BCE97] border border-[#4BCE97]/40">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#4BCE97] animate-pulse" />
                    Active Cycle
                  </span>
                  <span className="text-xs text-[#738496]">
                    {activeCycle.startDate} – {activeCycle.endDate}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-[#DEE4EA]">{activeCycle.name}</h2>
                <p className="text-xs text-[#9FADBC] mt-1 max-w-2xl">{activeCycle.description}</p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-bold text-[#579DFF]">
                  {Math.round((activeCycle.completedIssues / activeCycle.totalIssues) * 100)}%
                </span>
                <p className="text-[11px] text-[#738496]">Completion rate</p>
              </div>
            </div>

            {/* Progress bar */}
            <div>
              <div className="h-2 w-full rounded-full bg-[#22272B] overflow-hidden flex">
                <div
                  className="bg-[#4BCE97] transition-all"
                  style={{ width: `${(activeCycle.completedIssues / activeCycle.totalIssues) * 100}%` }}
                />
                <div
                  className="bg-[#F5CD47] transition-all"
                  style={{ width: `${(activeCycle.inProgressIssues / activeCycle.totalIssues) * 100}%` }}
                />
              </div>

              {/* Progress metrics breakdown */}
              <div className="flex items-center justify-between text-xs text-[#9FADBC] mt-2">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#4BCE97]" />
                    {activeCycle.completedIssues} Completed
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#F5CD47]" />
                    {activeCycle.inProgressIssues} In Progress
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#738496]" />
                    {activeCycle.backlogIssues} Pending
                  </span>
                </div>
                <span>{activeCycle.totalIssues} total work items</span>
              </div>
            </div>

            {/* Active Cycle Work Items preview */}
            {activeCycle.items.length > 0 && (
              <div className="pt-3 border-t border-[#282E33]/70">
                <p className="text-xs font-semibold text-[#9FADBC] mb-2">Cycle Work Items</p>
                <div className="space-y-1.5">
                  {activeCycle.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-[#1D2125] hover:bg-[#22272B] transition cursor-pointer text-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <CheckSquare className="h-3.5 w-3.5 text-[#579DFF]" />
                        <span className="font-semibold text-[#579DFF]">{item.key}</span>
                        <span className="text-[#DEE4EA] font-medium">{item.title}</span>
                      </div>
                      <span className="capitalize text-[11px] text-[#9FADBC] px-2 py-0.5 rounded bg-[#282E33]">
                        {item.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Cycles List */}
        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-[#738496] uppercase tracking-wider">
            All Cycles ({filteredCycles.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCycles.map((cycle) => {
              const percent =
                cycle.totalIssues > 0
                  ? Math.round((cycle.completedIssues / cycle.totalIssues) * 100)
                  : 0;

              return (
                <div
                  key={cycle.id}
                  className="rounded-xl border border-[#282E33] bg-[#161A1D] p-4.5 hover:border-[#388BFF]/60 transition flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          cycle.status === 'active'
                            ? 'bg-[#163828] text-[#4BCE97]'
                            : cycle.status === 'upcoming'
                            ? 'bg-[#1C2B41] text-[#579DFF]'
                            : 'bg-[#22272B] text-[#738496]'
                        }`}
                      >
                        {cycle.status}
                      </span>
                      <span className="text-xs text-[#738496]">
                        {cycle.startDate} – {cycle.endDate}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-[#DEE4EA]">{cycle.name}</h4>
                    <p className="text-xs text-[#9FADBC] mt-1 line-clamp-2">{cycle.description}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-[#282E33]/60">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-[#9FADBC]">Progress</span>
                      <span className="font-semibold text-[#DEE4EA]">{percent}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#22272B] overflow-hidden">
                      <div
                        className="h-full bg-[#4BCE97]"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-[#738496] mt-2">
                      <span>{cycle.completedIssues}/{cycle.totalIssues} items resolved</span>
                      <span>{cycle.points} story points</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Create Cycle Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Cycle"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateCycle} className="space-y-4 text-xs text-[#DEE4EA]">
          <div>
            <label className="block text-xs font-semibold text-[#9FADBC] mb-1">
              Cycle Name *
            </label>
            <input
              required
              autoFocus
              type="text"
              placeholder="e.g. Cycle 17 · Beta Release"
              value={newCycleName}
              onChange={(e) => setNewCycleName(e.target.value)}
              className="w-full rounded-md bg-[#1D2125] border border-[#333C44] px-3 py-2 text-xs text-[#DEE4EA] focus:outline-none focus:border-[#579DFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9FADBC] mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Sprint goals and deliverables..."
              value={newCycleDesc}
              onChange={(e) => setNewCycleDesc(e.target.value)}
              className="w-full rounded-md bg-[#1D2125] border border-[#333C44] p-3 text-xs text-[#DEE4EA] focus:outline-none focus:border-[#579DFF]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#9FADBC] mb-1">
                Start Date
              </label>
              <DatePicker
                value={newCycleStart}
                onChange={(val) => setNewCycleStart(val)}
                placeholder="Select start date"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#9FADBC] mb-1">
                End Date
              </label>
              <DatePicker
                value={newCycleEnd}
                onChange={(val) => setNewCycleEnd(val)}
                placeholder="Select end date"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-[#282E33]">
            <button
              type="button"
              onClick={() => setIsCreateOpen(false)}
              className="px-3 py-1.5 rounded-md hover:bg-[#282E33] text-xs font-semibold text-[#DEE4EA] transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-md bg-[#0C66E4] hover:bg-[#0055CC] text-xs font-semibold text-white transition cursor-pointer"
            >
              Create Cycle
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
