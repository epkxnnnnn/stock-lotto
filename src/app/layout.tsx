import type { Metadata } from 'next';
import { Inter, Noto_Sans_Thai, Noto_Sans_Lao, JetBrains_Mono } from 'next/font/google';
import { getBrandConfig } from '@/lib/theme/config';
import { getThemeCSSString } from '@/lib/theme/colors';
import Providers from '@/components/Providers';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BottomNav from '@/components/BottomNav';
import JsonLd from '@/components/JsonLd';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ['thai'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-thai',
  display: 'swap',
});

const notoSansLao = Noto_Sans_Lao({
  subsets: ['lao'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-lao',
  display: 'swap',
});

const jetBrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mono',
  display: 'swap',
});

const config = getBrandConfig();
const brand = config.brand;

// CSS variables are built from hardcoded theme constants only (no user input)
const themeStyleContent = `:root {
    ${getThemeCSSString(brand)}
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
    ? 'หวยหุ้นแพลทินัม, ผลหวยหุ้น, หวยหุ้นออนไลน์, Stock Platinums, ตรวจหวยหุ้น, หวยหุ้นวันนี้, ผลหวยหุ้นย้อนหลัง, ผลหวยหุ้นวันนี้, หวยหุ้นต่างประเทศ, หวยหุ้นดาวโจนส์, หวยหุ้นนิเคอิ, หวยหุ้นฮั่งเส็ง, หวยหุ้นจีน, ตรวจผลหวยหุ้นวันนี้, หวยหุ้นเรียลไทม์, ຫວຍຫຸ້ນ, ຜົນຫວຍຫຸ້ນ, ຫວຍຫຸ້ນອອນລາຍ, ກວດຫວຍຫຸ້ນ, ຫວຍຫຸ້ນວັນນີ້'
    : 'หวยหุ้น VVIP, ผลหวยหุ้น, หวยหุ้นออนไลน์, Stock VVIP, ตรวจหวยหุ้น, หวยหุ้นวันนี้, ผลหวยหุ้นย้อนหลัง, ผลหวยหุ้นวันนี้, หวยหุ้นต่างประเทศ, หวยหุ้นดาวโจนส์, หวยหุ้นนิเคอิ, หวยหุ้นฮั่งเส็ง, หวยหุ้นจีน, ตรวจผลหวยหุ้นวันนี้, หวยหุ้นเรียลไทม์, ຫວຍຫຸ້ນ, ຜົນຫວຍຫຸ້ນ, ຫວຍຫຸ້ນອອນລາຍ, ກວດຫວຍຫຸ້ນ, ຫວຍຫຸ້ນວັນນີ້';

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
  other: { 'theme-color': brand === 'platinum' ? '#00c2c7' : '#d4a829' },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // themeStyleContent is built from hardcoded constants only - safe for inline style
  return (
    <html lang="th">
      <head>
        <style
          dangerouslySetInnerHTML={{
            __html: themeStyleContent,
          }}
        />
        <JsonLd breadcrumbs={[{ name: 'หน้าแรก', href: '/' }]} />
      </head>
      <body
        className={`${inter.variable} ${notoSansThai.variable} ${notoSansLao.variable} ${jetBrainsMono.variable} font-[family-name:var(--font-sans)] antialiased`}
      >
        <Providers>
          <Header />
          <main className="container-main">{children}</main>
          <Footer />
          <BottomNav />
        </Providers>
      </body>
    </html>
  );
}
