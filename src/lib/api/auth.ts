import { createAdminClient } from '@/lib/supabase/admin';
import type { NextRequest } from 'next/server';

interface AgentAuth {
  agentId: string;
  agentName: string;
  allowedSources: string[];
  rateLimit: number;
}

async function hashApiKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function validateApiKey(
  request: NextRequest
): Promise<{ success: true; agent: AgentAuth } | { success: false; error: string; status: number }> {
  const apiKey = request.headers.get('X-API-Key');
  if (!apiKey) {
    return { success: false, error: 'Missing X-API-Key header', status: 401 };
  }

  const hashedKey = await hashApiKey(apiKey);
  const supabase = createAdminClient();

  const { data: agent, error } = await supabase
    .from('agent_api_keys')
    .select('*')
    .eq('api_key', hashedKey)
    .eq('is_active', true)
    .single();

  if (error || !agent) {
    return { success: false, error: 'Invalid API key', status: 401 };
  }

  // IP whitelist check
  if (agent.allowed_ips && agent.allowed_ips.length > 0) {
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('cf-connecting-ip')
      || '0.0.0.0';
    if (!agent.allowed_ips.includes(clientIp)) {
      return { success: false, error: 'IP not whitelisted', status: 403 };
    }
  }

  // Rate limiting check
  const oneMinuteAgo = new Date(Date.now() - 60_000).toISOString();
  const { count } = await supabase
    .from('api_usage_logs')
    .select('*', { count: 'exact', head: true })
    .eq('agent_id', agent.id)
    .gte('created_at', oneMinuteAgo);

  if (count !== null && count >= agent.rate_limit) {
    return { success: false, error: 'Rate limit exceeded', status: 429 };
  }

  // Update last_used_at
  await supabase
    .from('agent_api_keys')
    .update({ last_used_at: new Date().toISOString() })
    .eq('id', agent.id);

  return {
    success: true,
    agent: {
      agentId: agent.id,
      agentName: agent.agent_name,
      allowedSources: agent.allowed_sources,
      rateLimit: agent.rate_limit,
    },
  };
}

export async function logApiUsage(
  agentId: string,
  endpoint: string,
  ipAddress: string,
  responseCode: number
): Promise<void> {
  const supabase = createAdminClient();
  await supabase.from('api_usage_logs').insert({
    agent_id: agentId,
    endpoint,
    ip_address: ipAddress,
    response_code: responseCode,
  });
}

export function getClientIp(request: NextRequest): string {
  return (
    request.headers.get('cf-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    '0.0.0.0'
  );
}
