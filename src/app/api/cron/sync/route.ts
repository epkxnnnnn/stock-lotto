import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createKhongClient } from '@/lib/supabase/khong';
import { computeResultHash } from '@/lib/verify';
import { dispatchWebhooks } from '@/lib/api/webhook';
import { vvipMarkets } from '@/config/markets-vvip';
import { platinumMarkets } from '@/config/markets-platinum';
import type { Market } from '@/types';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * Build a reverse lookup: khongTemplateId → { source, market }
 */
function buildKhongToLocalMap(): Map<number, { source: 'vvip' | 'platinum'; market: string }> {
  const map = new Map<number, { source: 'vvip' | 'platinum'; market: string }>();
  const addMarkets = (markets: Market[], source: 'vvip' | 'platinum') => {
    for (const m of markets) {
      map.set(m.khongTemplateId, { source, market: m.code });
    }
  };
  addMarkets(vvipMarkets, 'vvip');
  addMarkets(platinumMarkets, 'platinum');
  return map;
}

/**
 * Vercel Cron Job: runs every 2 minutes
 * 1. Seeds today's schedule if missing
 * 2. Auto-closes markets past close_time
 * 3. Reads results from Khong DB for closed markets (khong generates via SWP)
 * 4. Dispatches webhooks to agents
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

  const stats = { seeded: 0, closed: 0, synced: 0, notified: 0, errors: 0 };

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

  // Step 3: Read results from Khong for closed markets without winning numbers
  interface SyncedResult {
    source: string;
    market: string;
    top: string;
    bottom: string;
  }
  const syncedResults: SyncedResult[] = [];

  {
    const { data: unresolvedMarkets } = await supabase
      .from('stock_results')
      .select('id, source, market, close_time')
      .eq('round_date', today)
      .eq('status', 'closed')
      .is('winning_number', null)
      .lte('close_time', now.toISOString());

    if (unresolvedMarkets && unresolvedMarkets.length > 0) {
      const khong = createKhongClient();
      const khongToLocal = buildKhongToLocalMap();

      // Collect all khong template IDs we need to look up
      const templateIdsNeeded: number[] = [];
      const localRowsByTemplate = new Map<number, typeof unresolvedMarkets>();

      for (const row of unresolvedMarkets) {
        // Find the khong template ID for this source:market
        for (const [templateId, mapping] of khongToLocal) {
          if (mapping.source === row.source && mapping.market === row.market) {
            templateIdsNeeded.push(templateId);
            if (!localRowsByTemplate.has(templateId)) {
              localRowsByTemplate.set(templateId, []);
            }
            localRowsByTemplate.get(templateId)!.push(row);
            break;
          }
        }
      }

      if (templateIdsNeeded.length > 0) {
        // Find today's lotteries in Khong for these templates
        const startOfDay = `${today}T00:00:00+07:00`;
        const endOfDay = `${today}T23:59:59+07:00`;

        const { data: khongLotteries } = await khong
          .from('lotteries')
          .select('id, ltp, status')
          .in('ltp', templateIdsNeeded)
          .gte('close', startOfDay)
          .lte('close', endOfDay);

        if (khongLotteries && khongLotteries.length > 0) {
          // Only look at lotteries that have been fully processed (status 3 = COMPLETED)
          // Excludes CALCULATING(4), CANCELLED(5), NO_RESULT(7)
          const completedLotteries = khongLotteries.filter(l => l.status === 3);
          const lotteryIds = completedLotteries.map(l => l.id);

          if (lotteryIds.length > 0) {
            // Fetch results from lottery_metas
            const { data: metas } = await khong
              .from('lottery_metas')
              .select('lottery_id, top, bottom')
              .in('lottery_id', lotteryIds)
              .is('meta_key', null)
              .not('top', 'is', null)
              .not('bottom', 'is', null);

            if (metas && metas.length > 0) {
              // Build lottery_id → template_id map
              const lotteryToTemplate = new Map(completedLotteries.map(l => [l.id, l.ltp]));

              for (const meta of metas) {
                const templateId = lotteryToTemplate.get(meta.lottery_id);
                if (!templateId) continue;

                const localRows = localRowsByTemplate.get(templateId);
                if (!localRows) continue;

                for (const localRow of localRows) {
                  const resultTime = now.toISOString();
                  const resultHash = computeResultHash({
                    source: localRow.source,
                    market: localRow.market,
                    roundDate: today,
                    winningNumber: meta.top,
                    winningNumber2d: meta.bottom,
                    resultTime,
                    referencePrice: null,
                    seed: null,
                  });

                  const { error: updateError } = await supabase
                    .from('stock_results')
                    .update({
                      winning_number: meta.top,
                      winning_number_2d: meta.bottom,
                      status: 'resulted',
                      result_time: resultTime,
                      generation_method: 'khong_sync',
                      generation_seed: null,
                      reference_price: null,
                      result_hash: resultHash,
                      updated_at: now.toISOString(),
                    })
                    .eq('id', localRow.id)
                    .is('winning_number', null);

                  if (!updateError) {
                    stats.synced++;
                    syncedResults.push({
                      source: localRow.source,
                      market: localRow.market,
                      top: meta.top,
                      bottom: meta.bottom,
                    });
                  } else {
                    stats.errors++;
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // Step 4: Dispatch webhooks to agents (fire-and-forget)
  for (const r of syncedResults) {
    dispatchWebhooks({
      event: 'result.published',
      source: r.source,
      market: r.market,
      winning_number: r.top,
      winning_number_2d: r.bottom,
      round_date: today,
      timestamp: now.toISOString(),
    }).then(() => {
      // logged internally
    }).catch((err) => {
      console.error(`[cron] Webhook dispatch error for ${r.source}:${r.market}:`, err);
    });
    stats.notified++;
  }

  return NextResponse.json({
    success: true,
    timestamp: now.toISOString(),
    date: today,
    stats,
  });
}
