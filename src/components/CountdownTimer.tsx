'use client';

import { useEffect, useState } from 'react';
import { useI18n } from '@/lib/i18n';

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
  const { t } = useI18n();

  useEffect(() => {
    let fired = false;
    const interval = setInterval(() => {
      const tl = getTimeLeft(targetTime);
      setTime(tl);
      if (tl.expired) {
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
    <div className="flex justify-center gap-2">
      {[
        { value: time.hours, label: t('countdown.hours') },
        { value: time.minutes, label: t('countdown.minutes') },
        { value: time.seconds, label: t('countdown.seconds') },
      ].map((item) => (
        <div
          key={item.label}
          className="bg-[var(--bg-primary)] border border-[var(--border)] rounded min-w-[52px] px-2 py-2 md:min-w-[64px] md:px-3 md:py-3 text-center"
        >
          <div className="font-[family-name:var(--font-mono)] text-xl md:text-2xl font-bold text-[var(--brand-light)] leading-none tabular-nums">
            {pad(item.value)}
          </div>
          <div className="text-[9px] md:text-[10px] text-[var(--text-muted)] mt-1 tracking-wider uppercase">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
