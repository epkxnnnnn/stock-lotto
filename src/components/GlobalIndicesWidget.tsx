'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';

export default function GlobalIndicesWidget() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    if (!widgetRef.current) return;

    const existing = widgetRef.current.querySelector('script');
    if (existing) existing.remove();

    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js';
    script.async = true;
    script.onload = () => setLoaded(true);
    script.textContent = JSON.stringify({
      colorTheme: 'dark',
      dateRange: '1D',
      showChart: true,
      locale: 'th_TH',
      largeChartUrl: '',
      isTransparent: true,
      showSymbolLogo: true,
      showFloatingTooltip: true,
      width: '100%',
      height: '100%',
      tabs: [
        {
          title: 'Indices',
          symbols: [
            { s: 'FOREXCOM:DJI', d: 'Dow Jones' },
            { s: 'FOREXCOM:NI225', d: 'Nikkei 225' },
            { s: 'HSI:HSI', d: 'Hang Seng' },
            { s: 'SSE:000001', d: 'Shanghai' },
            { s: 'KRX:KOSPI', d: 'KOSPI' },
            { s: 'TWSE:TAIEX', d: 'TAIEX' },
            { s: 'SGX:ES3', d: 'STI (ES3)' },
            { s: 'HOSE:VNINDEX', d: 'VN-Index' },
          ],
        },
        {
          title: 'Forex',
          symbols: [
            { s: 'FX:EURUSD', d: 'EUR/USD' },
            { s: 'FX:USDJPY', d: 'USD/JPY' },
            { s: 'FX:GBPUSD', d: 'GBP/USD' },
            { s: 'FX:USDTHB', d: 'USD/THB' },
            { s: 'FX:USDCNH', d: 'USD/CNH' },
            { s: 'FX:USDKRW', d: 'USD/KRW' },
          ],
        },
        {
          title: 'Crypto',
          symbols: [
            { s: 'BINANCE:BTCUSDT', d: 'Bitcoin' },
            { s: 'BINANCE:ETHUSDT', d: 'Ethereum' },
            { s: 'BINANCE:SOLUSDT', d: 'Solana' },
            { s: 'BINANCE:XRPUSDT', d: 'XRP' },
          ],
        },
      ],
    });

    widgetRef.current.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div className="panel overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          {t('stats.globalIndices')}
        </h3>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
          <span className="text-[10px] text-[var(--text-muted)]">LIVE</span>
        </div>
      </div>

      {/* TradingView Market Overview Widget */}
      <div className="flex-1 relative min-h-[420px]">
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="space-y-3 w-full px-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-[var(--border)] animate-pulse" />
                    <div className="h-3 w-20 bg-[var(--border)] rounded animate-pulse" />
                  </div>
                  <div className="h-3 w-16 bg-[var(--border)] rounded animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        )}
        <div ref={widgetRef} className="tradingview-widget-container h-full" />
      </div>
    </div>
  );
}
