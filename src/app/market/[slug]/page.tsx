import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { getBrandConfig } from '@/lib/theme/config';
import { getMarkets } from '@/lib/theme/rounds';
import { getMarketBySlug, marketCodeToSlug, getRelatedMarkets } from '@/lib/market-utils';
import { getMarketDescription } from '@/config/market-descriptions';
import type { StockResult } from '@/types';
import MarketPageClient from './MarketPageClient';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

const config = getBrandConfig();

export async function generateStaticParams() {
  const markets = getMarkets(config.brand);
  return markets.map((m) => ({
    slug: marketCodeToSlug(m.code),
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const market = getMarketBySlug(config.brand, slug);
  if (!market) return { title: 'Not Found' };

  const desc = getMarketDescription(market.code);
  const baseUrl = `https://${config.domain}`;
  const title = `ผลหวยหุ้น${market.labelTh} วันนี้ — ${market.flagEmoji} ${market.stockIndex} | ${config.siteName}`;
  const description = desc
    ? `ตรวจผลหวยหุ้น${market.labelTh} (${market.stockIndex}) อัพเดทเรียลไทม์ ${desc.exchangeName} ${desc.exchangeCountry}`
    : `ตรวจผลหวยหุ้น${market.labelTh} (${market.stockIndex}) อัพเดทเรียลไทม์ | ${config.siteNameTh}`;

  const ogImage = `${baseUrl}/images/og-${config.brand}.png`;

  return {
    title,
    description,
    keywords: desc?.seoKeywords?.join(', '),
    openGraph: {
      title: `ผลหวยหุ้น${market.labelTh} — ${market.stockIndex}`,
      description,
      url: `${baseUrl}/market/${slug}`,
      siteName: config.siteName,
      type: 'article',
      locale: 'th_TH',
      images: [{ url: ogImage, width: 1200, height: 630, alt: `ผลหวยหุ้น${market.labelTh}` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `ผลหวยหุ้น${market.labelTh} — ${market.stockIndex}`,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `${baseUrl}/market/${slug}`,
    },
  };
}

function mapRow(r: Record<string, unknown>): StockResult {
  return {
    id: r.id as string,
    source: r.source as 'vvip' | 'platinum',
    market: r.market as string,
    marketLabelTh: r.market_label_th as string,
    marketLabelLo: (r.market_label_lo as string) ?? undefined,
    flagEmoji: r.flag_emoji as string,
    winningNumber: r.winning_number as string | null,
    winningNumber2d: (r.winning_number_2d as string | null) ?? null,
    roundDate: r.round_date as string,
    closeTime: r.close_time as string,
    resultTime: r.result_time as string | null,
    status: r.status as 'open' | 'closed' | 'resulted',
    generationMethod: (r.generation_method as 'auto' | 'manual' | 'stock_ref' | null) ?? null,
    resultHash: (r.result_hash as string | null) ?? null,
    referencePrice: (r.reference_price as string | null) ?? null,
    generationSeed: (r.generation_seed as string | null) ?? null,
    createdAt: r.created_at as string,
    updatedAt: r.updated_at as string,
  };
}

export default async function MarketPage({ params }: PageProps) {
  const { slug } = await params;
  const market = getMarketBySlug(config.brand, slug);
  if (!market) notFound();

  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
  const desc = getMarketDescription(market.code);
  const allMarkets = getMarkets(config.brand);

  // Resolve related markets
  const relatedMarkets = desc
    ? getRelatedMarkets(config.brand, market.code, desc.relatedMarkets)
    : [];

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  // Fetch today's result
  const { data: todayData } = await supabase
    .from('stock_results')
    .select('*')
    .eq('source', config.brand)
    .eq('market', market.code)
    .eq('round_date', today)
    .single();

  const todayResult: StockResult = todayData
    ? mapRow(todayData)
    : {
        id: `${config.brand}-${market.code}-${today}`,
        source: config.brand,
        market: market.code,
        marketLabelTh: market.labelTh,
        marketLabelLo: market.labelLo,
        flagEmoji: market.flagEmoji,
        winningNumber: null,
        winningNumber2d: null,
        roundDate: today,
        closeTime: `${today}T${market.closeTime}:00+07:00`,
        resultTime: null,
        status: 'open',
        generationMethod: null,
        resultHash: null,
        referencePrice: null,
        generationSeed: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

  // Fetch 30-day history
  const { data: historyData } = await supabase
    .from('stock_results')
    .select('*')
    .eq('source', config.brand)
    .eq('market', market.code)
    .not('winning_number', 'is', null)
    .order('round_date', { ascending: false })
    .limit(30);

  const history: StockResult[] = historyData ? historyData.map(mapRow) : [];

  const baseUrl = `https://${config.domain}`;

  // JSON-LD schemas — safe: all values from trusted server config, not user input
  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'หน้าแรก', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: `หวยหุ้น${market.labelTh}`, item: `${baseUrl}/market/${slug}` },
    ],
  };

  const webPageLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `ผลหวยหุ้น${market.labelTh} วันนี้`,
    description: desc
      ? `ตรวจผลหวยหุ้น${market.labelTh} (${market.stockIndex}) อัพเดทเรียลไทม์ ${desc.exchangeName}`
      : `ตรวจผลหวยหุ้น${market.labelTh} (${market.stockIndex})`,
    url: `${baseUrl}/market/${slug}`,
    inLanguage: 'th',
    dateModified: new Date().toISOString(),
    isPartOf: { '@type': 'WebSite', name: config.siteName, url: baseUrl },
  };

  const faqLd = desc?.faqTh?.length
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: desc.faqTh.map((faq) => ({
          '@type': 'Question',
          name: faq.q,
          acceptedAnswer: { '@type': 'Answer', text: faq.a },
        })),
      }
    : null;

  const jsonLdArray = [breadcrumbLd, webPageLd, ...(faqLd ? [faqLd] : [])];
  const jsonLdString = JSON.stringify(jsonLdArray);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdString }}
      />
      <MarketPageClient
        market={market}
        description={desc ?? null}
        todayResult={todayResult}
        history={history}
        brand={config.brand}
        today={today}
        relatedMarkets={relatedMarkets}
        allMarkets={allMarkets}
      />
    </>
  );
}
