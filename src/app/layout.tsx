import type { Metadata } from 'next';
import { Prompt, Orbitron, Bebas_Neue } from 'next/font/google';
import { getBrandConfig } from '@/lib/theme/config';
import { getThemeCSSString } from '@/lib/theme/colors';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LineFloatButton from '@/components/LineFloatButton';
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

export const metadata: Metadata = {
  title: `${config.siteName} - ${config.siteNameTh}`,
  description: `${config.siteNameTh} ผลหวยหุ้น ออนไลน์ อัพเดทผลทุกรอบ`,
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
        <LineFloatButton />
      </body>
    </html>
  );
}
