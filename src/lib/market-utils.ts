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
