'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import type { StockResult } from '@/types';
import HeroNextRound from './HeroNextRound';
import CountdownStrip from './CountdownStrip';
import ResultsGrid from './ResultsGrid';
import PayoutTable from './PayoutTable';
import SectionTitle from './SectionTitle';

interface HomeClientProps {
  initialResults: StockResult[];
  brand: string;
  today: string;
}

function mapRow(r: Record<string, unknown>): StockResult {
  return {
    id: r.id as string,
    source: r.source as 'vvip' | 'platinum',
    market: r.market as string,
    marketLabelTh: r.market_label_th as string,
    flagEmoji: r.flag_emoji as string,
    winningNumber: r.winning_number as string | null,
    roundDate: r.round_date as string,
    closeTime: r.close_time as string,
    resultTime: r.result_time as string | null,
    status: r.status as 'open' | 'closed' | 'resulted',
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export default function HomeClient({ initialResults, brand, today }: HomeClientProps) {
  const [results, setResults] = useState<StockResult[]>(initialResults);
  const [refreshKey, setRefreshKey] = useState(0);

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
    // Force re-render to recalculate nextRound/upcomingRounds
    setRefreshKey((k) => k + 1);
  }, [brand, today]);

  const handleCountdownExpire = useCallback(() => {
    // Small delay to let server-side status update propagate
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
                    status: (updated.status as StockResult['status']) ?? r.status,
                    resultTime: (updated.result_time as string) ?? null,
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
  const upcomingRounds = openRounds.filter((r) => r !== nextRound);

  const todayFormatted = new Date().toLocaleDateString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });

  return (
    <>
      <HeroNextRound nextRound={nextRound} onCountdownExpire={handleCountdownExpire} />

      {upcomingRounds.length > 0 && (
        <>
          <SectionTitle>&#x23F3; รอบที่กำลังจะมา</SectionTitle>
          <CountdownStrip rounds={upcomingRounds} />
        </>
      )}

      <SectionTitle>&#x1F3C6; ผลหวยวันนี้ &mdash; {todayFormatted}</SectionTitle>
      <ResultsGrid results={results} />

      <SectionTitle>&#x1F4B0; อัตราจ่าย</SectionTitle>
      <PayoutTable />
    </>
  );
}
