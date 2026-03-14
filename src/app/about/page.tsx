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

const features = [
  {
    icon: '\u26A1',
    title: 'เรียลไทม์',
    description: 'อัพเดทผลหวยหุ้นแบบเรียลไทม์ทันทีที่ออกผล ไม่ต้องรีเฟรชหน้า',
  },
  {
    icon: '\u{1F512}',
    title: 'ปลอดภัย',
    description: 'ระบบป้องกันการคัดลอกข้อมูล 3 ชั้น พร้อมการเข้ารหัสระดับสูง',
  },
  {
    icon: '\u{1F30D}',
    title: 'ครอบคลุมทั่วโลก',
    description: 'รวมตลาดหุ้นชั้นนำจากหลายประเทศ ญี่ปุ่น จีน ฮ่องกง เกาหลี อเมริกา',
  },
  {
    icon: '\u{1F4F1}',
    title: 'รองรับทุกอุปกรณ์',
    description: 'ใช้งานได้สะดวกทั้งมือถือ แท็บเล็ต และคอมพิวเตอร์',
  },
];

export default function AboutPage() {
  const config = getBrandConfig();
  const markets = getMarkets(config.brand);

  // Count unique countries
  const uniqueFlags = new Set(markets.map(m => m.flagEmoji));

  return (
    <div className="py-10">
      <SectionTitle>&#x2139;&#xFE0F; เกี่ยวกับ {config.siteName}</SectionTitle>

      {/* Hero about section */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-8 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand-primary)]/5 to-transparent pointer-events-none" />
        <div className="relative">
          <h3 className="font-heading text-2xl tracking-[3px] gradient-text mb-4">
            {config.siteNameTh}
          </h3>
          <div className="space-y-3 text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
            <p>
              {config.siteNameTh} เป็นแหล่งรวมผลหวยหุ้นออนไลน์ที่น่าเชื่อถือ
              อัพเดทผลทุกรอบแบบเรียลไทม์ ครบทุกตลาดหุ้นทั่วโลก
            </p>
            <p>
              เราให้บริการผลหวยหุ้นจำนวน {markets.length} รอบต่อวัน
              ครอบคลุมตลาดหุ้นชั้นนำจากหลายประเทศทั่วโลก
              ผลหวยทุกรอบมีความถูกต้องแม่นยำ ตรวจสอบได้จากแหล่งข้อมูลที่เชื่อถือได้
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {[
          { value: `${markets.length}`, label: 'รอบต่อวัน', sub: 'ครบทุกรอบ' },
          { value: `${uniqueFlags.size}`, label: 'ประเทศ', sub: 'ตลาดหุ้นทั่วโลก' },
          { value: '24/7', label: 'อัพเดท', sub: 'เรียลไทม์' },
          { value: '99.9%', label: 'ความแม่นยำ', sub: 'ตรวจสอบได้' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-5 text-center"
          >
            <div className="font-mono text-2xl md:text-3xl font-bold gradient-text mb-1">
              {stat.value}
            </div>
            <div className="text-sm font-semibold text-[var(--text-primary)]">{stat.label}</div>
            <div className="text-[10px] text-[var(--text-muted)] mt-0.5">{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Feature highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 flex items-start gap-4 hover:border-[var(--brand-primary)]/30 transition-all"
          >
            <div className="w-10 h-10 rounded-[10px] bg-[var(--brand-primary)]/10 flex items-center justify-center text-xl shrink-0">
              {feature.icon}
            </div>
            <div>
              <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">
                {feature.title}
              </div>
              <div className="text-xs text-[var(--text-muted)] leading-relaxed">
                {feature.description}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Markets list */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 md:p-8 mb-6">
        <h3 className="font-heading text-xl tracking-[2px] text-[var(--brand-primary)] mb-4">
          &#x1F30D; ตลาดหุ้นทั้งหมด ({markets.length} รอบ)
        </h3>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
          {markets.map((market, i) => (
            <div
              key={market.code}
              className="flex items-center gap-3 px-4 py-3 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-secondary)]/80 transition-colors"
              style={{
                animation: 'fadeInUp 0.4s ease-out backwards',
                animationDelay: `${i * 0.03}s`,
              }}
            >
              <span className="text-xl">{market.flagEmoji}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {market.labelTh}
                </div>
                <div className="text-[11px] text-[var(--text-muted)]">
                  ปิดรับ {market.closeTime} น. &middot; ออกผล {market.announceTime} น.
                </div>
              </div>
              <span className="text-xs text-[var(--text-muted)] font-mono shrink-0">
                #{market.order}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 md:p-8">
        <h3 className="font-heading text-xl tracking-[2px] text-[var(--brand-primary)] mb-4">
          &#x1F4AC; ติดต่อเรา
        </h3>
        <div className="text-sm text-[var(--text-secondary)] space-y-3">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center text-sm">&#x1F310;</span>
            <span>{config.domain}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
