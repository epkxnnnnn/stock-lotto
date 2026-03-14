'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { getBrandConfig } from '@/lib/theme/config';
import { getMarkets } from '@/lib/theme/rounds';
import SectionTitle from '@/components/SectionTitle';
import ResultsGrid from '@/components/ResultsGrid';
import type { StockResult } from '@/types';

function mapRow(r: Record<string, unknown>): StockResult {
  return {
    id: r.id as string,
    source: r.source as 'vvip' | 'platinum',
    market: r.market as string,
    marketLabelTh: r.market_label_th as string,
    flagEmoji: r.flag_emoji as string,
    winningNumber: r.winning_number as string | null,
    winningNumber2d: (r.winning_number_2d as string | null) ?? null,
    roundDate: r.round_date as string,
    closeTime: r.close_time as string,
    resultTime: r.result_time as string | null,
    status: r.status as 'open' | 'closed' | 'resulted',
    generationMethod: (r.generation_method as 'auto' | 'manual' | null) ?? null,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export default function ResultsClient() {
  const config = getBrandConfig();
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
      // Fallback: show markets with no data
      const markets = getMarkets(config.brand);
      setResults(
        markets.map((m) => ({
          id: `${config.brand}-${m.code}-${selectedDate}`,
          source: config.brand,
          market: m.code,
          marketLabelTh: m.labelTh,
          flagEmoji: m.flagEmoji,
          winningNumber: null,
          winningNumber2d: null,
          roundDate: selectedDate,
          closeTime: `${selectedDate}T${m.closeTime}:00+07:00`,
          resultTime: null,
          status: 'open' as const,
          generationMethod: null,
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

  return (
    <div className="py-10">
      <SectionTitle>&#x1F4CB; ผลหวยย้อนหลัง</SectionTitle>

      {/* Date picker */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <label className="text-sm text-[var(--text-secondary)]">เลือกวันที่:</label>
        <input
          type="date"
          value={selectedDate}
          max={todayStr}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors [color-scheme:dark]"
        />
        {!isToday && (
          <button
            onClick={() => setSelectedDate(todayStr)}
            className="text-xs text-[var(--brand-primary)] hover:text-[var(--brand-light)] transition-colors"
          >
            กลับไปวันนี้
          </button>
        )}
      </div>

      {/* Date display */}
      <div className="mb-6">
        <p className="text-[var(--text-secondary)] text-sm">
          {config.siteNameTh} &mdash;{' '}
          {new Date(selectedDate + 'T00:00:00').toLocaleDateString('th-TH', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* Results */}
      {loading ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-10 text-center">
          <p className="text-[var(--text-muted)] text-sm">กำลังโหลด...</p>
        </div>
      ) : (
        <ResultsGrid results={results} />
      )}
    </div>
  );
}
