import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { createKhongClient } from '@/lib/supabase/khong';
import { buildKhongToMarketMap, getAllTemplateIds } from '@/lib/sync/khong-mapping';
import { vvipMarkets } from '@/config/markets-vvip';
import { platinumMarkets } from '@/config/markets-platinum';

interface KhongRow {
  lottery_id: string;
  ltp: number;
  slug: string;
  round_date: string;
  close: string;
  winning_number: string;
  winning_number_2d: string | null;
  result_time: string;
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const days = Math.min(Math.max((body.days as number) || 7, 1), 30);

  const khong = createKhongClient();
  const supabase = createAdminClient();
  const marketMap = buildKhongToMarketMap();
  const templateIds = getAllTemplateIds();

  // Query Khong DB via direct table queries
  let rows: KhongRow[];

  {
    // First get lotteries
    const { data: lotteries, error: lotError } = await khong
      .from('lotteries')
      .select('id, ltp, slug, open, close, status')
      .in('ltp', templateIds)
      .eq('status', 3)
      .gte('close', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('close', { ascending: true });

    if (lotError) {
      return NextResponse.json(
        { success: false, error: `Khong query failed: ${lotError.message}` },
        { status: 500 }
      );
    }

    if (!lotteries || lotteries.length === 0) {
      return NextResponse.json({
        success: true,
        synced: 0,
        seeded: 0,
        skipped: 0,
        message: 'No resulted lotteries found in Khong DB',
      });
    }

    const lotteryIds = lotteries.map((l: { id: string }) => l.id);

    // Get winning numbers from lottery_metas
    const { data: metas, error: metaError } = await khong
      .from('lottery_metas')
      .select('lottery_id, top, bottom, created_at')
      .in('lottery_id', lotteryIds)
      .is('meta_key', null)
      .not('top', 'is', null);

    if (metaError) {
      return NextResponse.json(
        { success: false, error: `Khong meta query failed: ${metaError.message}` },
        { status: 500 }
      );
    }

    // Build a meta lookup by lottery_id
    const metaByLotteryId = new Map<string, { top: string; bottom: string | null; created_at: string }>();
    for (const m of metas ?? []) {
      metaByLotteryId.set(m.lottery_id, {
        top: m.top,
        bottom: m.bottom,
        created_at: m.created_at,
      });
    }

    // Join lotteries + metas
    rows = [];
    for (const l of lotteries) {
      const meta = metaByLotteryId.get(l.id);
      if (!meta) continue;

      // Calculate round_date from open time in Bangkok timezone
      const openDate = new Date(l.open);
      const bangkokDate = openDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });

      rows.push({
        lottery_id: l.id,
        ltp: l.ltp,
        slug: l.slug,
        round_date: bangkokDate,
        close: l.close,
        winning_number: meta.top,
        winning_number_2d: meta.bottom,
        result_time: meta.created_at,
      });
    }
  }

  // Process rows: seed schedule + upsert results
  let synced = 0;
  let seeded = 0;
  let skipped = 0;

  // Group by round_date to batch-seed schedules
  const dateSet = new Set(rows.map((r) => r.round_date));

  // Seed missing schedule rows for each date
  for (const date of dateSet) {
    const seedRows: {
      source: string;
      market: string;
      market_label_th: string;
      flag_emoji: string;
      round_date: string;
      close_time: string;
      status: string;
    }[] = [];

    for (const m of vvipMarkets) {
      seedRows.push({
        source: 'vvip',
        market: m.code,
        market_label_th: m.labelTh,
        flag_emoji: m.flagEmoji,
        round_date: date,
        close_time: `${date}T${m.closeTime}:00+07:00`,
        status: 'open',
      });
    }
    for (const m of platinumMarkets) {
      seedRows.push({
        source: 'platinum',
        market: m.code,
        market_label_th: m.labelTh,
        flag_emoji: m.flagEmoji,
        round_date: date,
        close_time: `${date}T${m.closeTime}:00+07:00`,
        status: 'open',
      });
    }

    const { data: seedResult } = await supabase
      .from('stock_results')
      .upsert(seedRows, { onConflict: 'source,market,round_date', ignoreDuplicates: true })
      .select('id');

    seeded += seedResult?.length ?? 0;
  }

  // Upsert winning numbers
  for (const row of rows) {
    const mapped = marketMap.get(row.ltp);
    if (!mapped) {
      skipped++;
      continue;
    }

    const { error: updateError } = await supabase
      .from('stock_results')
      .update({
        winning_number: row.winning_number,
        winning_number_2d: row.winning_number_2d,
        status: 'resulted',
        result_time: row.result_time,
        generation_method: 'manual',
      })
      .eq('source', mapped.source)
      .eq('market', mapped.code)
      .eq('round_date', row.round_date);

    if (updateError) {
      skipped++;
    } else {
      synced++;
    }
  }

  return NextResponse.json({
    success: true,
    synced,
    seeded,
    skipped,
    dates: Array.from(dateSet).sort(),
    message: `Synced ${synced} results across ${dateSet.size} dates (seeded ${seeded} new schedule rows, skipped ${skipped})`,
  });
}
