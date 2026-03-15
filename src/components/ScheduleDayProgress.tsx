'use client';

import { useI18n } from '@/lib/i18n';
import type { ScheduleMarketDisplay } from './ScheduleMarketCard';

interface ScheduleDayProgressProps {
  markets: ScheduleMarketDisplay[];
  firstOpenISO: string;
  lastAnnounceISO: string;
}

export default function ScheduleDayProgress({ markets, firstOpenISO, lastAnnounceISO }: ScheduleDayProgressProps) {
  const { t } = useI18n();
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
    <div className="panel p-4 mb-4">
      {/* Progress bar */}
      <div className="relative h-1.5 rounded-full bg-[var(--bg-primary)]">
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-[var(--brand-primary)] transition-all duration-1000"
          style={{ width: `${currentPosition}%` }}
        />
        <div
          className="absolute top-1/2 w-2.5 h-2.5 rounded-full bg-[var(--brand-primary)] shadow-[0_0_6px_var(--brand-glow)] z-20 transition-all duration-1000"
          style={{ left: `${currentPosition}%`, transform: 'translateX(-50%) translateY(-50%)' }}
        />
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs mt-2.5">
        <div className="text-[var(--text-secondary)]">
          {allDone ? (
            <span className="text-[var(--accent-green)]">{t('status.resulted')}</span>
          ) : (
            <>
              {t('results.progress')}{' '}
              <span className="text-[var(--brand-primary)] font-semibold font-[family-name:var(--font-mono)]">
                {resultedCount}/{totalCount}
              </span>{' '}
              {t('results.rounds')}
            </>
          )}
        </div>
        <div className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-muted)]">
          {bangkokTime}
        </div>
      </div>
    </div>
  );
}
