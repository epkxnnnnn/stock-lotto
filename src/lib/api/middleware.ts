import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validateApiKey, logApiUsage, getClientIp } from './auth';

interface ApiContext {
  agentId: string;
  agentName: string;
  allowedSources: string[];
}

type ApiHandler = (
  request: NextRequest,
  context: ApiContext
) => Promise<NextResponse>;

export function withApiAuth(handler: ApiHandler) {
  return async (request: NextRequest) => {
    const auth = await validateApiKey(request);

    if (!auth.success) {
      const ip = getClientIp(request);
      await logApiUsage('00000000-0000-0000-0000-000000000000', request.nextUrl.pathname, ip, auth.status);
      return NextResponse.json(
        { success: false, error: auth.error },
        { status: auth.status }
      );
    }

    const ip = getClientIp(request);
    try {
      const response = await handler(request, {
        agentId: auth.agent.agentId,
        agentName: auth.agent.agentName,
        allowedSources: auth.agent.allowedSources,
      });

      const status = response.status;
      await logApiUsage(auth.agent.agentId, request.nextUrl.pathname, ip, status);
      return response;
    } catch {
      await logApiUsage(auth.agent.agentId, request.nextUrl.pathname, ip, 500);
      return NextResponse.json(
        { success: false, error: 'Internal server error' },
        { status: 500 }
      );
    }
  };
}

export function apiResponse<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function apiError(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}
