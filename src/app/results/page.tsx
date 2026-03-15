import type { Metadata } from 'next';
import { getBrandConfig } from '@/lib/theme/config';
import ResultsClient from './ResultsClient';
import JsonLd from '@/components/JsonLd';

const config = getBrandConfig();

const resultsOgImage = `/images/og-${config.brand}.png`;
const resultsDescription = `ดูผลหวยหุ้นย้อนหลัง ${config.siteNameTh} ครบทุกรอบ ทุกตลาดหุ้นทั่วโลก เลือกดูย้อนหลังรายวัน ดาวโจนส์ นิเคอิ ฮั่งเส็ง จีน เกาหลี ไต้หวัน`;

export const metadata: Metadata = {
  title: `ผลหวยหุ้นย้อนหลัง — ตรวจผลหวยหุ้นทุกรอบ ${config.siteNameTh}`,
  description: resultsDescription,
  openGraph: {
    title: `ผลหวยหุ้นย้อนหลัง — ${config.siteNameTh}`,
    description: `ดูผลหวยหุ้นย้อนหลัง ${config.siteNameTh} ครบทุกรอบ ทุกตลาดหุ้นทั่วโลก`,
    url: '/results',
    type: 'website',
    locale: 'th_TH',
    images: [{ url: resultsOgImage, width: 1200, height: 630, alt: `ผลหวยหุ้นย้อนหลัง ${config.siteNameTh}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `ผลหวยหุ้นย้อนหลัง — ${config.siteNameTh}`,
    description: resultsDescription,
    images: [resultsOgImage],
  },
  alternates: { canonical: '/results' },
};

export default function ResultsPage() {
  return (
    <>
      <JsonLd
        breadcrumbs={[
          { name: 'หน้าแรก', href: '/' },
          { name: 'ผลหวยย้อนหลัง', href: '/results' },
        ]}
      />
      <ResultsClient />
    </>
  );
}
