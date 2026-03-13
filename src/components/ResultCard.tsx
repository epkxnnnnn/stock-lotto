import type { StockResult } from '@/types';
import NumberRenderer from './NumberRenderer';

interface ResultCardProps {
  result: StockResult;
}

export default function ResultCard({ result }: ResultCardProps) {
  const isWaiting = !result.winningNumber;
  const closeDate = new Date(result.closeTime);
  const formattedClose = `${closeDate.toLocaleDateString('th-TH', { day: '2-digit', month: '2-digit', year: 'numeric' })} ${closeDate.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', hour12: false })}`;

  return (
    <div
      className={`bg-[var(--bg-card)] border rounded-[14px] px-5 py-[18px] flex items-center gap-3.5 transition-all relative overflow-hidden group hover:bg-[var(--bg-card-hover)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] ${
        isWaiting
          ? 'border-dashed border-[var(--brand-primary)]/10'
          : 'border-[var(--border)] hover:border-[var(--brand-primary)]/30'
      }`}
    >
      <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[var(--brand-accent)] to-[var(--brand-dark)] opacity-0 transition-opacity group-hover:opacity-100" />

      <span className="absolute top-2.5 right-3 text-[10px] px-2 py-0.5 rounded font-semibold tracking-wider">
        {isWaiting ? (
          <span className="bg-[rgba(46,204,113,0.15)] text-[var(--accent-green)] border border-[rgba(46,204,113,0.3)] px-2 py-0.5 rounded">
            เปิดรับ
          </span>
        ) : (
          <span className="bg-[rgba(231,76,60,0.15)] text-[var(--accent-red)] border border-[rgba(231,76,60,0.3)] px-2 py-0.5 rounded">
            ปิดรับแล้ว
          </span>
        )}
      </span>

      <div className="w-11 h-11 rounded-[10px] bg-[var(--bg-secondary)] flex items-center justify-center text-[26px] shrink-0">
        {result.flagEmoji}
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-[var(--text-primary)] truncate">
          {result.marketLabelTh}
        </div>
        <div className="text-[11px] text-[var(--text-muted)]">
          ปิดรับ: {formattedClose}
        </div>
      </div>

      {isWaiting ? (
        <span className="text-[var(--text-muted)] text-sm tracking-wider font-thai">
          รอผล...
        </span>
      ) : (
        <NumberRenderer number={result.winningNumber!} />
      )}
    </div>
  );
}
