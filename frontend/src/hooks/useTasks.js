import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';
import { useWorkspaceContext } from '../context/WorkspaceContext';

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

  const tasksQuery = useQuery({
    queryKey: ['tasks', projectId, activeWorkspaceId],
    queryFn: () => taskService.fetchTasks(projectId, activeWorkspaceId),
  });

  const createTaskMutation = useMutation({
    mutationFn: (taskData) =>
      taskService.createTask({
        workspace_id: activeWorkspaceId || 'ws-1',
        ...taskData,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
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
