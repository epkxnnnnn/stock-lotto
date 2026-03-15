import { createKhongClient } from '@/lib/supabase/khong';
import { vvipMarkets } from '@/config/markets-vvip';
import { platinumMarkets } from '@/config/markets-platinum';
import type { Brand, Market } from '@/types';

interface KhongMapping {
  khongTemplateId: number;
  khongSlug: string;
}

interface PushParams {
  source: Brand;
  market: string;
  winningNumber: string;
  winningNumber2d: string | null;
  roundDate: string;
}

interface PushResult {
  success: boolean;
  lotteryId?: string;
  error?: string;
}

interface BatchStats {
  pushed: number;
  failed: number;
}

/**
 * Reverse lookup: (source, marketCode) → { khongTemplateId, khongSlug }
 * Key format: "vvip:dow_jones"
 */
export function buildMarketToKhongMap(): Map<string, KhongMapping> {
  const map = new Map<string, KhongMapping>();

  const addMarkets = (markets: Market[], source: Brand) => {
    for (const m of markets) {
      map.set(`${source}:${m.code}`, {
        khongTemplateId: m.khongTemplateId,
        khongSlug: m.khongSlug,
      });
    }
  };

  addMarkets(vvipMarkets, 'vvip');
  addMarkets(platinumMarkets, 'platinum');

  return map;
}

// Module-level cached map
let _marketToKhongMap: Map<string, KhongMapping> | null = null;
function getMarketToKhongMap(): Map<string, KhongMapping> {
  if (!_marketToKhongMap) {
    _marketToKhongMap = buildMarketToKhongMap();
  }
  return _marketToKhongMap;
}

/**
 * Push a single result to Khong DB.
 * 1. Look up khongTemplateId from our market code + source
 * 2. Find today's lottery row in Khong: lotteries table where ltp = templateId AND close is within today (Bangkok time)
 * 3. Write lottery_metas (top/bottom) — Khong's process-draws handles status transitions + winner processing
 * Never throws — all errors caught and returned.
 */
export async function pushResultToKhong(params: PushParams): Promise<PushResult> {
  try {
    const map = getMarketToKhongMap();
    const key = `${params.source}:${params.market}`;
    const mapping = map.get(key);

    if (!mapping) {
      return { success: false, error: `No Khong mapping for ${key}` };
    }

    const khong = createKhongClient();

    // Find today's lottery row in Khong (Bangkok time)
    const startOfDay = `${params.roundDate}T00:00:00+07:00`;
    const endOfDay = `${params.roundDate}T23:59:59+07:00`;

    const { data: lottery, error: findError } = await khong
      .from('lotteries')
      .select('id, status')
      .eq('ltp', mapping.khongTemplateId)
      .gte('close', startOfDay)
      .lte('close', endOfDay)
      .order('close', { ascending: true })
      .limit(1)
      .single();

    if (findError || !lottery) {
      return {
        success: false,
        error: `Lottery not found in Khong for template ${mapping.khongTemplateId} on ${params.roundDate}: ${findError?.message ?? 'no row'}`,
      };
    }

    // Write results to lottery_metas only — do NOT change lottery status.
    // Khong's process-draws cron handles status transitions (SELLING → CALCULATING → COMPLETED)
    // and winner processing. We just pre-populate the results so Khong skips Yahoo fetch.
    // Cannot use upsert because meta_key is NULL and PostgreSQL treats NULL ≠ NULL for conflict detection
    const { data: existingMeta } = await khong
      .from('lottery_metas')
      .select('id')
      .eq('lottery_id', lottery.id)
      .is('meta_key', null)
      .limit(1)
      .maybeSingle();

    if (existingMeta) {
      const { error: updateMetaError } = await khong
        .from('lottery_metas')
        .update({
          top: params.winningNumber,
          bottom: params.winningNumber2d,
        })
        .eq('id', existingMeta.id);

      if (updateMetaError) {
        return { success: false, error: `Failed to update lottery_metas: ${updateMetaError.message}` };
      }
    } else {
      const { error: insertMetaError } = await khong
        .from('lottery_metas')
        .insert({
          lottery_id: lottery.id,
          top: params.winningNumber,
          bottom: params.winningNumber2d,
          meta_key: null,
          created_at: new Date().toISOString(),
        });

      if (insertMetaError) {
        return { success: false, error: `Failed to insert lottery_metas: ${insertMetaError.message}` };
      }
    }

    return { success: true, lotteryId: lottery.id };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error pushing to Khong',
    };
  }
}

/**
 * Push multiple results to Khong DB. Returns stats { pushed, failed }.
 */
export async function pushBatchToKhong(results: PushParams[]): Promise<BatchStats> {
  let pushed = 0;
  let failed = 0;

  for (const result of results) {
    const pushResult = await pushResultToKhong(result);
    if (pushResult.success) {
      pushed++;
    } else {
      failed++;
      console.error(`[push-to-khong] Failed ${result.source}:${result.market}: ${pushResult.error}`);
    }
  }

  return { pushed, failed };
}
