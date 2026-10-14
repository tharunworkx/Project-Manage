import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  !rawUrl.includes('mock-supabase') &&
  !rawUrl.includes('your-project') &&
  !rawKey.includes('mock-anon-key')
);

const supabaseUrl = isSupabaseConfigured ? rawUrl : 'https://localhost.local/mock-supabase';
const supabaseAnonKey = isSupabaseConfigured ? rawKey : 'mock-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

