'use client';

import { useState, useMemo } from 'react';

interface TradingViewChartProps {
  symbol: string;
  interval?: string;
  height?: number;
  hideSideToolbar?: boolean;
}

export default function TradingViewChart({ symbol, interval = '15', height = 420, hideSideToolbar = false }: TradingViewChartProps) {
  const [loaded, setLoaded] = useState(false);

  const iframeUrl = useMemo(() => {
    const params = new URLSearchParams({
      symbol,
      interval,
      hide_top_toolbar: '0',
      hide_legend: '0',
      hide_volume: '0',
      hide_side_toolbar: hideSideToolbar ? '1' : '0',
      withdateranges: '1',
      style: '1',
      theme: 'dark',
      timezone: 'Asia/Bangkok',
      backgroundColor: 'rgba(11,14,20,1)',
      gridColor: 'rgba(42,46,57,0.3)',
      allow_symbol_change: '0',
      save_image: '0',
      details: '1',
      calendar: '0',
      locale: 'th_TH',
    });
    return `https://s.tradingview.com/widgetembed/?${params.toString()}`;
  }, [symbol, interval, hideSideToolbar]);

  return (
    <div className="relative w-full rounded overflow-hidden" style={{ height }} key={symbol}>
      {/* Loading skeleton */}
      {!loaded && (
        <div className="absolute inset-0 bg-[var(--bg-primary)] flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            {/* Fake chart skeleton */}
            <div className="w-full max-w-[280px] space-y-2 px-4">
              <div className="h-2 bg-[var(--border)] rounded animate-pulse w-3/4" />
              <div className="h-2 bg-[var(--border)] rounded animate-pulse w-full" />
              <div className="h-2 bg-[var(--border)] rounded animate-pulse w-5/6" />
              <div className="h-2 bg-[var(--border)] rounded animate-pulse w-2/3" />
              <div className="h-2 bg-[var(--border)] rounded animate-pulse w-4/5" />
            </div>
            <span className="text-[10px] text-[var(--text-muted)] font-[family-name:var(--font-mono)]">
              Loading chart...
            </span>
          </div>
        </div>
      )}
      <iframe
        src={iframeUrl}
        width="100%"
        height={height}
        frameBorder="0"
        allowTransparency
        sandbox="allow-scripts allow-same-origin"
        referrerPolicy="no-referrer"
        onLoad={() => setLoaded(true)}
        className="block"
      />
    </div>
  );
}
