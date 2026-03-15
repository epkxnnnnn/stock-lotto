import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createKhongClient } from '@/lib/supabase/khong';
import { buildKhongToMarketMap, getAllTemplateIds } from '@/lib/sync/khong-mapping';
import { computeResultHash } from '@/lib/verify';
import { vvipMarkets } from '@/config/markets-vvip';
import { platinumMarkets } from '@/config/markets-platinum';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * Vercel Cron Job: runs every 2 minutes
 * 1. Seeds today's schedule if missing
 * 2. Auto-closes markets past close_time
 * 3. Pulls winning numbers from Khong DB for resulted markets
 */
export async function GET(request: NextRequest) {
  // Verify Vercel cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();
  const now = new Date();
  const today = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });

  const stats = { seeded: 0, closed: 0, synced: 0, errors: 0 };

  // Step 1: Seed today's schedule if not already done
  {
    const { count } = await supabase
      .from('stock_results')
      .select('id', { count: 'exact', head: true })
      .eq('round_date', today);

    if (!count || count === 0) {
      const seedRows = [
        ...vvipMarkets.map(m => ({
          source: 'vvip' as const,
          market: m.code,
          market_label_th: m.labelTh,
          flag_emoji: m.flagEmoji,
          round_date: today,
          close_time: `${today}T${m.closeTime}:00+07:00`,
          status: 'open' as const,
        })),
        ...platinumMarkets.map(m => ({
          source: 'platinum' as const,
          market: m.code,
          market_label_th: m.labelTh,
          flag_emoji: m.flagEmoji,
          round_date: today,
          close_time: `${today}T${m.closeTime}:00+07:00`,
          status: 'open' as const,
        })),
      ];

      const { data: seedResult } = await supabase
        .from('stock_results')
        .upsert(seedRows, { onConflict: 'source,market,round_date', ignoreDuplicates: true })
        .select('id');

      stats.seeded = seedResult?.length ?? 0;
    }
  }

  // Step 2: Auto-close markets past close_time that are still "open"
  {
    const { data: openMarkets } = await supabase
      .from('stock_results')
      .select('id')
      .eq('round_date', today)
      .eq('status', 'open')
      .lte('close_time', now.toISOString());

    if (openMarkets && openMarkets.length > 0) {
      const ids = openMarkets.map(m => m.id);
      const { error } = await supabase
        .from('stock_results')
        .update({ status: 'closed', updated_at: now.toISOString() })
        .in('id', ids);

      if (!error) stats.closed = ids.length;
      else stats.errors++;
    }
  }

  // Step 3: Pull results from Khong for today's markets that don't have results yet
  {
    const khong = createKhongClient();
    const marketMap = buildKhongToMarketMap();
    const templateIds = getAllTemplateIds();

    // Query Khong for today's resulted lotteries
    const startOfDay = `${today}T00:00:00+07:00`;
    const { data: lotteries, error: lotError } = await khong
      .from('lotteries')
      .select('id, ltp, slug, open, close, status')
      .in('ltp', templateIds)
      .eq('status', 3)
      .gte('close', startOfDay)
      .order('close', { ascending: true });

    if (lotError) {
      stats.errors++;
    } else if (lotteries && lotteries.length > 0) {
      const lotteryIds = lotteries.map((l: { id: string }) => l.id);

      // Get winning numbers
      const { data: metas, error: metaError } = await khong
        .from('lottery_metas')
        .select('lottery_id, top, bottom, created_at')
        .in('lottery_id', lotteryIds)
        .is('meta_key', null)
        .not('top', 'is', null);

      if (metaError) {
        stats.errors++;
      } else {
        const metaByLotteryId = new Map<string, { top: string; bottom: string | null; created_at: string }>();
        for (const m of metas ?? []) {
          metaByLotteryId.set(m.lottery_id, { top: m.top, bottom: m.bottom, created_at: m.created_at });
        }

        // Update our DB with Khong results
        for (const l of lotteries) {
          const meta = metaByLotteryId.get(l.id);
          if (!meta) continue;

          const mapped = marketMap.get(l.ltp);
          if (!mapped) continue;

          // Calculate round_date from open time
          const openDate = new Date(l.open);
          const bangkokDate = openDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });

          // Only sync today's results
          if (bangkokDate !== today) continue;

          const resultHash = computeResultHash({
            source: mapped.source,
            market: mapped.code,
            roundDate: bangkokDate,
            winningNumber: meta.top,
            winningNumber2d: meta.bottom,
            resultTime: meta.created_at,
          });

          const { error: updateError } = await supabase
            .from('stock_results')
            .update({
              winning_number: meta.top,
              winning_number_2d: meta.bottom,
              status: 'resulted',
              result_time: meta.created_at,
              generation_method: 'manual',
              result_hash: resultHash,
              updated_at: now.toISOString(),
            })
            .eq('source', mapped.source)
            .eq('market', mapped.code)
            .eq('round_date', bangkokDate)
            .is('winning_number', null); // Only update if not already set

          if (!updateError) stats.synced++;
          else stats.errors++;
        }
      }
    }
  }

  return NextResponse.json({
    success: true,
    timestamp: now.toISOString(),
    date: today,
    stats,
  });
}
