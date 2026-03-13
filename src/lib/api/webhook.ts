import { createAdminClient } from '@/lib/supabase/admin';

const RETRY_DELAYS = [5_000, 30_000, 300_000]; // 5s, 30s, 5min

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

async function deliverWebhook(
  url: string,
  payload: object,
  attempt: number
): Promise<boolean> {
  const body = JSON.stringify(payload);
  const hmacSecret = process.env.HMAC_SECRET || '';
  const signature = await signPayload(body, hmacSecret);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': signature,
      },
      body,
      signal: AbortSignal.timeout(10_000),
    });

    if (response.ok) return true;

    console.error(`Webhook delivery failed (attempt ${attempt + 1}): ${response.status}`);
    return false;
  } catch (err) {
    console.error(`Webhook delivery error (attempt ${attempt + 1}):`, err);
    return false;
  }
}

export async function dispatchWebhooks(resultData: object): Promise<void> {
  const supabase = createAdminClient();

  const { data: agents } = await supabase
    .from('agent_api_keys')
    .select('webhook_url')
    .eq('is_active', true)
    .not('webhook_url', 'is', null);

  if (!agents || agents.length === 0) return;

  for (const agent of agents) {
    if (!agent.webhook_url) continue;

    // Try delivery with retries
    for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
      const success = await deliverWebhook(agent.webhook_url, resultData, attempt);
      if (success) break;
      if (attempt < RETRY_DELAYS.length) {
        await new Promise((r) => setTimeout(r, RETRY_DELAYS[attempt]));
      }
    }
  }
}
