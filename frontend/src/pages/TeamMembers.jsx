import React, { useState, useEffect } from 'react';
import { Users2, Search, Mail, ShieldCheck, UserCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { userService } from '../services/userService';
import { taskService } from '../services/taskService';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { useAuthContext } from '../context/AuthContext';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { toast } from 'sonner';

export default function TeamMembers() {
  const { isAdmin } = useAuthContext();
  const [users, setUsers] = useState(() => userService.getUsers());
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [memberToDelete, setMemberToDelete] = useState(null);

  // Sync users & tasks with remote database and listen to realtime updates
  useEffect(() => {
    let isMounted = true;

    const refreshData = async () => {
      try {
        const [remoteUsers, remoteTasks] = await Promise.all([
          userService.fetchUsersFromRemote(),
          taskService.fetchTasks().catch(() => []),
        ]);
        if (isMounted) {
          if (Array.isArray(remoteUsers)) setUsers(remoteUsers);
          if (Array.isArray(remoteTasks)) setTasks(remoteTasks);
        }
      } catch (err) {
        console.warn('Error loading team members data:', err);
      }
    };

    refreshData();

    const handleLocalUpdate = (e) => {
      if (e?.detail?.deleted && (e.detail.id || e.detail.email)) {
        setUsers((prev) =>
          prev.filter(
            (u) =>
              (e.detail.id ? u.id !== e.detail.id : true) &&
              (e.detail.email ? u.email?.toLowerCase() !== e.detail.email?.toLowerCase() : true)
          )
        );
      } else {
        setUsers(userService.getUsers());
      }
    };

    window.addEventListener('taskflow_users_updated', handleLocalUpdate);
    window.addEventListener('storage', handleLocalUpdate);

    let channel = null;
    if (isSupabaseConfigured) {
      const channelId = `realtime_team_members_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      channel = supabase
        .channel(channelId)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, (payload) => {
          if (payload?.eventType === 'DELETE' && payload.old?.id) {
            setUsers((prev) => prev.filter((u) => u.id !== payload.old.id));
          } else {
            refreshData();
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
          if (payload?.eventType === 'DELETE' && payload.old?.id) {
            setUsers((prev) => prev.filter((u) => u.id !== payload.old.id));
          } else {
            refreshData();
          }
        })
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, refreshData)
        .subscribe();
    }

    return () => {
      isMounted = false;
      window.removeEventListener('taskflow_users_updated', handleLocalUpdate);
      window.removeEventListener('storage', handleLocalUpdate);
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  const getActiveTasksCount = (member) => {
    if (!Array.isArray(tasks) || !member) return 0;
    const cleanEmail = member.email?.toLowerCase().trim();
    const cleanName = member.name?.toLowerCase().trim();
    const memberId = member.id;

    return tasks.filter((t) => {
      if (t.status === 'done' || t.status === 'cancelled') return false;
      if (t.assignee_id && t.assignee_id === memberId) return true;
      if (t.assignee && typeof t.assignee === 'object' && t.assignee.email === cleanEmail) return true;
      if (typeof t.assignee === 'string' && (t.assignee.toLowerCase() === cleanEmail || t.assignee.toLowerCase() === cleanName)) return true;
      return false;
    }).length;
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    const target = memberToDelete;
    const targetName = target.name || 'Member';
    setMemberToDelete(null);

    // Optimistic immediate UI removal
    setUsers((prev) =>
      prev.filter((u) => u.id !== target.id && u.email?.toLowerCase() !== target.email?.toLowerCase())
    );

    try {
      await userService.deleteUser(target);
      toast.success(`Member "${targetName}" deleted successfully`);
    } catch (err) {
      toast.error('Failed to delete member from database');
      refreshData();
    }
  };

  const filtered = users.filter((m) => {
    const cleanSearch = search.toLowerCase();
    const matchesSearch =
      (m.name && m.name.toLowerCase().includes(cleanSearch)) ||
      (m.email && m.email.toLowerCase().includes(cleanSearch));
    const role = (m.role || 'team_member').toLowerCase();
    const matchesRole =
      filterRole === 'all'
        ? true
        : filterRole === 'admin'
        ? role === 'admin' || role === 'project_manager'
        : role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    const norm = (role || 'team_member').toLowerCase();
    if (norm === 'admin') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-[#7C3AED]/10 text-[#7C3AED] border border-[#7C3AED]/25">
          <ShieldCheck className="h-3.5 w-3.5 stroke-[2.2]" />
          <span>Administrator</span>
        </span>
      );
    }
    if (norm === 'project_manager') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-[#0C66E4]/10 dark:bg-[#579DFF]/15 text-[#0C66E4] dark:text-[#579DFF] border border-[#0C66E4]/25">
          <ShieldCheck className="h-3.5 w-3.5 stroke-[2.2]" />
          <span>Project Manager</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[11px] font-semibold bg-emerald-500/10 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25">
        <UserCheck className="h-3.5 w-3.5 stroke-[2.2]" />
        <span>Team Member</span>
      </span>
    );
  };

  return (
    <div className="w-full p-4 sm:p-6 space-y-4 sm:space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-[#0C66E4]/10 dark:bg-[#579DFF]/15 border border-[#0C66E4]/25 flex items-center justify-center text-[#0C66E4] dark:text-[#579DFF] shrink-0">
            <Users2 className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#DEE4EA]">Team Members</h1>
            <p className="text-xs text-slate-500 dark:text-[#9FADBC]">
              Live synchronized team directory ({filtered.length} total)
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
          <input
            type="text"
            placeholder="Search member name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-[#161A1D] text-xs text-slate-900 dark:text-[#DEE4EA] focus:outline-none focus:border-[#0C66E4] dark:focus:border-[#579DFF] transition-colors"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1">
          {[
            { id: 'all', label: 'All Users' },
            { id: 'admin', label: 'Admins & Managers' },
            { id: 'team_member', label: 'Team Members' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterRole(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 whitespace-nowrap ${
                filterRole === tab.id
                  ? 'bg-[#0C66E4] text-white shadow-xs'
                  : 'bg-white dark:bg-[#161A1D] border border-slate-200 dark:border-[#282E33] text-slate-600 dark:text-[#9FADBC] hover:bg-slate-50 dark:hover:bg-[#22272B]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Team Members */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((member) => {
          const taskCount = getActiveTasksCount(member);
          const isMe = member.email?.toLowerCase().includes('tharun');

          return (
            <div
              key={member.id || member.email}
              className="rounded-2xl border border-slate-200 dark:border-[#282E33] bg-white dark:bg-[#161A1D] p-5 space-y-4 hover:shadow-md transition-shadow relative group"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="h-11 w-11 rounded-full text-white font-bold text-sm flex items-center justify-center shadow-xs shrink-0"
                    style={{ backgroundColor: member.color || '#10B981' }}
                  >
                    {member.avatar || (member.name ? member.name.substring(0, 2).toUpperCase() : 'U')}
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-slate-900 dark:text-[#DEE4EA] leading-tight">
                      {member.name}
                    </h3>
                    <span className="text-xs text-slate-500 dark:text-[#9FADBC]">{member.email}</span>
                  </div>
                </div>

                {isAdmin && !isMe && (
                  <button
                    onClick={() => setMemberToDelete(member)}
                    className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete member"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-[#282E33]/60 text-xs">
                <div>{getRoleBadge(member.role)}</div>
                <div className="text-slate-500 dark:text-[#738496]">
                  <strong className="text-slate-900 dark:text-[#DEE4EA]">{taskCount}</strong> active tasks
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(`mailto:${member.email}`)}
                className="w-full text-xs h-8"
              >
                <Mail className="h-3.5 w-3.5 mr-1.5" />
                Message
              </Button>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        isOpen={Boolean(memberToDelete)}
        onClose={() => setMemberToDelete(null)}
        onConfirm={handleDeleteMember}
        title="Delete Team Member"
        description={`Are you sure you want to permanently delete "${memberToDelete?.name}" (${memberToDelete?.email})? This action will remove them from Supabase database.`}
        confirmText="Delete Member"
        variant="danger"
      />
    </div>
  );
}
