'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import FlagIcon from '@/components/FlagIcon';
import LiveClock from '@/components/trading/LiveClock';
import MiniSparkline from '@/components/trading/MiniSparkline';
import { marketCodeToSlug } from '@/lib/market-utils';
import type { BrandConfig, Market } from '@/types';

interface AboutClientProps {
  config: BrandConfig;
  markets: Market[];
  uniqueFlagCount: number;
}

/** Animated count-up number */
function CountUpStat({ target, suffix, label }: { target: number; suffix?: string; label: string }) {
  const [value, setValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 1200;
          const start = performance.now();
          const animate = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setValue(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <div
      ref={ref}
      className="panel p-4 text-center group hover:border-[var(--brand-primary)]/30 transition-all duration-300"
      style={{ '--glow-color': 'var(--brand-primary)' } as React.CSSProperties}
    >
      <div className="font-[family-name:var(--font-mono)] text-2xl font-bold text-[var(--brand-primary)] mb-0.5 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_var(--brand-primary)]">
        {value}{suffix}
      </div>
      <div className="text-xs text-[var(--text-muted)]">{label}</div>
    </div>
  );
}

export default function AboutClient({ config, markets, uniqueFlagCount }: AboutClientProps) {
  const { t, marketLabel } = useI18n();
  const router = useRouter();

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

      {/* Stats — animated count-up with glow hover */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <CountUpStat target={markets.length} label="รอบ/วัน" />
        <CountUpStat target={uniqueFlagCount} label="ประเทศ" />
        {/* 24/7 and 99.9% are special — display as text */}
        <div className="panel p-4 text-center group hover:border-[var(--brand-primary)]/30 transition-all duration-300">
          <div className="font-[family-name:var(--font-mono)] text-2xl font-bold text-[var(--brand-primary)] mb-0.5 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_var(--brand-primary)]">
            24/7
          </div>
          <div className="text-xs text-[var(--text-muted)]">อัพเดท</div>
        </div>
        <CountUpStat target={99} suffix=".9%" label="ความแม่นยำ" />
      </div>

      {/* Markets list */}
      <div className="panel overflow-hidden mb-4">
        <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            {t('about.markets')} ({markets.length})
          </h3>
          <LiveClock />
        </div>
        <div className="divide-y divide-[var(--border)]">
          {markets.map((market) => (
            <div
              key={market.code}
              className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer"
              onClick={() => router.push(`/market/${marketCodeToSlug(market.code)}`)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/market/${marketCodeToSlug(market.code)}`); } }}
              role="link"
              tabIndex={0}
            >
              <FlagIcon emoji={market.flagEmoji} size={24} className="ring-0" />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {marketLabel(market.labelTh, market.labelLo)}
                </div>
              </div>
              <div className="hidden sm:block">
                <MiniSparkline resulted={true} market={market.code} />
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
