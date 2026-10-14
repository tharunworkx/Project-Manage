import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskService } from '../services/taskService';

export function useTasks(projectId = null) {
  const queryClient = useQueryClient();

  const tasksQuery = useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => taskService.fetchTasks(projectId),
  });

  const createTaskMutation = useMutation({
    mutationFn: taskService.createTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, updates }) => taskService.updateTask(id, updates),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  const deleteTaskMutation = useMutation({
    mutationFn: taskService.deleteTask,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tasks'] }),
  });

  return {
    ...tasksQuery,
    tasks: tasksQuery.data || [],
    createTask: createTaskMutation.mutateAsync,
    updateTask: updateTaskMutation.mutateAsync,
    deleteTask: deleteTaskMutation.mutateAsync,
  };
}
