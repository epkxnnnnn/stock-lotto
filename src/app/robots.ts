import type { MetadataRoute } from 'next';
import { getBrandConfig } from '@/lib/theme/config';

export default function robots(): MetadataRoute.Robots {
  const config = getBrandConfig();

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/', '/api-docs'],
      },
    ],
    sitemap: `https://${config.domain}/sitemap.xml`,
  };
}
