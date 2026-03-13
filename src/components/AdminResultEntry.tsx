'use client';

import { useState } from 'react';
import type { Market } from '@/types';

interface AdminResultEntryProps {
  market: Market;
  savedNumber?: string;
  savedNumber2d?: string;
  status: 'pending' | 'saving' | 'saved' | 'error';
  onSave: (winningNumber: string, winningNumber2d: string) => void;
}

export default function AdminResultEntry({
  market,
  savedNumber,
  savedNumber2d,
  status,
  onSave,
}: AdminResultEntryProps) {
  const [number, setNumber] = useState(savedNumber || '');
  const [number2d, setNumber2d] = useState(savedNumber2d || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isValid) {
      onSave(number, number2d);
    }
  };

  const isValid =
    /^\d{3}$/.test(number) && /^\d{2}$/.test(number2d);

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-4 flex items-center gap-3">
      {/* Market info */}
      <div className="w-10 h-10 rounded-lg bg-[var(--bg-secondary)] flex items-center justify-center text-xl shrink-0">
        {market.flagEmoji}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-[var(--text-primary)] truncate">
          {market.labelTh}
        </div>
        <div className="text-[11px] text-[var(--text-muted)]">
          ปิดรับ: {market.closeTime} น.
        </div>
      </div>

      {/* Input + Save */}
      <form onSubmit={handleSubmit} className="flex items-center gap-2 shrink-0">
        <input
          type="text"
          value={number}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 3);
            setNumber(val);
          }}
          placeholder="000"
          maxLength={3}
          className="w-[72px] bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-center font-mono text-lg text-[var(--brand-light)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
          disabled={status === 'saving' || status === 'saved'}
          title="3 ตัวบน"
        />
        <input
          type="text"
          value={number2d}
          onChange={(e) => {
            const val = e.target.value.replace(/\D/g, '').slice(0, 2);
            setNumber2d(val);
          }}
          placeholder="00"
          maxLength={2}
          className="w-[56px] bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-3 py-2 text-center font-mono text-lg text-[var(--brand-light)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors"
          disabled={status === 'saving' || status === 'saved'}
          title="2 ตัวล่าง"
        />
        <button
          type="submit"
          disabled={!isValid || status === 'saving' || status === 'saved'}
          className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
            status === 'saved'
              ? 'bg-[rgba(46,204,113,0.15)] text-[var(--accent-green)] border border-[rgba(46,204,113,0.3)]'
              : status === 'error'
                ? 'bg-[rgba(231,76,60,0.15)] text-[var(--accent-red)] border border-[rgba(231,76,60,0.3)]'
                : status === 'saving'
                  ? 'bg-[var(--bg-secondary)] text-[var(--text-muted)] border border-[var(--border)]'
                  : 'bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-light)] text-[var(--bg-primary)] disabled:opacity-40'
          }`}
        >
          {status === 'saved' ? '&#x2713;' : status === 'saving' ? '...' : status === 'error' ? '&#x2717;' : 'บันทึก'}
        </button>
      </form>
    </div>
  );
}
