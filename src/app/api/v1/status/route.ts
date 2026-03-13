import type { NextRequest } from 'next/server';
import { withApiAuth, apiResponse } from '@/lib/api/middleware';

export const GET = withApiAuth(async (_request: NextRequest, context) => {
  return apiResponse({
    status: 'ok',
    agent: context.agentName,
    allowedSources: context.allowedSources,
    timestamp: new Date().toISOString(),
  });
});
