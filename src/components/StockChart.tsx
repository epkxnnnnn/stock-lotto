'use client';

interface StockChartProps {
  symbol: string;
  height?: number;
  width?: string;
}

export default function StockChart({ symbol, height = 200, width = '100%' }: StockChartProps) {
  const params = new URLSearchParams({
    symbol,
    interval: '5',
    theme: 'dark',
    style: '1',
    hide_top_toolbar: '1',
    hide_legend: '1',
    save_image: '0',
    hide_volume: '1',
    allow_symbol_change: '0',
    backgroundColor: 'rgba(11,14,20,1)',
    gridColor: 'rgba(42,46,57,0.3)',
    locale: 'th_TH',
  });
  const src = `https://s.tradingview.com/widgetembed/?${params.toString()}`;

  return (
    <div className="rounded overflow-hidden border border-[var(--border)] bg-[var(--bg-primary)]" style={{ width }}>
      <iframe
        src={src}
        height={height}
        style={{ width: '100%' }}
        frameBorder="0"
        allowTransparency
        loading="lazy"
        sandbox="allow-scripts allow-same-origin"
        referrerPolicy="no-referrer"
        title={`${symbol} chart`}
      />
    </div>
  );
}
