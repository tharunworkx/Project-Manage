import React, { useState } from 'react';
import {
  ShieldCheck,
  Briefcase,
  UserCheck,
  Search,
  Plus,
  MoreVertical,
  Users2,
  UserX,
  UserCheck2,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
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
  { id: '1', name: 'Tharun R', email: 'tharun.workx@gmail.com', role: 'admin', status: 'Active', avatar: 'TR', color: '#7C3AED' },
  { id: '2', name: 'Alex Johnson', email: 'alex.j@company.com', role: 'project_manager', status: 'Active', avatar: 'AJ', color: '#0C66E4' },
  { id: '3', name: 'Sarah Miller', email: 'sarah.m@company.com', role: 'project_manager', status: 'Active', avatar: 'SM', color: '#0284C7' },
  { id: '4', name: 'Maria Garcia', email: 'maria.g@company.com', role: 'team_member', status: 'Active', avatar: 'MG', color: '#10B981' },
  { id: '5', name: 'David Chen', email: 'david.c@company.com', role: 'team_member', status: 'Active', avatar: 'DC', color: '#059669' },
  { id: '6', name: 'Sophie Taylor', email: 'sophie.t@company.com', role: 'team_member', status: 'Deactivated', avatar: 'ST', color: '#64748B' },
  { id: '7', name: 'Liam Wilson', email: 'liam.w@company.com', role: 'team_member', status: 'Invited', avatar: 'LW', color: '#F59E0B' },
];

export default function UserManagement() {
  const [users, setUsers] = useState(INITIAL_USERS);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('team_member');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    const roleLabels = {
      admin: 'Admin',
      project_manager: 'Project Manager',
      team_member: 'Team Member',
    };
    toast.success(`Role updated to ${roleLabels[newRole] || newRole}`);
  };

  const handleToggleStatus = (userId) => {
    setUsers(users.map(u => {
      if (u.id === userId) {
        const nextStatus = u.status === 'Active' ? 'Deactivated' : 'Active';
        toast.success(`Employee account marked as ${nextStatus}`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  const handleSaveEdit = (userId) => {
    if (!editName.trim()) return;
    setUsers(users.map(u => u.id === userId ? { ...u, name: editName } : u));
    setEditingUserId(null);
    setEditName('');
    toast.success('Employee account updated successfully');
  };

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const colors = {
      admin: '#7C3AED',
      project_manager: '#0C66E4',
      team_member: '#10B981',
    };
    const newUser = {
      id: String(Date.now()),
      name: inviteName || inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'Active',
      avatar: (inviteName ? inviteName.substring(0, 2) : inviteEmail.substring(0, 2)).toUpperCase(),
      color: colors[inviteRole] || '#10B981',
    };
    setUsers([newUser, ...users]);
    setInviteEmail('');
    setInviteName('');
    setIsInviteOpen(false);
    toast.success(`Employee account created for ${inviteEmail}`);
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const adminCount = users.filter(u => u.role === 'admin' && u.status === 'Active').length;
  const pmCount = users.filter(u => u.role === 'project_manager' && u.status === 'Active').length;
  const memberCount = users.filter(u => u.role === 'team_member' && u.status === 'Active').length;

  return (
    <div className="p-6 space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/25 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">Employee Accounts & Roles</h1>
          </div>
          <p className="text-xs text-slate-500 dark:text-[#9FADBC] mt-1 ml-11.5">
            Admin console: Create, view, edit, and deactivate employee accounts, assign Project Managers, and manage workspace permissions.
          </p>
        </div>

        <Button onClick={() => setIsInviteOpen(true)} className="gap-2 bg-purple-600 hover:bg-purple-700 text-white shadow-xs">
          <Plus className="h-4 w-4" />
          <span>Add Employee Account</span>
        </Button>
      </div>

      {/* 3 Role Summary Cards with Coloured Lucide Logos */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Card 1: Administrators */}
        <div
          onClick={() => setRoleFilter(roleFilter === 'admin' ? 'all' : 'admin')}
          className={`cursor-pointer rounded-2xl border bg-white dark:bg-[#161A1D] p-5 flex items-center justify-between shadow-xs transition-all ${
            roleFilter === 'admin'
              ? 'border-purple-500 ring-2 ring-purple-500/20'
              : 'border-slate-200 dark:border-[#282E33] hover:border-purple-500/40'
          }`}
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#9FADBC]">
              Administrators
            </span>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">
                {adminCount}
              </p>
              <span className="text-xs text-purple-600 dark:text-purple-400 font-medium">Full access</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-purple-500/10 dark:bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-xs">
            <ShieldCheck className="h-6 w-6 stroke-[2]" />
          </div>
        </div>

        {/* Card 2: Project Managers */}
        <div
          onClick={() => setRoleFilter(roleFilter === 'project_manager' ? 'all' : 'project_manager')}
          className={`cursor-pointer rounded-2xl border bg-white dark:bg-[#161A1D] p-5 flex items-center justify-between shadow-xs transition-all ${
            roleFilter === 'project_manager'
              ? 'border-[#0C66E4] ring-2 ring-[#0C66E4]/20'
              : 'border-slate-200 dark:border-[#282E33] hover:border-[#0C66E4]/40'
          }`}
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#9FADBC]">
              Project Managers
            </span>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">
                {pmCount}
              </p>
              <span className="text-xs text-[#0C66E4] dark:text-[#579DFF] font-medium">Projects & teams</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-[#0C66E4]/10 dark:bg-[#579DFF]/15 border border-[#0C66E4]/30 flex items-center justify-center text-[#0C66E4] dark:text-[#579DFF] shadow-xs">
            <Briefcase className="h-6 w-6 stroke-[2]" />
          </div>
        </div>

        {/* Card 3: Team Members */}
        <div
          onClick={() => setRoleFilter(roleFilter === 'team_member' ? 'all' : 'team_member')}
          className={`cursor-pointer rounded-2xl border bg-white dark:bg-[#161A1D] p-5 flex items-center justify-between shadow-xs transition-all ${
            roleFilter === 'team_member'
              ? 'border-emerald-500 ring-2 ring-emerald-500/20'
              : 'border-slate-200 dark:border-[#282E33] hover:border-emerald-500/40'
          }`}
        >
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-500 dark:text-[#9FADBC]">
              Team Members
            </span>
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">
                {memberCount}
              </p>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Tasks & progress</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-xs">
            <UserCheck className="h-6 w-6 stroke-[2]" />
          </div>
        </div>
      </div>

      {/* Add / Create Employee Modal */}
      {isInviteOpen && (
        <div className="rounded-2xl border border-purple-500/30 bg-purple-50/50 dark:bg-purple-950/20 p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Users2 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
            <h3 className="font-semibold text-sm text-slate-900 dark:text-[#DEE4EA]">Create New Employee Account</h3>
          </div>
          <form onSubmit={handleInvite} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Full name (e.g. John Doe)"
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] text-xs text-slate-900 dark:text-[#DEE4EA] focus:outline-none"
            />
            <input
              type="email"
              required
              placeholder="Work email address"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] text-xs text-slate-900 dark:text-[#DEE4EA] focus:outline-none"
            />
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="h-9 px-3 rounded-xl border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] text-xs text-slate-900 dark:text-[#DEE4EA] font-medium"
            >
              <option value="team_member">Team Member (Default)</option>
              <option value="project_manager">Project Manager</option>
              <option value="admin">Administrator</option>
            </select>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1 h-9 text-xs bg-purple-600 hover:bg-purple-700 text-white">Create Account</Button>
              <Button type="button" variant="outline" onClick={() => setIsInviteOpen(false)} className="h-9 text-xs">Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {/* Search and Table */}
      <div className="rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 dark:border-[#282E33] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search employee accounts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 pl-8.5 pr-3 rounded-xl border border-slate-200 dark:border-[#333C44] bg-slate-50 dark:bg-[#22272B] text-xs text-slate-900 dark:text-[#DEE4EA] focus:outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            {roleFilter !== 'all' && (
              <button
                onClick={() => setRoleFilter('all')}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-[#22272B] text-slate-600 dark:text-[#9FADBC] hover:text-slate-900 transition"
              >
                Clear filter ({roleFilter})
              </button>
            )}
            <span className="text-xs text-slate-500 dark:text-[#738496]">{filteredUsers.length} employee accounts</span>
          </div>
        </div>

        <Table aria-label="Employee Accounts Table">
          <TableHeader>
            <TableHead id="user" isRowHeader>Employee</TableHead>
            <TableHead id="email">Work Email</TableHead>
            <TableHead id="badge">Role Badge</TableHead>
            <TableHead id="permissions">Assigned Role</TableHead>
            <TableHead id="status">Account Status</TableHead>
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
                      {editingUserId === user.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-7 px-2 text-xs rounded border border-purple-500 bg-white dark:bg-[#22272B] text-slate-900 dark:text-[#DEE4EA]"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveEdit(user.id)}
                            className="p-1 text-emerald-600 hover:text-emerald-700"
                            title="Save"
                          >
                            <CheckCircle2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => setEditingUserId(null)}
                            className="p-1 text-slate-400 hover:text-slate-600"
                            title="Cancel"
                          >
                            <XCircle className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-slate-900 dark:text-[#DEE4EA]">{user.name}</span>
                          {user.id === '1' && (
                            <span className="text-[10px] text-purple-600 dark:text-purple-400 font-bold bg-purple-500/10 px-1.5 py-0.2 rounded">(You)</span>
                          )}
                          <button
                            onClick={() => {
                              setEditingUserId(user.id);
                              setEditName(user.name);
                            }}
                            className="opacity-0 group-hover:opacity-100 hover:opacity-100 text-slate-400 hover:text-slate-700 p-0.5"
                            title="Edit employee name"
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600 dark:text-[#9FADBC]">
                  {user.email}
                </TableCell>
                <TableCell>
                  {user.role === 'admin' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-purple-500/10 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/30">
                      <ShieldCheck className="h-3.5 w-3.5 stroke-[2.2]" />
                      <span>Admin</span>
                    </span>
                  )}
                  {user.role === 'project_manager' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-[#0C66E4]/10 dark:bg-[#579DFF]/15 text-[#0C66E4] dark:text-[#579DFF] border border-[#0C66E4]/30">
                      <Briefcase className="h-3.5 w-3.5 stroke-[2.2]" />
                      <span>Project Manager</span>
                    </span>
                  )}
                  {user.role === 'team_member' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                      <UserCheck className="h-3.5 w-3.5 stroke-[2.2]" />
                      <span>Team Member</span>
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-[#333C44] bg-white dark:bg-[#22272B] text-xs text-slate-900 dark:text-[#DEE4EA] font-semibold cursor-pointer focus:outline-none"
                  >
                    <option value="admin">Admin</option>
                    <option value="project_manager">Project Manager</option>
                    <option value="team_member">Team Member</option>
                  </select>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                    user.status === 'Active'
                      ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20'
                      : user.status === 'Deactivated'
                      ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                      : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                  }`}>
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                    {user.status}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {user.status === 'Active' ? (
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/40 hover:bg-rose-100 transition cursor-pointer"
                        title="Deactivate employee account"
                      >
                        <UserX className="h-3.5 w-3.5" />
                        <span>Deactivate</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(user.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/40 hover:bg-emerald-100 transition cursor-pointer"
                        title="Reactivate employee account"
                      >
                        <UserCheck2 className="h-3.5 w-3.5" />
                        <span>Activate</span>
                      </button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
