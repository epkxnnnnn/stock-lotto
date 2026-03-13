// Supabase Edge Function: webhook-dispatch
// Triggered by database changes to push results to agents + LINE

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const HMAC_SECRET = Deno.env.get('HMAC_SECRET') || '';

async function signPayload(payload: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

Deno.serve(async (req) => {
  try {
    const body = await req.json();
    const { record } = body; // Supabase trigger payload

    if (!record || record.status !== 'resulted' || !record.winning_number) {
      return new Response(JSON.stringify({ skipped: true }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Get active agents with webhooks
    const { data: agents } = await supabase
      .from('agent_api_keys')
      .select('webhook_url')
      .eq('is_active', true)
      .not('webhook_url', 'is', null);

    const payload = {
      event: 'result.published',
      source: record.source,
      market: record.market,
      market_label_th: record.market_label_th,
      flag_emoji: record.flag_emoji,
      winning_number: record.winning_number,
      round_date: record.round_date,
      result_time: record.result_time,
      timestamp: new Date().toISOString(),
    };

    const payloadStr = JSON.stringify(payload);
    const signature = await signPayload(payloadStr, HMAC_SECRET);

    // Dispatch to all agent webhooks
    const results = await Promise.allSettled(
      (agents || [])
        .filter((a) => a.webhook_url)
        .map((agent) =>
          fetch(agent.webhook_url!, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Webhook-Signature': signature,
            },
            body: payloadStr,
          })
        )
    );

    const delivered = results.filter((r) => r.status === 'fulfilled').length;
    const failed = results.filter((r) => r.status === 'rejected').length;

    return new Response(
      JSON.stringify({
        success: true,
        delivered,
        failed,
        total: agents?.length ?? 0,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: String(err) }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
