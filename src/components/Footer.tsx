import { getBrandConfig } from '@/lib/theme/config';

export default function Footer() {
  const config = getBrandConfig();

  return (
    <footer className="mt-15 py-7.5 border-t border-[var(--border)] text-center">
      <div className="max-w-[1200px] mx-auto px-4 md:px-5">
        <p className="text-xs text-[var(--text-muted)] tracking-wider">
          &copy; 2026 {config.siteName.toUpperCase()} &mdash; {config.siteNameTh} &nbsp;|&nbsp; {config.domain}
        </p>
      </div>
    </footer>
  );
}
