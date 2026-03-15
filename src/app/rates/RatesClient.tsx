'use client';

import { useI18n } from '@/lib/i18n';
import type { PayoutRate } from '@/types';

interface RatesClientProps {
  payoutRates: PayoutRate[];
  ignoredNumbers: string[];
}

export default function RatesClient({ payoutRates, ignoredNumbers }: RatesClientProps) {
  const { t } = useI18n();

  return (
    <div className="py-6">
      <h1 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        {t('rates.title')}
      </h1>

      {/* Highlight cards for top rates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {payoutRates.slice(0, 3).map((rate) => (
          <div
            key={rate.type}
            className="panel p-5 text-center"
          >
            <div className="text-xs text-[var(--text-muted)] tracking-wider uppercase mb-2">
              {rate.type}
            </div>
            <div className="font-[family-name:var(--font-mono)] text-3xl font-bold text-[var(--brand-primary)] mb-1">
              {rate.rate}
            </div>
            <div className="text-[11px] text-[var(--text-secondary)]">
              {rate.description}
            </div>
          </div>
        ))}
      </div>

      {/* Full payout table */}
      <div className="panel overflow-hidden mb-6">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            {t('rates.allRates')}
          </h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-xs text-[var(--text-muted)]">
              <th className="text-left px-4 py-2 font-medium">{t('rates.type')}</th>
              <th className="text-right px-4 py-2 font-medium">{t('rates.rate')}</th>
              <th className="text-left px-4 py-2 font-medium max-md:hidden">{t('rates.description')}</th>
            </tr>
          </thead>
          <tbody>
            {payoutRates.map((rate) => (
              <tr key={rate.type} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-card-hover)] transition-colors">
                <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                  {rate.type}
                </td>
                <td className="px-4 py-3 text-right font-[family-name:var(--font-mono)] text-[var(--brand-primary)] font-bold">
                  {rate.rate}
                </td>
                <td className="px-4 py-3 text-xs text-[var(--text-muted)] max-md:hidden">
                  {rate.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Ignored numbers */}
      <div className="panel p-4 mb-6">
        <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          {t('rates.ignored')}
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {ignoredNumbers.map((num) => (
            <span
              key={num}
              className="font-[family-name:var(--font-mono)] text-xs px-2.5 py-1 rounded bg-[var(--accent-red)]/10 text-[var(--accent-red)] border border-[var(--accent-red)]/20"
            >
              {num}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
