import type { StockResult } from '@/types';
import CountdownTimer from './CountdownTimer';

interface HeroNextRoundProps {
  nextRound: StockResult | undefined;
  onCountdownExpire?: () => void;
}

export default function HeroNextRound({ nextRound, onCountdownExpire }: HeroNextRoundProps) {
  if (!nextRound) return null;

  return (
    <section className="py-10 pb-7.5 text-center">
      <div className="text-xs text-[var(--text-secondary)] tracking-[5px] uppercase mb-3">
        รอบถัดไป
      </div>
      <div className="font-heading text-4xl tracking-[2px] text-[var(--brand-light)] mb-2 flex items-center justify-center gap-3 max-md:text-[28px]">
        <span className="text-[32px]">{nextRound.flagEmoji}</span> {nextRound.marketLabelTh}
      </div>
      <CountdownTimer targetTime={nextRound.closeTime} onExpire={onCountdownExpire} />
      <div className="inline-flex items-center gap-2 bg-[rgba(46,204,113,0.1)] border border-[rgba(46,204,113,0.3)] px-4 py-1.5 rounded-full text-xs text-[var(--accent-green)] font-semibold mt-4 tracking-wider">
        <span className="w-2 h-2 bg-[var(--accent-green)] rounded-full animate-pulse" />
        LIVE &mdash; กำลังเปิดรับ
      </div>
    </section>
  );
}
