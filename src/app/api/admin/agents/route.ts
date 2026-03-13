import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

async function hashKey(key: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(key);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function generateApiKey(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const segments = [8, 8, 8, 8];
  return 'sk_' + segments
    .map((len) =>
      Array.from(crypto.getRandomValues(new Uint8Array(len)))
        .map((b) => chars[b % chars.length])
        .join('')
    )
    .join('-');
}

// GET - List all agents
export async function GET() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from('agent_api_keys')
    .select('id, agent_name, allowed_sources, allowed_ips, rate_limit, is_active, webhook_url, last_used_at, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

// POST - Create new agent
export async function POST(request: NextRequest) {
  const supabase = createAdminClient();

  const body = await request.json();
  const {
    agent_name,
    allowed_sources = ['vvip', 'platinum'],
    rate_limit = 60,
    webhook_url = null,
  } = body as {
    agent_name: string;
    allowed_sources?: string[];
    rate_limit?: number;
    webhook_url?: string | null;
  };

  if (!agent_name) {
    return NextResponse.json({ success: false, error: 'agent_name is required' }, { status: 400 });
  }

  // Generate API key
  const rawKey = generateApiKey();
  const hashedKey = await hashKey(rawKey);

  const { data, error } = await supabase
    .from('agent_api_keys')
    .insert({
      agent_name,
      api_key: hashedKey,
      allowed_sources,
      rate_limit,
      webhook_url,
    })
    .select('id, agent_name, allowed_sources, rate_limit, webhook_url, created_at')
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  // Return the raw key ONCE — it can never be retrieved again
  return NextResponse.json({
    success: true,
    data,
    api_key: rawKey,
    warning: 'Save this API key now. It cannot be retrieved again.',
  });
}

// PATCH - Update agent (toggle active, update webhook, etc.)
export async function PATCH(request: NextRequest) {
  const supabase = createAdminClient();

  const body = await request.json();
  const { id, ...updates } = body as {
    id: string;
    is_active?: boolean;
    webhook_url?: string | null;
    rate_limit?: number;
    allowed_sources?: string[];
  };

  if (!id) {
    return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('agent_api_keys')
    .update(updates)
    .eq('id', id)
    .select('id, agent_name, allowed_sources, rate_limit, is_active, webhook_url')
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}

// DELETE - Remove agent
export async function DELETE(request: NextRequest) {
  const supabase = createAdminClient();

  const { id } = (await request.json()) as { id: string };

  if (!id) {
    return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 });
  }

  const { error } = await supabase
    .from('agent_api_keys')
    .delete()
    .eq('id', id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
