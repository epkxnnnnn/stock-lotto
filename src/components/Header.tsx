'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getBrandConfig } from '@/lib/theme/config';
import { useI18n } from '@/lib/i18n';

const config = getBrandConfig();

const navItems = [
  { href: '/', key: 'nav.home' },
  { href: '/results', key: 'nav.results' },
  { href: '/schedule', key: 'nav.schedule' },
  { href: '/verify', key: 'nav.verify' },
  { href: '/agent', key: 'nav.agent' },
  { href: '/about', key: 'nav.about' },
] as const;

export default function Header() {
  const { lang, setLang, t } = useI18n();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="h-14 md:h-16 bg-[var(--bg-card)] border-b border-[var(--border)] sticky top-0 z-50">
      <div className="max-w-[1400px] mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo + Brand */}
        <Link href="/" className="flex items-center gap-2.5 no-underline shrink-0">
          <div className="w-8 h-8 rounded overflow-hidden">
            <Image
              src={config.brand === 'vvip' ? '/images/logo-vvip.png' : '/images/logo-platinum.png'}
              alt={config.siteName}
              width={32}
              height={32}
              className="object-cover"
              priority
            />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm md:text-base font-semibold text-[var(--text-primary)] tracking-wide">
              {config.siteName.toUpperCase()}
            </span>
            <span className="text-[10px] text-[var(--text-muted)] hidden sm:inline">
              {config.siteNameTh}
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[var(--text-secondary)] text-[13px] font-medium px-3 py-1.5 rounded transition-colors hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/[0.08]"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>

        {/* Right: Language Toggle + Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {/* Language Toggle */}
          <div className="flex items-center rounded overflow-hidden border border-[var(--border)] text-xs">
            <button
              onClick={() => setLang('th')}
              className={`px-2.5 py-1 font-medium transition-colors ${
                lang === 'th'
                  ? 'bg-[var(--brand-primary)] text-[var(--bg-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              TH
            </button>
            <button
              onClick={() => setLang('lo')}
              className={`px-2.5 py-1 font-medium transition-colors ${
                lang === 'lo'
                  ? 'bg-[var(--brand-primary)] text-[var(--bg-primary)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              LA
            </button>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden flex flex-col gap-1 p-1"
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-[var(--text-secondary)] transition-transform ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[var(--text-secondary)] transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-[var(--text-secondary)] transition-transform ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {mobileOpen && (
        <nav className="md:hidden bg-[var(--bg-card)] border-b border-[var(--border)] px-4 pb-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="block text-[var(--text-secondary)] text-sm font-medium py-2 px-2 rounded transition-colors hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/[0.08]"
            >
              {t(item.key)}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
