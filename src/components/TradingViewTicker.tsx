'use client';

import { useEffect, useRef, useState } from 'react';

const TICKER_SYMBOLS = [
  { proName: 'FOREXCOM:SPXUSD', title: 'S&P 500' },
  { proName: 'FOREXCOM:NSXUSD', title: 'US 100' },
  { proName: 'FX:EURUSD', title: 'EUR/USD' },
  { proName: 'BITSTAMP:BTCUSD', title: 'Bitcoin' },
  { proName: 'BITSTAMP:ETHUSD', title: 'Ethereum' },
  { proName: 'FOREXCOM:DJI', title: 'Dow Jones' },
  { proName: 'TVC:NI225', title: 'Nikkei 225' },
  { proName: 'TVC:HSI', title: 'Hang Seng' },
  { proName: 'OANDA:XAUUSD', title: 'Gold' },
];

export default function TradingViewTicker() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!widgetRef.current) return;

    const existing = widgetRef.current.querySelector('script');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js';
    script.async = true;
    script.onload = () => setLoaded(true);
    script.textContent = JSON.stringify({
      symbols: TICKER_SYMBOLS,
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'th_TH',
    });

    widgetRef.current.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="relative w-full rounded overflow-hidden mb-4" style={{ height: 78 }}>
      {!loaded && (
        <div className="absolute inset-0 bg-[var(--bg-card)] border border-[var(--border)] rounded flex items-center gap-6 px-4 z-10 overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5 min-w-[100px]">
              <div className="h-2.5 bg-[var(--border)] rounded animate-pulse w-16" />
              <div className="h-3 bg-[var(--border)] rounded animate-pulse w-20" />
            </div>
          ))}
        </div>
      )}
      <div ref={widgetRef} className="tradingview-widget-container h-full" />
    </div>
  );
}
