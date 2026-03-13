import type { Metadata } from 'next';
import SectionTitle from '@/components/SectionTitle';
import PayoutTable from '@/components/PayoutTable';
import { getBrandConfig } from '@/lib/theme/config';

const config = getBrandConfig();

export const metadata: Metadata = {
  title: `อัตราจ่ายหวยหุ้น — ตาราง 3 ตัว 2 ตัว ${config.siteNameTh}`,
  description: `อัตราจ่ายหวยหุ้น ${config.siteNameTh} ตาราง 3 ตัวบน 3 ตัวโต๊ด 2 ตัว อัพเดทล่าสุด จ่ายเต็มอัตรา`,
  openGraph: {
    title: `อัตราจ่ายหวยหุ้น — ${config.siteNameTh}`,
    description: `อัตราจ่ายหวยหุ้น ${config.siteNameTh} ตาราง 3 ตัวบน 3 ตัวโต๊ด 2 ตัว อัพเดทล่าสุด`,
    url: '/rates',
  },
  alternates: { canonical: '/rates' },
};

export default function RatesPage() {
  return (
    <div className="py-10">
      <SectionTitle>&#x1F4B0; อัตราจ่าย</SectionTitle>
      <PayoutTable />
    </div>
  );
}
