// Supabase Edge Function: auto-pull-results
// Cron job that:
// 1. Auto-closes markets past their close_time
// 2. Checks for pending results and marks them as resulted when available
// Triggered on schedule (e.g., every 2 minutes during market hours)

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const WEBHOOK_NOTIFY_SECRET = Deno.env.get('INTERNAL_WEBHOOK_SECRET') || 'internal-secret';

interface MarketResult {
  id: string;
  source: string;
  market: string;
  market_label_th: string;
  flag_emoji: string;
  close_time: string;
  status: string;
  round_date: string;
}

interface GeneratedNumbers {
  winningNumber: string;   // 3-digit (3 ตัวบน)
  winningNumber2d: string; // 2-digit (2 ตัวล่าง)
  seed: string;            // hex-encoded random bytes for audit
}

Deno.serve(async (_req) => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const stats = { closed: 0, resulted: 0, errors: 0 };

    // Step 1: Auto-close markets past their close_time that are still "open"
    const { data: openMarkets, error: openErr } = await supabase
      .from('stock_results')
      .select('id, source, market, close_time')
      .eq('round_date', today)
      .eq('status', 'open')
      .lte('close_time', now.toISOString());

    if (openErr) {
      return jsonResponse({ error: openErr.message }, 500);
    }

    if (openMarkets && openMarkets.length > 0) {
      const ids = openMarkets.map((m: { id: string }) => m.id);
      const { error: closeErr } = await supabase
        .from('stock_results')
        .update({ status: 'closed', updated_at: now.toISOString() })
        .in('id', ids);

      if (closeErr) {
        stats.errors++;
      } else {
        stats.closed = ids.length;
      }
    }

    // Step 2: Find closed markets past close_time + 1 minute that need RNG
    const oneMinAgo = new Date(now.getTime() - 60_000).toISOString();
    const { data: pendingResults, error: pendingErr } = await supabase
      .from('stock_results')
      .select('id, source, market, market_label_th, flag_emoji, winning_number, round_date, close_time, status')
      .eq('round_date', today)
      .eq('status', 'closed')
      .is('winning_number', null)
      .lte('close_time', oneMinAgo) as { data: MarketResult[] | null; error: { message: string } | null };

    if (pendingErr) {
      return jsonResponse({ error: pendingErr.message }, 500);
    }

    // Step 3: Generate random numbers for each eligible market
    if (pendingResults && pendingResults.length > 0) {
      for (const market of pendingResults) {
        try {
          const generated = generateRandomNumbers();
          const { error: updateErr } = await supabase
            .from('stock_results')
            .update({
              winning_number: generated.winningNumber,
              winning_number_2d: generated.winningNumber2d,
              generation_method: 'auto',
              generation_seed: generated.seed,
              status: 'resulted',
              result_time: now.toISOString(),
              updated_at: now.toISOString(),
            })
            .eq('id', market.id);

          if (!updateErr) {
            stats.resulted++;

            // Trigger webhook notifications
            await triggerWebhookNotify(market, generated.winningNumber, generated.winningNumber2d);
          } else {
            stats.errors++;
          }
        } catch {
          stats.errors++;
        }
      }
    }

    return jsonResponse({
      success: true,
      timestamp: now.toISOString(),
      stats: {
        auto_closed: stats.closed,
        results_fetched: stats.resulted,
        pending_markets: (pendingResults?.length ?? 0) - stats.resulted,
        errors: stats.errors,
      },
    });
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});

/**
 * Generate cryptographically random 3-digit and 2-digit numbers.
 * Uses crypto.getRandomValues for uniform distribution.
 * Returns both numbers plus hex-encoded seed for audit trail.
 */
function generateRandomNumbers(): GeneratedNumbers {
  // Get 8 random bytes: enough entropy for both numbers + audit seed
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);

  // Use first 2 bytes for 3-digit number (0-999)
  const raw3d = ((bytes[0] << 8) | bytes[1]) % 1000;
  const winningNumber = raw3d.toString().padStart(3, '0');

  // Use next 2 bytes for 2-digit number (0-99)
  const raw2d = ((bytes[2] << 8) | bytes[3]) % 100;
  const winningNumber2d = raw2d.toString().padStart(2, '0');

  // Full 8 bytes as hex seed for auditability
  const seed = Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  return { winningNumber, winningNumber2d, seed };
}

/**
 * Trigger the webhook/notify endpoint to push results to agents + LINE
 */
async function triggerWebhookNotify(
  market: MarketResult,
  winningNumber: string,
  winningNumber2d: string
): Promise<void> {
  try {
    const baseUrl = SUPABASE_URL.replace('.supabase.co', '.supabase.co');
    // Call our Next.js webhook notify endpoint (or handle inline)
    // For Edge Function, we call the webhook dispatch function directly
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    // Get all active agents with webhook URLs that have access to this source
    const { data: agents } = await supabase
      .from('agent_api_keys')
      .select('id, agent_name, webhook_url, allowed_sources')
      .eq('is_active', true)
      .not('webhook_url', 'is', null);

    if (!agents) return;

    const payload = {
      event: 'result.published',
      source: market.source,
      market: market.market,
      market_label_th: market.market_label_th,
      flag_emoji: market.flag_emoji,
      winning_number: winningNumber,
      winning_number_2d: winningNumber2d,
      round_date: market.round_date,
      timestamp: new Date().toISOString(),
    };

    for (const agent of agents) {
      if (!agent.webhook_url) continue;
      if (!agent.allowed_sources?.includes(market.source)) continue;

      // Fire-and-forget webhook delivery (3 retries with backoff)
      deliverWebhook(agent.webhook_url, payload).catch(() => {});
    }
  } catch {
    // Non-critical — don't fail the main flow
  }
}

async function deliverWebhook(
  url: string,
  payload: Record<string, unknown>,
  attempt = 1
): Promise<void> {
  const HMAC_SECRET = Deno.env.get('HMAC_SECRET') || 'webhook-secret';
  const encoder = new TextEncoder();
  const body = JSON.stringify(payload);

  // Sign the payload
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(HMAC_SECRET),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(body));
  const sigHex = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Signature': sigHex,
      },
      body,
      signal: AbortSignal.timeout(10000),
    });

    if (!res.ok && attempt < 3) {
      const delays = [5000, 30000, 300000];
      await new Promise((r) => setTimeout(r, delays[attempt - 1]));
      return deliverWebhook(url, payload, attempt + 1);
    }
  } catch {
    if (attempt < 3) {
      const delays = [5000, 30000, 300000];
      await new Promise((r) => setTimeout(r, delays[attempt - 1]));
      return deliverWebhook(url, payload, attempt + 1);
    }
  }
}

function jsonResponse(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
