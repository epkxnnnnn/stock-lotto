/**
 * Static map from market code to TradingView symbol, Yahoo Finance symbol,
 * and human-readable index name.
 * Used for chart display, stock price fetching, and verification page — no DB dependency.
 *
 * chartInterval: override for TradingView embed interval (default '15').
 * Symbols under INDEX:/HOSE:/MOEX: only support D/W/M — use 'D' for those.
 * TVC: symbols support intraday intervals in the free embed widget.
 */

interface StockSymbolInfo {
  symbol: string;
  indexName: string;
  yahooSymbol: string;
  chartInterval?: string;
}

/**
 * Symbols use FOREXCOM: prefix where available — these reliably load
 * in the free TradingView embed widget. TVC:/INDEX:/HOSE: symbols
 * often show "This symbol is only available on TradingView" errors.
 *
 * chartInterval: some symbols only support daily ('D') in the embed.
 */
export const stockSymbols: Record<string, StockSymbolInfo> = {
  dow_jones: { symbol: 'FOREXCOM:DJI', indexName: 'Dow Jones', yahooSymbol: '^DJI' },
  nikkei_am: { symbol: 'FOREXCOM:NI225', indexName: 'Nikkei 225', yahooSymbol: '^N225' },
  nikkei_pm: { symbol: 'FOREXCOM:NI225', indexName: 'Nikkei 225', yahooSymbol: '^N225' },
  china_am: { symbol: 'SSE:000001', indexName: 'Shanghai Composite', yahooSymbol: '000001.SS', chartInterval: 'D' },
  china_pm: { symbol: 'SSE:000001', indexName: 'Shanghai Composite', yahooSymbol: '000001.SS', chartInterval: 'D' },
  hangseng_am: { symbol: 'FOREXCOM:HSI', indexName: 'Hang Seng', yahooSymbol: '^HSI' },
  hangseng_pm: { symbol: 'FOREXCOM:HSI', indexName: 'Hang Seng', yahooSymbol: '^HSI' },
  taiwan: { symbol: 'TWSE:TAIEX', indexName: 'TAIEX', yahooSymbol: '^TWII', chartInterval: 'D' },
  korea: { symbol: 'FOREXCOM:KOSPI', indexName: 'KOSPI', yahooSymbol: '^KS11' },
  singapore: { symbol: 'FOREXCOM:STI', indexName: 'Straits Times', yahooSymbol: '^STI' },
  vietnam_am: { symbol: 'HOSE:VNINDEX', indexName: 'VN-Index', yahooSymbol: '^VNINDEX', chartInterval: 'D' },
  vietnam_pm: { symbol: 'HOSE:VNINDEX', indexName: 'VN-Index', yahooSymbol: '^VNINDEX', chartInterval: 'D' },
  vietnam_eve: { symbol: 'HOSE:VNINDEX', indexName: 'VN-Index', yahooSymbol: '^VNINDEX', chartInterval: 'D' },
  russia: { symbol: 'MOEX:IMOEX', indexName: 'MOEX Russia', yahooSymbol: 'IMOEX.ME', chartInterval: 'D' },
  uk: { symbol: 'FOREXCOM:UKX', indexName: 'FTSE 100', yahooSymbol: '^FTSE' },
  germany: { symbol: 'FOREXCOM:DEU40', indexName: 'DAX', yahooSymbol: '^GDAXI' },
};

export function getStockSymbol(marketCode: string): StockSymbolInfo | null {
  return stockSymbols[marketCode] ?? null;
}
