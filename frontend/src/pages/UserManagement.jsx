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
import { userService } from '../services/userService';
import { Select } from '@/components/ui/Select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { useAuthContext } from '../context/AuthContext';
import { activityService } from '../services/activityService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { toast } from 'sonner';
import { Navigate, useNavigate } from 'react-router-dom';

export default function UserManagement() {
  const { isAdmin } = useAuthContext();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isAdmin) {
      navigate('/kanban', { replace: true });
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return <Navigate to="/kanban" replace />;
  }

  const [users, setUsers] = useState(() => userService.getUsers());
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteName, setInviteName] = useState('');
  const [inviteRole, setInviteRole] = useState('team_member');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editName, setEditName] = useState('');
  const [userToDelete, setUserToDelete] = useState(null);

  React.useEffect(() => {
    const refresh = () => {
      userService.fetchUsersFromRemote().then((loaded) => {
        if (Array.isArray(loaded)) setUsers(loaded);
      });
    };

    refresh();

    const handleCustomSync = (e) => {
      if (e?.detail?.deleted && (e.detail.id || e.detail.email)) {
        setUsers((prev) =>
          prev.filter(
            (u) =>
              (e.detail.id ? u.id !== e.detail.id : true) &&
              (e.detail.email ? u.email?.toLowerCase() !== e.detail.email?.toLowerCase() : true)
          )
        );
      } else if (Array.isArray(e?.detail?.users)) {
        setUsers(e.detail.users);
      } else {
        refresh();
      }
    };

    window.addEventListener('taskflow_users_updated', handleCustomSync);
    window.addEventListener('storage', refresh);

    let channel = null;
    if (isSupabaseConfigured) {
      const channelId = `realtime_users_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      channel = supabase
        .channel(channelId)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
          if (payload?.eventType === 'DELETE' && payload.old?.id) {
            setUsers((prev) => prev.filter((u) => u.id !== payload.old.id));
            try {
              const cur = userService.getUsers();
              userService.saveUsers(cur.filter((u) => u.id !== payload.old.id));
            } catch {}
          } else {
            refresh();
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
          if (payload?.eventType === 'DELETE' && payload.old?.id) {
            setUsers((prev) => prev.filter((u) => u.id !== payload.old.id));
            try {
              const cur = userService.getUsers();
              userService.saveUsers(cur.filter((u) => u.id !== payload.old.id));
            } catch {}
          } else {
            refresh();
          }
        })
        .subscribe();
    }

    return () => {
      window.removeEventListener('taskflow_users_updated', handleCustomSync);
      window.removeEventListener('storage', refresh);
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const handleRoleChange = (userId, newRole) => {
    const targetUser = users.find((u) => u.id === userId);
    userService.updateRole(userId, newRole);
    setUsers(userService.getUsers());
    activityService.logActivity('all', {
      user: user?.name || 'Admin',
      action: 'promoted/updated role for',
      target: `${targetUser?.name || 'Employee'} to ${newRole === 'project_manager' ? 'Project Manager' : 'Team Member'}`,
      type: 'role',
    });
    toast.success('Role updated');
  };

  const handleToggleStatus = async (userId) => {
    let nextStatus = 'Active';
    let targetName = '';
    const updated = users.map((u) => {
      if (u.id === userId) {
        nextStatus = u.status === 'Active' ? 'Deactivated' : 'Active';
        targetName = u.name;
        return { ...u, status: nextStatus };
      }
      return u;
    });
    setUsers(updated);
    userService.saveUsers(updated);
    const targetUser = updated.find((u) => u.id === userId);
    if (targetUser) {
      userService.syncUserToRemote(targetUser);
    }
    activityService.logActivity('all', {
      user: user?.name || 'Admin',
      action: `${nextStatus === 'Active' ? 'activated' : 'deactivated'} employee account for`,
      target: targetName || 'Employee',
      type: 'user',
    });
    toast.info(`Account status for "${targetName || 'User'}" set to ${nextStatus}`);
  };

  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    const target = userToDelete;
    const deletedName = target.name || 'User';
    setUserToDelete(null);

    // Optimistic immediate UI removal
    setUsers((prev) =>
      prev.filter((u) => u.id !== target.id && u.email?.toLowerCase() !== target.email?.toLowerCase())
    );

    try {
      await userService.deleteUser(target);
      activityService.logActivity('all', {
        user: user?.name || 'Admin',
        action: 'deleted employee account for',
        target: deletedName,
        type: 'user',
      });
      toast.success(`Account "${deletedName}" deleted permanently`);
    } catch (err) {
      console.error('Delete user error:', err);
      toast.error('Failed to delete user');
      userService.fetchUsersFromRemote().then((loaded) => {
        if (Array.isArray(loaded)) setUsers(loaded);
      });
    }
  };

  const handleSaveEdit = (userId) => {
    if (!editName.trim()) return;
    userService.updateUserProfile(userId, { name: editName });
    setUsers(userService.getUsers());
    activityService.logActivity('all', {
      user: user?.name || 'Admin',
      action: 'updated employee profile for',
      target: editName,
      type: 'user',
    });
    setEditingUserId(null);
    setEditName('');
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    try {
      const newUser = await userService.addUserByAdmin({
        name: inviteName.trim(),
        email: inviteEmail.trim(),
        role: inviteRole,
      });
      setUsers(userService.getUsers());
      setInviteEmail('');
      setInviteName('');
      setIsInviteOpen(false);
      activityService.logActivity('all', {
        user: user?.name || 'Admin',
        action: 'added employee account for',
        target: `${newUser.name} (${newUser.role === 'project_manager' ? 'Project Manager' : 'Team Member'})`,
        taskTitle: newUser.email,
        type: 'user',
      });
      toast.success(`Account for "${newUser.name}" (${newUser.email}) created successfully!`);
    } catch (err) {
      toast.error(err.message || 'Could not register employee');
    }
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
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-[#22272B] border border-slate-200 dark:border-[#333C44] flex items-center justify-center text-slate-700 dark:text-[#DEE4EA] shrink-0">
              <ShieldCheck className="h-5 w-5 stroke-[1.8]" />
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">Employee Accounts & Roles</h1>
          </div>
        </div>

        <Button onClick={() => setIsInviteOpen(true)} className="gap-2 bg-[#0C66E4] hover:bg-[#0055CC] text-white shadow-xs self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          <span>Add Employee Account</span>
        </Button>
      </div>

      {/* 3 Role Summary Cards with Normal Clean Icons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        {/* Card 1: Administrators */}
        <div
          onClick={() => setRoleFilter(roleFilter === 'admin' ? 'all' : 'admin')}
          className={`cursor-pointer rounded-2xl border bg-white dark:bg-[#161A1D] p-5 flex items-center justify-between shadow-xs transition-all ${
            roleFilter === 'admin'
              ? 'border-slate-400 dark:border-[#579DFF] ring-2 ring-slate-300 dark:ring-[#579DFF]/20'
              : 'border-slate-200 dark:border-[#282E33] hover:border-slate-300 dark:hover:border-[#333C44]'
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
              <span className="text-xs text-slate-500 dark:text-[#9FADBC] font-medium">Full access</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-[#22272B] border border-slate-200 dark:border-[#333C44] flex items-center justify-center text-slate-700 dark:text-[#DEE4EA] shadow-xs">
            <ShieldCheck className="h-6 w-6 stroke-[1.8]" />
          </div>
        </div>

        {/* Card 2: Project Managers */}
        <div
          onClick={() => setRoleFilter(roleFilter === 'project_manager' ? 'all' : 'project_manager')}
          className={`cursor-pointer rounded-2xl border bg-white dark:bg-[#161A1D] p-5 flex items-center justify-between shadow-xs transition-all ${
            roleFilter === 'project_manager'
              ? 'border-slate-400 dark:border-[#579DFF] ring-2 ring-slate-300 dark:ring-[#579DFF]/20'
              : 'border-slate-200 dark:border-[#282E33] hover:border-slate-300 dark:hover:border-[#333C44]'
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
              <span className="text-xs text-slate-500 dark:text-[#9FADBC] font-medium">Projects & teams</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-[#22272B] border border-slate-200 dark:border-[#333C44] flex items-center justify-center text-slate-700 dark:text-[#DEE4EA] shadow-xs">
            <Briefcase className="h-6 w-6 stroke-[1.8]" />
          </div>
        </div>

        {/* Card 3: Team Members */}
        <div
          onClick={() => setRoleFilter(roleFilter === 'team_member' ? 'all' : 'team_member')}
          className={`cursor-pointer rounded-2xl border bg-white dark:bg-[#161A1D] p-5 flex items-center justify-between shadow-xs transition-all ${
            roleFilter === 'team_member'
              ? 'border-slate-400 dark:border-[#579DFF] ring-2 ring-slate-300 dark:ring-[#579DFF]/20'
              : 'border-slate-200 dark:border-[#282E33] hover:border-slate-300 dark:hover:border-[#333C44]'
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
              <span className="text-xs text-slate-500 dark:text-[#9FADBC] font-medium">Tasks & progress</span>
            </div>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-slate-100 dark:bg-[#22272B] border border-slate-200 dark:border-[#333C44] flex items-center justify-center text-slate-700 dark:text-[#DEE4EA] shadow-xs">
            <UserCheck className="h-6 w-6 stroke-[1.8]" />
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
            <Select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value)}
              className="h-9 rounded-xl text-xs"
            >
              <option value="team_member">Team Member (Default)</option>
              <option value="project_manager">Project Manager</option>
              <option value="admin">Administrator</option>
            </Select>
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search employee accounts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-8.5 pl-8.5 pr-3 rounded-xl border border-black dark:border-white bg-slate-50 dark:bg-[#22272B] text-xs text-slate-900 dark:text-[#DEE4EA] focus:outline-none focus:border-black dark:focus:border-white transition-colors"
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
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-[#282E33] text-slate-700 dark:text-[#DEE4EA] border border-slate-200 dark:border-[#333C44]">
                      <ShieldCheck className="h-3.5 w-3.5 stroke-[1.8]" />
                      <span>Admin</span>
                    </span>
                  )}
                  {user.role === 'project_manager' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-[#282E33] text-slate-700 dark:text-[#DEE4EA] border border-slate-200 dark:border-[#333C44]">
                      <Briefcase className="h-3.5 w-3.5 stroke-[1.8]" />
                      <span>Project Manager</span>
                    </span>
                  )}
                  {user.role === 'team_member' && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-slate-100 dark:bg-[#282E33] text-slate-700 dark:text-[#DEE4EA] border border-slate-200 dark:border-[#333C44]">
                      <UserCheck className="h-3.5 w-3.5 stroke-[1.8]" />
                      <span>Team Member</span>
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    className="w-36 h-8 text-xs font-semibold"
                  >
                    <option value="admin">Admin</option>
                    <option value="project_manager">Project Manager</option>
                    <option value="team_member">Team Member</option>
                  </Select>
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
                  <div className="flex items-center justify-end">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          type="button"
                          className="h-8 w-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-800 dark:text-[#9FADBC] dark:hover:text-[#DEE4EA] hover:bg-slate-100 dark:hover:bg-[#282E33] transition cursor-pointer"
                          title="Account actions"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="w-40 rounded-xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-1.5 shadow-xl text-xs z-50"
                      >
                        <DropdownMenuItem
                          onClick={() => handleToggleStatus(user.id)}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-[#22272B] text-slate-700 dark:text-[#DEE4EA] font-medium"
                        >
                          {user.status === 'Active' ? (
                            <>
                              <UserX className="h-3.5 w-3.5 text-amber-500" />
                              <span>Deactivate</span>
                            </>
                          ) : (
                            <>
                              <UserCheck2 className="h-3.5 w-3.5 text-emerald-500" />
                              <span>Activate</span>
                            </>
                          )}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => setUserToDelete(user)}
                          className="flex items-center gap-2 px-2.5 py-2 rounded-lg cursor-pointer hover:bg-rose-50 dark:hover:bg-rose-950/30 text-rose-600 dark:text-rose-400 font-medium"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Delete User Account Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!userToDelete}
        onClose={() => setUserToDelete(null)}
        onConfirm={confirmDeleteUser}
        title="Delete Employee Account"
        description={`Are you sure you want to permanently delete the account for "${userToDelete?.name}" (${userToDelete?.email})? They will immediately lose access to all projects and tasks.`}
        confirmText="Delete Account"
      />
    </div>
  );
}
