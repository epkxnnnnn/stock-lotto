'use client';

import { useEffect, useState } from 'react';
import type { StockResult } from '@/types';

interface CountdownStripProps {
  rounds: StockResult[];
}

function formatTimeLeft(target: string): string {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return '00:00:00';

  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export default function CountdownStrip({ rounds }: CountdownStripProps) {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (rounds.length === 0) return null;

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-2.5 mb-7.5 max-md:grid-cols-2">
      {rounds.map((round) => (
        <div
          key={round.id}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[10px] px-4 py-3 flex justify-between items-center"
        >
          <span className="text-[13px] font-medium text-[var(--text-secondary)]">
            {round.flagEmoji} {round.marketLabelTh.replace(/VVIP|แพลทินัม|หุ้น/g, '').trim()}
          </span>
          <span className="font-mono text-sm font-semibold text-[var(--brand-accent)]">
            {formatTimeLeft(round.closeTime)}
          </span>
        </div>
      ))}
    </div>
  );
}
