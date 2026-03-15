'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getBrandConfig } from '@/lib/theme/config';
import { getMarkets } from '@/lib/theme/rounds';
import { useI18n } from '@/lib/i18n';
import ResultsGrid from '@/components/ResultsGrid';
import type { StockResult } from '@/types';

function mapRow(r: Record<string, unknown>): StockResult {
  return {
    id: r.id as string,
    source: r.source as 'vvip' | 'platinum',
    market: r.market as string,
    marketLabelTh: r.market_label_th as string,
    marketLabelLo: (r.market_label_lo as string) ?? undefined,
    flagEmoji: r.flag_emoji as string,
    winningNumber: r.winning_number as string | null,
    winningNumber2d: (r.winning_number_2d as string | null) ?? null,
    roundDate: r.round_date as string,
    closeTime: r.close_time as string,
    resultTime: r.result_time as string | null,
    status: r.status as 'open' | 'closed' | 'resulted',
    generationMethod: (r.generation_method as 'auto' | 'manual' | 'stock_ref' | null) ?? null,
    resultHash: (r.result_hash as string | null) ?? null,
    referencePrice: (r.reference_price as string | null) ?? null,
    generationSeed: (r.generation_seed as string | null) ?? null,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + 'T12:00:00');
  d.setDate(d.getDate() + days);
  return d.toLocaleDateString('en-CA');
}

function LoadingSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded px-4 py-3 flex items-center gap-3"
          style={{ animation: 'pulse 1.5s ease-in-out infinite', animationDelay: `${i * 0.1}s` }}
        >
          <div className="w-7 h-7 rounded-full bg-[var(--bg-secondary)]" />
          <div className="flex-1 space-y-1.5">
            <div className="h-3.5 w-32 bg-[var(--bg-secondary)] rounded" />
            <div className="h-2.5 w-20 bg-[var(--bg-secondary)] rounded" />
          </div>
          <div className="h-5 w-16 bg-[var(--bg-secondary)] rounded" />
        </div>
      ))}
    </div>
  );
}

export default function ResultsClient() {
  const config = getBrandConfig();
  const { t } = useI18n();
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' })
  );
  const [results, setResults] = useState<StockResult[]>([]);
  const [loading, setLoading] = useState(true);

  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
  const isToday = selectedDate === todayStr;

  const fetchResults = useCallback(async () => {
    setLoading(true);
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data } = await supabase
      .from('stock_results')
      .select('*')
      .eq('source', config.brand)
      .eq('round_date', selectedDate)
      .order('close_time', { ascending: true });

    if (data && data.length > 0) {
      setResults(data.map((r: Record<string, unknown>) => mapRow(r)));
    } else {
      const markets = getMarkets(config.brand);
      setResults(
        markets.map((m) => ({
          id: `${config.brand}-${m.code}-${selectedDate}`,
          source: config.brand,
          market: m.code,
          marketLabelTh: m.labelTh,
          marketLabelLo: m.labelLo,
          flagEmoji: m.flagEmoji,
          winningNumber: null,
          winningNumber2d: null,
          roundDate: selectedDate,
          closeTime: `${selectedDate}T${m.closeTime}:00+07:00`,
          resultTime: null,
          status: 'open' as const,
          generationMethod: null,
          resultHash: null,
          referencePrice: null,
          generationSeed: null,
          createdAt: '',
          updatedAt: '',
        }))
      );
    }
    setLoading(false);
  }, [config.brand, selectedDate]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const resultedCount = results.filter(r => r.winningNumber).length;
  const totalCount = results.length;
  const allResulted = resultedCount === totalCount && totalCount > 0;

  const formattedDate = new Date(selectedDate + 'T00:00:00').toLocaleDateString('th-TH', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const canGoForward = selectedDate < todayStr;

  return (
    <div className="py-6">
      {/* Page header */}
      <h1 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        {t('results.title')}
      </h1>

      {/* Date navigation */}
      <div className="panel p-4 mb-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedDate(shiftDate(selectedDate, -1))}
              className="w-8 h-8 flex items-center justify-center rounded bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary)]/30 transition-colors text-sm"
            >
              &#x25C0;
            </button>
            <input
              type="date"
              value={selectedDate}
              max={todayStr}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors [color-scheme:dark]"
            />
            <button
              onClick={() => canGoForward && setSelectedDate(shiftDate(selectedDate, 1))}
              disabled={!canGoForward}
              className="w-8 h-8 flex items-center justify-center rounded bg-[var(--bg-primary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary)]/30 transition-colors text-sm disabled:opacity-30 disabled:cursor-not-allowed"
            >
              &#x25B6;
            </button>
            {!isToday && (
              <button
                onClick={() => setSelectedDate(todayStr)}
                className="text-xs text-[var(--brand-primary)] hover:text-[var(--brand-light)] transition-colors ml-1 px-2.5 py-1 rounded bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20"
              >
                {t('common.today')}
              </button>
            )}
          </div>

          <div className="text-right">
            <div className="text-sm font-medium text-[var(--text-primary)]">{formattedDate}</div>
            {!loading && (
              <div className="text-[10px] text-[var(--text-muted)] mt-0.5 font-[family-name:var(--font-mono)]">
                {allResulted ? (
                  <span className="text-[var(--accent-green)]">{t('status.resulted')}</span>
                ) : (
                  <>{t('results.progress')} {resultedCount}/{totalCount} {t('results.rounds')}</>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? <LoadingSkeleton /> : <ResultsGrid results={results} />}
    </div>
  );
}
