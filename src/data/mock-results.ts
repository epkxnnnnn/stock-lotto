import type { Brand, StockResult } from '@/types';
import { vvipMarkets } from '@/config/markets-vvip';
import { platinumMarkets } from '@/config/markets-platinum';

const vvipNumbers = ['847', '512', '396', '270', '638', '154', '491', '725', '083', '942', '316', null, null];
const platinumNumbers = ['361', '578', '204', '892', '467', '135', '749', '023', '581', '694', '317', null, null, null, null];

function buildResults(brand: Brand): StockResult[] {
  const markets = brand === 'platinum' ? platinumMarkets : vvipMarkets;
  const numbers = brand === 'platinum' ? platinumNumbers : vvipNumbers;
  const today = new Date().toISOString().split('T')[0];

  return markets.map((market, i) => {
    const num = numbers[i] ?? null;
    const status = num ? 'resulted' as const : 'open' as const;

    return {
      id: `${brand}-${market.code}-${today}`,
      source: brand,
      market: market.code,
      marketLabelTh: market.labelTh,
      flagEmoji: market.flagEmoji,
      winningNumber: num,
      roundDate: today,
      closeTime: `${today}T${market.closeTime}:00+07:00`,
      resultTime: num ? `${today}T${market.closeTime}:00+07:00` : null,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  });
}

export function getMockResults(brand: Brand): StockResult[] {
  return buildResults(brand);
}

export function getMockNextRound(brand: Brand): StockResult | undefined {
  return buildResults(brand).find((r) => r.status === 'open');
}

export function getMockUpcomingRounds(brand: Brand): StockResult[] {
  return buildResults(brand).filter((r) => r.status === 'open');
}
