'use client';

import type { StockResult } from '@/types';
import FlagIcon from './FlagIcon';
import NumberRenderer from './NumberRenderer';
import { useI18n } from '@/lib/i18n';

interface MarketOverviewTableProps {
  results: StockResult[];
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Bangkok',
  });
}

function StatusBadge({ status, t }: { status: string; t: (key: string) => string }) {
  const config = {
    open: { bg: 'bg-[var(--accent-green)]/10', text: 'text-[var(--accent-green)]', border: 'border-[var(--accent-green)]/20' },
    closed: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
    resulted: { bg: 'bg-[var(--brand-primary)]/10', text: 'text-[var(--brand-primary)]', border: 'border-[var(--brand-primary)]/20' },
  }[status] || { bg: 'bg-[var(--text-muted)]/10', text: 'text-[var(--text-muted)]', border: 'border-[var(--text-muted)]/20' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${config.bg} ${config.text} border ${config.border}`}>
      {t(`status.${status}`)}
    </span>
  );
}

// Mini sparkline for visual interest
function MiniSparkline({ resulted }: { resulted: boolean }) {
  if (!resulted) {
    return (
      <svg width="48" height="16" viewBox="0 0 48 16" className="text-[var(--text-muted)]">
        <line x1="0" y1="8" x2="48" y2="8" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
      </svg>
    );
  }

  // Decorative sparkline (static shape, purely visual)
  const points = [12, 8, 10, 5, 9, 3, 7, 4, 6, 2];
  const path = points.map((y, i) => `${i === 0 ? 'M' : 'L'}${i * 5.3} ${y}`).join(' ');

  return (
    <svg width="48" height="16" viewBox="0 0 48 16" className="text-[var(--accent-green)]">
      <path d={path} fill="none" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export default function MarketOverviewTable({ results }: MarketOverviewTableProps) {
  const { t, marketLabel } = useI18n();

  return (
    <div className="panel mb-4 overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">
          {t('section.marketOverview')}
        </h2>
        <span className="text-[10px] font-[family-name:var(--font-mono)] text-[var(--text-muted)]">
          {results.filter((r) => r.winningNumber).length}/{results.length} {t('results.rounds')}
        </span>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--text-muted)] text-xs">
              <th className="text-left py-2 px-4 font-medium">{t('table.asset')}</th>
              <th className="text-center py-2 px-2 font-medium w-12">
                <span className="sr-only">Trend</span>
              </th>
              <th className="text-right py-2 px-4 font-medium">{t('table.number')}</th>
              <th className="text-right py-2 px-4 font-medium">{t('table.number2d')}</th>
              <th className="text-center py-2 px-4 font-medium">{t('table.status')}</th>
              <th className="text-right py-2 px-4 font-medium">{t('table.settlement')}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr
                key={r.market}
                className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-card-hover)] transition-colors"
              >
                {/* Asset */}
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <FlagIcon emoji={r.flagEmoji} size={24} className="ring-0" />
                    <div>
                      <div className="text-[var(--text-primary)] font-medium text-sm">
                        {marketLabel(r.marketLabelTh, r.marketLabelLo)}
                      </div>
                      <div className="text-[var(--text-muted)] text-[10px] font-[family-name:var(--font-mono)] uppercase">
                        {r.market}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Sparkline */}
                <td className="py-2.5 px-2 text-center">
                  <MiniSparkline resulted={!!r.winningNumber} />
                </td>

                {/* 3-digit Result */}
                <td className="py-2.5 px-4 text-right">
                  {r.winningNumber ? (
                    <NumberRenderer number={r.winningNumber} size="sm" />
                  ) : (
                    <span className="text-[var(--text-muted)] font-[family-name:var(--font-mono)]">---</span>
                  )}
                </td>

                {/* 2-digit Result */}
                <td className="py-2.5 px-4 text-right">
                  {r.winningNumber2d ? (
                    <span className="text-[var(--text-secondary)] font-[family-name:var(--font-mono)] text-sm">
                      {r.winningNumber2d}
                    </span>
                  ) : (
                    <span className="text-[var(--text-muted)] font-[family-name:var(--font-mono)]">--</span>
                  )}
                </td>

                {/* Status */}
                <td className="py-2.5 px-4 text-center">
                  <StatusBadge status={r.status} t={t} />
                </td>

                {/* Close Time */}
                <td className="py-2.5 px-4 text-right">
                  <span className="text-[var(--text-secondary)] font-[family-name:var(--font-mono)] text-xs">
                    {formatTime(r.closeTime)}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden divide-y divide-[var(--border)]">
        {results.map((r) => (
          <div key={r.market} className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <FlagIcon emoji={r.flagEmoji} size={28} className="ring-0" />
              <div>
                <div className="text-[var(--text-primary)] font-medium text-sm">
                  {marketLabel(r.marketLabelTh, r.marketLabelLo)}
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[var(--text-muted)] text-[10px] font-[family-name:var(--font-mono)]">
                    {formatTime(r.closeTime)}
                  </span>
                  <StatusBadge status={r.status} t={t} />
                </div>
              </div>
            </div>
            <div className="text-right">
              {r.winningNumber ? (
                <div className="flex flex-col items-end gap-0.5">
                  <NumberRenderer number={r.winningNumber} size="sm" />
                  {r.winningNumber2d && (
                    <span className="text-[var(--text-muted)] font-[family-name:var(--font-mono)] text-xs">
                      {r.winningNumber2d}
                    </span>
                  )}
                </div>
              ) : (
                <span className="text-[var(--text-muted)] font-[family-name:var(--font-mono)] text-lg">---</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
