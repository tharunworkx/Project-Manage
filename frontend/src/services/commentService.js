import { supabase } from '../lib/supabase';

export const commentService = {
  async fetchComments(taskId) {
    const { data, error } = await supabase.from('comments').select('*, profiles(*)').eq('task_id', taskId);
    if (error) return [];
    return data;
  },
  async addComment(taskId, content) {
    const { data, error } = await supabase.from('comments').insert([{ task_id: taskId, content }]).select().single();
    if (error) throw error;
    return data;
  },
};
