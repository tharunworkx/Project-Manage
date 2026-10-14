import { supabase, isSupabaseConfigured } from '../lib/supabase';

const MOCK_PROJECTS = [
  { id: 'p1', name: 'Taskflow Core Web App', description: 'Next-gen project collaboration dashboard', color: '#6366f1', task_count: 14, completed_count: 8 },
  { id: 'p2', name: 'Mobile App Companion', description: 'React Native iOS & Android client', color: '#ec4899', task_count: 9, completed_count: 3 },
  { id: 'p3', name: 'Marketing & Brand Redesign', description: 'Interactive landing page and marketing assets', color: '#06b6d4', task_count: 6, completed_count: 5 },
];

export const projectService = {
  async fetchProjects() {
    if (!isSupabaseConfigured) {
      return MOCK_PROJECTS;
    }
    try {
      const { data, error } = await supabase.from('projects').select('*');
      if (error) throw error;
      return data && data.length ? data : MOCK_PROJECTS;
    } catch {
      return MOCK_PROJECTS;
    }
  },
  async createProject(project) {
    if (!isSupabaseConfigured) {
      return { id: 'p' + Date.now(), ...project };
    }
    try {
      const { data, error } = await supabase.from('projects').insert([project]).select().single();
      if (error) return { id: 'p' + Date.now(), ...project };
      return data;
    } catch {
      return { id: 'p' + Date.now(), ...project };
    }
  },
};

