import type { MetadataRoute } from 'next';
import { getBrandConfig } from '@/lib/theme/config';

export default function manifest(): MetadataRoute.Manifest {
  const config = getBrandConfig();

  return {
    name: config.siteNameTh,
    short_name: config.siteName,
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0e14',
    theme_color: config.brand === 'platinum' ? '#00c2c7' : '#d4a829',
    icons: [
      {
        src: `/images/logo-${config.brand}.png`,
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
