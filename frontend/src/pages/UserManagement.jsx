import React, { useState } from 'react';
import {
  ShieldCheck,
  UserCheck,
  Search,
  Plus,
  MoreVertical,
  Users2,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';
import { toast } from 'sonner';

const INITIAL_USERS = [
  { id: '1', name: 'Tharun R', email: 'tharun.workx@gmail.com', role: 'admin', status: 'Active', avatar: 'TR', color: '#E8831D' },
  { id: '2', name: 'Alex Johnson', email: 'alex.j@company.com', role: 'admin', status: 'Active', avatar: 'AJ', color: '#0C66E4' },
  { id: '3', name: 'Maria Garcia', email: 'maria.g@company.com', role: 'team_member', status: 'Active', avatar: 'MG', color: '#579DFF' },
  { id: '4', name: 'David Chen', email: 'david.c@company.com', role: 'team_member', status: 'Active', avatar: 'DC', color: '#4BCE97' },
  { id: '5', name: 'Sophie Taylor', email: 'sophie.t@company.com', role: 'team_member', status: 'Active', avatar: 'ST', color: '#BA75FF' },
  { id: '6', name: 'Liam Wilson', email: 'liam.w@company.com', role: 'team_member', status: 'Invited', avatar: 'LW', color: '#F5CD47' },
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
    toast.success(`User role updated to ${newRole === 'admin' ? 'Admin / Project Manager' : 'Team Member'}`);
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
      color: inviteRole === 'admin' ? '#0C66E4' : '#4BCE97',
    };
    setUsers([newUser, ...users]);
    setInviteEmail('');
    setInviteName('');
    setIsInviteOpen(false);
    toast.success(`Invitation sent to ${inviteEmail} as ${inviteRole === 'admin' ? 'Admin / Project Manager' : 'Team Member'}`);
  };

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const adminCount = users.filter(u => u.role === 'admin').length;
  const memberCount = users.filter(u => u.role === 'team_member').length;

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-[#0C66E4]/10 dark:bg-[#579DFF]/15 border border-[#0C66E4]/25 flex items-center justify-center text-[#0C66E4] dark:text-[#579DFF]">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">User Management</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#9FADBC] mt-1 ml-11.5">
            Admin console: Manage team access, assign roles, and configure project permissions.
          </p>
        </div>

        <Button onClick={() => setIsInviteOpen(true)} className="gap-2 bg-[#0C66E4] hover:bg-[#0055CC] text-white">
          <Plus className="h-4 w-4" />
          <span>Invite New User</span>
        </Button>
      </div>

      {/* Exactly 2 Role Summary Cards with Coloured Lucide Logos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Admin / Project Managers */}
        <div className="rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-5 flex items-center justify-between shadow-xs hover:border-[#0C66E4]/40 transition-colors">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#9FADBC]">
              Admin / Project Managers
            </span>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">
                {adminCount}
              </p>
              <span className="text-xs text-slate-400">overseeing projects</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#0C66E4]/10 dark:bg-[#579DFF]/15 border border-[#0C66E4]/30 flex items-center justify-center text-[#0C66E4] dark:text-[#579DFF] shadow-xs">
            <ShieldCheck className="h-6 w-6 stroke-[2]" />
          </div>
        </div>

        {/* Card 2: Team Members */}
        <div className="rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-5 flex items-center justify-between shadow-xs hover:border-emerald-500/40 transition-colors">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#9FADBC]">
              Team Members
            </span>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">
                {memberCount}
              </p>
              <span className="text-xs text-slate-400">working on tasks</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
            <UserCheck className="h-6 w-6 stroke-[2]" />
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="rounded-2xl border border-[#0C66E4]/30 bg-blue-50/50 dark:bg-[#1C2B41]/40 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Users2 className="h-4 w-4 text-[#0C66E4] dark:text-[#579DFF]" />
            <h3 className="font-semibold text-sm text-slate-900 dark:text-[#DEE4EA]">Invite Member to Workspace</h3>
          </div>
          <form onSubmit={handleInvite} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Full name"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] text-xs text-slate-900 dark:text-[#DEE4EA]"
            />
            <input
              type="email"
              required
              placeholder="Email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] text-xs text-slate-900 dark:text-[#DEE4EA]"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] text-xs text-slate-900 dark:text-[#DEE4EA] font-medium"
            >
              <option value="team_member">Team Member (Default)</option>
              <option value="admin">Admin / Project Manager</option>
            </select>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 h-9 text-xs bg-[#0C66E4] hover:bg-[#0055CC] text-white">Send Invite</Button>
              <Button type="button" variant="outline" onClick={() => setIsInviteOpen(false)} className="h-9 text-xs">Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Table using Table component */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-[#282E33] flex items-center justify-between">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 pl-8.5 pr-3 rounded-xl border border-slate-200 dark:border-[#333C44] bg-slate-50 dark:bg-[#22272B] text-xs text-slate-900 dark:text-[#DEE4EA] focus:outline-none"
            />
          </div>
          <span className="text-xs text-slate-500 dark:text-[#738496]">{filteredUsers.length} total users</span>
        </div>

        <Table aria-label="Users Table">
          <TableHeader>
            <TableHead id="user" isRowHeader>User</TableHead>
            <TableHead id="email">Email</TableHead>
            <TableHead id="badge">Role Badge</TableHead>
            <TableHead id="permissions">Role & Permissions</TableHead>
            <TableHead id="status">Status</TableHead>
            <TableHead id="actions" className="text-right">Actions</TableHead>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id} id={user.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-8.5 w-8.5 rounded-full text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-xs"
                      style={{ backgroundColor: user.color || '#0C66E4' }}
                    >
                      {user.avatar}
                    </div>
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-[#DEE4EA]">{user.name}</span>
                      {user.id === '1' && (
                        <span className="ml-1.5 text-[10px] text-slate-400">(You)</span>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600 dark:text-[#9FADBC]">
                  {user.email}
                </TableCell>
                <TableCell>
                  {user.role === 'admin' ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#0C66E4]/10 dark:bg-[#579DFF]/15 text-[#0C66E4] dark:text-[#579DFF] border border-[#0C66E4]/30">
                      <ShieldCheck className="h-3.5 w-3.5 stroke-[2.2]" />
                      <span>Admin / Project Manager</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      <UserCheck className="h-3.5 w-3.5 stroke-[2.2]" />
                      <span>Team Member</span>
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <select
                    value={user.role === 'admin' ? 'admin' : 'team_member'}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] text-xs text-slate-900 dark:text-[#DEE4EA] font-semibold cursor-pointer focus:outline-none"
                  >
                    <option value="admin">Admin / Project Manager</option>
                    <option value="team_member">Team Member</option>
                  </select>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium ${
                    user.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                  }`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <button
                    className="p-1 rounded hover:bg-slate-100 dark:hover:bg-[#282E33] text-slate-400 hover:text-slate-700 dark:text-[#738496] cursor-pointer"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
