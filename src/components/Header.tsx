import Link from 'next/link';
import Image from 'next/image';
import { getBrandConfig } from '@/lib/theme/config';

export default function Header() {
  const config = getBrandConfig();

  return (
    <header className="py-5 border-b border-[var(--border)] relative">
      <div className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-[200px] h-[2px] bg-gradient-to-r from-transparent via-[var(--brand-primary)] to-transparent" />
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="flex items-center justify-between max-md:flex-col max-md:gap-4">
          <Link href="/" className="flex items-center gap-3.5 no-underline">
            <div className="w-[52px] h-[52px] rounded-xl flex items-center justify-center shadow-[0_4px_20px_var(--brand-glow)] overflow-hidden relative">
              <Image
                src={config.brand === 'vvip' ? '/images/logo-vvip.png' : '/images/logo-platinum.png'}
                alt={config.siteName}
                width={52}
                height={52}
                className="object-cover"
                priority
              />
            </div>
            <div>
              <h1 className="font-heading text-[28px] tracking-[3px] leading-none gradient-text">
                {config.siteName.toUpperCase()}
              </h1>
              <span className="text-[11px] text-[var(--text-secondary)] tracking-[4px] uppercase">
                {config.siteNameTh}
              </span>
            </div>
          </Link>
          <nav className="flex gap-2 flex-wrap max-md:justify-center">
            <Link href="/" className="text-[var(--text-secondary)] text-sm font-medium px-4 py-2 rounded-lg transition-all hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/[0.08]">
              หน้าแรก
            </Link>
            <Link href="/results" className="text-[var(--text-secondary)] text-sm font-medium px-4 py-2 rounded-lg transition-all hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/[0.08]">
              ผลหวย
            </Link>
            <Link href="/schedule" className="text-[var(--text-secondary)] text-sm font-medium px-4 py-2 rounded-lg transition-all hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/[0.08]">
              ตารางเวลา
            </Link>
            <Link href="/rates" className="text-[var(--text-secondary)] text-sm font-medium px-4 py-2 rounded-lg transition-all hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/[0.08]">
              อัตราจ่าย
            </Link>
            <Link href="/agent" className="text-[var(--text-secondary)] text-sm font-medium px-4 py-2 rounded-lg transition-all hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/[0.08]">
              สมัครตัวแทน
            </Link>
            <Link href="/about" className="text-[var(--text-secondary)] text-sm font-medium px-4 py-2 rounded-lg transition-all hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/[0.08]">
              เกี่ยวกับ
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
