'use client';

import Link from 'next/link';
import { getBrandConfig } from '@/lib/theme/config';
import { useI18n } from '@/lib/i18n';

const config = getBrandConfig();

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="mt-8 py-5 border-t border-[var(--border)] bg-[var(--bg-card)]">
      <div className="max-w-[1400px] mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
        <p className="text-xs text-[var(--text-muted)]">
          &copy; 2026 {config.siteName.toUpperCase()} &mdash; {config.siteNameTh}
        </p>
        <nav className="flex gap-4 text-xs text-[var(--text-muted)]">
          <Link href="/results" className="hover:text-[var(--text-secondary)] transition-colors">
            {t('nav.results')}
          </Link>
          <Link href="/schedule" className="hover:text-[var(--text-secondary)] transition-colors">
            {t('nav.schedule')}
          </Link>
          <Link href="/rates" className="hover:text-[var(--text-secondary)] transition-colors">
            {t('nav.rates')}
          </Link>
          <Link href="/about" className="hover:text-[var(--text-secondary)] transition-colors">
            {t('nav.about')}
          </Link>
        </nav>
      </div>
    </footer>
  );
}
