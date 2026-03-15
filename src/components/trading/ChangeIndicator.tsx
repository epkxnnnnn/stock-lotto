'use client';

import { useMemo } from 'react';
import { seededRandom, hashString } from '@/lib/utils/seeded-random';

interface ChangeIndicatorProps {
  market: string;
}

/** Simulated % change badge (deterministic per market) */
export default function ChangeIndicator({ market }: ChangeIndicatorProps) {
  const { isBullish, change } = useMemo(() => {
    const seed = hashString(market + 'chg');
    const rng = seededRandom(seed);
    const bull = rng() > 0.45;
    const val = (rng() * 2.5 + 0.1).toFixed(2);
    return { isBullish: bull, change: val };
  }, [market]);

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-[family-name:var(--font-mono)] font-medium ${isBullish ? 'text-[var(--accent-green)]' : 'text-red-400'}`}
    >
      <span>{isBullish ? '\u25B2' : '\u25BC'}</span>
      <span>{change}%</span>
    </span>
  );
}
