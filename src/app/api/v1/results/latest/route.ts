import type { NextRequest } from 'next/server';
import { withApiAuth, apiResponse, apiError } from '@/lib/api/middleware';
import { createAdminClient } from '@/lib/supabase/admin';

interface ResultRow {
  source: string;
  market: string;
  [key: string]: unknown;
}

export const GET = withApiAuth(async (request: NextRequest, context) => {
  const supabase = createAdminClient();

  const source = request.nextUrl.searchParams.get('source');

  let query = supabase
    .from('stock_results')
    .select('*')
    .eq('status', 'resulted')
    .order('result_time', { ascending: false });

  if (source) {
    if (!context.allowedSources.includes(source)) {
      return apiError('Source not allowed for this API key', 403);
    }
    query = query.eq('source', source);
  } else {
    query = query.in('source', context.allowedSources);
  }

  const { data, error } = await query;

  if (error) {
    return apiError('Failed to fetch results', 500);
  }

  // Group by market, keep only latest per market
  const rows = (data ?? []) as ResultRow[];
  const latestByMarket = new Map<string, ResultRow>();
  for (const row of rows) {
    const key = `${row.source}-${row.market}`;
    if (!latestByMarket.has(key)) {
      latestByMarket.set(key, row);
    }
  }

  return apiResponse(Array.from(latestByMarket.values()));
});
