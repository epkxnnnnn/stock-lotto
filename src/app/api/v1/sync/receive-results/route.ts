import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { buildKhongToMarketMap } from '@/lib/sync/khong-mapping';
import { vvipMarkets } from '@/config/markets-vvip';
import { platinumMarkets } from '@/config/markets-platinum';

export const dynamic = 'force-dynamic';

interface ResultSyncPayload {
  templateId: number;
  top: string;
  bottom: string;
  threeBottom?: string;
  closeDateStr: string;
  lotteryName: string;
  sourceSite: string;
}

/**
 * GET /api/v1/sync/receive-results — Health check
 */
export async function GET() {
  return NextResponse.json({ ok: true, service: 'stock-lotto-result-receiver' });
}

/**
 * POST /api/v1/sync/receive-results — Receive pushed results from khong.vip
 *
 * Auth: Bearer token matching RESULT_SYNC_API_KEY
 * Body: ResultSyncPayload
 */
export async function POST(request: NextRequest) {
  // Auth check
  const authHeader = request.headers.get('authorization');
  const apiKey = process.env.RESULT_SYNC_API_KEY?.trim();

  if (!apiKey) {
    console.error('[ReceiveResults] RESULT_SYNC_API_KEY not configured');
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
  }

  if (authHeader !== `Bearer ${apiKey}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Parse payload
  let payload: ResultSyncPayload;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { templateId, top, bottom, closeDateStr } = payload;

  if (!templateId || !top || !closeDateStr) {
    return NextResponse.json(
      { error: 'Missing required fields: templateId, top, closeDateStr' },
      { status: 400 },
    );
  }

  // Map templateId → our market
  const marketMap = buildKhongToMarketMap();
  const mapped = marketMap.get(templateId);

  if (!mapped) {
    // Not a market we track — silently ignore
    return NextResponse.json({
      ok: true,
      action: 'ignored',
      detail: `templateId ${templateId} not mapped to any market`,
    });
  }

  // Calculate round_date from closeDateStr (Bangkok timezone)
  const closeDate = new Date(closeDateStr);
  const roundDate = closeDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });

  const supabase = createAdminClient();
  const now = new Date().toISOString();

  // Auto-seed schedule row if missing
  const allMarkets = [...vvipMarkets, ...platinumMarkets];
  const marketDef = allMarkets.find(m => m.khongTemplateId === templateId);

  if (marketDef) {
    await supabase
      .from('stock_results')
      .upsert(
        {
          source: mapped.source,
          market: mapped.code,
          market_label_th: mapped.labelTh,
          flag_emoji: mapped.flagEmoji,
          round_date: roundDate,
          close_time: `${roundDate}T${marketDef.closeTime}:00+07:00`,
          status: 'open',
        },
        { onConflict: 'source,market,round_date', ignoreDuplicates: true },
      );
  }

  // Update result — only if winning_number is not already set (idempotent)
  const { data: updated, error: updateError } = await supabase
    .from('stock_results')
    .update({
      winning_number: top,
      winning_number_2d: bottom || null,
      status: 'resulted',
      result_time: now,
      generation_method: 'manual',
      updated_at: now,
    })
    .eq('source', mapped.source)
    .eq('market', mapped.code)
    .eq('round_date', roundDate)
    .is('winning_number', null)
    .select('id');

  if (updateError) {
    console.error(`[ReceiveResults] Update failed for ${mapped.source}/${mapped.code}/${roundDate}:`, updateError.message);
    return NextResponse.json(
      { error: 'Database update failed', detail: updateError.message },
      { status: 500 },
    );
  }

  const wasUpdated = updated && updated.length > 0;

  console.log(
    `[ReceiveResults] ${mapped.source}/${mapped.code} ${roundDate}: ${wasUpdated ? `set ${top}/${bottom}` : 'already had result (skipped)'}`,
  );

  return NextResponse.json({
    ok: true,
    action: wasUpdated ? 'updated' : 'skipped',
    market: `${mapped.source}/${mapped.code}`,
    roundDate,
    winningNumber: wasUpdated ? top : undefined,
  });
}
