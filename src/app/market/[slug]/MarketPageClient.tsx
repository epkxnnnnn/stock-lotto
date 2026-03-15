'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import type { Market, StockResult, Brand } from '@/types';
import type { MarketDescription } from '@/config/market-descriptions';
import { useI18n } from '@/lib/i18n';
import FlagIcon from '@/components/FlagIcon';
import NumberRenderer from '@/components/NumberRenderer';
import TradingViewChart from '@/components/TradingViewChart';
import VerifiedBadge from '@/components/VerifiedBadge';

interface MarketPageClientProps {
  market: Market;
  description: MarketDescription | null;
  todayResult: StockResult;
  history: StockResult[];
  brand: Brand;
  today: string;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Bangkok',
  });
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    timeZone: 'Asia/Bangkok',
  });
}

function StatusBadge({ status, t }: { status: string; t: (key: string) => string }) {
  const styles: Record<string, string> = {
    open: 'bg-[var(--accent-green)]/10 text-[var(--accent-green)] border-[var(--accent-green)]/20',
    closed: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    resulted: 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border-[var(--brand-primary)]/20',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-xs font-medium border ${styles[status] || styles.closed}`}>
      {status === 'open' && (
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" style={{ animation: 'pulse 2s infinite' }} />
      )}
      {t(`status.${status}`)}
    </span>
  );
}

function Countdown({ closeTime }: { closeTime: string }) {
  const [remaining, setRemaining] = useState('');
  const [urgent, setUrgent] = useState(false);

  useEffect(() => {
    const update = () => {
      const diff = new Date(closeTime).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining('00:00:00');
        setUrgent(false);
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setUrgent(diff < 300000);
      setRemaining(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [closeTime]);

  if (!remaining) return null;

  return (
    <span className={`font-[family-name:var(--font-mono)] text-sm tabular-nums ${urgent ? 'text-red-400' : 'text-[var(--accent-green)]'}`}>
      {remaining}
    </span>
  );
}

function MethodBadge({ method }: { method: string | null }) {
  if (!method) return <span className="text-[var(--text-muted)]">-</span>;

  const styles: Record<string, string> = {
    stock_ref: 'text-blue-400',
    auto: 'text-emerald-400',
    manual: 'text-[var(--text-muted)]',
  };

  const labels: Record<string, string> = {
    stock_ref: 'Stock Ref',
    auto: 'Provably Fair',
    manual: 'Manual',
  };

  return (
    <span className={`text-[10px] font-medium ${styles[method] || 'text-[var(--text-muted)]'}`}>
      {labels[method] || method}
    </span>
  );
}

export default function MarketPageClient({
  market,
  description,
  todayResult: initialResult,
  history,
  brand,
  today,
}: MarketPageClientProps) {
  const { t, marketLabel } = useI18n();
  const [todayResult, setTodayResult] = useState<StockResult>(initialResult);

  // Supabase realtime subscription for today's result
  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const channel = supabase
      .channel(`market_${market.code}_realtime`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stock_results',
          filter: `source=eq.${brand}`,
        },
        (payload) => {
          const updated = payload.new as Record<string, unknown>;
          if (!updated || updated.market !== market.code || updated.round_date !== today) return;

          setTodayResult((prev) => ({
            ...prev,
            winningNumber: (updated.winning_number as string) ?? null,
            winningNumber2d: (updated.winning_number_2d as string) ?? null,
            status: (updated.status as StockResult['status']) ?? prev.status,
            resultTime: (updated.result_time as string) ?? null,
            resultHash: (updated.result_hash as string) ?? null,
            generationMethod: (updated.generation_method as StockResult['generationMethod']) ?? prev.generationMethod,
            referencePrice: (updated.reference_price as string) ?? null,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [brand, market.code, today]);

  const isOpen = todayResult.status === 'open';

  return (
    <div className="py-4 space-y-4">
      {/* Back link */}
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        {t('market.backToHome')}
      </Link>

      {/* Header */}
      <div className="panel px-4 py-4">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <FlagIcon emoji={market.flagEmoji} size={36} className="ring-0" />
            <div>
              <h1 className="text-lg font-semibold text-[var(--text-primary)] font-[family-name:var(--font-thai)]">
                {marketLabel(market.labelTh, market.labelLo)}
              </h1>
              <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--text-muted)]">
                <span className="font-[family-name:var(--font-mono)]">{market.stockIndex}</span>
                <span>|</span>
                <span>{t('market.closesAt')} {formatTime(todayResult.closeTime)}</span>
                {isOpen && (
                  <>
                    <span>|</span>
                    <Countdown closeTime={todayResult.closeTime} />
                  </>
                )}
              </div>
            </div>
          </div>
          <StatusBadge status={todayResult.status} t={t} />
        </div>
      </div>

      {/* TradingView Chart */}
      <div className="panel overflow-hidden">
        <div className="hidden md:block">
          <TradingViewChart symbol={market.stockSymbol} height={420} />
        </div>
        <div className="md:hidden">
          <TradingViewChart symbol={market.stockSymbol} height={300} hideSideToolbar />
        </div>
      </div>

      {/* Market Description */}
      {description && (
        <div className="panel px-4 py-4">
          <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
            {t('market.description')}
          </h2>
          <p className="text-sm text-[var(--text-secondary)] leading-relaxed font-[family-name:var(--font-thai)] mb-3">
            {description.descriptionTh}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-[var(--bg-primary)] rounded px-3 py-2">
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-0.5">
                {t('market.exchange')}
              </div>
              <div className="text-xs text-[var(--text-primary)] font-medium">
                {description.exchangeName}
              </div>
            </div>
            <div className="bg-[var(--bg-primary)] rounded px-3 py-2">
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-0.5">
                {t('market.country')}
              </div>
              <div className="text-xs text-[var(--text-primary)] font-medium">
                {description.exchangeCountry}
              </div>
            </div>
            <div className="bg-[var(--bg-primary)] rounded px-3 py-2">
              <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider mb-0.5">
                {t('market.tradingHours')}
              </div>
              <div className="text-xs text-[var(--text-primary)] font-medium">
                {description.tradingHoursTh}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Today's Result */}
      <div className="panel px-4 py-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          {t('market.todayResult')}
        </h2>
        {todayResult.winningNumber ? (
          <div className="flex items-center gap-4 flex-wrap">
            <NumberRenderer number={todayResult.winningNumber} size="lg" />
            {todayResult.winningNumber2d && (
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-[var(--text-muted)] mb-0.5">{t('table.number2d')}</span>
                <span className="text-xl font-bold font-[family-name:var(--font-mono)] text-[var(--text-secondary)]">
                  {todayResult.winningNumber2d}
                </span>
              </div>
            )}
            {todayResult.resultHash && (
              <VerifiedBadge hash={todayResult.resultHash} method={todayResult.generationMethod} />
            )}
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)] font-[family-name:var(--font-thai)]">
            {t('market.noResult')}
          </p>
        )}
      </div>

      {/* 30-Day History */}
      <div className="panel overflow-hidden">
        <div className="px-4 py-3 border-b border-[var(--border)]">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            {t('market.history')}
          </h2>
        </div>

        {history.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <p className="text-xs text-[var(--text-muted)]">{t('common.noData')}</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] text-[var(--text-muted)] text-xs">
                    <th className="text-left py-2 px-4 font-medium">{t('market.date')}</th>
                    <th className="text-right py-2 px-4 font-medium">{t('table.number')}</th>
                    <th className="text-right py-2 px-4 font-medium">{t('table.number2d')}</th>
                    <th className="text-center py-2 px-4 font-medium">{t('market.method')}</th>
                    <th className="text-right py-2 px-4 font-medium">{t('market.time')}</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-card-hover)] transition-colors"
                    >
                      <td className="py-2 px-4 text-[var(--text-secondary)] text-xs font-[family-name:var(--font-mono)]">
                        {formatDate(r.roundDate)}
                      </td>
                      <td className="py-2 px-4 text-right">
                        {r.winningNumber && <NumberRenderer number={r.winningNumber} size="sm" />}
                      </td>
                      <td className="py-2 px-4 text-right text-[var(--text-secondary)] font-[family-name:var(--font-mono)] text-xs">
                        {r.winningNumber2d || '--'}
                      </td>
                      <td className="py-2 px-4 text-center">
                        <MethodBadge method={r.generationMethod} />
                      </td>
                      <td className="py-2 px-4 text-right text-[var(--text-muted)] font-[family-name:var(--font-mono)] text-xs">
                        {r.resultTime ? formatTime(r.resultTime) : formatTime(r.closeTime)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card List */}
            <div className="md:hidden divide-y divide-[var(--border)]">
              {history.map((r) => (
                <div key={r.id} className="px-4 py-2.5 flex items-center justify-between">
                  <div>
                    <div className="text-xs text-[var(--text-secondary)] font-[family-name:var(--font-mono)]">
                      {formatDate(r.roundDate)}
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <MethodBadge method={r.generationMethod} />
                      <span className="text-[10px] text-[var(--text-muted)] font-[family-name:var(--font-mono)]">
                        {r.resultTime ? formatTime(r.resultTime) : formatTime(r.closeTime)}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {r.winningNumber && <NumberRenderer number={r.winningNumber} size="sm" />}
                    {r.winningNumber2d && (
                      <span className="text-[var(--text-muted)] font-[family-name:var(--font-mono)] text-xs">
                        {r.winningNumber2d}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
