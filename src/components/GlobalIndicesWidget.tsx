'use client';

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n';

const INDICES = [
  { symbol: 'TVC:DJI', name: 'Dow Jones' },
  { symbol: 'TVC:NI225', name: 'Nikkei 225' },
  { symbol: 'TVC:HSI', name: 'Hang Seng' },
  { symbol: 'TVC:SHCOMP', name: 'Shanghai' },
  { symbol: 'TVC:KOSPI', name: 'KOSPI' },
  { symbol: 'INDEX:TAIEX', name: 'TAIEX' },
  { symbol: 'TVC:STI', name: 'STI' },
  { symbol: 'HOSE:VNINDEX', name: 'VN-Index' },
];

export default function GlobalIndicesWidget() {
  const widgetRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    if (!widgetRef.current) return;

    // Remove any previous script children
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
          name: 'Indices',
          originalName: 'Indices',
          symbols: INDICES.map((idx) => ({
            name: idx.symbol,
            displayName: idx.name,
          })),
        },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      colorTheme: 'dark',
      locale: 'th_TH',
      backgroundColor: 'rgba(0,0,0,0)',
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

      {/* TradingView Widget */}
      <div className="flex-1 relative min-h-[300px]">
        {/* Loading skeleton */}
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
