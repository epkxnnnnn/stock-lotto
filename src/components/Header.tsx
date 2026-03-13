import Link from 'next/link';
import { getBrandConfig } from '@/lib/theme/config';

const LineSvg = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
  </svg>
);

export default function Header() {
  const config = getBrandConfig();

  return (
    <header className="py-5 border-b border-[var(--border)] relative">
      <div className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 w-[200px] h-[2px] bg-gradient-to-r from-transparent via-[var(--brand-primary)] to-transparent" />
      <div className="max-w-[1200px] mx-auto px-5">
        <div className="flex items-center justify-between max-md:flex-col max-md:gap-4">
          <Link href="/" className="flex items-center gap-3.5 no-underline">
            <div className="w-[52px] h-[52px] bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-light)] rounded-xl flex items-center justify-center font-heading text-[22px] text-[var(--bg-primary)] tracking-wider shadow-[0_4px_20px_var(--brand-glow)]">
              {config.logoText}
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
            <Link href="/rates" className="text-[var(--text-secondary)] text-sm font-medium px-4 py-2 rounded-lg transition-all hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/[0.08]">
              อัตราจ่าย
            </Link>
            <Link href="/about" className="text-[var(--text-secondary)] text-sm font-medium px-4 py-2 rounded-lg transition-all hover:text-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/[0.08]">
              เกี่ยวกับ
            </Link>
            <Link href="/line" className="bg-[#06c755] text-white font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 transition-all hover:bg-[#05b34a]">
              <LineSvg />
              LINE
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
