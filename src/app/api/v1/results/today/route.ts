import type { NextRequest } from 'next/server';
import { withApiAuth, apiResponse, apiError } from '@/lib/api/middleware';
import { createAdminClient } from '@/lib/supabase/admin';

export const GET = withApiAuth(async (request: NextRequest, context) => {
  const supabase = createAdminClient();

  const source = request.nextUrl.searchParams.get('source');
  const today = new Date().toISOString().split('T')[0];

  let query = supabase
    .from('stock_results')
    .select('*')
    .eq('round_date', today)
    .order('close_time', { ascending: true });

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

  return apiResponse(data);
});
