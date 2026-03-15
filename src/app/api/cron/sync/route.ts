import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { computeResultHash, deriveNumbersFromPrice, deriveNumbersFromSeed } from '@/lib/verify';
import { fetchStockPrice, getYahooSymbol, isWeekday } from '@/lib/stock-price';
import { pushBatchToKhong } from '@/lib/sync/push-to-khong';
import { dispatchWebhooks } from '@/lib/api/webhook';
import { vvipMarkets } from '@/config/markets-vvip';
import { platinumMarkets } from '@/config/markets-platinum';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * Vercel Cron Job: runs every 2 minutes
 * 1. Seeds today's schedule if missing
 * 2. Auto-closes markets past close_time
 * 3. Generates results for closed markets (stock price / provably fair)
 * 4. Pushes results to Khong DB
 * 5. Dispatches webhooks to agents
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

  const stats = { seeded: 0, closed: 0, generated: 0, pushed: 0, notified: 0, errors: 0 };

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

  // Step 3: Generate results for closed markets without winning numbers
  interface GeneratedResult {
    source: string;
    market: string;
    top: string;
    bottom: string;
  }
  const generatedResults: GeneratedResult[] = [];

  {
    const { data: unresolvedMarkets } = await supabase
      .from('stock_results')
      .select('id, source, market, close_time')
      .eq('round_date', today)
      .eq('status', 'closed')
      .is('winning_number', null)
      .lte('close_time', now.toISOString());

    if (unresolvedMarkets && unresolvedMarkets.length > 0) {
      const weekday = isWeekday(today);

      for (const row of unresolvedMarkets) {
        let top: string;
        let bottom: string;
        let generationMethod: string;
        let seed: string | null = null;
        let referencePrice: string | null = null;

        if (weekday) {
          // Try stock price derivation first on weekdays
          const yahooSymbol = getYahooSymbol(row.market);
          const priceData = yahooSymbol ? await fetchStockPrice(yahooSymbol) : null;

          if (priceData) {
            const derived = deriveNumbersFromPrice(priceData.price, row.source, row.market, today);
            top = derived.threeDigit;
            bottom = derived.twoDigit;
            generationMethod = 'stock_ref';
            referencePrice = priceData.price;
          } else {
            // Fallback to Provably Fair
            seed = crypto.randomBytes(32).toString('hex');
            const derived = deriveNumbersFromSeed(seed, row.source, row.market, today);
            top = derived.threeDigit;
            bottom = derived.twoDigit;
            generationMethod = 'auto';
          }
        } else {
          // Weekend: Provably Fair only
          seed = crypto.randomBytes(32).toString('hex');
          const derived = deriveNumbersFromSeed(seed, row.source, row.market, today);
          top = derived.threeDigit;
          bottom = derived.twoDigit;
          generationMethod = 'auto';
        }

        const resultTime = now.toISOString();
        const resultHash = computeResultHash({
          source: row.source,
          market: row.market,
          roundDate: today,
          winningNumber: top,
          winningNumber2d: bottom,
          resultTime,
          referencePrice,
          seed,
        });

        const { error: updateError } = await supabase
          .from('stock_results')
          .update({
            winning_number: top,
            winning_number_2d: bottom,
            status: 'resulted',
            result_time: resultTime,
            generation_method: generationMethod,
            generation_seed: seed,
            reference_price: referencePrice,
            result_hash: resultHash,
            updated_at: now.toISOString(),
          })
          .eq('id', row.id)
          .is('winning_number', null);

        if (!updateError) {
          stats.generated++;
          generatedResults.push({ source: row.source, market: row.market, top, bottom });
        } else {
          stats.errors++;
        }
      }
    }
  }

  // Step 4: Push generated results to Khong DB
  if (generatedResults.length > 0) {
    const pushParams = generatedResults.map(r => ({
      source: r.source as 'vvip' | 'platinum',
      market: r.market,
      winningNumber: r.top,
      winningNumber2d: r.bottom,
      roundDate: today,
    }));

    const { pushed, failed } = await pushBatchToKhong(pushParams);
    stats.pushed = pushed;
    if (failed > 0) stats.errors += failed;
  }

  // Step 5: Dispatch webhooks to agents (fire-and-forget — must not block cron)
  // dispatchWebhooks() has retry delays up to 5min, so we cannot await it.
  for (const r of generatedResults) {
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
