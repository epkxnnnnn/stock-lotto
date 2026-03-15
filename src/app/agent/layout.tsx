import type { Metadata } from 'next';
import { getBrandConfig } from '@/lib/theme/config';

const agentConfig = getBrandConfig();

export const metadata: Metadata = {
  title: `สมัครตัวแทน — โปรแกรมตัวแทนหวยหุ้น ${agentConfig.siteNameTh}`,
  description: `สมัครเป็นตัวแทน ${agentConfig.siteNameTh} ค่าคอมมิชชั่นสูง ซัพพอร์ตตลอด 24 ชม. พร้อมระบบ API เชื่อมต่อผลหวยหุ้นเรียลไทม์`,
  alternates: { canonical: '/agent' },
  openGraph: {
    title: `สมัครตัวแทน ${agentConfig.siteNameTh} — ค่าคอมมิชชั่นสูง`,
    description: `โปรแกรมตัวแทน ${agentConfig.siteNameTh} สร้างรายได้จากการแนะนำสมาชิก พร้อม API เชื่อมต่อเรียลไทม์`,
    url: '/agent',
  },
};

export default function AgentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
