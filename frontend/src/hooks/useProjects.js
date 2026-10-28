import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectService, isProjectAssignedToEmail, mapRemoteProject } from '../services/projectService';
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
    const handleCustomSync = (e) => {
      if (e?.detail?.deleted && e?.detail?.id) {
        queryClient.setQueriesData({ queryKey: ['projects'] }, (old) => {
          if (!Array.isArray(old)) return old;
          return old.filter((p) => p.id !== e.detail.id);
        });
      } else if (Array.isArray(e?.detail?.projects)) {
        queryClient.setQueriesData({ queryKey: ['projects'] }, () => e.detail.projects);
      } else if (Array.isArray(e?.detail)) {
        queryClient.setQueriesData({ queryKey: ['projects'] }, () => e.detail);
      }
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    };

    const handleStorage = (e) => {
      if (e.key === 'taskflow_manage_projects_list_v4' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (Array.isArray(parsed)) {
            queryClient.setQueriesData({ queryKey: ['projects'] }, () => parsed);
          }
        } catch {}
      }
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    };

    const handleFocus = () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    };

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        queryClient.invalidateQueries({ queryKey: ['projects'] });
      }
    };

    window.addEventListener('taskflow_projects_updated', handleCustomSync);
    window.addEventListener('storage', handleStorage);
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibility);

    let channel = null;
    if (isSupabaseConfigured) {
      const channelId = `realtime_projects_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
      channel = supabase
        .channel(channelId)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'projects' },
          (payload) => {
            if (payload?.eventType === 'DELETE' && payload.old?.id) {
              queryClient.setQueriesData({ queryKey: ['projects'] }, (old) => {
                if (!Array.isArray(old)) return old;
                return old.filter((p) => p.id !== payload.old.id);
              });
            } else if (payload?.eventType === 'INSERT' && payload.new?.id) {
              const mapped = mapRemoteProject(payload.new);
              queryClient.setQueriesData({ queryKey: ['projects'] }, (old) => {
                if (!Array.isArray(old)) return [mapped];
                if (old.some((p) => p.id === mapped.id)) return old;
                return [mapped, ...old];
              });
            } else if (payload?.eventType === 'UPDATE' && payload.new?.id) {
              const mapped = mapRemoteProject(payload.new);
              queryClient.setQueriesData({ queryKey: ['projects'] }, (old) => {
                if (!Array.isArray(old)) return old;
                return old.map((p) => (p.id === mapped.id ? { ...p, ...mapped } : p));
              });
            }
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
      window.removeEventListener('taskflow_projects_updated', handleCustomSync);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibility);
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
