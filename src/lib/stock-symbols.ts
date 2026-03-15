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

export const stockSymbols: Record<string, StockSymbolInfo> = {
  dow_jones: { symbol: 'TVC:DJI', indexName: 'Dow Jones', yahooSymbol: '^DJI' },
  nikkei_am: { symbol: 'TVC:NI225', indexName: 'Nikkei 225', yahooSymbol: '^N225' },
  nikkei_pm: { symbol: 'TVC:NI225', indexName: 'Nikkei 225', yahooSymbol: '^N225' },
  china_am: { symbol: 'TVC:SHCOMP', indexName: 'Shanghai Composite', yahooSymbol: '000001.SS' },
  china_pm: { symbol: 'TVC:SHCOMP', indexName: 'Shanghai Composite', yahooSymbol: '000001.SS' },
  hangseng_am: { symbol: 'TVC:HSI', indexName: 'Hang Seng', yahooSymbol: '^HSI' },
  hangseng_pm: { symbol: 'TVC:HSI', indexName: 'Hang Seng', yahooSymbol: '^HSI' },
  taiwan: { symbol: 'INDEX:TAIEX', indexName: 'TAIEX', yahooSymbol: '^TWII', chartInterval: 'D' },
  korea: { symbol: 'TVC:KOSPI', indexName: 'KOSPI', yahooSymbol: '^KS11' },
  singapore: { symbol: 'TVC:STI', indexName: 'Straits Times', yahooSymbol: '^STI' },
  vietnam_am: { symbol: 'HOSE:VNINDEX', indexName: 'VN-Index', yahooSymbol: '^VNINDEX', chartInterval: 'D' },
  vietnam_pm: { symbol: 'HOSE:VNINDEX', indexName: 'VN-Index', yahooSymbol: '^VNINDEX', chartInterval: 'D' },
  vietnam_eve: { symbol: 'HOSE:VNINDEX', indexName: 'VN-Index', yahooSymbol: '^VNINDEX', chartInterval: 'D' },
  russia: { symbol: 'MOEX:IMOEX', indexName: 'MOEX Russia', yahooSymbol: 'IMOEX.ME', chartInterval: 'D' },
  uk: { symbol: 'TVC:UKX', indexName: 'FTSE 100', yahooSymbol: '^FTSE' },
  germany: { symbol: 'TVC:DEU40', indexName: 'DAX', yahooSymbol: '^GDAXI' },
};

export function getStockSymbol(marketCode: string): StockSymbolInfo | null {
  return stockSymbols[marketCode] ?? null;
}
