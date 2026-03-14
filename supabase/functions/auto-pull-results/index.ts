// Supabase Edge Function: auto-pull-results
// Backup cron that auto-closes markets past their close_time.
// Primary sync is handled by Vercel cron (/api/cron/sync) which pulls from Khong DB.
// This edge function only handles status transitions as a safety net.

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (_req) => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
    const now = new Date();
    const today = now.toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });
    const stats = { closed: 0, errors: 0 };

    // Auto-close markets past their close_time that are still "open"
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

    // Note: Results are pulled from Khong DB by Vercel cron (/api/cron/sync).
    // No random number generation here — all results come from Khong source.

    return jsonResponse({
      success: true,
      timestamp: now.toISOString(),
      date: today,
      stats: {
        auto_closed: stats.closed,
        errors: stats.errors,
      },
    });
  } catch (err) {
    return jsonResponse({ error: String(err) }, 500);
  }
});

function jsonResponse(data: Record<string, unknown>, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}
