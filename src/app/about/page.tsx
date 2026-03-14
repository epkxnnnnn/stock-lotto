import type { Metadata } from 'next';
import { getBrandConfig } from '@/lib/theme/config';
import { getMarkets } from '@/lib/theme/rounds';
import SectionTitle from '@/components/SectionTitle';

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
  const config = getBrandConfig();
  const markets = getMarkets(config.brand);

  return (
    <div className="py-10">
      <SectionTitle>&#x2139;&#xFE0F; เกี่ยวกับ {config.siteName}</SectionTitle>

      {/* About section */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-8 mb-6">
        <h3 className="font-heading text-xl tracking-[2px] text-[var(--brand-primary)] mb-4">
          {config.siteNameTh}
        </h3>
        <div className="space-y-3 text-sm text-[var(--text-secondary)] leading-relaxed">
          <p>
            {config.siteNameTh} เป็นแหล่งรวมผลหวยหุ้นออนไลน์ที่น่าเชื่อถือ
            อัพเดทผลทุกรอบแบบเรียลไทม์ ครบทุกตลาดหุ้นทั่วโลก
          </p>
          <p>
            เราให้บริการผลหวยหุ้นจำนวน {markets.length} รอบต่อวัน
            ครอบคลุมตลาดหุ้นชั้นนำจากหลายประเทศทั่วโลก
          </p>
          <p>
            ผลหวยทุกรอบมีความถูกต้องแม่นยำ ตรวจสอบได้จากแหล่งข้อมูลที่เชื่อถือได้
          </p>
        </div>
      </div>

      {/* Markets list */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-8 mb-6">
        <h3 className="font-heading text-xl tracking-[2px] text-[var(--brand-primary)] mb-4">
          &#x1F30D; ตลาดหุ้นทั้งหมด ({markets.length} รอบ)
        </h3>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
          {markets.map((market) => (
            <div
              key={market.code}
              className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-secondary)] rounded-lg"
            >
              <span className="text-xl">{market.flagEmoji}</span>
              <div className="flex-1">
                <div className="text-sm font-medium text-[var(--text-primary)]">
                  {market.labelTh}
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  ปิดรับ: {market.closeTime} น. · ออกผล: {market.announceTime} น.
                </div>
              </div>
              <span className="text-xs text-[var(--text-muted)] font-mono">
                #{market.order}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-8">
        <h3 className="font-heading text-xl tracking-[2px] text-[var(--brand-primary)] mb-4">
          &#x1F4AC; ติดต่อเรา
        </h3>
        <div className="text-sm text-[var(--text-secondary)] space-y-2">
          <p>
            &#x1F310; เว็บไซต์: {config.domain}
          </p>
        </div>
      </div>
    </div>
  );
}
