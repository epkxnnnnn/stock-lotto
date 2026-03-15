'use client';

import { useMemo } from 'react';
import { seededRandom, hashString } from '@/lib/utils/seeded-random';

interface VolumeBarsProps {
  market: string;
  /** Compact mode: shorter bars, no labels */
  compact?: boolean;
}

/** Decorative volume bar chart */
export default function VolumeBars({ market, compact }: VolumeBarsProps) {
  const barCount = compact ? 16 : 24;

  const bars = useMemo(() => {
    const seed = hashString(market + 'vol');
    const rng = seededRandom(seed);
    return Array.from({ length: barCount }, () => 0.15 + rng() * 0.85);
  }, [market, barCount]);

  if (compact) {
    return (
      <div className="flex items-end gap-[1px] h-3">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-[1px]"
            style={{
              height: `${h * 100}%`,
              background: h > 0.6 ? 'var(--brand-primary)' : 'var(--border)',
              opacity: 0.4 + h * 0.4,
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="px-4 pb-3 pt-1">
      <div className="flex items-end gap-[2px] h-6">
        {bars.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-[1px] transition-all duration-500"
            style={{
              height: `${h * 100}%`,
              background: h > 0.6 ? 'var(--brand-primary)' : 'var(--border)',
              opacity: 0.5 + h * 0.5,
              animationDelay: `${i * 0.05}s`,
            }}
          />
        ))}
      </div>
      <div className="flex items-center justify-between mt-1">
        <span className="text-[8px] text-[var(--text-muted)] font-[family-name:var(--font-mono)] uppercase tracking-wider">Vol</span>
        <span className="text-[8px] text-[var(--text-muted)] font-[family-name:var(--font-mono)]">{barCount} bars</span>
      </div>
    </div>
  );
}
