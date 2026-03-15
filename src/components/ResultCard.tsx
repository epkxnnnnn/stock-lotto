'use client';

import type { StockResult } from '@/types';
import NumberRenderer from './NumberRenderer';
import FlagIcon from './FlagIcon';
import { useI18n } from '@/lib/i18n';

interface ResultCardProps {
  result: StockResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const { t, marketLabel } = useI18n();
  const isWaiting = !result.winningNumber;
  const closeDate = new Date(result.closeTime);
  const formattedClose = closeDate.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Bangkok' });

  return (
    <div
      className={`bg-[var(--bg-card)] border rounded px-3.5 py-3 md:px-4 md:py-3.5 flex items-center gap-2.5 md:gap-3 transition-colors hover:bg-[var(--bg-card-hover)] ${
        isWaiting
          ? 'border-dashed border-[var(--border)]'
          : 'border-[var(--border)]'
      }`}
    >
      <FlagIcon emoji={result.flagEmoji} size={28} className="ring-0" />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[var(--text-primary)] truncate">
            {marketLabel(result.marketLabelTh, result.marketLabelLo)}
          </span>
          {isWaiting ? (
            <span className="shrink-0 bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/20 text-[10px] px-1.5 py-0.5 rounded font-medium">
              {t('status.open')}
            </span>
          ) : (
            <span className="shrink-0 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20 text-[10px] px-1.5 py-0.5 rounded font-medium">
              {t('status.resulted')}
            </span>
          )}
        </div>
        <div className="text-[10px] text-[var(--text-muted)] font-[family-name:var(--font-mono)]">
          {formattedClose}
        </div>
      </div>

      <div className="shrink-0 flex justify-end">
        {isWaiting ? (
          <span className="text-[var(--text-muted)] text-sm font-[family-name:var(--font-mono)]">---</span>
        ) : (
          <div className="flex items-center gap-2">
            <NumberRenderer number={result.winningNumber!} size="sm" />
            {result.winningNumber2d && (
              <span className="text-[var(--text-muted)] font-[family-name:var(--font-mono)] text-xs">
                {result.winningNumber2d}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
