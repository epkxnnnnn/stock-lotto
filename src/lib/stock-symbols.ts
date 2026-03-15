/**
 * Static map from market code to TradingView symbol and human-readable index name.
 * Used for chart display and verification page — no DB dependency.
 */
export const stockSymbols: Record<string, { symbol: string; indexName: string }> = {
  dow_jones: { symbol: 'TVC:DJI', indexName: 'Dow Jones' },
  nikkei_am: { symbol: 'TVC:NI225', indexName: 'Nikkei 225' },
  nikkei_pm: { symbol: 'TVC:NI225', indexName: 'Nikkei 225' },
  china_am: { symbol: 'SSE:000001', indexName: 'Shanghai Composite' },
  china_pm: { symbol: 'SSE:000001', indexName: 'Shanghai Composite' },
  hangseng_am: { symbol: 'TVC:HSI', indexName: 'Hang Seng' },
  hangseng_pm: { symbol: 'TVC:HSI', indexName: 'Hang Seng' },
  taiwan: { symbol: 'TWSE:TAIEX', indexName: 'TAIEX' },
  korea: { symbol: 'KRX:KOSPI', indexName: 'KOSPI' },
  singapore: { symbol: 'TVC:STI', indexName: 'Straits Times' },
  vietnam_am: { symbol: 'HOSE:VNINDEX', indexName: 'VN-Index' },
  vietnam_pm: { symbol: 'HOSE:VNINDEX', indexName: 'VN-Index' },
  vietnam_eve: { symbol: 'HOSE:VNINDEX', indexName: 'VN-Index' },
  russia: { symbol: 'MOEX:IMOEX', indexName: 'MOEX Russia' },
  uk: { symbol: 'TVC:UKX', indexName: 'FTSE 100' },
  germany: { symbol: 'XETR:DAX', indexName: 'DAX' },
};

export function getStockSymbol(marketCode: string): { symbol: string; indexName: string } | null {
  return stockSymbols[marketCode] ?? null;
}
