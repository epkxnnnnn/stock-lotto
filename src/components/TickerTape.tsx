'use client';

import type { StockResult } from '@/types';
import FlagIcon from './FlagIcon';
import { useI18n } from '@/lib/i18n';

interface TickerTapeProps {
  results: StockResult[];
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Bangkok',
  });
}

export default function TickerTape({ results }: TickerTapeProps) {
  const { t, marketLabel } = useI18n();

  if (results.length === 0) return null;

  const items = results.map((r) => ({
    key: r.market,
    flag: r.flagEmoji,
    name: marketLabel(r.marketLabelTh, r.marketLabelLo),
    number: r.winningNumber,
    status: r.status,
    closeTime: formatTime(r.closeTime),
  }));

  // Duplicate for seamless scroll
  const doubled = [...items, ...items];

  return (
    <div className="bg-[var(--ticker-bg)] border-b border-[var(--ticker-border)] overflow-hidden relative">
      <div
        className="flex whitespace-nowrap"
        style={{ animation: `ticker-scroll ${Math.max(30, items.length * 4)}s linear infinite` }}
      >
        {doubled.map((item, i) => (
          <div
            key={`${item.key}-${i}`}
            className="inline-flex items-center gap-2 px-4 py-1.5 border-r border-[var(--border)] text-xs shrink-0"
          >
            <FlagIcon emoji={item.flag} size={16} className="ring-0" />
            <span className="text-[var(--text-secondary)]">{item.name}</span>
            {item.number ? (
              <>
                <span className="text-[var(--accent-green)] font-[family-name:var(--font-mono)] font-semibold">
                  {item.number}
                </span>
                <span className="text-[var(--accent-green)] text-[10px]">&#9650;</span>
              </>
            ) : (
              <span className="text-[var(--text-muted)]">{item.closeTime}</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
