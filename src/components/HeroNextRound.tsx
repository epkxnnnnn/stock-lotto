import type { StockResult } from '@/types';
import { getBrandConfig } from '@/lib/theme/config';
import CountdownTimer from './CountdownTimer';
import FlagIcon from './FlagIcon';

interface HeroNextRoundProps {
  nextRound: StockResult | undefined;
  onCountdownExpire?: () => void;
}

export default function HeroNextRound({ nextRound, onCountdownExpire }: HeroNextRoundProps) {
  const config = getBrandConfig();

  if (!nextRound) return null;

  return (
    <section className="py-6 pb-5 md:py-10 md:pb-7.5 text-center relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none"
        style={{
          backgroundImage: `url('/images/hero-bg-${config.brand}.png')`,
        }}
      />
      <div className="relative">
        <div className="text-xs text-[var(--text-secondary)] tracking-[5px] uppercase mb-3">
          รอบถัดไป
        </div>
        <div className="font-heading text-2xl md:text-4xl tracking-[2px] text-[var(--brand-light)] mb-2 flex items-center justify-center gap-3">
          <FlagIcon emoji={nextRound.flagEmoji} size={28} /> {nextRound.marketLabelTh}
        </div>
        <CountdownTimer targetTime={nextRound.closeTime} onExpire={onCountdownExpire} />
        <div className="inline-flex items-center gap-2 bg-[rgba(46,204,113,0.1)] border border-[rgba(46,204,113,0.3)] px-4 py-1.5 rounded-full text-xs text-[var(--accent-green)] font-semibold mt-4 tracking-wider">
          <span className="w-2 h-2 bg-[var(--accent-green)] rounded-full animate-pulse" />
          LIVE &mdash; กำลังเปิดรับ
        </div>
      </div>
    </section>
  );
}
