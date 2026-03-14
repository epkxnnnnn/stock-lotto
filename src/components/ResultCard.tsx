import type { StockResult } from '@/types';
import NumberRenderer from './NumberRenderer';
import FlagIcon from './FlagIcon';

interface ResultCardProps {
  result: StockResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const isWaiting = !result.winningNumber;
  const closeDate = new Date(result.closeTime);
  const formattedClose = `${closeDate.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${closeDate.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false })}`;

  return (
    <div
      className={`bg-[var(--bg-card)] border rounded-[14px] px-3.5 py-3 md:px-5 md:py-[18px] min-h-[68px] md:min-h-[82px] flex items-center gap-2.5 md:gap-3.5 transition-all relative overflow-hidden group hover:bg-[var(--bg-card-hover)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] ${
        isWaiting
          ? 'border-dashed border-[var(--brand-primary)]/10'
          : 'border-[var(--border)] hover:border-[var(--brand-primary)]/30'
      }`}
    >
      <div
        className="absolute inset-0 bg-cover bg-center opacity-[0.06] group-hover:opacity-[0.12] transition-opacity pointer-events-none rounded-[14px]"
        style={{
          backgroundImage: `url('/images/card-frame-${result.source}.png')`,
        }}
      />
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[var(--brand-accent)] to-[var(--brand-dark)] opacity-0 transition-opacity group-hover:opacity-100" />

      <FlagIcon emoji={result.flagEmoji} size={36} />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-[var(--text-primary)] truncate">
            {result.marketLabelTh}
          </span>
          {isWaiting ? (
            <span className="shrink-0 bg-[rgba(46,204,113,0.15)] text-[var(--accent-green)] border border-[rgba(46,204,113,0.3)] text-[10px] px-1.5 py-0.5 rounded font-semibold">
              เปิดรับ
            </span>
          ) : (
            <span className="shrink-0 bg-[rgba(231,76,60,0.15)] text-[var(--accent-red)] border border-[rgba(231,76,60,0.3)] text-[10px] px-1.5 py-0.5 rounded font-semibold">
              ปิดรับแล้ว
            </span>
          )}
        </div>
        <div className="text-[11px] text-[var(--text-muted)]">
          ปิดรับ: {formattedClose}
        </div>
      </div>

      <div className="shrink-0 w-[90px] md:w-[110px] flex justify-end">
        {isWaiting ? (
          <span className="text-[var(--text-muted)] text-sm tracking-wider font-thai">
            รอผล...
          </span>
        ) : (
          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] text-[var(--text-muted)] font-thai">3 ตัวบน</span>
              <NumberRenderer number={result.winningNumber!} size="md" />
            </div>
            {result.winningNumber2d && (
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] text-[var(--text-muted)] font-thai">2 ตัวล่าง</span>
                <NumberRenderer number={result.winningNumber2d} size="sm" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
