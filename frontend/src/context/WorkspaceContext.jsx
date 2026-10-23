import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

const WorkspaceContext = createContext(null);

const STORAGE_KEY_WORKSPACES = 'taskflow_workspaces_list_v1';
const STORAGE_KEY_ACTIVE_WS = 'taskflow_active_workspace_id_v1';

// Seeded UUIDs matching Supabase records
export const SEED_WORKSPACE_IDS = {
  WS1: '00000000-0000-0000-0000-000000000001',
  WS2: '00000000-0000-0000-0000-000000000010',
  WS3: '00000000-0000-0000-0000-000000000003',
};

const INITIAL_WORKSPACES = [
  {
    id: SEED_WORKSPACE_IDS.WS1,
    name: 'Southern Rescue Services',
    slug: 'southern-rescue',
    initial: 'S',
    color: '#0C66E4',
    description: 'Emergency response logistics, field dispatch and rescue operations.',
    role: 'owner',
  },
  {
    id: SEED_WORKSPACE_IDS.WS2,
    name: 'Acme Product Studio',
    slug: 'acme-studio',
    initial: 'A',
    color: '#7C3AED',
    description: 'Main product engineering, SaaS dashboard and design systems.',
    role: 'admin',
  },
  {
    id: SEED_WORKSPACE_IDS.WS3,
    name: 'Mobile App Labs',
    slug: 'mobile-labs',
    initial: 'M',
    color: '#10B981',
    description: 'iOS & Android native client applications development.',
    role: 'member',
  },
];

const normalizeId = (id) => {
  if (!id) return SEED_WORKSPACE_IDS.WS1;
  if (id === 'ws-1') return SEED_WORKSPACE_IDS.WS1;
  if (id === 'ws-2') return SEED_WORKSPACE_IDS.WS2;
  if (id === 'ws-3') return SEED_WORKSPACE_IDS.WS3;
  return id;
};

export function WorkspaceProvider({ children }) {
  const [workspaces, setWorkspaces] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_WORKSPACES);
      if (stored !== null) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          if (isSupabaseConfigured) {
            return parsed.filter(
              (w) =>
                !['ws-1', 'ws-2', 'ws-3', SEED_WORKSPACE_IDS.WS1, SEED_WORKSPACE_IDS.WS2, SEED_WORKSPACE_IDS.WS3].includes(w.id)
            );
          }
          return parsed.map((w) => ({
            ...w,
            id: normalizeId(w.id),
          }));
        }
      }
    } catch {}
    return isSupabaseConfigured ? [] : INITIAL_WORKSPACES;
  });

  const [currentWorkspace, setCurrentWorkspace] = useState(() => {
    try {
      const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_WS);
      if (activeId) {
        const normId = normalizeId(activeId);
        const found = workspaces.find((w) => w.id === normId || w.id === activeId);
        if (found) return found;
      }
    } catch {}
    return workspaces[0] || null;
  });

  const saveWorkspaces = useCallback((updated) => {
    setWorkspaces(updated);
    try {
      localStorage.setItem(STORAGE_KEY_WORKSPACES, JSON.stringify(updated));
    } catch {}
  }, []);

  // Sync with Supabase on mount
  useEffect(() => {
    if (!isSupabaseConfigured) return;

    let isMounted = true;
    async function syncWithSupabase() {
      try {
        const { data: remoteWorkspaces, error } = await supabase
          .from('workspaces')
          .select('*')
          .order('created_at', { ascending: true });

        if (error) {
          console.warn('Could not load workspaces from Supabase:', error.message);
          return;
        }

        if (isMounted && remoteWorkspaces && remoteWorkspaces.length > 0) {
          const mappedRemote = remoteWorkspaces.map((rw) => ({
            id: rw.id,
            name: rw.name,
            slug: rw.slug,
            description: rw.description || '',
            color: rw.color || '#0C66E4',
            initial: rw.name
              .trim()
              .split(' ')
              .map((w) => w[0])
              .join('')
              .substring(0, 2)
              .toUpperCase() || 'W',
            role: 'owner',
          }));

          setWorkspaces(mappedRemote);
          try {
            localStorage.setItem(STORAGE_KEY_WORKSPACES, JSON.stringify(mappedRemote));
          } catch {}

          setCurrentWorkspace((prev) => {
            if (prev && mappedRemote.some((w) => w.id === prev.id)) {
              return prev;
            }
            return mappedRemote[0];
          });
        } else if (isMounted && remoteWorkspaces && remoteWorkspaces.length === 0) {
          setWorkspaces([]);
          setCurrentWorkspace(null);
          try {
            localStorage.setItem(STORAGE_KEY_WORKSPACES, JSON.stringify([]));
            localStorage.removeItem(STORAGE_KEY_ACTIVE_WS);
          } catch {}
        }
      } catch (err) {
        console.warn('Supabase workspace sync error:', err);
      }
    }

    syncWithSupabase();
    return () => {
      isMounted = false;
    };
  }, []);

  const switchWorkspace = (workspaceId) => {
    const normId = normalizeId(workspaceId);
    const target = workspaces.find((w) => w.id === normId || w.id === workspaceId);
    if (target) {
      setCurrentWorkspace(target);
      try {
        localStorage.setItem(STORAGE_KEY_ACTIVE_WS, target.id);
      } catch {}
    }
  };

  const createWorkspace = async ({ name, description = '', color }) => {
    if (!name?.trim()) return null;
    const cleanName = name.trim();
    const initials = cleanName
      .split(' ')
      .map((w) => w[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();

    const colors = ['#0C66E4', '#7C3AED', '#10B981', '#F59E0B', '#EC4899', '#06B6D4'];
    const chosenColor = color || colors[Math.floor(Math.random() * colors.length)];
    const cleanDesc = description.trim() || 'New collaborative team workspace.';
    
    let baseSlug = cleanName.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '');
    if (!baseSlug) baseSlug = 'workspace';
    const uniqueSlug = `${baseSlug}-${Date.now().toString().slice(-4)}`;

    let generatedId = null;

    // 1. Persist directly to Supabase
    if (isSupabaseConfigured) {
      try {
        const { data, error } = await supabase
          .from('workspaces')
          .insert([
            {
              name: cleanName,
              slug: uniqueSlug,
              description: cleanDesc,
              color: chosenColor,
            },
          ])
          .select()
          .single();

        if (error) {
          console.error('Supabase workspace insert failed:', error);
        } else if (data) {
          generatedId = data.id;
        }
      } catch (supaErr) {
        console.error('Supabase workspace insert exception:', supaErr);
      }
    }

    // Fallback UUID if offline
    if (!generatedId) {
      generatedId =
        typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID()
          : '00000000-0000-0000-0000-' + Date.now().toString().padStart(12, '0');
    }

    const newWs = {
      id: generatedId,
      name: cleanName,
      slug: uniqueSlug,
      initial: initials || 'W',
      color: chosenColor,
      description: cleanDesc,
      role: 'owner',
    };

    const updated = [...workspaces, newWs];
    saveWorkspaces(updated);
    setCurrentWorkspace(newWs);
    try {
      localStorage.setItem(STORAGE_KEY_ACTIVE_WS, newWs.id);
    } catch {}

    return newWs;
  };

  const updateWorkspace = async (workspaceId, updates) => {
    const normId = normalizeId(workspaceId);
    const updated = workspaces.map((w) =>
      w.id === normId || w.id === workspaceId ? { ...w, ...updates } : w
    );
    saveWorkspaces(updated);
    if (currentWorkspace?.id === normId || currentWorkspace?.id === workspaceId) {
      setCurrentWorkspace((prev) => ({ ...prev, ...updates }));
    }

    if (isSupabaseConfigured) {
      try {
        const payload = {};
        if (updates.name) payload.name = updates.name;
        if (updates.description !== undefined) payload.description = updates.description;
        if (updates.color) payload.color = updates.color;
        if (Object.keys(payload).length > 0) {
          await supabase.from('workspaces').update(payload).eq('id', normId);
        }
      } catch (err) {
        console.warn('Failed to update workspace in Supabase:', err);
      }
    }
  };

  const deleteWorkspace = async (workspaceId) => {
    const normId = normalizeId(workspaceId);
    const filtered = workspaces.filter((w) => w.id !== normId && w.id !== workspaceId);
    saveWorkspaces(filtered);

    const nextWs = filtered.length > 0 ? filtered[0] : null;
    if (currentWorkspace?.id === normId || currentWorkspace?.id === workspaceId) {
      setCurrentWorkspace(nextWs);
      try {
        if (nextWs) {
          localStorage.setItem(STORAGE_KEY_ACTIVE_WS, nextWs.id);
        } else {
          localStorage.removeItem(STORAGE_KEY_ACTIVE_WS);
        }
      } catch {}
    }

    if (isSupabaseConfigured) {
      try {
        await supabase.from('workspaces').delete().eq('id', normId);
      } catch (err) {
        console.warn('Failed to delete workspace in Supabase:', err);
      }
    }

    return true;
  };

  const toggleStarWorkspace = (workspaceId) => {
    const target = workspaces.find((w) => w.id === workspaceId);
    if (!target) return false;
    const isStarred = !target.isStarred;
    updateWorkspace(workspaceId, { isStarred });
    return isStarred;
  };

  const archiveWorkspace = (workspaceId) => {
    const target = workspaces.find((w) => w.id === workspaceId);
    if (!target) return false;
    const isArchived = !target.isArchived;
    updateWorkspace(workspaceId, { isArchived });
    return isArchived;
  };

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        setCurrentWorkspace,
        switchWorkspace,
        createWorkspace,
        updateWorkspace,
        deleteWorkspace,
        toggleStarWorkspace,
        archiveWorkspace,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspaceContext() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspaceContext must be used within a WorkspaceProvider');
  }
  return context;
}
