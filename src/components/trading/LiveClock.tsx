'use client';

import { useState, useEffect } from 'react';

/** Live Bangkok time clock with pulsing green dot */
export default function LiveClock() {
  const [time, setTime] = useState('');

  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString('th-TH', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Bangkok',
      }));
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-[family-name:var(--font-mono)] text-[var(--text-muted)]">
      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)]" style={{ animation: 'pulse 2s infinite' }} />
      <span className="tabular-nums">{time}</span>
      <span className="text-[8px] opacity-60">ICT</span>
    </span>
  );
}
