import { supabase } from '../lib/supabase';

export const authService = {
  async signIn(email, password) {
    return supabase.auth.signInWithPassword({ email, password });
  },
  async signUp(email, password, fullName) {
    return supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
  },
  async signOut() {
    return supabase.auth.signOut();
  },
  async getProfile(userId) {
    const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (error) throw error;
    return data;
  },
};
