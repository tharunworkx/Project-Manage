import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { useWorkspaceContext } from '../context/WorkspaceContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export function useTasks(projectId = null, explicitWorkspaceId = null) {
  const queryClient = useQueryClient();

  let contextWorkspaceId = null;
  try {
    const ws = useWorkspaceContext();
    contextWorkspaceId = ws?.currentWorkspace?.id;
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
    const handleLiveSync = () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    };

    window.addEventListener('taskflow_tasks_updated', handleLiveSync);
    window.addEventListener('storage', handleLiveSync);

    let channel = null;
    if (isSupabaseConfigured) {
      channel = supabase
        .channel('realtime_tasks_feed')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'tasks' },
          () => {
            queryClient.invalidateQueries({ queryKey: ['tasks'] });
          }
        )
        .subscribe();
    }

    return () => {
      window.removeEventListener('taskflow_tasks_updated', handleLiveSync);
      window.removeEventListener('storage', handleLiveSync);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [queryClient]);

  const createTaskMutation = useMutation({
    mutationFn: (taskData) =>
      taskService.createTask({
        workspace_id: activeWorkspaceId || 'ws-1',
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
    tasks: tasksQuery.data || [],
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
  };
}

export default useTasks;
