'use client';

interface NumberRendererProps {
  number: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Anti-scrape number renderer (Layer 1)
 * - Each digit rendered as SVG path (not text in DOM)
 * - Randomized class names per render
 * - Honeypot hidden digits to poison scrapers
 * - No accessible text content contains actual numbers
 */

// SVG path data for digits 0-9 (simplified seven-segment style)
const DIGIT_PATHS: Record<string, string> = {
  '0': 'M4 2h12a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm2 4v12h8V6H6z',
  '1': 'M8 2h4v18h4v2H4v-2h4V6L6 8V5.5L8 2z',
  '2': 'M4 2h12a2 2 0 012 2v6a2 2 0 01-2 2H6v4h12v2a2 2 0 01-2 2H4a2 2 0 01-2-2v-2h12v-4H4a2 2 0 01-2-2V4a2 2 0 012-2zm2 4v4h8V6H6z',
  '3': 'M4 2h12a2 2 0 012 2v16a2 2 0 01-2 2H4v-2h12v-6H8v-2h8V6H4V4a2 2 0 012-2z',
  '4': 'M4 2v10h8v10h4V2h-4v8H6V2H4z',
  '5': 'M18 2H4v10h12a2 2 0 012 2v4a2 2 0 01-2 2H4v2h12a4 4 0 004-4v-4a4 4 0 00-4-4H6V4h12V2z',
  '6': 'M16 2H4a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2H6V6h12V4a2 2 0 00-2-2zM6 14h8v6H6v-6z',
  '7': 'M4 2h14v2L8 22H5L15 6H4V2z',
  '8': 'M4 2h12a2 2 0 012 2v16a2 2 0 01-2 2H4a2 2 0 01-2-2V4a2 2 0 012-2zm2 4v4h8V6H6zm0 8v6h8v-6H6z',
  '9': 'M4 2h12a2 2 0 012 2v6a2 2 0 01-2 2H6v6H4V2h2zm2 4v4h8V6H6z',
};

const SIZES = {
  sm: { width: 16, height: 20, viewBox: '0 0 20 24', gap: 'gap-0.5' },
  md: { width: 22, height: 28, viewBox: '0 0 20 24', gap: 'gap-1' },
  lg: { width: 32, height: 40, viewBox: '0 0 20 24', gap: 'gap-1.5' },
};

function randomClass(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function randomDigit(): string {
  return Math.floor(Math.random() * 10).toString();
}

export default function NumberRenderer({ number, size = 'md' }: NumberRendererProps) {
  const digits = number.split('');
  const sizeConfig = SIZES[size];

  return (
    <span className={`inline-flex items-center ${sizeConfig.gap} relative`} aria-hidden="true">
      {/* Honeypot: hidden fake numbers to poison scrapers */}
      <span
        className="absolute opacity-0 pointer-events-none select-none"
        style={{ position: 'absolute', left: '-9999px', fontSize: 0, lineHeight: 0 }}
        data-value={`${randomDigit()}${randomDigit()}${randomDigit()}`}
        aria-hidden="true"
      >
        {randomDigit()}{randomDigit()}{randomDigit()}
      </span>

      {digits.map((digit, i) => {
        const cls = randomClass();
        return (
          <svg
            key={i}
            className={cls}
            width={sizeConfig.width}
            height={sizeConfig.height}
            viewBox={sizeConfig.viewBox}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            data-r={randomClass()}
          >
            <path
              d={DIGIT_PATHS[digit] || DIGIT_PATHS['0']}
              fill="var(--brand-light)"
              className={randomClass()}
            />
          </svg>
        );
      })}

      {/* Another honeypot with different technique */}
      <span
        className={randomClass()}
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
      >
        {randomDigit()}{randomDigit()}{randomDigit()}
      </span>
    </span>
  );
}
