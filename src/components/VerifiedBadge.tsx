'use client';

import { useState, useRef, useEffect, useCallback } from 'react';

interface VerifiedBadgeProps {
  hash: string;
  method?: 'auto' | 'manual' | 'stock_ref' | null;
}

export default function VerifiedBadge({ hash, method }: VerifiedBadgeProps) {
  const [showFull, setShowFull] = useState(false);
  const [openAbove, setOpenAbove] = useState(true);
  const ref = useRef<HTMLSpanElement>(null);
  const shortHash = hash.slice(0, 8);

  const methodLabel = method === 'stock_ref'
    ? 'Stock Ref'
    : method === 'auto'
    ? 'Provably Fair'
    : 'Manual';

  const methodColor = method === 'stock_ref'
    ? 'text-blue-400'
    : method === 'auto'
    ? 'text-emerald-400'
    : 'text-[var(--text-muted)]';

  const handleToggle = useCallback(() => {
    if (!showFull && ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setOpenAbove(rect.top >= 80);
    }
    setShowFull(prev => !prev);
  }, [showFull]);

  useEffect(() => {
    if (!showFull) return;
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShowFull(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showFull]);

  const tooltipPosition = openAbove
    ? 'bottom-full mb-1'
    : 'top-full mt-1';

  return (
    <span className="relative inline-flex items-center gap-1" ref={ref}>
      <button
        type="button"
        onClick={handleToggle}
        aria-expanded={showFull}
        className="inline-flex items-center gap-0.5 text-[9px] text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors font-[family-name:var(--font-mono)] cursor-pointer"
        title={`${methodLabel} — ${hash}`}
      >
        <svg className="w-2.5 h-2.5 text-emerald-500 shrink-0" viewBox="0 0 16 16" fill="currentColor">
          <path fillRule="evenodd" d="M8 0a4 4 0 0 0-1.5.3A4 4 0 0 0 4.1 1.5 4 4 0 0 0 2.4 3 4 4 0 0 0 .3 6.5 4 4 0 0 0 0 8a4 4 0 0 0 .3 1.5A4 4 0 0 0 1.5 11.9a4 4 0 0 0 1.5 1.7A4 4 0 0 0 6.5 15.7 4 4 0 0 0 8 16a4 4 0 0 0 1.5-.3 4 4 0 0 0 2.4-1.2 4 4 0 0 0 1.7-1.5A4 4 0 0 0 15.7 9.5 4 4 0 0 0 16 8a4 4 0 0 0-.3-1.5A4 4 0 0 0 14.5 4.1a4 4 0 0 0-1.5-1.7A4 4 0 0 0 9.5.3 4 4 0 0 0 8 0zm3.7 6.3a.75.75 0 0 0-1-1.1L7.2 8.7 5.3 6.8a.75.75 0 0 0-1.1 1.1l2.5 2.5a.75.75 0 0 0 1.1 0l4-3.9z" clipRule="evenodd"/>
        </svg>
        <span>{shortHash}</span>
      </button>

      {showFull && (
        <span className={`absolute ${tooltipPosition} left-0 z-50 bg-[var(--bg-card)] border border-[var(--border)] rounded px-2 py-1.5 shadow-lg max-w-[90vw]`}>
          <span className={`block text-[9px] font-medium ${methodColor} mb-0.5 whitespace-nowrap`}>{methodLabel}</span>
          <span className="block text-[9px] text-[var(--text-secondary)] font-[family-name:var(--font-mono)] select-all break-all">{hash}</span>
        </span>
      )}
    </span>
  );
}
