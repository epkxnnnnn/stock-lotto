/**
 * Static map from market code to TradingView symbol, Yahoo Finance symbol,
 * and human-readable index name.
 * Used for chart display, stock price fetching, and verification page — no DB dependency.
 */
export const stockSymbols: Record<string, { symbol: string; indexName: string; yahooSymbol: string }> = {
  dow_jones: { symbol: 'TVC:DJI', indexName: 'Dow Jones', yahooSymbol: '^DJI' },
  nikkei_am: { symbol: 'TVC:NI225', indexName: 'Nikkei 225', yahooSymbol: '^N225' },
  nikkei_pm: { symbol: 'TVC:NI225', indexName: 'Nikkei 225', yahooSymbol: '^N225' },
  china_am: { symbol: 'SSE:000001', indexName: 'Shanghai Composite', yahooSymbol: '000001.SS' },
  china_pm: { symbol: 'SSE:000001', indexName: 'Shanghai Composite', yahooSymbol: '000001.SS' },
  hangseng_am: { symbol: 'TVC:HSI', indexName: 'Hang Seng', yahooSymbol: '^HSI' },
  hangseng_pm: { symbol: 'TVC:HSI', indexName: 'Hang Seng', yahooSymbol: '^HSI' },
  taiwan: { symbol: 'TWSE:TAIEX', indexName: 'TAIEX', yahooSymbol: '^TWII' },
  korea: { symbol: 'KRX:KOSPI', indexName: 'KOSPI', yahooSymbol: '^KS11' },
  singapore: { symbol: 'TVC:STI', indexName: 'Straits Times', yahooSymbol: '^STI' },
  vietnam_am: { symbol: 'HOSE:VNINDEX', indexName: 'VN-Index', yahooSymbol: '^VNINDEX' },
  vietnam_pm: { symbol: 'HOSE:VNINDEX', indexName: 'VN-Index', yahooSymbol: '^VNINDEX' },
  vietnam_eve: { symbol: 'HOSE:VNINDEX', indexName: 'VN-Index', yahooSymbol: '^VNINDEX' },
  russia: { symbol: 'MOEX:IMOEX', indexName: 'MOEX Russia', yahooSymbol: 'IMOEX.ME' },
  uk: { symbol: 'TVC:UKX', indexName: 'FTSE 100', yahooSymbol: '^FTSE' },
  germany: { symbol: 'XETR:DAX', indexName: 'DAX', yahooSymbol: '^GDAXI' },
};

export function getStockSymbol(marketCode: string): { symbol: string; indexName: string; yahooSymbol: string } | null {
  return stockSymbols[marketCode] ?? null;
}
