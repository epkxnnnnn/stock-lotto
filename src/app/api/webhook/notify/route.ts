import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { dispatchWebhooks } from '@/lib/api/webhook';
import { broadcastMessage, buildResultNotification } from '@/lib/line/notify';
import { getBrandConfig } from '@/lib/theme/config';

export async function POST(request: NextRequest) {
  // Verify internal secret
  const secret = request.headers.get('x-internal-secret');
  if (secret !== process.env.HMAC_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { market_label_th, flag_emoji, winning_number, winning_number_2d, source, market, round_date } = body;

  if (!market_label_th || !winning_number) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const config = getBrandConfig();

  // Dispatch agent webhooks
  await dispatchWebhooks({
    event: 'result.published',
    source,
    market,
    market_label_th,
    flag_emoji,
    winning_number,
    winning_number_2d: winning_number_2d ?? null,
    round_date,
    timestamp: new Date().toISOString(),
  });

  // Send LINE notification
  const lineMessage = buildResultNotification(
    market_label_th,
    flag_emoji,
    winning_number,
    config.siteNameTh,
    winning_number_2d ?? null
  );
  await broadcastMessage([lineMessage]);

  return NextResponse.json({ success: true });
}
