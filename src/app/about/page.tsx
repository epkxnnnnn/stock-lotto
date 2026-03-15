import type { Metadata } from 'next';
import { getBrandConfig } from '@/lib/theme/config';
import { getMarkets } from '@/lib/theme/rounds';
import AboutClient from './AboutClient';

const aboutConfig = getBrandConfig();
const aboutRoundCount = aboutConfig.brand === 'platinum' ? 15 : 13;

export const metadata: Metadata = {
  title: `เกี่ยวกับ ${aboutConfig.siteNameTh} — แหล่งผลหวยหุ้นออนไลน์`,
  description: `เกี่ยวกับ ${aboutConfig.siteNameTh} แหล่งรวมผลหวยหุ้นออนไลน์ ${aboutRoundCount} รอบต่อวัน ครบทุกตลาดหุ้นทั่วโลก อัพเดทเรียลไทม์ น่าเชื่อถือ`,
  openGraph: {
    title: `เกี่ยวกับ ${aboutConfig.siteNameTh} — แหล่งผลหวยหุ้นออนไลน์`,
    description: `แหล่งรวมผลหวยหุ้นออนไลน์ ${aboutRoundCount} รอบต่อวัน ครบทุกตลาดหุ้นทั่วโลก`,
    url: '/about',
  },
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  const markets = getMarkets(aboutConfig.brand);
  const uniqueFlags = new Set(markets.map(m => m.flagEmoji));

  return (
    <AboutClient
      config={aboutConfig}
      markets={markets}
      uniqueFlagCount={uniqueFlags.size}
    />
  );
}
