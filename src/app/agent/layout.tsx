import type { Metadata } from 'next';
import { getBrandConfig } from '@/lib/theme/config';

const agentConfig = getBrandConfig();

const agentOgImage = `/images/og-${agentConfig.brand}.png`;
const agentDescription = `สมัครเป็นตัวแทน ${agentConfig.siteNameTh} ค่าคอมมิชชั่นสูง ซัพพอร์ตตลอด 24 ชม. พร้อมระบบ API เชื่อมต่อผลหวยหุ้นเรียลไทม์`;

export const metadata: Metadata = {
  title: `สมัครตัวแทน — โปรแกรมตัวแทนหวยหุ้น ${agentConfig.siteNameTh}`,
  description: agentDescription,
  alternates: { canonical: '/agent' },
  openGraph: {
    title: `สมัครตัวแทน ${agentConfig.siteNameTh} — ค่าคอมมิชชั่นสูง`,
    description: `โปรแกรมตัวแทน ${agentConfig.siteNameTh} สร้างรายได้จากการแนะนำสมาชิก พร้อม API เชื่อมต่อเรียลไทม์`,
    url: '/agent',
    type: 'website',
    locale: 'th_TH',
    images: [{ url: agentOgImage, width: 1200, height: 630, alt: `สมัครตัวแทน ${agentConfig.siteNameTh}` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `สมัครตัวแทน ${agentConfig.siteNameTh} — ค่าคอมมิชชั่นสูง`,
    description: agentDescription,
    images: [agentOgImage],
  },
};

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
