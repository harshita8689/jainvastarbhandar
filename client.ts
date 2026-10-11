import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Verify that the credentials are valid, non-placeholder URLs and keys
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('your-project-ref') &&
  !supabaseAnonKey.includes('your-anon-or-publishable-key')
);

if (!isSupabaseConfigured && typeof window !== 'undefined') {
  console.info(
    'ℹ️ [JVB] Supabase environment variables (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) are unconfigured. The website will display an informative setup guide for your Supabase backend.'
  );
}

// Fallback dummy URL and key to prevent createClient from throwing an initialization exception if unconfigured
const clientUrl = isSupabaseConfigured ? supabaseUrl : 'https://unconfigured-placeholder.supabase.co';
const clientKey = isSupabaseConfigured ? supabaseAnonKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.unconfigured-key';

export const supabase = createClient(clientUrl, clientKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
