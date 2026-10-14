import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../services/projectService';

export function useProjects() {
  const queryClient = useQueryClient();

  const projectsQuery = useQuery({
    queryKey: ['projects'],
    queryFn: projectService.fetchProjects,
  });

  const createProjectMutation = useMutation({
    mutationFn: projectService.createProject,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  return {
    ...projectsQuery,
    projects: projectsQuery.data || [],
    createProject: createProjectMutation.mutateAsync,
  };
}
