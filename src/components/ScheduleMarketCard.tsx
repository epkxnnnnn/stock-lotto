'use client';

import NumberRenderer from './NumberRenderer';
import FlagIcon from './FlagIcon';

export type DisplayStatus = 'upcoming' | 'open' | 'closed' | 'resulted';

export interface ScheduleMarketDisplay {
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

  const borderClass =
    displayStatus === 'upcoming'
      ? 'border-dashed border-[var(--border)]/50'
      : displayStatus === 'open'
        ? 'border-[var(--brand-primary)]/40 shadow-[0_0_20px_var(--brand-glow)]'
        : displayStatus === 'closed'
          ? 'border-[var(--brand-primary)]/20'
          : 'border-[var(--border)]';

  const cardOpacity = displayStatus === 'upcoming' ? 'opacity-60' : displayStatus === 'resulted' ? 'opacity-90' : '';

  return (
    <div
      className={`bg-[var(--bg-card)] border rounded-[14px] p-4 md:p-5 transition-all relative overflow-hidden ${borderClass} ${cardOpacity}`}
      style={{
        animation: 'fadeInUp 0.4s ease-out backwards',
        animationDelay: `${index * 0.05}s`,
      }}
    >
      {/* Card frame background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.04] pointer-events-none rounded-[14px]"
        style={{ backgroundImage: `url('/images/card-frame-${market.source}.png')` }}
      />

      {/* Left accent for open/resulted */}
      {displayStatus === 'open' && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[var(--brand-accent)] to-[var(--brand-dark)]" />
      )}
      {displayStatus === 'resulted' && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[var(--accent-green)] to-[var(--accent-green)]/30" />
      )}

      {/* Main content */}
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
          {/* Left: Flag + Name + Badge */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <FlagIcon emoji={market.flagEmoji} size={44} />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
                  {market.labelTh}
                </span>
                {displayStatus === 'open' && (
                  <span className="inline-flex items-center gap-1 bg-[rgba(46,204,113,0.15)] text-[var(--accent-green)] border border-[rgba(46,204,113,0.3)] text-[10px] px-2 py-0.5 rounded font-semibold tracking-wider shrink-0">
                    <span
                      className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]"
                      style={{ animation: 'pulse 1.5s ease-in-out infinite' }}
                    />
                    LIVE
                  </span>
                )}
                {displayStatus === 'resulted' && (
                  <span className="inline-flex items-center gap-1 bg-[rgba(46,204,113,0.15)] text-[var(--accent-green)] border border-[rgba(46,204,113,0.3)] text-[10px] px-2 py-0.5 rounded font-semibold tracking-wider shrink-0">
                    &#x2713; ออกผล
                  </span>
                )}
                {displayStatus === 'closed' && (
                  <span className="inline-flex items-center gap-1 bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20 text-[10px] px-2 py-0.5 rounded font-semibold tracking-wider shrink-0">
                    รอผล
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                ปิดรับ {market.closeTimeDisplay} น. &middot; ประกาศ {market.announceTimeDisplay} น.
              </div>
            </div>
          </div>

          {/* Right: Countdown or Result */}
          <div className="md:text-right shrink-0">
            {displayStatus === 'upcoming' && (
              <div>
                <div className="text-[10px] text-[var(--text-muted)] mb-1 font-thai">นับถอยหลังปิดรับ</div>
                <div className="font-mono text-lg font-bold text-[var(--text-secondary)]">
                  {formatTimeLeft(market.closeTimeISO)}
                </div>
              </div>
            )}
            {displayStatus === 'open' && (
              <div>
                <div className="text-[10px] text-[var(--brand-primary)] mb-1 font-thai">ปิดรับในอีก</div>
                <div className="font-mono text-xl font-bold text-[var(--brand-light)]">
                  {formatTimeLeft(market.closeTimeISO)}
                </div>
              </div>
            )}
            {displayStatus === 'closed' && (
              <div>
                <div className="text-[10px] text-[var(--text-muted)] mb-1 font-thai">ประกาศผลในอีก</div>
                <div className="font-mono text-lg font-bold text-[var(--brand-accent)]">
                  {formatTimeLeft(market.announceTimeISO)}
                </div>
                <div className="text-[11px] text-[var(--text-muted)] mt-1 font-thai">รอประกาศผล...</div>
              </div>
            )}
            {displayStatus === 'resulted' && market.winningNumber && (
              <div className="flex flex-col items-start md:items-end gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] text-[var(--text-muted)] font-thai">3 ตัวบน</span>
                  <NumberRenderer number={market.winningNumber} size="md" />
                </div>
                {market.winningNumber2d && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-[var(--text-muted)] font-thai">2 ตัวล่าง</span>
                    <NumberRenderer number={market.winningNumber2d} size="sm" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Progress bar for open markets */}
        {displayStatus === 'open' && (
          <div className="mt-3 h-1.5 rounded-full bg-[var(--bg-secondary)] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--brand-dark)] via-[var(--brand-primary)] to-[var(--brand-light)] transition-all duration-1000"
              style={{ width: `${getProgressPercent(market.openTimeISO, market.closeTimeISO)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
