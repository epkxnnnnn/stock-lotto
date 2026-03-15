'use client';

import { seededRandom, hashString } from '@/lib/utils/seeded-random';

interface MiniSparklineProps {
  resulted: boolean;
  market: string;
}

/** 48x16 SVG sparkline — bullish (green) or bearish (red), deterministic per market */
export default function MiniSparkline({ resulted, market }: MiniSparklineProps) {
  if (!resulted) {
    return (
      <svg width="48" height="16" viewBox="0 0 48 16" className="text-[var(--text-muted)]">
        <line x1="0" y1="8" x2="48" y2="8" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
      </svg>
    );
  }

  const seed = hashString(market);
  const rng = seededRandom(seed);
  const isBullish = rng() > 0.45;

  const numPoints = 10;
  const points: number[] = [];
  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1);
    const trend = isBullish ? 13 - t * 10 : 3 + t * 10;
    const noise = (rng() - 0.5) * 6;
    points.push(Math.max(1, Math.min(15, trend + noise)));
  }

  const path = points.map((y, i) => `${i === 0 ? 'M' : 'L'}${i * 5.3} ${y}`).join(' ');
  const pathLength = points.reduce((acc, y, i) => {
    if (i === 0) return 0;
    const dx = 5.3;
    const dy = y - points[i - 1];
    return acc + Math.sqrt(dx * dx + dy * dy);
  }, 0);

  const color = isBullish ? 'text-[var(--accent-green)]' : 'text-red-500';
  const delay = (seed % 5) * 0.15;

  return (
    <svg width="48" height="16" viewBox="0 0 48 16" className={color}>
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          ['--sparkline-length' as string]: pathLength,
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
          animation: `sparkline-draw 1.2s ease-out ${delay}s forwards, sparkline-glow 2s ease-in-out ${delay + 1.2}s infinite`,
        }}
      />
    </svg>
  );
}
