import type { Metadata } from 'next';
import { getBrandConfig } from '@/lib/theme/config';
import ResultsClient from './ResultsClient';
import JsonLd from '@/components/JsonLd';

const config = getBrandConfig();

export const metadata: Metadata = {
  title: `ผลหวยหุ้นย้อนหลัง — ตรวจผลหวยหุ้นทุกรอบ ${config.siteNameTh}`,
  description: `ดูผลหวยหุ้นย้อนหลัง ${config.siteNameTh} ครบทุกรอบ ทุกตลาดหุ้นทั่วโลก เลือกดูย้อนหลังรายวัน ดาวโจนส์ นิเคอิ ฮั่งเส็ง จีน เกาหลี ไต้หวัน`,
  openGraph: {
    title: `ผลหวยหุ้นย้อนหลัง — ${config.siteNameTh}`,
    description: `ดูผลหวยหุ้นย้อนหลัง ${config.siteNameTh} ครบทุกรอบ ทุกตลาดหุ้นทั่วโลก`,
    url: '/results',
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
