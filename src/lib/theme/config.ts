import type { BrandConfig } from '@/types';

export function getBrandConfig(): BrandConfig {
  const brand = (process.env.NEXT_PUBLIC_BRAND || 'vvip') as 'vvip' | 'platinum';

  if (brand === 'platinum') {
    return {
      brand: 'platinum',
      theme: 'platinum',
      siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Stock Platinums',
      siteNameTh: process.env.NEXT_PUBLIC_SITE_NAME_TH || 'หวยหุ้น แพลทินัม',
      domain: process.env.NEXT_PUBLIC_DOMAIN || 'stockplatinums.com',
      lineUrl: process.env.NEXT_PUBLIC_LINE_URL || '#',
      logoText: 'PLT',
    };
  }

  return {
    brand: 'vvip',
    theme: 'gold',
    siteName: process.env.NEXT_PUBLIC_SITE_NAME || 'Stock VVIP',
    siteNameTh: process.env.NEXT_PUBLIC_SITE_NAME_TH || 'หวยหุ้น VVIP',
    domain: process.env.NEXT_PUBLIC_DOMAIN || 'stockvvip.com',
    lineUrl: process.env.NEXT_PUBLIC_LINE_URL || '#',
    logoText: 'VVIP',
  };
}
