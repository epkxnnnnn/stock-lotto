import type { Metadata } from 'next';
import { getBrandConfig } from '@/lib/theme/config';
import { getMarkets } from '@/lib/theme/rounds';
import HomeClient from '@/components/HomeClient';
import type { StockResult } from '@/types';
import { createClient } from '@supabase/supabase-js';

const homeConfig = getBrandConfig();
const homeRoundCount = homeConfig.brand === 'platinum' ? 15 : 13;

export const metadata: Metadata = {
  title: `${homeConfig.siteNameTh} — ผลหวยหุ้นวันนี้ ${homeRoundCount} รอบ อัพเดทเรียลไทม์ | ${homeConfig.siteName}`,
  description: `ตรวจผลหวยหุ้นวันนี้ ${homeConfig.siteNameTh} ${homeRoundCount} รอบ ดาวโจนส์ นิเคอิ ฮั่งเส็ง จีน เกาหลี ไต้หวัน สิงคโปร์ เวียดนาม อัพเดทเรียลไทม์ทุกรอบ ฟรี`,
  openGraph: {
    title: `${homeConfig.siteNameTh} — ผลหวยหุ้นวันนี้ อัพเดทเรียลไทม์`,
    description: `ตรวจผลหวยหุ้นวันนี้ ${homeConfig.siteNameTh} ครบ ${homeRoundCount} รอบ อัพเดทผลทุกตลาดหุ้นทั่วโลก`,
    url: '/',
  },
};

function mapRow(r: Record<string, unknown>): StockResult {
  return {
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
  };
}

async function getResults(brand: string, date: string): Promise<StockResult[]> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { data } = await supabase
    .from('stock_results')
    .select('*')
    .eq('source', brand)
    .eq('round_date', date)
    .order('close_time', { ascending: true });

  if (!data || data.length === 0) {
    // Fallback to market config if no DB rows yet
    const markets = getMarkets(brand as 'vvip' | 'platinum');
    return markets.map((m) => ({
      id: `${brand}-${m.code}-${date}`,
      source: brand as 'vvip' | 'platinum',
      market: m.code,
      marketLabelTh: m.labelTh,
      flagEmoji: m.flagEmoji,
      winningNumber: null,
      winningNumber2d: null,
      roundDate: date,
      closeTime: `${date}T${m.closeTime}:00+07:00`,
      resultTime: null,
      status: 'open' as const,
      generationMethod: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
  }

  return data.map(mapRow);
}

export const dynamic = 'force-dynamic';

function getYesterday(today: string): string {
  const d = new Date(today + 'T12:00:00');
  d.setDate(d.getDate() - 1);
  return d.toLocaleDateString('en-CA');
}

export default async function HomePage() {
  const config = getBrandConfig();
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
  const results = await getResults(config.brand, today);

  // If no results today, fetch yesterday's for the results grid
  const hasAnyResult = results.some((r) => r.winningNumber);
  const yesterday = getYesterday(today);
  const yesterdayResults = hasAnyResult ? [] : await getResults(config.brand, yesterday);

  return (
    <HomeClient
      initialResults={results}
      initialYesterdayResults={yesterdayResults}
      brand={config.brand}
      today={today}
      yesterday={yesterday}
    />
  );
}
