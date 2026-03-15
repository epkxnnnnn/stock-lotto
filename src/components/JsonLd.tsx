import { getBrandConfig } from '@/lib/theme/config';

interface BreadcrumbItem {
  name: string;
  href: string;
}

interface JsonLdProps {
  breadcrumbs?: BreadcrumbItem[];
  faq?: { question: string; answer: string }[];
}

export default function JsonLd({ breadcrumbs, faq }: JsonLdProps) {
  const config = getBrandConfig();
  const baseUrl = `https://${config.domain}`;

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.siteNameTh,
    url: baseUrl,
    description:
      config.brand === 'platinum'
        ? `${config.siteNameTh} ผลหวยหุ้นแพลทินัม 15 รอบต่อวัน ตรวจผลหวยหุ้นออนไลน์ อัพเดทเรียลไทม์`
        : `${config.siteNameTh} ผลหวยหุ้น VVIP 13 รอบต่อวัน ตรวจผลหวยหุ้นออนไลน์ อัพเดทเรียลไทม์`,
    inLanguage: ['th', 'lo'],
    publisher: {
      '@type': 'Organization',
      name: config.siteName,
      url: baseUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/images/logo-${config.brand}.png`,
      },
    },
  };

  const breadcrumbSchema = breadcrumbs
    ? {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: `${baseUrl}${item.href}`,
        })),
      }
    : null;

  const faqSchema =
    faq && faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : null;

  // All JSON-LD content is generated server-side from hardcoded config values.
  // No user input is involved — safe for inline script injection.
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {breadcrumbSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
