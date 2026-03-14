import type { Metadata } from 'next';
import { Prompt, Orbitron, Bebas_Neue } from 'next/font/google';
import { getBrandConfig } from '@/lib/theme/config';
import { getThemeCSSString } from '@/lib/theme/colors';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import './globals.css';

const prompt = Prompt({
  subsets: ['thai', 'latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-thai',
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-mono',
  display: 'swap',
});

const bebasNeue = Bebas_Neue({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-heading',
  display: 'swap',
});

const config = getBrandConfig();
const brand = config.brand;

const bodyTexture =
  brand === 'platinum'
    ? `radial-gradient(ellipse at 30% 0%, rgba(126, 184, 224, 0.06) 0%, transparent 50%),
       radial-gradient(ellipse at 70% 100%, rgba(168, 180, 196, 0.04) 0%, transparent 50%),
       repeating-linear-gradient(90deg, transparent, transparent 120px, rgba(168, 180, 196, 0.015) 120px, rgba(168, 180, 196, 0.015) 121px)`
    : `radial-gradient(ellipse at 20% 0%, rgba(212, 168, 41, 0.08) 0%, transparent 50%),
       radial-gradient(ellipse at 80% 100%, rgba(212, 168, 41, 0.05) 0%, transparent 50%),
       repeating-linear-gradient(0deg, transparent, transparent 100px, rgba(212, 168, 41, 0.02) 100px, rgba(212, 168, 41, 0.02) 101px)`;

// CSS variables are built from hardcoded theme constants only (no user input)
const themeStyleContent = `:root {
    ${getThemeCSSString(brand)}
    --body-texture: ${bodyTexture};
  }`;

const faviconPath = brand === 'platinum' ? '/images/logo-platinum.png' : '/images/logo-vvip.png';
const ogImagePath = brand === 'platinum' ? '/images/og-platinum.png' : '/images/og-vvip.png';

const roundCount = brand === 'platinum' ? 15 : 13;
const siteDescription =
  brand === 'platinum'
    ? `${config.siteNameTh} ผลหวยหุ้นแพลทินัม ${roundCount} รอบต่อวัน ตรวจผลหวยหุ้นออนไลน์ อัพเดทเรียลไทม์ ครบทุกตลาดหุ้นทั่วโลก`
    : `${config.siteNameTh} ผลหวยหุ้น VVIP ${roundCount} รอบต่อวัน ตรวจผลหวยหุ้นออนไลน์ อัพเดทเรียลไทม์ ครบทุกตลาดหุ้นทั่วโลก`;
const siteKeywords =
  brand === 'platinum'
    ? 'หวยหุ้นแพลทินัม, ผลหวยหุ้น, หวยหุ้นออนไลน์, Stock Platinums, ตรวจหวยหุ้น, หวยหุ้นวันนี้, ผลหวยหุ้นย้อนหลัง'
    : 'หวยหุ้น VVIP, ผลหวยหุ้น, หวยหุ้นออนไลน์, Stock VVIP, ตรวจหวยหุ้น, หวยหุ้นวันนี้, ผลหวยหุ้นย้อนหลัง';

export const metadata: Metadata = {
  metadataBase: new URL(`https://${config.domain}`),
  title: {
    default: `${config.siteNameTh} — ผลหวยหุ้นออนไลน์ ${roundCount} รอบ อัพเดทเรียลไทม์ | ${config.siteName}`,
    template: `%s | ${config.siteName}`,
  },
  description: siteDescription,
  keywords: siteKeywords,
  icons: {
    icon: faviconPath,
    apple: faviconPath,
  },
  openGraph: {
    title: `${config.siteNameTh} — ผลหวยหุ้นออนไลน์ อัพเดทเรียลไทม์`,
    description: siteDescription,
    url: '/',
    siteName: config.siteName,
    locale: 'th_TH',
    type: 'website',
    images: [{ url: ogImagePath, width: 1200, height: 630, alt: `${config.siteNameTh} ผลหวยหุ้นออนไลน์` }],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${config.siteNameTh} — ผลหวยหุ้นออนไลน์ อัพเดทเรียลไทม์`,
    description: siteDescription,
    images: [ogImagePath],
  },
  alternates: { canonical: '/' },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  other: { 'theme-color': brand === 'platinum' ? '#a8b4c4' : '#d4a829' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: themeStyleContent,
          }}
        />
      </head>
      <body
        className={`${prompt.variable} ${orbitron.variable} ${bebasNeue.variable} font-[family-name:var(--font-thai)] antialiased`}
      >
        <Header />
        <main className="container-main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
