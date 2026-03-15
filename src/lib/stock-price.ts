import { stockSymbols } from './stock-symbols';

/** Map TradingView symbols to Yahoo Finance symbols */
const yahooSymbolMap: Record<string, string> = {
  'TVC:DJI': '^DJI',
  'TVC:NI225': '^N225',
  'TVC:HSI': '^HSI',
  'SSE:000001': '000001.SS',
  'TWSE:TAIEX': '^TWII',
  'KRX:KOSPI': '^KS11',
  'TVC:STI': '^STI',
  'HOSE:VNINDEX': '^VNINDEX',
  'MOEX:IMOEX': 'IMOEX.ME',
  'TVC:UKX': '^FTSE',
  'XETR:DAX': '^GDAXI',
};

/**
 * Get Yahoo Finance symbol for a market code.
 * Looks up the TradingView symbol from stockSymbols, then maps to Yahoo.
 */
export function getYahooSymbol(marketCode: string): string | null {
  const entry = stockSymbols[marketCode];
  if (!entry) return null;
  return entry.yahooSymbol ?? yahooSymbolMap[entry.symbol] ?? null;
}

/**
 * Fetch current stock price from Yahoo Finance v8 chart endpoint.
 * Returns price as string (e.g. "38423.57") or null on failure.
 * 5-second timeout, never throws.
 */
export async function fetchStockPrice(
  yahooSymbol: string,
): Promise<{ price: string; timestamp: string } | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(yahooSymbol)}?interval=1m&range=1d`;
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; StockLotto/1.0)',
      },
    });
    clearTimeout(timeout);

    if (!res.ok) return null;

    const json = await res.json();
    const result = json?.chart?.result?.[0];
    if (!result) return null;

    const price = result.meta?.regularMarketPrice;
    if (price === undefined || price === null) return null;

    const marketTime = result.meta?.regularMarketTime;
    const timestamp = marketTime
      ? new Date(marketTime * 1000).toISOString()
      : new Date().toISOString();

    return { price: String(price), timestamp };
  } catch {
    return null;
  }
}

/**
 * Check if a date string (YYYY-MM-DD) falls on a weekday (Mon-Fri).
 * Uses UTC noon to avoid any timezone day-boundary issues.
 */
export function isWeekday(dateStr: string): boolean {
  const date = new Date(`${dateStr}T12:00:00Z`);
  const day = date.getUTCDay();
  return day >= 1 && day <= 5;
}
