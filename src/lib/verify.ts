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
 * Uses HMAC-SHA256 so numbers are NOT predictable from the price alone.
 * Key = HMAC_SECRET from env, message = "stock-ref-v1|{source}|{market}|{roundDate}|{price}"
 * Bytes 0-1 → uint16 mod 1000 → 3-digit
 * Bytes 2-3 → uint16 mod 100 → 2-digit
 *
 * Different source (vvip vs platinum) → different numbers from the same price.
 * Without HMAC_SECRET, customers cannot reverse-engineer results from stock prices.
 */
export function deriveNumbersFromPrice(
  indexPrice: string,
  source: string,
  market: string,
  roundDate: string,
): { threeDigit: string; twoDigit: string } {
  const secret = process.env.HMAC_SECRET;
  if (!secret) {
    throw new Error('HMAC_SECRET is required for stock price derivation');
  }

  const message = `stock-ref-v1|${source}|${market}|${roundDate}|${indexPrice}`;
  const hmac = crypto.createHmac('sha256', secret).update(message).digest();

  const threeDigit = (hmac.readUInt16BE(0) % 1000).toString().padStart(3, '0');
  const twoDigit = (hmac.readUInt16BE(2) % 100).toString().padStart(2, '0');

  return { threeDigit, twoDigit };
}
