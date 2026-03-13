import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  const supabase = createAdminClient();

  const body = await request.json();
  const { source, market, winning_number, round_date } = body as {
    source: string;
    market: string;
    winning_number: string;
    round_date: string;
  };

  // Validate input
  if (!source || !market || !winning_number || !round_date) {
    return NextResponse.json(
      { success: false, error: 'Missing required fields' },
      { status: 400 }
    );
  }

  if (!/^\d{3}$/.test(winning_number)) {
    return NextResponse.json(
      { success: false, error: 'Invalid winning number format' },
      { status: 400 }
    );
  }

  if (source !== 'vvip' && source !== 'platinum') {
    return NextResponse.json(
      { success: false, error: 'Invalid source' },
      { status: 400 }
    );
  }

  // Try update existing row first
  const { data: existing } = await supabase
    .from('stock_results')
    .select('id')
    .eq('source', source)
    .eq('market', market)
    .eq('round_date', round_date)
    .single();

  let resultData;

  if (existing) {
    const { data: updated, error: updateError } = await supabase
      .from('stock_results')
      .update({
        winning_number,
        status: 'resulted',
        result_time: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      );
    }

    resultData = updated;
  } else {
    return NextResponse.json(
      { success: false, error: 'Result row not found. Ensure schedule is seeded for this date.' },
      { status: 404 }
    );
  }

  // Trigger webhook notification (non-blocking)
  try {
    const hmacSecret = process.env.HMAC_SECRET || '';
    await fetch(`${request.nextUrl.origin}/api/webhook/notify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': hmacSecret,
      },
      body: JSON.stringify(resultData),
    });
  } catch {
    console.error('Webhook notification failed');
  }

  return NextResponse.json({ success: true, data: resultData });
}
