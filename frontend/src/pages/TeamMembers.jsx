import React, { useState } from 'react';
import { Users2, Search, Mail, CheckCircle2, Shield, Briefcase, User } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

const MEMBERS = [
  { id: '1', name: 'Tharun R', email: 'tharun.workx@gmail.com', role: 'admin', activeTasks: 5, avatar: 'TR', color: '#E8831D' },
  { id: '2', name: 'Alex Johnson', email: 'alex.j@company.com', role: 'project_manager', activeTasks: 8, avatar: 'AJ', color: '#0C66E4' },
  { id: '3', name: 'Maria Garcia', email: 'maria.g@company.com', role: 'team_member', activeTasks: 4, avatar: 'MG', color: '#579DFF' },
  { id: '4', name: 'David Chen', email: 'david.c@company.com', role: 'team_member', activeTasks: 6, avatar: 'DC', color: '#4BCE97' },
  { id: '5', name: 'Sophie Taylor', email: 'sophie.t@company.com', role: 'project_manager', activeTasks: 7, avatar: 'ST', color: '#BA75FF' },
  { id: '6', name: 'Liam Wilson', email: 'liam.w@company.com', role: 'team_member', activeTasks: 2, avatar: 'LW', color: '#F5CD47' },
];

export default function TeamMembers() {
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const filtered = MEMBERS.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase()) || m.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = filterRole === 'all' || m.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Shield className="h-3 w-3" /> Admin
          </span>
        );
      case 'project_manager':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Briefcase className="h-3 w-3" /> Project Manager
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <User className="h-3 w-3" /> Team Member
          </span>
        );
    }
  };

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      <div>
        <div className="flex items-center gap-2.5">
          <Users2 className="h-6 w-6 text-[#0C66E4] dark:text-[#579DFF]" />
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">Team Members</h1>
        </div>
        <p className="text-xs text-slate-500 dark:text-[#9FADBC] mt-1">
          Collaborators, project managers, and contributors active in this workspace.
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search member name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#161A1D] text-xs text-slate-900 dark:text-[#DEE4EA] focus:outline-none"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          {['all', 'admin', 'project_manager', 'team_member'].map((r) => (
            <button
              key={r}
              onClick={() => setFilterRole(r)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer capitalize ${
                filterRole === r
                  ? 'bg-[#0C66E4] text-white'
                  : 'bg-white dark:bg-[#161A1D] border border-slate-200 dark:border-[#282E33] text-slate-600 dark:text-[#9FADBC] hover:bg-slate-50 dark:hover:bg-[#22272B]'
              }`}
            >
              {r === 'all' ? 'All Roles' : r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((member) => (
          <div
            key={member.id}
            className="rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-5 space-y-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="h-11 w-11 rounded-full text-white font-bold text-sm flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: member.color }}
                >
                  {member.avatar}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 dark:text-[#DEE4EA] leading-tight">{member.name}</h3>
                  <span className="text-xs text-slate-500 dark:text-[#9FADBC]">{member.email}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#282E33]/60 text-xs">
              <div>{getRoleBadge(member.role)}</div>
              <div className="text-slate-500 dark:text-[#738496]">
                <strong className="text-slate-900 dark:text-[#DEE4EA]">{member.activeTasks}</strong> active tasks
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info(`Viewing profile for ${member.name}`)}
              className="w-full text-xs h-8"
            >
              <Mail className="h-3.5 w-3.5 mr-1.5" />
              Message
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
