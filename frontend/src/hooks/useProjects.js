import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService, isProjectAssignedToEmail } from '../services/projectService';
import { useWorkspaceContext } from '../context/WorkspaceContext';
import { useAuthContext } from '../context/AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

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

  // Real-time project synchronization: 3-second polling fallback + live Supabase Realtime channel
  const projectsQuery = useQuery({
    queryKey: ['projects', activeWorkspaceId],
    queryFn: () => projectService.fetchProjects(activeWorkspaceId),
    refetchInterval: 3000,
    refetchIntervalInBackground: true,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    const handleSync = () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    };

    window.addEventListener('taskflow_projects_updated', handleSync);
    window.addEventListener('storage', handleSync);

    let channel = null;
    if (isSupabaseConfigured) {
      channel = supabase
        .channel('realtime_projects_feed')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'projects' },
          () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
          }
        )
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'project_members' },
          () => {
            queryClient.invalidateQueries({ queryKey: ['projects'] });
          }
        )
        .subscribe();
    }

    return () => {
      window.removeEventListener('taskflow_projects_updated', handleSync);
      window.removeEventListener('storage', handleSync);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [queryClient]);

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      window.dispatchEvent(new CustomEvent('taskflow_projects_updated'));
    },
  });

  return {
    ...projectsQuery,
    projects: assignedProjects,
    allProjects,
    createProject: createProjectMutation.mutateAsync,
  };
}

export default useProjects;
