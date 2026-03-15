import crypto from 'crypto';

/**
 * Compute SHA-256 hash of result data for immutability proof.
 * payload = "source|market|roundDate|winningNumber|winningNumber2d|resultTime|referencePrice|seed"
 */
export function computeResultHash(params: {
  source: string;
  market: string;
  roundDate: string;
  winningNumber: string;
  winningNumber2d: string | null;
  resultTime: string;
  referencePrice?: string | null;
  seed?: string | null;
}): string {
  const payload = [
    params.source,
    params.market,
    params.roundDate,
    params.winningNumber,
    params.winningNumber2d ?? '',
    params.resultTime,
    params.referencePrice ?? '',
    params.seed ?? '',
  ].join('|');

  return crypto.createHash('sha256').update(payload).digest('hex');
}

/**
 * Derive winning numbers from a cryptographic seed (Provably Fair — weekends/holidays).
 * HMAC-SHA256: key = hex-decoded seed, message = "stock-lotto-v1|{source}|{market}|{roundDate}"
 * Bytes 0-1 → uint16 mod 1000 → 3-digit
 * Bytes 2-3 → uint16 mod 100 → 2-digit
 */
export function deriveNumbersFromSeed(
  seed: string,
  source: string,
  market: string,
  roundDate: string,
): { threeDigit: string; twoDigit: string } {
  const key = Buffer.from(seed, 'hex');
  const message = `stock-lotto-v1|${source}|${market}|${roundDate}`;
  const hmac = crypto.createHmac('sha256', key).update(message).digest();

  const threeDigit = (hmac.readUInt16BE(0) % 1000).toString().padStart(3, '0');
  const twoDigit = (hmac.readUInt16BE(2) % 100).toString().padStart(2, '0');

  return { threeDigit, twoDigit };
}

/**
 * Derive winning numbers from a real stock index price (weekdays).
 * Takes index value like "38423.57", returns:
 * 3-digit = last 3 digits of integer part ("423")
 * 2-digit = last 2 digits of integer part ("23")
 */
export function deriveNumbersFromPrice(indexPrice: string): { threeDigit: string; twoDigit: string } {
  const integerPart = indexPrice.split('.')[0].replace(/[^0-9]/g, '');
  const padded = integerPart.padStart(3, '0');

  const threeDigit = padded.slice(-3);
  const twoDigit = padded.slice(-2);

  return { threeDigit, twoDigit };
}
