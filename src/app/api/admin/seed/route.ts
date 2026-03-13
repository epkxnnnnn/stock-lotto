import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { vvipMarkets } from '@/config/markets-vvip';
import { platinumMarkets } from '@/config/markets-platinum';

export async function POST(request: NextRequest) {
  const supabase = createAdminClient();

  const body = await request.json().catch(() => ({}));
  const date = (body.date as string) || new Date().toISOString().split('T')[0];

  const rows: {
    source: string;
    market: string;
    market_label_th: string;
    flag_emoji: string;
    round_date: string;
    close_time: string;
    status: string;
  }[] = [];

  // Build VVIP rows
  for (const m of vvipMarkets) {
    rows.push({
      source: 'vvip',
      market: m.code,
      market_label_th: m.labelTh,
      flag_emoji: m.flagEmoji,
      round_date: date,
      close_time: `${date}T${m.closeTime}:00+07:00`,
      status: 'open',
    });
  }

  // Build Platinum rows
  for (const m of platinumMarkets) {
    rows.push({
      source: 'platinum',
      market: m.code,
      market_label_th: m.labelTh,
      flag_emoji: m.flagEmoji,
      round_date: date,
      close_time: `${date}T${m.closeTime}:00+07:00`,
      status: 'open',
    });
  }

  // Upsert all (skip if already exists)
  const { data, error } = await supabase
    .from('stock_results')
    .upsert(rows, { onConflict: 'source,market,round_date', ignoreDuplicates: true })
    .select();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    seeded: data?.length ?? 0,
    date,
    message: `Seeded ${data?.length ?? 0} rows for ${date} (VVIP: ${vvipMarkets.length}, Platinum: ${platinumMarkets.length})`,
  });
}
