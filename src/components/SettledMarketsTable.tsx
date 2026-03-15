'use client';

import type { StockResult } from '@/types';
import FlagIcon from './FlagIcon';
import NumberRenderer from './NumberRenderer';
import { useI18n } from '@/lib/i18n';

interface SettledMarketsTableProps {
  results: StockResult[];
  title: string;
  variant?: 'settled' | 'latest';
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Bangkok',
  });
}

export default function SettledMarketsTable({ results, title, variant = 'settled' }: SettledMarketsTableProps) {
  const { t, marketLabel } = useI18n();

  const filtered = variant === 'settled'
    ? results.filter((r) => r.status === 'resulted')
    : results.filter((r) => r.winningNumber);

  if (filtered.length === 0) {
    return (
      <div className="panel p-4">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">{title}</h3>
        <p className="text-xs text-[var(--text-muted)] text-center py-6">{t('common.noData')}</p>
      </div>
    );
  }

  return (
    <div className="panel overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border)]">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">{title}</h3>
      </div>
      <div className="divide-y divide-[var(--border)]">
        {filtered.map((r) => (
          <div
            key={r.market}
            className="px-4 py-2.5 flex items-center justify-between hover:bg-[var(--bg-card-hover)] transition-colors"
          >
            <div className="flex items-center gap-2">
              <FlagIcon emoji={r.flagEmoji} size={22} className="ring-0" />
              <div>
                <div className="text-[var(--text-primary)] text-sm font-medium">
                  {marketLabel(r.marketLabelTh, r.marketLabelLo)}
                </div>
                <span className="text-[var(--text-muted)] text-[10px] font-[family-name:var(--font-mono)]">
                  {r.resultTime ? formatTime(r.resultTime) : formatTime(r.closeTime)}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {r.winningNumber && <NumberRenderer number={r.winningNumber} size="sm" />}
              {r.winningNumber2d && (
                <span className="text-[var(--text-muted)] font-[family-name:var(--font-mono)] text-xs min-w-[20px] text-right">
                  {r.winningNumber2d}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
