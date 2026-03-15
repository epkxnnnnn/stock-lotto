'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useI18n } from '@/lib/i18n';
import ScheduleMarketCard from './ScheduleMarketCard';
import ScheduleDayProgress from './ScheduleDayProgress';
import type { ScheduleMarketDisplay, DisplayStatus } from './ScheduleMarketCard';

export interface ScheduleMarketData {
  code: string;
  labelTh: string;
  labelLo?: string;
  flagEmoji: string;
  openTimeISO: string;
  closeTimeISO: string;
  announceTimeISO: string;
  closeTimeDisplay: string;
  announceTimeDisplay: string;
  order: number;
  source: 'vvip' | 'platinum';
  winningNumber: string | null;
  winningNumber2d: string | null;
  dbStatus: 'open' | 'closed' | 'resulted';
  resultTime: string | null;
  session: 'morning' | 'afternoon' | 'evening';
}

interface ScheduleTimelineProps {
  initialMarkets: ScheduleMarketData[];
  brand: string;
  today: string;
}

function getDisplayStatus(market: ScheduleMarketData): DisplayStatus {
  if (market.winningNumber || market.dbStatus === 'resulted') return 'resulted';
  const now = Date.now();
  const closeTime = new Date(market.closeTimeISO).getTime();
  const openTime = new Date(market.openTimeISO).getTime();
  if (now >= closeTime) return 'closed';
  if (now >= openTime) return 'open';
  return 'upcoming';
}

export default function ScheduleTimeline({ initialMarkets, brand, today }: ScheduleTimelineProps) {
  const [markets, setMarkets] = useState<ScheduleMarketData[]>(initialMarkets);
  const [, setTick] = useState(0);
  const activeRef = useRef<HTMLDivElement>(null);
  const hasScrolled = useRef(false);
  const { t } = useI18n();

  useEffect(() => {
    const interval = setInterval(() => setTick(tk => tk + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const channel = supabase
      .channel('schedule_results_realtime')
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

          setMarkets(prev =>
            prev.map(m =>
              m.code === updated.market
                ? {
                    ...m,
                    winningNumber: (updated.winning_number as string) ?? null,
                    winningNumber2d: (updated.winning_number_2d as string | null) ?? null,
                    dbStatus: (updated.status as ScheduleMarketData['dbStatus']) ?? m.dbStatus,
                    resultTime: (updated.result_time as string) ?? null,
                  }
                : m
            )
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [brand, today]);

  useEffect(() => {
    if (!hasScrolled.current && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      hasScrolled.current = true;
    }
  });

  const marketsWithStatus: ScheduleMarketDisplay[] = markets.map(m => ({
    ...m,
    displayStatus: getDisplayStatus(m),
  }));

  const marketIndexMap = new Map<string, number>();
  marketsWithStatus.forEach((m, i) => marketIndexMap.set(m.code, i));

  const firstNonResultedCode = marketsWithStatus.find(m => m.displayStatus !== 'resulted')?.code;

  const sessions = (['morning', 'afternoon', 'evening'] as const).filter(session =>
    marketsWithStatus.some(m => m.session === session)
  );

  const sessionLabels: Record<string, string> = {
    morning: t('schedule.morning'),
    afternoon: t('schedule.afternoon'),
    evening: t('schedule.evening'),
  };

  const allOpenTimes = markets.map(m => new Date(m.openTimeISO).getTime());
  const allAnnounceTimes = markets.map(m => new Date(m.announceTimeISO).getTime());
  const firstOpenISO = markets.length > 0 ? new Date(Math.min(...allOpenTimes)).toISOString() : '';
  const lastAnnounceISO = markets.length > 0 ? new Date(Math.max(...allAnnounceTimes)).toISOString() : '';

  return (
    <div>
      {/* Page header */}
      <h1 className="text-lg font-semibold text-[var(--text-primary)] mb-4">
        {t('schedule.title')}
      </h1>

      <ScheduleDayProgress
        markets={marketsWithStatus}
        firstOpenISO={firstOpenISO}
        lastAnnounceISO={lastAnnounceISO}
      />

      <div className="space-y-6 mt-4">
        {sessions.map(session => {
          const sessionMarkets = marketsWithStatus.filter(m => m.session === session);

          return (
            <div key={session}>
              {/* Session header */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-semibold text-[var(--brand-primary)]">
                  {sessionLabels[session]}
                </span>
                <span className="text-[10px] text-[var(--text-muted)] font-[family-name:var(--font-mono)]">
                  ({sessionMarkets.length} {t('results.rounds')})
                </span>
                <div className="flex-1 h-px bg-[var(--border)]" />
              </div>

              {/* Market entries */}
              <div className="space-y-2">
                {sessionMarkets.map(market => {
                  const globalIdx = marketIndexMap.get(market.code) ?? 0;
                  const isScrollTarget = market.code === firstNonResultedCode;

                  return (
                    <div
                      key={market.code}
                      ref={isScrollTarget ? activeRef : undefined}
                    >
                      <ScheduleMarketCard market={market} index={globalIdx} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
