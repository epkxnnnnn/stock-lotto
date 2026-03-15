'use client';

import { useState, useEffect, useCallback, type ReactNode } from 'react';
import type { StockResult } from '@/types';
import FlagIcon from './FlagIcon';
import CountdownTimer from './CountdownTimer';
import TradingViewChart from './TradingViewChart';
import { useI18n } from '@/lib/i18n';
import { getStockSymbol, stockSymbols } from '@/lib/stock-symbols';
import BackgroundSparkline from './trading/BackgroundSparkline';
import VolumeBars from './trading/VolumeBars';

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

// --- Countdown card sub-components ---

// Circular progress ring around the flag icon
function SessionProgressRing({ targetTime, children }: { targetTime: string; children: ReactNode }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Assume 30min session window for progress calculation
    const sessionDuration = 30 * 60 * 1000;
    const update = () => {
      const remaining = new Date(targetTime).getTime() - Date.now();
      const elapsed = sessionDuration - remaining;
      setProgress(Math.max(0, Math.min(1, elapsed / sessionDuration)));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  return (
    <div className="relative w-[72px] h-[72px] flex items-center justify-center">
      <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 72 72">
        {/* Track */}
        <circle cx="36" cy="36" r={radius} fill="none" stroke="var(--border)" strokeWidth="2" />
        {/* Progress */}
        <circle
          cx="36" cy="36" r={radius}
          fill="none"
          stroke="var(--brand-primary)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-linear"
          style={{ filter: 'drop-shadow(0 0 3px var(--brand-primary))' }}
        />
      </svg>
      {children}
    </div>
  );
}

// Horizontal session progress bar
function SessionProgressBar({ targetTime }: { targetTime: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const sessionDuration = 30 * 60 * 1000;
    const update = () => {
      const remaining = new Date(targetTime).getTime() - Date.now();
      const elapsed = sessionDuration - remaining;
      setProgress(Math.max(0, Math.min(1, elapsed / sessionDuration)));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [targetTime]);

  return (
    <div className="px-4 pb-2">
      <div className="flex items-center justify-between text-[9px] text-[var(--text-muted)] mb-1 font-[family-name:var(--font-mono)]">
        <span>OPEN</span>
        <span>{Math.round(progress * 100)}%</span>
        <span>CLOSE</span>
      </div>
      <div className="h-1 bg-[var(--bg-primary)] rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000 ease-linear"
          style={{
            width: `${progress * 100}%`,
            background: `linear-gradient(90deg, var(--accent-green), var(--brand-primary))`,
            boxShadow: '0 0 6px var(--brand-primary)',
          }}
        />
      </div>
    </div>
  );
}

export default function HeroSplit({ nextRound, results, onCountdownExpire }: HeroSplitProps) {
  const { t, marketLabel } = useI18n();

  // Market selector state
  const defaultMarket = nextRound?.market ?? results[0]?.market ?? 'dow_jones';
  const [selectedMarket, setSelectedMarket] = useState(defaultMarket);
  const [isManualSelect, setIsManualSelect] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Auto-track next round when user hasn't manually selected
  useEffect(() => {
    if (!isManualSelect && nextRound?.market) {
      setSelectedMarket(nextRound.market);
    }
  }, [nextRound?.market, isManualSelect]);

  // Detect mobile
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    setIsMobile(mql.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const handleMarketChange = useCallback((market: string) => {
    setSelectedMarket(market);
    setIsManualSelect(true);
  }, []);

  // Derive TradingView symbol and interval
  const stockInfo = getStockSymbol(selectedMarket);
  const tvSymbol = stockInfo?.symbol ?? 'FOREXCOM:DJI';
  const tvInterval = stockInfo?.chartInterval ?? '15';

  // Build unique market list for dropdown (deduplicate same symbol markets like nikkei_am/nikkei_pm)
  const uniqueMarkets = results.reduce<Array<{ market: string; label: string; flag: string; indexName: string }>>((acc, r) => {
    const info = getStockSymbol(r.market);
    if (!info) return acc;
    // Deduplicate by symbol
    if (acc.some((m) => stockSymbols[m.market]?.symbol === info.symbol)) return acc;
    acc.push({
      market: r.market,
      label: marketLabel(r.marketLabelTh, r.marketLabelLo),
      flag: r.flagEmoji,
      indexName: info.indexName,
    });
    return acc;
  }, []);

  const chartHeight = isMobile ? 300 : 420;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-10 gap-4 mb-4">
      {/* Left: TradingView Chart (7 cols) */}
      <div className="lg:col-span-7 panel p-3">
        {/* Chart Toolbar */}
        <div className="flex items-center justify-between mb-2 gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {/* Market selector */}
            <select
              value={selectedMarket}
              onChange={(e) => handleMarketChange(e.target.value)}
              className="bg-[var(--bg-primary)] text-[var(--text-primary)] text-xs font-[family-name:var(--font-mono)] border border-[var(--border)] rounded px-2 py-1.5 outline-none focus:border-[var(--brand-primary)] min-w-0 max-w-[200px] sm:max-w-[280px] truncate"
            >
              {uniqueMarkets.map((m) => (
                <option key={m.market} value={m.market}>
                  {m.flag} {m.label} — {m.indexName}
                </option>
              ))}
            </select>

            {stockInfo && (
              <span className="text-[10px] text-[var(--text-muted)] font-[family-name:var(--font-mono)] hidden sm:block">
                {stockInfo.symbol}
              </span>
            )}
          </div>

          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-[var(--accent-green)]/10 text-[var(--accent-green)] border border-[var(--accent-green)]/20 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" style={{ animation: 'pulse 2s infinite' }} />
            LIVE
          </span>
        </div>

        {/* TradingView Chart */}
        <TradingViewChart
          symbol={tvSymbol}
          interval={tvInterval}
          height={chartHeight}
          hideSideToolbar={isMobile}
        />
      </div>

      {/* Right: Countdown Widget (3 cols) */}
      <div className="lg:col-span-3 panel flex flex-col overflow-hidden relative">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] relative z-10">
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
          <div className="flex-1 flex flex-col relative z-10">
            {/* Background animated sparkline */}
            <BackgroundSparkline market={nextRound.market} />

            {/* Main content */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 gap-3">
              {/* Flag with progress ring */}
              <SessionProgressRing targetTime={nextRound.closeTime}>
                <FlagIcon emoji={nextRound.flagEmoji} size={44} />
              </SessionProgressRing>

              <div className="text-center">
                <h3 className="text-base font-semibold text-[var(--text-primary)]">
                  {marketLabel(nextRound.marketLabelTh, nextRound.marketLabelLo)}
                </h3>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  {t('countdown.closesAt')} {formatTime(nextRound.closeTime)}
                </p>
              </div>

              <CountdownTimer targetTime={nextRound.closeTime} onExpire={onCountdownExpire} />
            </div>

            {/* Session progress bar */}
            <SessionProgressBar targetTime={nextRound.closeTime} />

            {/* Simulated volume bars */}
            <VolumeBars market={nextRound.market} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center relative z-10">
            <p className="text-sm text-[var(--text-muted)]">{t('common.noData')}</p>
          </div>
        )}
      </div>
    </div>
  );
}
