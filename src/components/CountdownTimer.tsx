'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetTime: string; // ISO timestamp
  onExpire?: () => void;
}

function getTimeLeft(target: string) {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };

  return {
    hours: Math.floor(diff / (1000 * 60 * 60)),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export default function CountdownTimer({ targetTime, onExpire }: CountdownTimerProps) {
  const [time, setTime] = useState(getTimeLeft(targetTime));

  useEffect(() => {
    let fired = false;
    const interval = setInterval(() => {
      const t = getTimeLeft(targetTime);
      setTime(t);
      if (t.expired) {
        clearInterval(interval);
        if (!fired && onExpire) {
          fired = true;
          onExpire();
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime, onExpire]);

  return (
    <div className="flex justify-center gap-3 mt-5">
      {[
        { value: time.hours, label: 'ชั่วโมง' },
        { value: time.minutes, label: 'นาที' },
        { value: time.seconds, label: 'วินาที' },
      ].map((item) => (
        <div
          key={item.label}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl px-5 py-4 min-w-[80px] text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[var(--brand-dark)] via-[var(--brand-accent)] to-[var(--brand-dark)]" />
          <div className="font-mono text-4xl font-bold text-[var(--brand-light)] leading-none max-md:text-[28px] tabular-nums">
            {pad(item.value)}
          </div>
          <div className="text-[11px] text-[var(--text-muted)] mt-1.5 tracking-[2px] uppercase">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
