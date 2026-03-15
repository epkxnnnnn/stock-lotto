import type { Metadata } from 'next';
import { getBrandConfig } from '@/lib/theme/config';
import { payoutRates, ignoredThreeDigitNumbers } from '@/config/payout-rates';
import RatesClient from './RatesClient';

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
    <RatesClient
      payoutRates={payoutRates}
      ignoredNumbers={ignoredThreeDigitNumbers}
    />
  );
}
