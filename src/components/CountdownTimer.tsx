'use client';

import { useEffect, useState, useRef } from 'react';
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
  const [flash, setFlash] = useState(false);
  const prevSeconds = useRef(time.seconds);
  const { t } = useI18n();

  useEffect(() => {
    let fired = false;
    const interval = setInterval(() => {
      const tl = getTimeLeft(targetTime);
      setTime(tl);

      // Flash on second change
      if (tl.seconds !== prevSeconds.current) {
        prevSeconds.current = tl.seconds;
        setFlash(true);
        setTimeout(() => setFlash(false), 300);
      }

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

  const isUrgent = !time.expired && time.hours === 0 && time.minutes < 5;

  return (
    <div className="flex justify-center gap-2">
      {[
        { value: time.hours, label: t('countdown.hours'), isSeconds: false },
        { value: time.minutes, label: t('countdown.minutes'), isSeconds: false },
        { value: time.seconds, label: t('countdown.seconds'), isSeconds: true },
      ].map((item) => (
        <div
          key={item.label}
          className="relative bg-[var(--bg-primary)] border rounded min-w-[52px] px-2 py-2 md:min-w-[64px] md:px-3 md:py-3 text-center overflow-hidden transition-all duration-300"
          style={{
            borderColor: isUrgent
              ? 'rgba(239,68,68,0.4)'
              : (item.isSeconds && flash ? 'var(--brand-primary)' : 'var(--border)'),
            boxShadow: item.isSeconds && flash
              ? '0 0 12px color-mix(in srgb, var(--brand-primary) 20%, transparent), inset 0 0 8px color-mix(in srgb, var(--brand-primary) 5%, transparent)'
              : isUrgent
                ? '0 0 8px rgba(239,68,68,0.15)'
                : 'none',
          }}
        >
          {/* Subtle gradient overlay on active digit */}
          {item.isSeconds && flash && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(circle at center, color-mix(in srgb, var(--brand-primary) 8%, transparent), transparent 70%)',
              }}
            />
          )}
          <div
            className="font-[family-name:var(--font-mono)] text-xl md:text-2xl font-bold leading-none tabular-nums relative z-10 transition-all duration-200"
            style={{
              color: isUrgent ? 'rgb(248,113,113)' : 'var(--brand-light)',
              textShadow: item.isSeconds && flash
                ? '0 0 10px var(--brand-primary)'
                : isUrgent
                  ? '0 0 6px rgba(239,68,68,0.5)'
                  : 'none',
              animation: item.isSeconds && flash ? 'digit-tick 0.4s ease-out' : 'none',
            }}
          >
            {pad(item.value)}
          </div>
          <div className="text-[9px] md:text-[10px] text-[var(--text-muted)] mt-1 tracking-wider uppercase relative z-10">
            {item.label}
          </div>
        </div>
      ))}
    </div>
  );
}
