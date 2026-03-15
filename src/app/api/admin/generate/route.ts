import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { computeResultHash, deriveNumbersFromSeed } from '@/lib/verify';
import crypto from 'crypto';

/**
 * Auto-generate winning numbers for markets past close time.
 * Generates cryptographically random 3-digit (top) and 2-digit (bottom) numbers.
 * Only affects markets with status 'open' whose close_time has passed.
 */
export async function POST(request: NextRequest) {
  const supabase = createAdminClient();

  const body = await request.json().catch(() => ({}));
  const source = (body.source as string) || undefined;
  const date = (body.date as string) || new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });

  // Find markets past close time that have no results yet
  let query = supabase
    .from('stock_results')
    .select('id, source, market, market_label_th, close_time')
    .eq('round_date', date)
    .eq('status', 'open')
    .lte('close_time', new Date().toISOString());

  if (source) {
    query = query.eq('source', source);
  }

  const { data: pending, error: fetchError } = await query.order('close_time', { ascending: true });

  if (fetchError) {
    return NextResponse.json(
      { success: false, error: fetchError.message },
      { status: 500 }
    );
  }

  if (!pending || pending.length === 0) {
    return NextResponse.json({
      success: true,
      generated: 0,
      message: 'No pending markets past close time',
    });
  }

  let generated = 0;
  let failed = 0;
  const results: { market: string; source: string; top: string; bottom: string }[] = [];

  for (const row of pending) {
    // Provably Fair: generate seed, derive numbers deterministically via HMAC-SHA256
    const seed = crypto.randomBytes(32).toString('hex');
    const { threeDigit: top, twoDigit: bottom } = deriveNumbersFromSeed(seed, row.source, row.market, date);

    const resultTime = new Date().toISOString();
    const resultHash = computeResultHash({
      source: row.source,
      market: row.market,
      roundDate: date,
      winningNumber: top,
      winningNumber2d: bottom,
      resultTime,
      seed,
    });

    const { error: updateError } = await supabase
      .from('stock_results')
      .update({
        winning_number: top,
        winning_number_2d: bottom,
        status: 'resulted',
        result_time: resultTime,
        generation_method: 'auto',
        generation_seed: seed,
        result_hash: resultHash,
      })
      .eq('id', row.id);

    if (updateError) {
      failed++;
    } else {
      generated++;
      results.push({ market: row.market, source: row.source, top, bottom });
    }
  }

  // Trigger webhook for each generated result (non-blocking)
  for (const r of results) {
    try {
      const hmacSecret = process.env.HMAC_SECRET || '';
      fetch(`${request.nextUrl.origin}/api/webhook/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-internal-secret': hmacSecret,
        },
        body: JSON.stringify(r),
      }).catch(() => {});
    } catch {
      // Non-blocking
    }
  }

  return NextResponse.json({
    success: true,
    generated,
    failed,
    date,
    results,
    message: `Generated ${generated} results for ${date}${failed > 0 ? ` (${failed} failed)` : ''}`,
  });
}
