'use client';

import type { ScheduleMarketDisplay } from './ScheduleMarketCard';

interface ScheduleDayProgressProps {
  markets: ScheduleMarketDisplay[];
  firstOpenISO: string;
  lastAnnounceISO: string;
}

export default function ScheduleDayProgress({ markets, firstOpenISO, lastAnnounceISO }: ScheduleDayProgressProps) {
  const now = Date.now();
  const start = new Date(firstOpenISO).getTime();
  const end = new Date(lastAnnounceISO).getTime();
  const totalSpan = end - start;

  const currentPosition = totalSpan > 0
    ? Math.min(100, Math.max(0, ((now - start) / totalSpan) * 100))
    : 0;

  const resultedCount = markets.filter(m => m.displayStatus === 'resulted').length;
  const totalCount = markets.length;
  const allDone = resultedCount === totalCount;

  const bangkokTime = new Date().toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Bangkok',
  });

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-4 md:p-6 mb-6">
      {/* Progress bar */}
      <div className="relative h-2 rounded-full bg-[var(--bg-secondary)]">
        {/* Filled portion */}
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-[var(--brand-dark)] to-[var(--brand-primary)] transition-all duration-1000"
          style={{ width: `${currentPosition}%` }}
        />

        {/* Current time marker */}
        <div
          className="absolute top-1/2 w-3 h-3 rounded-full bg-[var(--brand-primary)] shadow-[0_0_8px_var(--brand-glow)] z-20 transition-all duration-1000"
          style={{ left: `${currentPosition}%`, transform: 'translateX(-50%) translateY(-50%)' }}
        />

        {/* Market dots - hidden on mobile */}
        <div className="hidden md:block">
          {markets.map((market) => {
            const closePos = totalSpan > 0
              ? ((new Date(market.closeTimeISO).getTime() - start) / totalSpan) * 100
              : 0;
            const dotColor =
              market.displayStatus === 'resulted'
                ? 'bg-[var(--accent-green)]'
                : market.displayStatus === 'open'
                  ? 'bg-[var(--brand-primary)]'
                  : 'bg-[var(--text-muted)]';

            return (
              <div
                key={market.code}
                className={`absolute top-1/2 w-1.5 h-1.5 rounded-full ${dotColor} z-10`}
                style={{ left: `${closePos}%`, transform: 'translateX(-50%) translateY(-50%)' }}
                title={`${market.labelTh} - ${market.closeTimeDisplay}`}
              />
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm mt-3">
        <div className="text-[var(--text-secondary)] font-thai">
          {allDone ? (
            <span className="text-[var(--accent-green)]">&#x2714; ผลหวยออกครบทุกรอบแล้ววันนี้</span>
          ) : (
            <>
              ออกผลแล้ว{' '}
              <span className="text-[var(--brand-primary)] font-semibold">
                {resultedCount}/{totalCount}
              </span>{' '}
              รอบ
            </>
          )}
        </div>
        <div className="font-mono text-xs text-[var(--text-muted)]">
          &#x1F550; {bangkokTime}
        </div>
      </div>
    </div>
  );
}
