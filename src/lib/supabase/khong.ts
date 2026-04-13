import { createClient } from '@supabase/supabase-js';

/**
 * Supabase client for the Khong DB — used for reading results from Khong.
 * Khong generates numbers via SWP; stock-lotto reads from lottery_metas.
 */
export function createKhongClient() {
  return createClient(
    process.env.KHONG_SUPABASE_URL!,
    process.env.KHONG_SUPABASE_SERVICE_KEY!
  );
}
