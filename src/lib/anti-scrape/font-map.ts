/**
 * Font glyph shuffle mapping
 * Creates a mapping where DOM characters differ from visual characters
 * The custom font renders mapped glyphs — e.g., "3" in DOM shows as "7" visually
 * Mapping rotates daily based on a seed
 */

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return s / 0x7fffffff;
  };
}

function getDailySeed(): number {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

export interface GlyphMap {
  encode: Record<string, string>; // real digit -> DOM character
  decode: Record<string, string>; // DOM character -> real digit
  seed: number;
}

export function getGlyphMap(seed?: number): GlyphMap {
  const s = seed ?? getDailySeed();
  const random = seededRandom(s);
  const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
  const shuffled = [...digits];

  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const encode: Record<string, string> = {};
  const decode: Record<string, string> = {};

  digits.forEach((digit, i) => {
    encode[digit] = shuffled[i];
    decode[shuffled[i]] = digit;
  });

  return { encode, decode, seed: s };
}

export function encodeNumber(number: string, glyphMap: GlyphMap): string {
  return number
    .split('')
    .map((ch) => glyphMap.encode[ch] ?? ch)
    .join('');
}

export function decodeNumber(encoded: string, glyphMap: GlyphMap): string {
  return encoded
    .split('')
    .map((ch) => glyphMap.decode[ch] ?? ch)
    .join('');
}
