import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { computeResultHash } from '@/lib/verify';
import { getStockSymbol } from '@/lib/stock-symbols';

export const dynamic = 'force-dynamic';

/**
 * GET /api/v1/verify?source=vvip&market=nikkei_am&date=2026-03-14
 * Public endpoint — no auth required. Returns result + verification data.
 */
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const source = searchParams.get('source');
  const market = searchParams.get('market');
  const date = searchParams.get('date');

  if (!source || !market || !date) {
    return NextResponse.json(
      { success: false, error: 'Missing required params: source, market, date' },
      { status: 400 },
    );
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
  );

  const { data, error } = await supabase
    .from('stock_results')
    .select('*')
    .eq('source', source)
    .eq('market', market)
    .eq('round_date', date)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { success: false, error: 'Result not found' },
      { status: 404 },
    );
  }

  const stockInfo = getStockSymbol(market);

  // Verify hash if result exists
  let verified: boolean | null = null;
  if (data.winning_number && data.result_hash) {
    const expectedHash = computeResultHash({
      source: data.source,
      market: data.market,
      roundDate: data.round_date,
      winningNumber: data.winning_number,
      winningNumber2d: data.winning_number_2d,
      resultTime: data.result_time,
      referencePrice: data.reference_price,
      seed: data.generation_seed,
    });
    verified = expectedHash === data.result_hash;
  }

  return NextResponse.json({
    success: true,
    data: {
      source: data.source,
      market: data.market,
      marketLabelTh: data.market_label_th,
      flagEmoji: data.flag_emoji,
      roundDate: data.round_date,
      winningNumber: data.winning_number,
      winningNumber2d: data.winning_number_2d,
      closeTime: data.close_time,
      resultTime: data.result_time,
      status: data.status,
      generationMethod: data.generation_method,
      generationSeed: data.generation_seed,
      referencePrice: data.reference_price,
      resultHash: data.result_hash,
      stockSymbol: stockInfo?.symbol ?? null,
      stockIndex: stockInfo?.indexName ?? null,
      verified,
    },
  });
}
