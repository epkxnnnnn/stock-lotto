'use client';

import NumberRenderer from './NumberRenderer';
import FlagIcon from './FlagIcon';
import { useI18n } from '@/lib/i18n';
import { seededRandom, hashString } from '@/lib/utils/seeded-random';
import BackgroundSparkline from './trading/BackgroundSparkline';
import ChangeIndicator from './trading/ChangeIndicator';
import VolumeBars from './trading/VolumeBars';

export type DisplayStatus = 'upcoming' | 'open' | 'closed' | 'resulted';

export interface ScheduleMarketDisplay {
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
  resultTime: string | null;
  displayStatus: DisplayStatus;
  session: 'morning' | 'afternoon' | 'evening';
}

interface ScheduleMarketCardProps {
  market: ScheduleMarketDisplay;
  index: number;
}

function formatTimeLeft(targetISO: string): string {
  const diff = new Date(targetISO).getTime() - Date.now();
  if (diff <= 0) return '00:00:00';
  const h = Math.floor(diff / (1000 * 60 * 60));
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function getProgressPercent(openISO: string, closeISO: string): number {
  const now = Date.now();
  const open = new Date(openISO).getTime();
  const close = new Date(closeISO).getTime();
  if (close <= open) return 0;
  const elapsed = now - open;
  const total = close - open;
  return Math.min(100, Math.max(0, (elapsed / total) * 100));
}

export default function ScheduleMarketCard({ market, index }: ScheduleMarketCardProps) {
  const { displayStatus } = market;
  const { t, marketLabel } = useI18n();

  const isResulted = displayStatus === 'resulted';
  const seed = hashString(market.code);
  const isBullish = seededRandom(seed)() > 0.45;

  const borderClass =
    displayStatus === 'upcoming'
      ? 'border-dashed border-[var(--border)]'
      : displayStatus === 'open'
        ? 'border-[var(--brand-primary)]/40'
        : 'border-[var(--border)]';

  const cardOpacity = displayStatus === 'upcoming' ? 'opacity-60' : '';

  const flashClass = isResulted
    ? (isBullish ? 'animate-[flash-green_2s_ease-out]' : 'animate-[flash-red_2s_ease-out]')
    : '';

  return (
    <div
      className={`panel p-3 md:p-4 transition-all relative overflow-hidden border ${borderClass} ${cardOpacity} ${flashClass}`}
      style={{
        animation: `fadeInUp 0.3s ease-out backwards${isResulted ? `, ${isBullish ? 'flash-green' : 'flash-red'} 2s ease-out` : ''}`,
        animationDelay: `${index * 0.03}s`,
      }}
    >
      {/* Left accent for open */}
      {displayStatus === 'open' && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--brand-primary)]" />
      )}
      {isResulted && (
        <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--accent-green)]" />
      )}

      {/* Background sparkline for resulted cards */}
      {isResulted && <BackgroundSparkline market={market.code} />}

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
          {/* Left: Flag + Name + Badge */}
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <FlagIcon emoji={market.flagEmoji} size={28} className="ring-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-medium text-[var(--text-primary)] truncate">
                  {marketLabel(market.labelTh, market.labelLo)}
                </span>
                {displayStatus === 'open' && (
                  <span className="inline-flex items-center gap-1 bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/20 text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]"
                      style={{ animation: 'pulse 1.5s ease-in-out infinite' }}
                    />
                    LIVE
                  </span>
                )}
                {isResulted && (
                  <span className="inline-flex items-center gap-1 bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/20 text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0">
                    {t('status.resulted')}
                  </span>
                )}
                {displayStatus === 'closed' && (
                  <span className="inline-flex items-center gap-1 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20 text-[10px] px-1.5 py-0.5 rounded font-medium shrink-0">
                    {t('status.pending')}
                  </span>
                )}
              </div>
              <div className="text-[10px] text-[var(--text-muted)] mt-0.5 font-[family-name:var(--font-mono)]">
                {t('schedule.closeTime')} {market.closeTimeDisplay} &middot; {t('schedule.announceTime')} {market.announceTimeDisplay}
              </div>
            </div>
          </div>

          {/* Right: Countdown or Result */}
          <div className="md:text-right shrink-0">
            {displayStatus === 'upcoming' && (
              <div className="font-[family-name:var(--font-mono)] text-base font-semibold text-[var(--text-secondary)]">
                {formatTimeLeft(market.closeTimeISO)}
              </div>
            )}
            {displayStatus === 'open' && (
              <div className="font-[family-name:var(--font-mono)] text-lg font-bold text-[var(--brand-light)]">
                {formatTimeLeft(market.closeTimeISO)}
              </div>
            )}
            {displayStatus === 'closed' && (
              <div className="font-[family-name:var(--font-mono)] text-base font-semibold text-[var(--brand-accent)]">
                {formatTimeLeft(market.announceTimeISO)}
              </div>
            )}
            {isResulted && market.winningNumber && (
              <div className="flex items-center gap-2 md:justify-end">
                <NumberRenderer number={market.winningNumber} size="sm" />
                {market.winningNumber2d && (
                  <span className="text-[var(--text-muted)] font-[family-name:var(--font-mono)] text-xs">
                    {market.winningNumber2d}
                  </span>
                )}
                <ChangeIndicator market={market.code} />
              </div>
            )}
          </div>
        </div>

        {/* Progress bar for open markets */}
        {displayStatus === 'open' && (
          <div className="mt-2 h-1 rounded-full bg-[var(--bg-primary)] overflow-hidden">
            <div
              className="h-full rounded-full bg-[var(--brand-primary)] transition-all duration-1000"
              style={{ width: `${getProgressPercent(market.openTimeISO, market.closeTimeISO)}%` }}
            />
          </div>
        )}

        {/* Compact volume bars for resulted cards */}
        {isResulted && (
          <div className="mt-2">
            <VolumeBars market={market.code} compact />
          </div>
        )}
      </div>
    </div>
  );
}
