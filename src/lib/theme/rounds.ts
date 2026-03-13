import type { Brand, Market } from '@/types';
import { vvipMarkets } from '@/config/markets-vvip';
import { platinumMarkets } from '@/config/markets-platinum';

export function getMarkets(brand: Brand): Market[] {
  return brand === 'platinum' ? platinumMarkets : vvipMarkets;
}
