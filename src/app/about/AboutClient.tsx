'use client';

import { useI18n } from '@/lib/i18n';
import FlagIcon from '@/components/FlagIcon';
import type { BrandConfig, Market } from '@/types';

interface AboutClientProps {
  config: BrandConfig;
  markets: Market[];
  uniqueFlagCount: number;
}

export default function AboutClient({ config, markets, uniqueFlagCount }: AboutClientProps) {
  const { t, marketLabel } = useI18n();

  return (
    <div className="py-6">
      <h1 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        {t('about.title')}
      </h1>

      {/* About section */}
      <div className="panel p-5 mb-4">
        <h3 className="text-base font-semibold text-[var(--brand-primary)] mb-3">
          {config.siteNameTh}
        </h3>
        <div className="space-y-2 text-sm text-[var(--text-secondary)] leading-relaxed max-w-2xl">
          <p>
            {config.siteNameTh} เป็นแหล่งรวมผลหวยหุ้นออนไลน์ที่น่าเชื่อถือ
            อัพเดทผลทุกรอบแบบเรียลไทม์ ครบทุกตลาดหุ้นทั่วโลก
          </p>
          <p>
            เราให้บริการผลหวยหุ้นจำนวน {markets.length} รอบต่อวัน
            ครอบคลุมตลาดหุ้นชั้นนำจากหลายประเทศทั่วโลก
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        {[
          { value: `${markets.length}`, label: 'รอบ/วัน' },
          { value: `${uniqueFlagCount}`, label: 'ประเทศ' },
          { value: '24/7', label: 'อัพเดท' },
          { value: '99.9%', label: 'ความแม่นยำ' },
        ].map((stat) => (
          <div key={stat.label} className="panel p-4 text-center">
            <div className="font-[family-name:var(--font-mono)] text-2xl font-bold text-[var(--brand-primary)] mb-0.5">
              {stat.value}
            </div>
            <div className="text-xs text-[var(--text-muted)]">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Markets list */}
      <div className="panel overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            {t('about.markets')} ({markets.length})
          </h3>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {markets.map((market) => (
            <div
              key={market.code}
              className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[var(--bg-card-hover)] transition-colors"
            >
              <FlagIcon emoji={market.flagEmoji} size={24} className="ring-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {marketLabel(market.labelTh, market.labelLo)}
                </div>
              </div>
              <div className="text-[10px] text-[var(--text-muted)] font-[family-name:var(--font-mono)] shrink-0">
                {market.closeTime} &middot; {market.announceTime}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="panel p-5">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          {t('about.contact')}
        </h3>
        <div className="text-sm text-[var(--text-secondary)]">
          {config.domain}
        </div>
      </div>
    </div>
  );
}
