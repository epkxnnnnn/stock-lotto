'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';

export default function TradingViewMarketQuotes() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    if (!widgetRef.current) return;

    const existing = widgetRef.current.querySelector('script');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js';
    script.async = true;
    script.onload = () => setLoaded(true);
    script.textContent = JSON.stringify({
      width: '100%',
      height: '100%',
      symbolsGroups: [
        {
          name: 'ตลาดสด',
          originalName: 'Forex',
          symbols: [
            { name: 'OANDA:XAUUSD', displayName: 'XAUUSD' },
            { name: 'FX:EURUSD', displayName: 'EURUSD' },
            { name: 'FX:GBPUSD', displayName: 'GBPUSD' },
            { name: 'FX:USDJPY', displayName: 'USDJPY' },
            { name: 'BINANCE:BTCUSDT', displayName: 'BTCUSD' },
          ],
        },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      colorTheme: 'dark',
      locale: 'th_TH',
    });

    widgetRef.current.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="panel overflow-hidden">
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          {t('stats.globalIndices')}
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] text-[var(--text-muted)] font-[family-name:var(--font-mono)]">
            {t('common.lastUpdate')}
          </span>
        </div>
      </div>
      <div className="relative" style={{ height: 180 }}>
        {!loaded && (
          <div className="absolute inset-0 flex items-center gap-4 px-4 z-10 overflow-hidden">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex-1 bg-[var(--bg-primary)] border border-[var(--border)] rounded p-3 space-y-2">
                <div className="h-2.5 bg-[var(--border)] rounded animate-pulse w-16" />
                <div className="h-4 bg-[var(--border)] rounded animate-pulse w-20" />
                <div className="h-2 bg-[var(--border)] rounded animate-pulse w-full" />
              </div>
            ))}
          </div>
        )}
        <div ref={widgetRef} className="tradingview-widget-container h-full" />
      </div>
    </div>
  );
}
