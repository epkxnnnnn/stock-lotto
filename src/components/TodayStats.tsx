'use client';

import { useMemo } from 'react';
import type { StockResult } from '@/types';
import { useI18n } from '@/lib/i18n';

interface TodayStatsProps {
  results: StockResult[];
}

export default function TodayStats({ results }: TodayStatsProps) {
  const { t } = useI18n();

  const stats = useMemo(() => {
    const resulted = results.filter((r) => r.winningNumber);
    const total = results.length;
    const settledCount = resulted.length;
    const openCount = results.filter((r) => r.status === 'open').length;

    // Digit frequency (0-9) from all 3-digit winning numbers
    const digitFreq = new Array(10).fill(0);
    resulted.forEach((r) => {
      if (r.winningNumber) {
        for (const ch of r.winningNumber) {
          const d = parseInt(ch, 10);
          if (!isNaN(d)) digitFreq[d]++;
        }
      }
    });
    const maxFreq = Math.max(...digitFreq, 1);

    // 2-digit frequency
    const twoDigitMap = new Map<string, number>();
    resulted.forEach((r) => {
      if (r.winningNumber2d) {
        twoDigitMap.set(r.winningNumber2d, (twoDigitMap.get(r.winningNumber2d) || 0) + 1);
      }
    });
    const topTwoDigits = [...twoDigitMap.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    // Last digit distribution (units place of 3-digit)
    const lastDigitFreq = new Array(10).fill(0);
    resulted.forEach((r) => {
      if (r.winningNumber) {
        const last = parseInt(r.winningNumber[r.winningNumber.length - 1], 10);
        if (!isNaN(last)) lastDigitFreq[last]++;
      }
    });

    return { total, settledCount, openCount, digitFreq, maxFreq, topTwoDigits, lastDigitFreq };
  }, [results]);

  return (
    <div className="panel overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          {t('stats.title')}
        </h3>
        <span className="text-[10px] font-[family-name:var(--font-mono)] text-[var(--text-muted)]">
          {stats.settledCount}/{stats.total} {t('results.rounds')}
        </span>
      </div>

      <div className="flex-1 p-4 space-y-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[var(--bg-primary)] rounded px-3 py-2 text-center">
            <div className="text-lg font-bold font-[family-name:var(--font-mono)] text-[var(--brand-primary)]">
              {stats.settledCount}
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">{t('stats.settled')}</div>
          </div>
          <div className="bg-[var(--bg-primary)] rounded px-3 py-2 text-center">
            <div className="text-lg font-bold font-[family-name:var(--font-mono)] text-[var(--accent-green)]">
              {stats.openCount}
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">{t('stats.pending')}</div>
          </div>
          <div className="bg-[var(--bg-primary)] rounded px-3 py-2 text-center">
            <div className="text-lg font-bold font-[family-name:var(--font-mono)] text-[var(--text-secondary)]">
              {stats.total}
            </div>
            <div className="text-[10px] text-[var(--text-muted)]">{t('stats.total')}</div>
          </div>
        </div>

        {/* Digit Frequency */}
        {stats.settledCount > 0 && (
          <div>
            <div className="text-[11px] text-[var(--text-muted)] mb-2 font-medium">
              {t('stats.digitFrequency')}
            </div>
            <div className="space-y-1">
              {stats.digitFreq.map((count, digit) => (
                <div key={digit} className="flex items-center gap-2">
                  <span className="text-[11px] font-[family-name:var(--font-mono)] text-[var(--text-muted)] w-3 text-right">
                    {digit}
                  </span>
                  <div className="flex-1 h-3.5 bg-[var(--bg-primary)] rounded-sm overflow-hidden">
                    <div
                      className="h-full rounded-sm transition-all duration-700 ease-out"
                      style={{
                        width: `${(count / stats.maxFreq) * 100}%`,
                        background: count === stats.maxFreq && count > 0
                          ? 'var(--brand-primary)'
                          : 'var(--brand-primary)',
                        opacity: count === 0 ? 0 : Math.max(0.3, count / stats.maxFreq),
                      }}
                    />
                  </div>
                  <span className="text-[10px] font-[family-name:var(--font-mono)] text-[var(--text-muted)] w-4">
                    {count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top 2-Digit Numbers */}
        {stats.topTwoDigits.length > 0 && (
          <div>
            <div className="text-[11px] text-[var(--text-muted)] mb-2 font-medium">
              {t('stats.hotNumbers')}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {stats.topTwoDigits.map(([num, count]) => (
                <div
                  key={num}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20"
                >
                  <span className="font-[family-name:var(--font-mono)] text-sm font-bold text-[var(--brand-primary)]">
                    {num}
                  </span>
                  <span className="text-[9px] text-[var(--text-muted)]">
                    x{count}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No data state */}
        {stats.settledCount === 0 && (
          <div className="flex-1 flex items-center justify-center py-6">
            <p className="text-xs text-[var(--text-muted)]">{t('stats.waitingForResults')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
