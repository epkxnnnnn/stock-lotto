'use client';

import type { StockResult } from '@/types';
import ResultCard from './ResultCard';
import FlagIcon from './FlagIcon';
import NumberRenderer from './NumberRenderer';
import { useI18n } from '@/lib/i18n';

interface ResultsGridProps {
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
  }[status] || { bg: '', text: 'text-[var(--text-muted)]', border: 'border-[var(--text-muted)]/20' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${config.bg} ${config.text} border ${config.border}`}>
      {t(`status.${status}`)}
    </span>
  );
}

export default function ResultsGrid({ results }: ResultsGridProps) {
  const { t, marketLabel } = useI18n();

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block panel overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--text-muted)] text-xs">
              <th className="text-left py-2 px-4 font-medium">{t('table.asset')}</th>
              <th className="text-right py-2 px-4 font-medium">{t('table.number')}</th>
              <th className="text-right py-2 px-4 font-medium">{t('table.number2d')}</th>
              <th className="text-center py-2 px-4 font-medium">{t('table.status')}</th>
              <th className="text-right py-2 px-4 font-medium">{t('table.closeTime')}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr key={r.id} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-card-hover)] transition-colors">
                <td className="py-2.5 px-4">
                  <div className="flex items-center gap-2.5">
                    <FlagIcon emoji={r.flagEmoji} size={24} className="ring-0" />
                    <span className="text-[var(--text-primary)] font-medium">
                      {marketLabel(r.marketLabelTh, r.marketLabelLo)}
                    </span>
                  </div>
                </td>
                <td className="py-2.5 px-4 text-right">
                  {r.winningNumber ? (
                    <NumberRenderer number={r.winningNumber} size="sm" />
                  ) : (
                    <span className="text-[var(--text-muted)] font-[family-name:var(--font-mono)]">---</span>
                  )}
                </td>
                <td className="py-2.5 px-4 text-right">
                  {r.winningNumber2d ? (
                    <span className="text-[var(--text-secondary)] font-[family-name:var(--font-mono)]">{r.winningNumber2d}</span>
                  ) : (
                    <span className="text-[var(--text-muted)] font-[family-name:var(--font-mono)]">--</span>
                  )}
                </td>
                <td className="py-2.5 px-4 text-center">
                  <StatusBadge status={r.status} t={t} />
                </td>
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

      {/* Mobile Cards */}
      <div className="md:hidden grid grid-cols-1 gap-2">
        {results.map((result) => (
          <ResultCard key={result.id} result={result} />
        ))}
      </div>
    </>
  );
}
