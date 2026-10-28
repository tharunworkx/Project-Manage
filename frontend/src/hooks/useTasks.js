import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService, isTaskCreatedByUser } from '../services/taskService';
import { useWorkspaceContext } from '../context/WorkspaceContext';
import { useAuthContext } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useTasks(projectId = null, explicitWorkspaceId = null) {
  const queryClient = useQueryClient();

  let contextWorkspaceId = null;
  let currentUser = null;
  let isMemberRole = false;
  try {
    const ws = useWorkspaceContext();
    contextWorkspaceId = ws?.currentWorkspace?.id;
  } catch {}

  try {
    const auth = useAuthContext();
    currentUser = auth?.user;
    isMemberRole = auth?.isTeamMember;
  } catch {}

  const activeWorkspaceId =
    explicitWorkspaceId !== undefined && explicitWorkspaceId !== null
      ? explicitWorkspaceId
      : contextWorkspaceId;

  // Real-time task synchronization: 3-second polling fallback + live Supabase Realtime channel
  const tasksQuery = useQuery({
    queryKey: ['tasks', projectId, activeWorkspaceId],
    queryFn: () => taskService.fetchTasks(projectId, activeWorkspaceId),
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    const handleCustomSync = (e) => {
      if (e?.detail?.deleted && e?.detail?.id) {
        queryClient.setQueriesData({ queryKey: ['tasks'] }, (old) => {
          if (!Array.isArray(old)) return old;
          return old.filter((t) => t.id !== e.detail.id);
        });
      } else if (Array.isArray(e?.detail)) {
        queryClient.setQueriesData({ queryKey: ['tasks'] }, () => e.detail);
      }
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    };

    const handleStorage = (e) => {
      if ((e.key === 'taskflow_jira_board_tasks_v2' || e.key === 'taskflow_tasks_cache_v5') && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            queryClient.setQueriesData({ queryKey: ['tasks'] }, () => parsed);
          }
        } catch {}
      }
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    };

    const handleFocus = () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        queryClient.invalidateQueries({ queryKey: ['tasks'] });
      }
    };

    window.addEventListener('taskflow_tasks_updated', handleCustomSync);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    let channel = null;
    if (isSupabaseConfigured) {
      const channelId = `realtime_tasks_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      channel = supabase
        .channel(channelId)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'tasks' },
          (payload) => {
            if (payload?.eventType === 'DELETE' && payload.old?.id) {
              queryClient.setQueriesData({ queryKey: ['tasks'] }, (old) => {
                if (!Array.isArray(old)) return old;
                return old.filter((t) => t.id !== payload.old.id);
              });
            }
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
          }
        )
        .subscribe();
    }

    return () => {
      window.removeEventListener('taskflow_tasks_updated', handleCustomSync);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [queryClient]);

  const allTasks = tasksQuery.data || [];

  // Role-based visibility enforcement:
  // - Team Member: Only display tasks created by (or assigned to) that specific team member!
  // - Admin and Project Manager: Display ALL team members' tasks!
  const visibleTasks = isMemberRole && currentUser
    ? allTasks.filter((t) => isTaskCreatedByUser(t, currentUser))
    : allTasks;

  const createTaskMutation = useMutation({
    mutationFn: (taskData) =>
      taskService.createTask({
        workspace_id: activeWorkspaceId || 'ws-1',
        created_by: currentUser?.name || taskData.created_by || 'Admin',
        created_by_id: currentUser?.id || taskData.created_by_id || null,
        created_by_email: currentUser?.email || taskData.created_by_email || null,
        created_by_role: currentUser?.role || taskData.created_by_role || 'team_member',
        reporter: currentUser?.name || taskData.reporter || 'Admin',
        reporter_id: currentUser?.id || taskData.reporter_id || null,
        assignee: isMemberRole ? (currentUser?.name || taskData.assignee) : taskData.assignee,
        assignee_id: isMemberRole ? (currentUser?.id || taskData.assignee_id) : taskData.assignee_id,
        ...taskData,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      window.dispatchEvent(new CustomEvent('taskflow_tasks_updated'));
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }) => taskService.updateTask(id, updates),
    onMutate: async ({ id, updates }) => {
      // Cancel any outgoing refetches so they don't overwrite optimistic update
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      // Snapshot the previous tasks
      const previousTasks = queryClient.getQueryData(['tasks', projectId, activeWorkspaceId]);

      // Optimistically update all tasks caches in queryClient immediately (0ms lag)
      queryClient.setQueriesData({ queryKey: ['tasks'] }, (old) => {
        if (!old || !Array.isArray(old)) return old;
        return old.map((t) => (t.id === id ? { ...t, ...updates } : t));
      });

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', projectId, activeWorkspaceId], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      window.dispatchEvent(new CustomEvent('taskflow_tasks_updated'));
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks', projectId, activeWorkspaceId]);
      queryClient.setQueriesData({ queryKey: ['tasks'] }, (old) => {
        if (!old || !Array.isArray(old)) return old;
        return old.filter((t) => t.id !== id);
      });
      return { previousTasks };
    },
    onError: (err, id, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['tasks', projectId, activeWorkspaceId], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      window.dispatchEvent(new CustomEvent('taskflow_tasks_updated'));
    },
  });

  return {
    ...tasksQuery,
    tasks: visibleTasks,
    allTasks,
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
  };
}

export default useTasks;
