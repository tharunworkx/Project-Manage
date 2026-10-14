import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Boxes,
  Plus,
  Calendar,
  CheckCircle2,
  Clock,
  User,
  Search,
  Filter,
  ArrowUpRight,
  ChevronRight,
  Layers,
  Sparkles,
} from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import { toast } from 'sonner';
import { DatePicker } from '../components/ui/date-picker';

export default function ModulesPage() {
  const [filter, setFilter] = useState('all');
  const [searchVal, setSearchVal] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const [modules, setModules] = useState([
    {
      id: 'mod-1',
      name: 'Authentication & SSO Workspace Access',
      description: 'Implement enterprise OAuth 2.0, GitHub, Google, and SAML single sign-on access.',
      lead: 'Tharun S.',
      status: 'completed',
      startDate: '2026-09-20',
      dueDate: '2026-10-12',
      totalIssues: 6,
      completedIssues: 6,
      color: '#4BCE97',
    },
    {
      id: 'mod-2',
      name: 'Kanban & 5-State Workflow Engine',
      description: 'Support Backlog, Unstarted, Started, Completed, and Cancelled drag-and-drop state groups.',
      lead: 'Tharun S.',
      status: 'in_progress',
      startDate: '2026-10-01',
      dueDate: '2026-10-25',
      totalIssues: 12,
      completedIssues: 9,
      color: '#F5CD47',
    },
    {
      id: 'mod-3',
      name: 'Cycles & Sprint Burndown Calculation',
      description: 'Calculate real-time completion pace and estimate points velocity across iterations.',
      lead: 'Tharun S.',
      status: 'in_progress',
      startDate: '2026-10-10',
      dueDate: '2026-11-05',
      totalIssues: 8,
      completedIssues: 4,
      color: '#579DFF',
    },
    {
      id: 'mod-4',
      name: 'Integrations & Webhook Event Dispatcher',
      description: 'Outbound webhooks for issue creation, state transitions, and third-party notifications.',
      lead: 'Alex R.',
      status: 'planned',
      startDate: '2026-11-01',
      dueDate: '2026-11-20',
      totalIssues: 7,
      completedIssues: 0,
      color: '#9F8FEF',
    },
    {
      id: 'mod-5',
      name: 'Real-time Collaborative Editor & RFC Docs',
      description: 'Document specs, team guidelines, and meeting notes embedded in the workspace.',
      lead: 'Sarah K.',
      status: 'backlog',
      startDate: '2026-11-15',
      dueDate: '2026-12-01',
      totalIssues: 5,
      completedIssues: 0,
      color: '#738496',
    },
  ]);

  // Create form state
  const [newModName, setNewModName] = useState('');
  const [newModDesc, setNewModDesc] = useState('');
  const [newModLead, setNewModLead] = useState('Tharun S.');
  const [newModDue, setNewModDue] = useState('');

  const handleCreateModule = (e) => {
    e.preventDefault();
    if (!newModName.trim()) return;

    const newModule = {
      id: `mod-${Date.now()}`,
      name: newModName.trim(),
      description: newModDesc.trim(),
      lead: newModLead,
      status: 'planned',
      startDate: new Date().toISOString().split('T')[0],
      dueDate: newModDue || '2026-11-30',
      totalIssues: 0,
      completedIssues: 0,
      color: '#579DFF',
    };

    setModules([newModule, ...modules]);
    setIsCreateOpen(false);
    setNewModName('');
    setNewModDesc('');
    toast.success('Module created successfully!');
  };

  const filteredModules = modules.filter((m) => {
    if (filter !== 'all' && m.status !== filter) return false;
    if (searchVal && !m.name.toLowerCase().includes(searchVal.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-[#101214] text-[#DEE4EA] overflow-y-auto">
      {/* Header */}
      <div className="border-b border-[#282E33] bg-[#101214] px-6 py-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-[#9FADBC] mb-1">
              <span>My Software Team</span>
              <span>/</span>
              <span className="text-[#DEE4EA]">Modules</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-lg bg-[#9F8FEF]/15 text-[#BA75FF] flex items-center justify-center font-bold">
                <Boxes className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-[#DEE4EA]">Modules</h1>
                <p className="text-xs text-[#9FADBC]">
                  High-level features and deliverable milestones with ownership and progress.
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
              <span>Create Module</span>
            </button>
          </div>
        </div>

        {/* Filters and search row */}
        <div className="flex items-center justify-between gap-4 mt-5 pt-3 border-t border-[#282E33]/60">
          <div className="flex items-center gap-2">
            {[
              { id: 'all', label: 'All Modules' },
              { id: 'in_progress', label: 'In Progress' },
              { id: 'planned', label: 'Planned' },
              { id: 'completed', label: 'Completed' },
              { id: 'backlog', label: 'Backlog' },
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
                    layoutId="modules-tab-pill"
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
              placeholder="Search modules..."
              value={searchVal}
              onChange={(e) => setSearchVal(e.target.value)}
              className="w-full h-8 rounded-md border border-[#333C44] bg-[#22272B] pl-8 pr-3 text-xs text-[#DEE4EA] placeholder-[#738496] focus:border-[#579DFF] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Modules Grid */}
      <div className="w-full px-6 py-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredModules.map((mod) => {
            const percent =
              mod.totalIssues > 0
                ? Math.round((mod.completedIssues / mod.totalIssues) * 100)
                : 0;

            return (
              <div
                key={mod.id}
                className="rounded-xl border border-[#282E33] bg-[#161A1D] p-5 hover:border-[#388BFF]/60 transition flex flex-col justify-between group shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        mod.status === 'completed'
                          ? 'bg-[#163828] text-[#4BCE97]'
                          : mod.status === 'in_progress'
                          ? 'bg-[#3F3112] text-[#F5CD47]'
                          : mod.status === 'planned'
                          ? 'bg-[#1C2B41] text-[#579DFF]'
                          : 'bg-[#22272B] text-[#738496]'
                      }`}
                    >
                      {mod.status.replace('_', ' ')}
                    </span>

                    <span className="text-xs text-[#738496] flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {mod.dueDate}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-[#DEE4EA] group-hover:text-[#579DFF] transition">
                    {mod.name}
                  </h3>
                  <p className="text-xs text-[#9FADBC] mt-1.5 line-clamp-2">
                    {mod.description}
                  </p>
                </div>

                <div className="mt-5 pt-3.5 border-t border-[#282E33]/70 space-y-2.5">
                  {/* Progress info */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-[#9FADBC]">Progress</span>
                      <span className="font-semibold text-[#DEE4EA]">{percent}%</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-[#22272B] overflow-hidden">
                      <div
                        className="h-full bg-[#4BCE97] transition-all"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  {/* Footer metadata */}
                  <div className="flex items-center justify-between text-xs text-[#738496]">
                    <div className="flex items-center gap-1.5">
                      <div className="h-5 w-5 rounded-full bg-[#C25E00] text-white flex items-center justify-center font-bold text-[9px]">
                        TR
                      </div>
                      <span className="text-[#DEE4EA] font-medium">{mod.lead}</span>
                    </div>
                    <span>{mod.completedIssues}/{mod.totalIssues} issues</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Module Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Create Module"
        maxWidth="max-w-lg"
      >
        <form onSubmit={handleCreateModule} className="space-y-4 text-xs text-[#DEE4EA]">
          <div>
            <label className="block text-xs font-semibold text-[#9FADBC] mb-1">
              Module Name *
            </label>
            <input
              required
              autoFocus
              type="text"
              placeholder="e.g. Notifications & Webhooks"
              value={newModName}
              onChange={(e) => setNewModName(e.target.value)}
              className="w-full rounded-md bg-[#1D2125] border border-[#333C44] px-3 py-2 text-xs text-[#DEE4EA] focus:outline-none focus:border-[#579DFF]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#9FADBC] mb-1">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="Deliverable details and scope..."
              value={newModDesc}
              onChange={(e) => setNewModDesc(e.target.value)}
              className="w-full rounded-md bg-[#1D2125] border border-[#333C44] p-3 text-xs text-[#DEE4EA] focus:outline-none focus:border-[#579DFF]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#9FADBC] mb-1">
                Module Lead
              </label>
              <input
                type="text"
                value={newModLead}
                onChange={(e) => setNewModLead(e.target.value)}
                className="w-full rounded-md bg-[#1D2125] border border-[#333C44] px-3 py-2 text-xs text-[#DEE4EA] focus:outline-none focus:border-[#579DFF]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9FADBC] mb-1">
                Target Date
              </label>
              <DatePicker
                value={newModDue}
                onChange={(val) => setNewModDue(val)}
                placeholder="Select target date"
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
              Create Module
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
