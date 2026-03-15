import type { Metadata } from 'next';
import { getBrandConfig } from '@/lib/theme/config';
import { getMarkets } from '@/lib/theme/rounds';
import AboutClient from './AboutClient';
import JsonLd from '@/components/JsonLd';

const aboutConfig = getBrandConfig();
const aboutRoundCount = aboutConfig.brand === 'platinum' ? 15 : 13;

const aboutFaq = [
  {
    question: 'หวยหุ้นคืออะไร?',
    answer: `หวยหุ้นคือการนำตัวเลขจากดัชนีตลาดหุ้นต่างประเทศมาเป็นผลรางวัล ${aboutConfig.siteNameTh} ให้บริการผลหวยหุ้น ${aboutRoundCount} รอบต่อวัน ครอบคลุมตลาดหุ้นชั้นนำทั่วโลก`,
  },
  {
    question: 'ผลหวยหุ้นออกกี่โมง?',
    answer: `ผลหวยหุ้นออกตลอดทั้งวัน ${aboutRoundCount} รอบ เริ่มตั้งแต่ช่วงเช้าจนถึงค่ำ ดูตารางเวลาออกผลทั้งหมดได้ที่หน้าตารางเวลา`,
  },
  {
    question: 'วิธีตรวจผลหวยหุ้น?',
    answer: `เข้าเว็บไซต์ ${aboutConfig.domain} ผลหวยหุ้นจะอัพเดทอัตโนมัติแบบเรียลไทม์ทันทีที่ผลออก ไม่ต้องรีเฟรชหน้า`,
  },
  {
    question: `${aboutConfig.siteNameTh} มีตลาดอะไรบ้าง?`,
    answer: `${aboutConfig.siteNameTh} ครอบคลุม ${aboutRoundCount} ตลาดหุ้น ได้แก่ ดาวโจนส์ นิเคอิ ฮั่งเส็ง จีน เกาหลี ไต้หวัน สิงคโปร์ เวียดนาม และอื่นๆ`,
  },
];

const aboutOgImage = `/images/og-${aboutConfig.brand}.png`;
const aboutDescription = `เกี่ยวกับ ${aboutConfig.siteNameTh} แหล่งรวมผลหวยหุ้นออนไลน์ ${aboutRoundCount} รอบต่อวัน ครบทุกตลาดหุ้นทั่วโลก อัพเดทเรียลไทม์ น่าเชื่อถือ`;

export const metadata: Metadata = {
  title: `เกี่ยวกับ ${aboutConfig.siteNameTh} — แหล่งผลหวยหุ้นออนไลน์`,
  description: aboutDescription,
  openGraph: {
    title: `เกี่ยวกับ ${aboutConfig.siteNameTh} — แหล่งผลหวยหุ้นออนไลน์`,
    description: `แหล่งรวมผลหวยหุ้นออนไลน์ ${aboutRoundCount} รอบต่อวัน ครบทุกตลาดหุ้นทั่วโลก`,
    url: '/about',
    type: 'website',
    locale: 'th_TH',
    images: [{ url: aboutOgImage, width: 1200, height: 630, alt: `เกี่ยวกับ ${aboutConfig.siteNameTh}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `เกี่ยวกับ ${aboutConfig.siteNameTh} — แหล่งผลหวยหุ้นออนไลน์`,
    description: aboutDescription,
    images: [aboutOgImage],
  },
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  const markets = getMarkets(aboutConfig.brand);
  const uniqueFlags = new Set(markets.map(m => m.flagEmoji));

  return (
    <>
      <JsonLd
        breadcrumbs={[
          { name: 'หน้าแรก', href: '/' },
          { name: 'เกี่ยวกับเรา', href: '/about' },
        ]}
        faq={aboutFaq}
      />
      <AboutClient
        config={aboutConfig}
        markets={markets}
        uniqueFlagCount={uniqueFlags.size}
      />
    </>
  );
}
