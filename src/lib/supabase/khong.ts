import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client for the Khong DB (source of historical results)
 * Uses service role key for read access to lotteries + lottery_metas
 */
export function createKhongClient() {
  return createClient(
    process.env.KHONG_SUPABASE_URL!,
    process.env.KHONG_SUPABASE_SERVICE_KEY!
  );
}
