'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { StockResult } from '@/types';
import FlagIcon from './FlagIcon';
import NumberRenderer from './NumberRenderer';
import { useI18n } from '@/lib/i18n';
import { marketCodeToSlug } from '@/lib/market-utils';

interface MarketOverviewTableProps {
  results: StockResult[];
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Bangkok',
  });
}

// Live countdown for open markets
function MiniCountdown({ closeTime }: { closeTime: string }) {
  const [remaining, setRemaining] = useState('');
  const [urgent, setUrgent] = useState(false);

  useEffect(() => {
    const update = () => {
      const diff = new Date(closeTime).getTime() - Date.now();
      if (diff <= 0) {
        setRemaining('00:00');
        setUrgent(false);
        return;
      }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setUrgent(diff < 300000); // < 5 min
      setRemaining(h > 0 ? `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}` : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [closeTime]);

  return (
    <span className={`font-[family-name:var(--font-mono)] text-[11px] tabular-nums ${urgent ? 'text-red-400' : 'text-[var(--accent-green)]'}`}>
      <span className="inline-flex items-center gap-0.5">
        {remaining.split(':').map((part, i, arr) => (
          <span key={i} className="inline-flex items-center">
            {part}
            {i < arr.length - 1 && (
              <span style={{ animation: 'blink-colon 1s ease-in-out infinite' }}>:</span>
            )}
          </span>
        ))}
      </span>
    </span>
  );
}

function StatusBadge({ status, closeTime, t }: { status: string; closeTime: string; t: (key: string) => string }) {
  if (status === 'open') {
    return (
      <div className="flex flex-col items-center gap-0.5">
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" style={{ animation: 'pulse 2s infinite' }} />
          {t('status.open')}
        </span>
        <MiniCountdown closeTime={closeTime} />
      </div>
    );
  }

  const config = {
    closed: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20' },
    resulted: { bg: 'bg-[var(--brand-primary)]/10', text: 'text-[var(--brand-primary)]', border: 'border-[var(--brand-primary)]/20' },
  }[status] || { bg: 'bg-[var(--text-muted)]/10', text: 'text-[var(--text-muted)]', border: 'border-[var(--text-muted)]/20' };

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${config.bg} ${config.text} border ${config.border}`}>
      {t(`status.${status}`)}
    </span>
  );
}

// Seeded PRNG
function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

// Mini sparkline with random bullish/bearish animation
function MiniSparkline({ resulted, market }: { resulted: boolean; market: string }) {
  if (!resulted) {
    return (
      <svg width="48" height="16" viewBox="0 0 48 16" className="text-[var(--text-muted)]">
        <line x1="0" y1="8" x2="48" y2="8" stroke="currentColor" strokeWidth="1" strokeDasharray="2 2" opacity="0.3" />
      </svg>
    );
  }

  const seed = hashString(market);
  const rng = seededRandom(seed);
  const isBullish = rng() > 0.45;

  const numPoints = 10;
  const points: number[] = [];
  for (let i = 0; i < numPoints; i++) {
    const t = i / (numPoints - 1);
    const trend = isBullish ? 13 - t * 10 : 3 + t * 10;
    const noise = (rng() - 0.5) * 6;
    points.push(Math.max(1, Math.min(15, trend + noise)));
  }

  const path = points.map((y, i) => `${i === 0 ? 'M' : 'L'}${i * 5.3} ${y}`).join(' ');
  const pathLength = points.reduce((acc, y, i) => {
    if (i === 0) return 0;
    const dx = 5.3;
    const dy = y - points[i - 1];
    return acc + Math.sqrt(dx * dx + dy * dy);
  }, 0);

  const color = isBullish ? 'text-[var(--accent-green)]' : 'text-red-500';
  const delay = (seed % 5) * 0.15;

  return (
    <svg width="48" height="16" viewBox="0 0 48 16" className={color}>
      <path
        d={path}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{
          ['--sparkline-length' as string]: pathLength,
          strokeDasharray: pathLength,
          strokeDashoffset: pathLength,
          animation: `sparkline-draw 1.2s ease-out ${delay}s forwards, sparkline-glow 2s ease-in-out ${delay + 1.2}s infinite`,
        }}
      />
    </svg>
  );
}

// Simulated % change badge (deterministic per market)
function ChangeIndicator({ market }: { market: string }) {
  const { isBullish, change } = useMemo(() => {
    const seed = hashString(market + 'chg');
    const rng = seededRandom(seed);
    const bull = rng() > 0.45;
    const val = (rng() * 2.5 + 0.1).toFixed(2);
    return { isBullish: bull, change: val };
  }, [market]);

  return (
    <span
      className={`inline-flex items-center gap-0.5 text-[10px] font-[family-name:var(--font-mono)] font-medium ${isBullish ? 'text-[var(--accent-green)]' : 'text-red-400'}`}
    >
      <span>{isBullish ? '\u25B2' : '\u25BC'}</span>
      <span>{change}%</span>
    </span>
  );
}

// Row with green/red flash on mount for resulted rows
function TableRow({ r, index, t, marketLabel, onClick }: {
  r: StockResult;
  index: number;
  t: (key: string) => string;
  marketLabel: (th: string, lo?: string) => string;
  onClick: () => void;
}) {
  const isResulted = !!r.winningNumber;
  const seed = hashString(r.market);
  const isBullish = seededRandom(seed)() > 0.45;
  const flashClass = isResulted
    ? (isBullish ? 'animate-[flash-green_2s_ease-out]' : 'animate-[flash-red_2s_ease-out]')
    : '';

  return (
    <tr
      className={`border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-card-hover)] transition-colors cursor-pointer ${flashClass}`}
      style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'backwards' }}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } }}
      role="link"
      tabIndex={0}
    >
      {/* Asset */}
      <td className="py-2.5 px-4">
        <div className="flex items-center gap-2.5">
          <FlagIcon emoji={r.flagEmoji} size={24} className="ring-0" />
          <div>
            <div className="text-[var(--text-primary)] font-medium text-sm">
              {marketLabel(r.marketLabelTh, r.marketLabelLo)}
            </div>
            <div className="text-[var(--text-muted)] text-[10px] font-[family-name:var(--font-mono)] uppercase">
              {r.market}
            </div>
          </div>
        </div>
      </td>

      {/* Sparkline + Change */}
      <td className="py-2.5 px-2">
        <div className="flex flex-col items-center gap-0.5">
          <MiniSparkline resulted={isResulted} market={r.market} />
          {isResulted && <ChangeIndicator market={r.market} />}
        </div>
      </td>

      {/* 3-digit Result */}
      <td className="py-2.5 px-4 text-right">
        {r.winningNumber ? (
          <NumberRenderer number={r.winningNumber} size="sm" />
        ) : (
          <span className="text-[var(--text-muted)] font-[family-name:var(--font-mono)]">---</span>
        )}
      </td>

      {/* 2-digit Result */}
      <td className="py-2.5 px-4 text-right">
        {r.winningNumber2d ? (
          <span className="text-[var(--text-secondary)] font-[family-name:var(--font-mono)] text-sm">
            {r.winningNumber2d}
          </span>
        ) : (
          <span className="text-[var(--text-muted)] font-[family-name:var(--font-mono)]">--</span>
        )}
      </td>

      {/* Status */}
      <td className="py-2.5 px-4 text-center">
        <StatusBadge status={r.status} closeTime={r.closeTime} t={t} />
      </td>

      {/* Close Time */}
      <td className="py-2.5 px-4 text-right">
        <span className="text-[var(--text-secondary)] font-[family-name:var(--font-mono)] text-xs">
          {formatTime(r.closeTime)}
        </span>
      </td>
    </tr>
  );
}

// Live clock component
function LiveClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Bangkok',
      }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-[family-name:var(--font-mono)] text-[var(--text-muted)]">
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" style={{ animation: 'pulse 2s infinite' }} />
      <span className="tabular-nums">{time}</span>
      <span className="text-[8px] opacity-60">ICT</span>
    </span>
  );
}

export default function MarketOverviewTable({ results }: MarketOverviewTableProps) {
  const { t, marketLabel } = useI18n();
  const router = useRouter();

  const resultedCount = results.filter((r) => r.winningNumber).length;

  return (
    <div className="panel mb-4 overflow-hidden">
      {/* Section Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <h2 className="text-sm font-semibold text-[var(--text-primary)]">
            {t('section.marketOverview')}
          </h2>
          <LiveClock />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-[family-name:var(--font-mono)] text-[var(--text-muted)]">
            {resultedCount}/{results.length} {t('results.rounds')}
          </span>
          {/* Mini progress bar */}
          <div className="w-16 h-1.5 bg-[var(--bg-primary)] rounded-full overflow-hidden hidden sm:block">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${(resultedCount / results.length) * 100}%`,
                background: 'linear-gradient(90deg, var(--accent-green), var(--brand-primary))',
              }}
            />
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-[var(--text-muted)] text-xs">
              <th className="text-left py-2 px-4 font-medium">{t('table.asset')}</th>
              <th className="text-center py-2 px-2 font-medium w-16">
                <span className="sr-only">Trend</span>
              </th>
              <th className="text-right py-2 px-4 font-medium">{t('table.number')}</th>
              <th className="text-right py-2 px-4 font-medium">{t('table.number2d')}</th>
              <th className="text-center py-2 px-4 font-medium">{t('table.status')}</th>
              <th className="text-right py-2 px-4 font-medium">{t('table.settlement')}</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r, i) => (
              <TableRow key={r.market} r={r} index={i} t={t} marketLabel={marketLabel} onClick={() => router.push(`/market/${marketCodeToSlug(r.market)}`)} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden divide-y divide-[var(--border)]">
        {results.map((r) => {
          const isResulted = !!r.winningNumber;
          const seed = hashString(r.market);
          const isBullish = seededRandom(seed)() > 0.45;

          return (
            <div
              key={r.market}
              className={`px-4 py-3 flex items-center justify-between cursor-pointer ${isResulted ? (isBullish ? 'animate-[flash-green_2s_ease-out]' : 'animate-[flash-red_2s_ease-out]') : ''}`}
              onClick={() => router.push(`/market/${marketCodeToSlug(r.market)}`)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); router.push(`/market/${marketCodeToSlug(r.market)}`); } }}
              role="link"
              tabIndex={0}
            >
              <div className="flex items-center gap-2.5">
                <FlagIcon emoji={r.flagEmoji} size={28} className="ring-0" />
                <div>
                  <div className="text-[var(--text-primary)] font-medium text-sm">
                    {marketLabel(r.marketLabelTh, r.marketLabelLo)}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {r.status === 'open' ? (
                      <MiniCountdown closeTime={r.closeTime} />
                    ) : (
                      <span className="text-[var(--text-muted)] text-[10px] font-[family-name:var(--font-mono)]">
                        {formatTime(r.closeTime)}
                      </span>
                    )}
                    {isResulted && <ChangeIndicator market={r.market} />}
                    {!isResulted && (
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium ${
                        r.status === 'open'
                          ? 'bg-[var(--accent-green)]/10 text-[var(--accent-green)]'
                          : 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]'
                      }`}>
                        {r.status === 'open' && <span className="w-1 h-1 rounded-full bg-[var(--accent-green)]" style={{ animation: 'pulse 2s infinite' }} />}
                        {t(`status.${r.status}`)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="text-right">
                {r.winningNumber ? (
                  <div className="flex flex-col items-end gap-0.5">
                    <NumberRenderer number={r.winningNumber} size="sm" />
                    {r.winningNumber2d && (
                      <span className="text-[var(--text-muted)] font-[family-name:var(--font-mono)] text-xs">
                        {r.winningNumber2d}
                      </span>
                    )}
                  </div>
                ) : (
                  <span className="text-[var(--text-muted)] font-[family-name:var(--font-mono)] text-lg">---</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
