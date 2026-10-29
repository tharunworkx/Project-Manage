import { createClient } from '@supabase/supabase-js';

const rawUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  'https://eyfjskljekukskzhsecg.supabase.co';
const rawKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV5Zmpza2xqZWt1a3NremhzZWNnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTMxNjg5MjUsImV4cCI6MjEwODc0NDkyNX0.9N3z82T_8V6t3rOTqZXXoSHk-_wSoir1ZsmPAv4kipY';

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

