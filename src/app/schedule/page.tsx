import type { Metadata } from 'next';
import { getBrandConfig } from '@/lib/theme/config';
import { getMarkets } from '@/lib/theme/rounds';
import { createClient } from '@supabase/supabase-js';
import ScheduleTimeline from '@/components/ScheduleTimeline';
import type { ScheduleMarketData } from '@/components/ScheduleTimeline';

const scheduleConfig = getBrandConfig();
const scheduleRoundCount = scheduleConfig.brand === 'platinum' ? 15 : 13;

export const metadata: Metadata = {
  title: `ตารางเวลาหวยหุ้น ${scheduleConfig.siteNameTh} ${scheduleRoundCount} รอบ | ${scheduleConfig.siteName}`,
  description: `ตารางเวลาออกผลหวยหุ้น ${scheduleConfig.siteNameTh} ครบ ${scheduleRoundCount} รอบ พร้อมนับถอยหลังเรียลไทม์ ดาวโจนส์ นิเคอิ ฮั่งเส็ง จีน เกาหลี ไต้หวัน สิงคโปร์ เวียดนาม`,
  openGraph: {
    title: `ตารางเวลาหวยหุ้น ${scheduleConfig.siteNameTh} — นับถอยหลังเรียลไทม์`,
    description: `ตารางเวลาออกผลหวยหุ้น ${scheduleConfig.siteNameTh} ครบ ${scheduleRoundCount} รอบ อัพเดทเรียลไทม์`,
    url: '/schedule',
  },
};

function getSession(closeTime: string): 'morning' | 'afternoon' | 'evening' {
  const hour = parseInt(closeTime.split(':')[0], 10);
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
}

export const dynamic = 'force-dynamic';

export default async function SchedulePage() {
  const brand = scheduleConfig.brand;
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
  const markets = getMarkets(brand);

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

  const resultMap = new Map<string, Record<string, unknown>>();
  if (data) {
    for (const row of data) {
      resultMap.set(row.market as string, row);
    }
  }

  const scheduleMarkets: ScheduleMarketData[] = markets.map(m => {
    const dbRow = resultMap.get(m.code);
    const cleanLabel = m.labelTh
      .replace(/VVIP|แพลทินัม|หุ้น/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    return {
      code: m.code,
      labelTh: cleanLabel,
      labelLo: m.labelLo,
      flagEmoji: m.flagEmoji,
      openTimeISO: `${today}T${m.openTime}:00+07:00`,
      closeTimeISO: dbRow ? (dbRow.close_time as string) : `${today}T${m.closeTime}:00+07:00`,
      announceTimeISO: `${today}T${m.announceTime}:00+07:00`,
      closeTimeDisplay: m.closeTime,
      announceTimeDisplay: m.announceTime,
      order: m.order,
      source: brand,
      winningNumber: dbRow ? (dbRow.winning_number as string | null) : null,
      winningNumber2d: dbRow ? ((dbRow.winning_number_2d as string | null) ?? null) : null,
      dbStatus: dbRow ? (dbRow.status as 'open' | 'closed' | 'resulted') : 'open',
      resultTime: dbRow ? (dbRow.result_time as string | null) : null,
      session: getSession(m.closeTime),
    };
  });

  return (
    <div className="py-6">
      <ScheduleTimeline initialMarkets={scheduleMarkets} brand={brand} today={today} />
    </div>
  );
}
