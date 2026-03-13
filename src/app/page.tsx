import { getBrandConfig } from '@/lib/theme/config';
import { getMarkets } from '@/lib/theme/rounds';
import HomeClient from '@/components/HomeClient';
import type { StockResult } from '@/types';
import { createClient } from '@supabase/supabase-js';

async function getResults(brand: string, today: string): Promise<StockResult[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { data } = await supabase
    .from('stock_results')
    .select('*')
    .eq('source', brand)
    .eq('round_date', today)
    .order('close_time', { ascending: true });

  if (!data || data.length === 0) {
    // Fallback to market config if no DB rows yet
    const markets = getMarkets(brand as 'vvip' | 'platinum');
    return markets.map((m) => ({
      id: `${brand}-${m.code}-${today}`,
      source: brand as 'vvip' | 'platinum',
      market: m.code,
      marketLabelTh: m.labelTh,
      flagEmoji: m.flagEmoji,
      winningNumber: null,
      winningNumber2d: null,
      roundDate: today,
      closeTime: `${today}T${m.closeTime}:00+07:00`,
      resultTime: null,
      status: 'open' as const,
      generationMethod: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }

  return data.map((r: Record<string, unknown>) => ({
    id: r.id as string,
    source: r.source as 'vvip' | 'platinum',
    market: r.market as string,
    marketLabelTh: r.market_label_th as string,
    marketLabelLo: r.market_label_lo as string | undefined,
    flagEmoji: r.flag_emoji as string,
    winningNumber: r.winning_number as string | null,
    winningNumber2d: (r.winning_number_2d as string | null) ?? null,
    roundDate: r.round_date as string,
    closeTime: r.close_time as string,
    resultTime: r.result_time as string | null,
    status: r.status as 'open' | 'closed' | 'resulted',
    generationMethod: (r.generation_method as 'auto' | 'manual' | null) ?? null,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  }));
}

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const config = getBrandConfig();
  const today = new Date().toISOString().split('T')[0];
  const results = await getResults(config.brand, today);

  return <HomeClient initialResults={results} brand={config.brand} today={today} />;
}
