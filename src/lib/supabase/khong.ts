import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client for the Khong DB — used for writing results to Khong DB.
 * Stock-lotto is the source; pushes winning numbers to Khong's lotteries + lottery_metas tables.
 */
export function createKhongClient() {
  return createClient(
    process.env.KHONG_SUPABASE_URL!,
    process.env.KHONG_SUPABASE_SERVICE_KEY!
  );
}
