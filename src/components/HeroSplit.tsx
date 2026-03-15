'use client';

import { useState, useEffect, useCallback } from 'react';
import type { StockResult } from '@/types';
import FlagIcon from './FlagIcon';
import CountdownTimer from './CountdownTimer';
import TradingViewChart from './TradingViewChart';
import { useI18n } from '@/lib/i18n';
import { getStockSymbol, stockSymbols } from '@/lib/stock-symbols';

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

  // Derive TradingView symbol
  const stockInfo = getStockSymbol(selectedMarket);
  const tvSymbol = stockInfo?.symbol ?? 'TVC:DJI';

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
          height={chartHeight}
          hideSideToolbar={isMobile}
        />
      </div>

      {/* Right: Countdown Widget (3 cols) */}
      <div className="lg:col-span-3 panel p-4 flex flex-col">
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
