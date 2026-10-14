import React, { useState } from 'react';
import { ShieldCheck, UserCheck, Users, Search, MoreVertical, Plus, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { toast } from 'sonner';

const INITIAL_USERS = [
  { id: '1', name: 'Tharun R', email: 'tharun.workx@gmail.com', role: 'admin', status: 'Active', avatar: 'TR' },
  { id: '2', name: 'Alex Johnson', email: 'alex.j@company.com', role: 'project_manager', status: 'Active', avatar: 'AJ' },
  { id: '3', name: 'Maria Garcia', email: 'maria.g@company.com', role: 'team_member', status: 'Active', avatar: 'MG' },
  { id: '4', name: 'David Chen', email: 'david.c@company.com', role: 'team_member', status: 'Active', avatar: 'DC' },
  { id: '5', name: 'Sophie Taylor', email: 'sophie.t@company.com', role: 'project_manager', status: 'Active', avatar: 'ST' },
  { id: '6', name: 'Liam Wilson', email: 'liam.w@company.com', role: 'team_member', status: 'Invited', avatar: 'LW' },
];

export default function UserManagement() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('team_member');
  const [isInviteOpen, setIsInviteOpen] = useState(false);

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    toast.success(`User role updated to ${newRole.replace('_', ' ')}`);
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const newUser = {
      id: String(Date.now()),
      name: inviteName || inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'Invited',
      avatar: (inviteName ? inviteName.substring(0, 2) : inviteEmail.substring(0, 2)).toUpperCase(),
    };
    setUsers([newUser, ...users]);
    setInviteEmail('');
    setInviteName('');
    setIsInviteOpen(false);
    toast.success(`Invitation sent to ${inviteEmail} as ${inviteRole.replace('_', ' ')}`);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="h-6 w-6 text-[#0C66E4] dark:text-[#579DFF]" />
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">User Management</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#9FADBC] mt-1">
            Admin console: Manage team access, assign Project Managers, and configure permissions.
          </p>
        </div>

        <Button onClick={() => setIsInviteOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Invite New User</span>
        </Button>
      </div>

      {/* Role Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-[#9FADBC]">Administrators</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-[#DEE4EA]">
              {users.filter(u => u.role === 'admin').length}
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center font-bold">
            👑
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-[#9FADBC]">Project Managers</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-[#DEE4EA]">
              {users.filter(u => u.role === 'project_manager').length}
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold">
            💼
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-4 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-slate-500 dark:text-[#9FADBC]">Team Members</span>
            <p className="text-2xl font-bold text-slate-900 dark:text-[#DEE4EA]">
              {users.filter(u => u.role === 'team_member').length}
            </p>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">
            👤
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="rounded-2xl border border-indigo-200 dark:border-indigo-500/30 bg-indigo-50/50 dark:bg-indigo-950/20 p-5 space-y-4">
          <h3 className="font-semibold text-sm text-slate-900 dark:text-[#DEE4EA]">Invite Member to Workspace</h3>
          <form onSubmit={handleInvite} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Full name"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              className="h-9 px-3 rounded-lg border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] text-xs text-slate-900 dark:text-[#DEE4EA]"
            />
            <input
              type="email"
              required
              placeholder="Email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="h-9 px-3 rounded-lg border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] text-xs text-slate-900 dark:text-[#DEE4EA]"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="h-9 px-3 rounded-lg border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] text-xs text-slate-900 dark:text-[#DEE4EA]"
            >
              <option value="team_member">Team Member (Default)</option>
              <option value="project_manager">Project Manager</option>
              <option value="admin">Admin</option>
            </select>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 h-9 text-xs">Send Invite</Button>
              <Button type="button" variant="outline" onClick={() => setIsInviteOpen(false)} className="h-9 text-xs">Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-[#282E33] flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 pl-8.5 pr-3 rounded-lg border border-slate-200 dark:border-[#333C44] bg-slate-50 dark:bg-[#22272B] text-xs text-slate-900 dark:text-[#DEE4EA] focus:outline-none"
            />
          </div>
          <span className="text-xs text-slate-500 dark:text-[#738496]">{filteredUsers.length} total users</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-[#1C2125] text-slate-600 dark:text-[#9FADBC] border-b border-slate-200 dark:border-[#282E33]">
              <tr>
                <th className="py-3 px-4 font-semibold">User</th>
                <th className="py-3 px-4 font-semibold">Email</th>
                <th className="py-3 px-4 font-semibold">Role & Permissions</th>
                <th className="py-3 px-4 font-semibold">Status</th>
                <th className="py-3 px-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#282E33]">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/70 dark:hover:bg-[#22272B]/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#E8831D] text-[#0C162D] font-bold text-xs flex items-center justify-center">
                        {user.avatar}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-[#DEE4EA]">{user.name}</span>
                        {user.role === 'admin' && (
                          <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-medium">
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-[#9FADBC]">{user.email}</td>
                  <td className="py-3 px-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="px-2.5 py-1 rounded-md border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] text-xs text-slate-900 dark:text-[#DEE4EA] font-medium cursor-pointer"
                    >
                      <option value="admin">Admin</option>
                      <option value="project_manager">Project Manager</option>
                      <option value="team_member">Team Member</option>
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                      user.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                    }`}>
                      <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => toast.info(`Viewing details for ${user.name}`)}
                      className="p-1 rounded hover:bg-slate-100 dark:hover:bg-[#282E33] text-slate-400 hover:text-slate-700 dark:text-[#738496] cursor-pointer"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
