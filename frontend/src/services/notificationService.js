import { supabase } from '../lib/supabase';

export const notificationService = {
  async fetchNotifications() {
    const { data, error } = await supabase.from('notifications').select('*').order('created_at', { ascending: false });
    if (error) return [];
    return data;
  },
  async markAsRead(id) {
    const { error } = await supabase.from('notifications').update({ read: true }).eq('id', id);
    if (error) throw error;
  },
};
