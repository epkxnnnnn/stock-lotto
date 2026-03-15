import type { Metadata } from 'next';
import { getBrandConfig } from '@/lib/theme/config';
import { getMarkets } from '@/lib/theme/rounds';
import VerifyClient from './VerifyClient';
import JsonLd from '@/components/JsonLd';

const config = getBrandConfig();

export const metadata: Metadata = {
  title: `ตรวจสอบผลหวยหุ้น — Provably Fair | ${config.siteName}`,
  description: `ตรวจสอบความถูกต้องผลหวยหุ้น ${config.siteNameTh} ด้วยระบบ Provably Fair และ Hash ยืนยัน อ้างอิงดัชนีตลาดหุ้นจริง ป้องกันการแก้ไขข้อมูลย้อนหลัง`,
  openGraph: {
    title: `ตรวจสอบผลหวยหุ้น — ${config.siteNameTh}`,
    description: `ระบบตรวจสอบความถูกต้องผลหวยหุ้น ${config.siteNameTh} Provably Fair + Hash ยืนยัน`,
    url: '/verify',
  },
  alternates: { canonical: '/verify' },
};

export default function VerifyPage() {
  const markets = getMarkets(config.brand);
  const marketOptions = markets.map(m => ({
    code: m.code,
    labelTh: m.labelTh,
    flagEmoji: m.flagEmoji,
  }));

  return (
    <>
      <JsonLd
        breadcrumbs={[
          { name: 'หน้าแรก', href: '/' },
          { name: 'ตรวจสอบผล', href: '/verify' },
        ]}
      />
      <VerifyClient brand={config.brand} markets={marketOptions} />
    </>
  );
}
