'use client';

import { useMemo } from 'react';
import { seededRandom, hashString } from '@/lib/utils/seeded-random';

interface BackgroundSparklineProps {
  market: string;
}

/** Full-width decorative SVG sparkline background at low opacity */
export default function BackgroundSparkline({ market }: BackgroundSparklineProps) {
  const path = useMemo(() => {
    const seed = hashString(market + 'bg');
    const rng = seededRandom(seed);
    const points: number[] = [];
    const count = 40;
    let y = 50;
    for (let i = 0; i < count; i++) {
      y += (rng() - 0.48) * 12;
      y = Math.max(15, Math.min(85, y));
      points.push(y);
    }
    return points.map((py, i) => `${i === 0 ? 'M' : 'L'}${(i / (count - 1)) * 100} ${py}`).join(' ');
  }, [market]);

  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
      style={{ opacity: 0.06 }}
    >
      <path d={path} fill="none" stroke="var(--brand-primary)" strokeWidth="0.8" />
      <path d={`${path} L100 100 L0 100 Z`} fill="var(--brand-primary)" opacity="0.3" />
    </svg>
  );
}
