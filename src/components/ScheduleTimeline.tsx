'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import ScheduleMarketCard from './ScheduleMarketCard';
import ScheduleDayProgress from './ScheduleDayProgress';
import type { ScheduleMarketDisplay, DisplayStatus } from './ScheduleMarketCard';

export interface ScheduleMarketData {
  code: string;
  labelTh: string;
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

const SESSION_CONFIG = {
  morning: { emoji: '\u{1F305}', label: '\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E0A\u0E49\u0E32' },
  afternoon: { emoji: '\u2600\uFE0F', label: '\u0E0A\u0E48\u0E27\u0E07\u0E1A\u0E48\u0E32\u0E22' },
  evening: { emoji: '\u{1F319}', label: '\u0E0A\u0E48\u0E27\u0E07\u0E40\u0E22\u0E47\u0E19-\u0E04\u0E48\u0E33' },
} as const;

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

  // 1-second tick for countdowns
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Supabase Realtime subscription
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

  // Auto-scroll to first non-resulted market
  useEffect(() => {
    if (!hasScrolled.current && activeRef.current) {
      activeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      hasScrolled.current = true;
    }
  });

  // Compute display statuses
  const marketsWithStatus: ScheduleMarketDisplay[] = markets.map(m => ({
    ...m,
    displayStatus: getDisplayStatus(m),
  }));

  // Build global index map for animation delays
  const marketIndexMap = new Map<string, number>();
  marketsWithStatus.forEach((m, i) => marketIndexMap.set(m.code, i));

  // Find first non-resulted market for auto-scroll target
  const firstNonResultedCode = marketsWithStatus.find(m => m.displayStatus !== 'resulted')?.code;

  // Active sessions (only show sessions that have markets)
  const sessions = (['morning', 'afternoon', 'evening'] as const).filter(session =>
    marketsWithStatus.some(m => m.session === session)
  );

  // Progress bar boundaries
  const allOpenTimes = markets.map(m => new Date(m.openTimeISO).getTime());
  const allAnnounceTimes = markets.map(m => new Date(m.announceTimeISO).getTime());
  const firstOpenISO = markets.length > 0 ? new Date(Math.min(...allOpenTimes)).toISOString() : '';
  const lastAnnounceISO = markets.length > 0 ? new Date(Math.max(...allAnnounceTimes)).toISOString() : '';

  return (
    <div className="mt-6">
      <ScheduleDayProgress
        markets={marketsWithStatus}
        firstOpenISO={firstOpenISO}
        lastAnnounceISO={lastAnnounceISO}
      />

      <div className="relative">
        {/* Vertical timeline line - desktop only */}
        <div className="hidden md:block absolute left-[15px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--brand-primary)]/30 via-[var(--brand-primary)]/20 to-[var(--text-muted)]/10" />

        {sessions.map(session => {
          const sessionMarkets = marketsWithStatus.filter(m => m.session === session);
          const { emoji, label } = SESSION_CONFIG[session];

          return (
            <div key={session} className="mb-8">
              {/* Session header */}
              <div className="flex items-center gap-3 mb-4 md:ml-10">
                <span className="text-lg">{emoji}</span>
                <span className="font-heading text-lg tracking-[2px] text-[var(--brand-primary)]">
                  {label}
                </span>
                <span className="text-xs text-[var(--text-muted)] font-thai">
                  ({sessionMarkets.length} รอบ)
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-[var(--border)] to-transparent" />
              </div>

              {/* Market entries */}
              <div className="space-y-3">
                {sessionMarkets.map(market => {
                  const globalIdx = marketIndexMap.get(market.code) ?? 0;
                  const isScrollTarget = market.code === firstNonResultedCode;

                  // Timeline node styling
                  const isOpen = market.displayStatus === 'open';
                  const isResulted = market.displayStatus === 'resulted';
                  const isClosed = market.displayStatus === 'closed';

                  return (
                    <div
                      key={market.code}
                      ref={isScrollTarget ? activeRef : undefined}
                      className="flex items-start gap-3 md:gap-4"
                    >
                      {/* Timeline node - desktop only */}
                      <div className="hidden md:flex w-[30px] justify-center pt-5 shrink-0 relative z-10">
                        {isOpen ? (
                          /* Diamond for active/open */
                          <div className="relative">
                            <div className="w-3.5 h-3.5 rotate-45 rounded-[2px] bg-[var(--brand-primary)] shadow-[0_0_8px_var(--brand-glow)]" />
                            <div
                              className="absolute inset-[-4px] rotate-45 rounded-[3px] bg-[var(--brand-primary)]/30"
                              style={{ animation: 'pulse 2s ease-in-out infinite' }}
                            />
                          </div>
                        ) : isResulted ? (
                          /* Filled circle for resulted */
                          <div className="w-3 h-3 rounded-full bg-[var(--accent-green)]" />
                        ) : isClosed ? (
                          /* Filled circle with brand color for closed/waiting */
                          <div className="w-3 h-3 rounded-full bg-[var(--brand-accent)]" />
                        ) : (
                          /* Empty circle for upcoming */
                          <div className="w-3 h-3 rounded-full border-2 border-[var(--text-muted)]/50" />
                        )}
                      </div>

                      {/* Mobile status dot */}
                      <div className="md:hidden flex items-center pt-5 shrink-0">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isResulted
                              ? 'bg-[var(--accent-green)]'
                              : isOpen
                                ? 'bg-[var(--brand-primary)]'
                                : isClosed
                                  ? 'bg-[var(--brand-accent)]'
                                  : 'bg-[var(--text-muted)]/50'
                          }`}
                        />
                      </div>

                      {/* Card */}
                      <div className="flex-1 min-w-0">
                        <ScheduleMarketCard market={market} index={globalIdx} />
                      </div>
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
