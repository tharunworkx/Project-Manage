import { supabase } from '../lib/supabase';

export const workspaceService = {
  async fetchWorkspaces() {
    const { data, error } = await supabase.from('workspaces').select('*');
    if (error) return [];
    return data;
  },
  async createWorkspace(name) {
    const { data, error } = await supabase.from('workspaces').insert([{ name }]).select().single();
    if (error) throw error;
    return data;
  },
};
