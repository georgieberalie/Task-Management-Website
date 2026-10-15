import { createClient } from '@supabase/supabase-js';

function sanitizeSupabaseUrl(url: string): string {
  if (!url) return '';
  let cleaned = url.trim();
  // Strip trailing slashes
  cleaned = cleaned.replace(/\/+$/, '');
  // Strip /rest/v1 or /auth/v1 if accidentally included
  cleaned = cleaned.replace(/\/(rest|auth)\/v[0-9]+.*$/, '');
  return cleaned;
}

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabaseUrl = sanitizeSupabaseUrl(rawUrl);
const supabaseAnonKey = rawAnonKey.trim();

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key'
);
