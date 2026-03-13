import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createToken, verifyToken } from '@/lib/anti-scrape/token';
import { encryptPayload } from '@/lib/anti-scrape/encrypt';
import { getGlyphMap, encodeNumber } from '@/lib/anti-scrape/font-map';
import { getBrandConfig } from '@/lib/theme/config';

export async function GET(request: NextRequest) {
  // Verify origin
  const origin = request.headers.get('origin') || '';
  const config = getBrandConfig();
  const allowedOrigins = [
    `https://${config.domain}`,
    'http://localhost:3000',
  ];

  if (!allowedOrigins.some((o) => origin.startsWith(o)) && origin !== '') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  // Verify token
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    // Issue a new token for session initialization
    const sessionId = crypto.randomUUID();
    const newToken = await createToken(sessionId);
    return NextResponse.json({ token: newToken });
  }

  const verification = await verifyToken(token);
  if (!verification.valid) {
    return NextResponse.json({ error: verification.error }, { status: 401 });
  }

  // Fetch results
  const { createAdminClient } = await import('@/lib/supabase/admin');
  const supabase = createAdminClient();
  const today = new Date().toISOString().split('T')[0];

  const { data: results } = await supabase
    .from('stock_results')
    .select('*')
    .eq('source', config.brand)
    .eq('round_date', today)
    .order('close_time', { ascending: true });

  // Apply glyph encoding
  const glyphMap = getGlyphMap();
  type ResultRow = Record<string, unknown>;
  const encodedResults = (results as ResultRow[] ?? []).map((r) => ({
    ...r,
    winning_number: r.winning_number ? encodeNumber(r.winning_number as string, glyphMap) : null,
    winning_number_2d: r.winning_number_2d ? encodeNumber(r.winning_number_2d as string, glyphMap) : null,
  }));

  // Encrypt the payload
  const encrypted = await encryptPayload({
    results: encodedResults,
    glyphSeed: glyphMap.seed,
    ts: Date.now(),
  });

  // Add honeypot fake numbers
  const honeypot = Array.from({ length: 3 }, () => ({
    id: crypto.randomUUID(),
    number: String(Math.floor(Math.random() * 1000)).padStart(3, '0'),
    _hp: true,
  }));

  const response = NextResponse.json({
    payload: encrypted,
    _d: honeypot,
  });

  response.headers.set('Access-Control-Allow-Origin', origin || allowedOrigins[0]);
  response.headers.set('Cache-Control', 'no-store, max-age=0');

  return response;
}
