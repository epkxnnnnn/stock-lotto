'use client';

import type { StockResult } from '@/types';
import FlagIcon from './FlagIcon';
import CountdownTimer from './CountdownTimer';
import { useI18n } from '@/lib/i18n';

interface HeroSplitProps {
  nextRound: StockResult | undefined;
  results: StockResult[];
  onCountdownExpire: () => void;
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('th-TH', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Bangkok',
  });
}

function ResultBar({ result, maxBar }: { result: StockResult; maxBar: number }) {
  const { marketLabel } = useI18n();
  const num = result.winningNumber ? parseInt(result.winningNumber, 10) : 0;
  const barWidth = maxBar > 0 ? (num / maxBar) * 100 : 0;

  return (
    <div className="flex items-center gap-2 text-xs">
      <FlagIcon emoji={result.flagEmoji} size={16} className="ring-0" />
      <span className="text-[var(--text-muted)] w-8 text-right font-[family-name:var(--font-mono)]">
        {result.winningNumber || '---'}
      </span>
      <div className="flex-1 h-4 bg-[var(--bg-primary)] rounded-sm overflow-hidden">
        {result.winningNumber && (
          <div
            className="h-full rounded-sm transition-all duration-500"
            style={{
              width: `${Math.max(barWidth, 8)}%`,
              background: `linear-gradient(90deg, var(--accent-green), var(--brand-primary))`,
            }}
          />
        )}
      </div>
      <span className="text-[var(--text-muted)] text-[10px] w-20 truncate hidden sm:block">
        {marketLabel(result.marketLabelTh, result.marketLabelLo)}
      </span>
    </div>
  );
}

export default function HeroSplit({ nextRound, results, onCountdownExpire }: HeroSplitProps) {
  const { t, marketLabel } = useI18n();

  const resultedMarkets = results.filter((r) => r.winningNumber);
  // Fixed scale: 3-digit lottery results are 000-999
  const maxBar = 999;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
      {/* Left: Chart Area (3 cols) */}
      <div className="lg:col-span-3 panel p-4">
        {/* Chart Toolbar */}
        <div className="flex items-center justify-between mb-3 border-b border-[var(--border)] pb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-[var(--text-primary)]">
              {t('hero.todayChart')}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] font-[family-name:var(--font-mono)]">
              {resultedMarkets.length}/{results.length}
            </span>
          </div>
          <div className="flex gap-1">
            {['1D'].map((interval) => (
              <span
                key={interval}
                className="px-2 py-0.5 text-[10px] font-[family-name:var(--font-mono)] rounded bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border border-[var(--brand-primary)]/20"
              >
                {interval}
              </span>
            ))}
          </div>
        </div>

        {/* OHLC Legend */}
        <div className="flex gap-4 mb-3 text-[10px] font-[family-name:var(--font-mono)]">
          <span className="text-[var(--text-muted)]">
            R: <span className="text-[var(--text-secondary)]">{resultedMarkets.length}</span>
          </span>
          <span className="text-[var(--text-muted)]">
            P: <span className="text-[var(--text-secondary)]">{results.length - resultedMarkets.length}</span>
          </span>
          <span className="text-[var(--text-muted)]">
            T: <span className="text-[var(--text-secondary)]">{results.length}</span>
          </span>
        </div>

        {/* Bar Chart */}
        <div className="space-y-1.5 max-h-[260px] overflow-y-auto pr-1">
          {results.map((r) => (
            <ResultBar key={r.market} result={r} maxBar={maxBar} />
          ))}
        </div>
      </div>

      {/* Right: Countdown Widget (2 cols) */}
      <div className="lg:col-span-2 panel p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-[var(--text-primary)]">
            {t('hero.nextSettlement')}
          </span>
          {nextRound && (
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/20">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" style={{ animation: 'pulse 2s infinite' }} />
              {t('status.live')}
            </span>
          )}
        </div>

        {nextRound ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <FlagIcon emoji={nextRound.flagEmoji} size={48} />
            <h3 className="text-base font-semibold text-[var(--text-primary)] mt-3 text-center">
              {marketLabel(nextRound.marketLabelTh, nextRound.marketLabelLo)}
            </h3>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              {t('countdown.closesAt')} {formatTime(nextRound.closeTime)}
            </p>
            <div className="mt-4">
              <CountdownTimer targetTime={nextRound.closeTime} onExpire={onCountdownExpire} />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-[var(--text-muted)]">{t('common.noData')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
