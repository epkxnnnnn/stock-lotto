import { vvipMarkets } from '@/config/markets-vvip';
import { platinumMarkets } from '@/config/markets-platinum';
import type { Brand, Market } from '@/types';

export interface MappedMarket {
  source: Brand;
  code: string;
  labelTh: string;
  flagEmoji: string;
  closeTime: string;
  openTime: string;
}

/**
 * Build a lookup map from khongTemplateId → our market definition
 * Both VVIP and Platinum markets are included
 */
export function buildKhongToMarketMap(): Map<number, MappedMarket> {
  const map = new Map<number, MappedMarket>();

  const addMarkets = (markets: Market[], source: Brand) => {
    for (const m of markets) {
      map.set(m.khongTemplateId, {
        source,
        code: m.code,
        labelTh: m.labelTh,
        flagEmoji: m.flagEmoji,
        closeTime: m.closeTime,
        openTime: m.openTime,
      });
    }
  };

  addMarkets(vvipMarkets, 'vvip');
  addMarkets(platinumMarkets, 'platinum');

  return map;
}

/**
 * Get all khong template IDs we care about
 */
export function getAllTemplateIds(): number[] {
  return [
    ...vvipMarkets.map((m) => m.khongTemplateId),
    ...platinumMarkets.map((m) => m.khongTemplateId),
  ];
}
