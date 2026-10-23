import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService } from '../services/projectService';
import { useWorkspaceContext } from '../context/WorkspaceContext';

export function useProjects(explicitWorkspaceId = null) {
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

  const projectsQuery = useQuery({
    queryKey: ['projects', activeWorkspaceId],
    queryFn: () => projectService.fetchProjects(activeWorkspaceId),
  });

  const createProjectMutation = useMutation({
    mutationFn: (projectData) =>
      projectService.createProject({
        workspace_id: activeWorkspaceId || 'ws-1',
        ...projectData,
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
  });

  return {
    ...projectsQuery,
    projects: projectsQuery.data || [],
    createProject: createProjectMutation.mutateAsync,
  };
}
