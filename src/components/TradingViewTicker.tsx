'use client';

import { useState, useMemo } from 'react';

const TICKER_SYMBOLS = [
  { proName: 'TVC:DJI', title: 'Dow Jones' },
  { proName: 'TVC:NI225', title: 'Nikkei 225' },
  { proName: 'TVC:HSI', title: 'Hang Seng' },
  { proName: 'TVC:SHCOMP', title: 'Shanghai' },
  { proName: 'INDEX:TAIEX', title: 'TAIEX' },
  { proName: 'TVC:KOSPI', title: 'KOSPI' },
  { proName: 'TVC:STI', title: 'Straits Times' },
  { proName: 'HOSE:VNINDEX', title: 'VN-Index' },
  { proName: 'MOEX:IMOEX', title: 'MOEX' },
  { proName: 'TVC:UKX', title: 'FTSE 100' },
  { proName: 'TVC:DEU40', title: 'DAX' },
];

export default function TradingViewTicker() {
  const [loaded, setLoaded] = useState(false);

  const iframeUrl = useMemo(() => {
    const config = {
      symbols: TICKER_SYMBOLS,
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: 'adaptive',
      colorTheme: 'dark',
      locale: 'th_TH',
    };
    return `https://s.tradingview.com/embed-widget/tickers/?${encodeURIComponent(JSON.stringify(config))}`;
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
      <iframe
        src={iframeUrl}
        width="100%"
        height={78}
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
