import { createClient } from '@supabase/supabase-js';

/**
 * Untyped Supabase service client for API routes
 * Uses service role key for full access
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );
}
