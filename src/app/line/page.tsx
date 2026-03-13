import type { Metadata } from 'next';
import { getBrandConfig } from '@/lib/theme/config';
import SectionTitle from '@/components/SectionTitle';

const lineConfig = getBrandConfig();

export const metadata: Metadata = {
  title: `LINE Official Account — แจ้งเตือนผลหวยหุ้น ${lineConfig.siteNameTh}`,
  description: `เพิ่มเพื่อน LINE OA ${lineConfig.siteNameTh} รับแจ้งเตือนผลหวยหุ้นทุกรอบแบบเรียลไทม์ ฟรี ไม่มีค่าใช้จ่าย`,
  openGraph: {
    title: `LINE OA — แจ้งเตือนผลหวยหุ้น ${lineConfig.siteNameTh}`,
    description: `เพิ่มเพื่อน LINE OA ${lineConfig.siteNameTh} รับแจ้งเตือนผลหวยหุ้นทุกรอบแบบเรียลไทม์ ฟรี`,
    url: '/line',
  },
  alternates: { canonical: '/line' },
};

export default function LinePage() {
  const config = getBrandConfig();

  return (
    <div className="py-10">
      <SectionTitle>LINE Official Account</SectionTitle>

      <div className="max-w-lg mx-auto">
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-10 text-center">
          {/* LINE icon */}
          <div className="w-20 h-20 bg-[#06c755] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_4px_20px_rgba(6,199,85,0.3)]">
            <svg viewBox="0 0 24 24" className="w-12 h-12 fill-white">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
          </div>

          <h2 className="font-heading text-2xl tracking-[2px] text-[var(--brand-primary)] mb-3">
            {config.siteNameTh}
          </h2>
          <p className="text-[var(--text-secondary)] text-sm mb-6 leading-relaxed">
            เพิ่มเพื่อน LINE Official Account ของเรา<br />
            เพื่อรับแจ้งเตือนผลหวยหุ้นทุกรอบแบบเรียลไทม์
          </p>

          {/* Features list */}
          <div className="text-left space-y-3 mb-8 px-4">
            {[
              'แจ้งเตือนผลหวยทุกรอบ ทันทีที่ออกผล',
              'ตรวจผลหวยย้อนหลังได้ง่ายๆ',
              'อัพเดทตารางเวลาเปิด-ปิดรับ',
              'ฟรี! ไม่มีค่าใช้จ่าย',
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-start gap-2 text-sm text-[var(--text-secondary)]"
              >
                <span className="text-[var(--accent-green)] mt-0.5">&#x2713;</span>
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <a
            href={config.lineUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#06c755] text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-[#05b34a] transition-all hover:scale-105 shadow-[0_4px_15px_rgba(6,199,85,0.3)]"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
            </svg>
            เพิ่มเพื่อน LINE
          </a>
        </div>
      </div>
    </div>
  );
}
