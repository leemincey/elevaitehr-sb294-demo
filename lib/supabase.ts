import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ── Browser client (anon key) ─────────────────────────────────────────────────
// Safe to use in Client Components. Respects RLS.
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

// ── Admin client (service role) ───────────────────────────────────────────────
// SERVER ONLY — never import this in a Client Component or expose to the browser.
// Bypasses RLS. Used exclusively in API routes.
export const supabaseAdmin = () =>
  createClient<Database>(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );