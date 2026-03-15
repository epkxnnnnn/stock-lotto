import type { Brand, Market } from '@/types';
import { getMarkets } from '@/lib/theme/rounds';

export function marketCodeToSlug(code: string): string {
  return code.replace(/_/g, '-');
}

export function slugToMarketCode(slug: string): string {
  return slug.replace(/-/g, '_');
}

export function getMarketBySlug(brand: Brand, slug: string): Market | undefined {
  const code = slugToMarketCode(slug);
  return getMarkets(brand).find((m) => m.code === code);
}

export function getRelatedMarkets(brand: Brand, currentCode: string, relatedCodes: string[]): Market[] {
  const allMarkets = getMarkets(brand);
  return relatedCodes
    .filter((code) => code !== currentCode)
    .map((code) => allMarkets.find((m) => m.code === code))
    .filter((m): m is Market => m !== undefined);
}
