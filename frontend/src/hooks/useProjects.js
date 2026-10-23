import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService, isProjectAssignedToEmail } from '../services/projectService';
import { useWorkspaceContext } from '../context/WorkspaceContext';
import { useAuthContext } from '../context/AuthContext';

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

  let currentUser = null;
  let isMemberRole = false;
  try {
    const auth = useAuthContext();
    currentUser = auth?.user;
    isMemberRole = auth?.isTeamMember;
  } catch {}

  const projectsQuery = useQuery({
    queryKey: ['projects', activeWorkspaceId],
    queryFn: () => projectService.fetchProjects(activeWorkspaceId),
  });

  const allProjects = projectsQuery.data || [];
  const assignedProjects = isMemberRole && currentUser
    ? allProjects.filter((p) => isProjectAssignedToEmail(p, currentUser.email, currentUser.id))
    : allProjects;

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
    projects: assignedProjects,
    allProjects,
    createProject: createProjectMutation.mutateAsync,
  };
}
