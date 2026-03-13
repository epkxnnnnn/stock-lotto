import type { NextRequest } from 'next/server';
import { withApiAuth, apiResponse, apiError } from '@/lib/api/middleware';
import { createAdminClient } from '@/lib/supabase/admin';

const MAX_DAYS = 30;
const DEFAULT_LIMIT = 50;
const MAX_LIMIT = 200;

export const GET = withApiAuth(async (request: NextRequest, context) => {
  const supabase = createAdminClient();

  const source = request.nextUrl.searchParams.get('source');
  const market = request.nextUrl.searchParams.get('market');
  const page = Math.max(1, parseInt(request.nextUrl.searchParams.get('page') || '1', 10));
  const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(request.nextUrl.searchParams.get('limit') || String(DEFAULT_LIMIT), 10)));

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - MAX_DAYS);
  const minDate = thirtyDaysAgo.toISOString().split('T')[0];

  let query = supabase
    .from('stock_results')
    .select('*', { count: 'exact' })
    .gte('round_date', minDate)
    .eq('status', 'resulted')
    .order('round_date', { ascending: false })
    .order('close_time', { ascending: true })
    .range((page - 1) * limit, page * limit - 1);

  if (source) {
    if (!context.allowedSources.includes(source)) {
      return apiError('Source not allowed for this API key', 403);
    }
    query = query.eq('source', source);
  } else {
    query = query.in('source', context.allowedSources);
  }

  if (market) {
    query = query.eq('market', market);
  }

  const { data, error, count } = await query;

  if (error) {
    return apiError('Failed to fetch results', 500);
  }

  return apiResponse({
    results: data,
    pagination: {
      page,
      limit,
      total: count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  });
});
