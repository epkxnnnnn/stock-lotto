'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { StockResult } from '@/types';
import { useI18n } from '@/lib/i18n';
import TickerTape from './TickerTape';
import HeroSplit from './HeroSplit';
import MarketOverviewTable from './MarketOverviewTable';
import TodayStats from './TodayStats';
import GlobalIndicesWidget from './GlobalIndicesWidget';

interface HomeClientProps {
  initialResults: StockResult[];
  initialYesterdayResults: StockResult[];
  brand: string;
  today: string;
  yesterday: string;
}

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

export default function HomeClient({ initialResults, initialYesterdayResults, brand, today, yesterday }: HomeClientProps) {
  const [results, setResults] = useState<StockResult[]>(initialResults);
  const [yesterdayResults] = useState<StockResult[]>(initialYesterdayResults);
  const [, setRefreshKey] = useState(0);
  const { t } = useI18n();

  // Refetch all results from Supabase (called when countdown expires)
  const refetchResults = useCallback(async () => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
    const { data } = await supabase
      .from('stock_results')
      .select('*')
      .eq('source', brand)
      .eq('round_date', today)
      .order('close_time', { ascending: true });

    if (data && data.length > 0) {
      setResults(data.map((r: Record<string, unknown>) => mapRow(r)));
    }
    setRefreshKey((k) => k + 1);
  }, [brand, today]);

  const handleCountdownExpire = useCallback(() => {
    setTimeout(() => refetchResults(), 3000);
  }, [refetchResults]);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const channel = supabase
      .channel('stock_results_realtime')
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
          if (!updated || updated.round_date !== today) return;

          setResults((prev) =>
            prev.map((r) =>
              r.market === updated.market
                ? {
                    ...r,
                    winningNumber: (updated.winning_number as string) ?? null,
                    winningNumber2d: (updated.winning_number_2d as string) ?? null,
                    status: (updated.status as StockResult['status']) ?? r.status,
                    resultTime: (updated.result_time as string) ?? null,
                    resultHash: (updated.result_hash as string) ?? null,
                    generationMethod: (updated.generation_method as StockResult['generationMethod']) ?? r.generationMethod,
                  }
                : r
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [brand, today]);

  const now = new Date();
  const openRounds = results.filter((r) => r.status === 'open');
  const nextRound = openRounds.find((r) => new Date(r.closeTime) > now);

  const hasAnyResult = results.some((r) => r.winningNumber);
  const showYesterday = !hasAnyResult && yesterdayResults.length > 0;

  const displayResults = showYesterday ? yesterdayResults : results;
  const sectionLabel = showYesterday ? t('section.yesterdayResults') : t('section.todayResults');

  return (
    <>
      <TickerTape results={displayResults} />

      <div className="py-4">
        <HeroSplit
          nextRound={nextRound}
          results={displayResults}
          onCountdownExpire={handleCountdownExpire}
        />

        <MarketOverviewTable results={displayResults} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TodayStats results={displayResults} />
          <GlobalIndicesWidget />
        </div>
      </div>
    </>
  );
}
