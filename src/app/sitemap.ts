import type { MetadataRoute } from 'next';
import { getBrandConfig } from '@/lib/theme/config';
import { getMarkets } from '@/lib/theme/rounds';
import { marketCodeToSlug } from '@/lib/market-utils';

export default function sitemap(): MetadataRoute.Sitemap {
  const config = getBrandConfig();
  const baseUrl = `https://${config.domain}`;

  const marketPages: MetadataRoute.Sitemap = getMarkets(config.brand).map((m) => ({
    url: `${baseUrl}/market/${marketCodeToSlug(m.code)}`,
    lastModified: new Date(),
    changeFrequency: 'hourly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/results`,
      lastModified: new Date(),
      changeFrequency: 'hourly',
      priority: 0.9,
    },
    ...marketPages,
    {
      url: `${baseUrl}/schedule`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/verify`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/agent`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.4,
    },
  ];
}
