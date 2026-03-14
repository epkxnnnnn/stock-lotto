import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

function jsonResponse(data: Record<string, unknown>, status = 200) {
  return NextResponse.json(data, { status });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, phone, line_id, experience, referral_source } = body;

    // Required field validation
    if (!full_name || typeof full_name !== 'string' || full_name.trim().length < 2) {
      return jsonResponse({ success: false, error: 'กรุณากรอกชื่อ-นามสกุล' }, 400);
    }

    if (!phone || typeof phone !== 'string') {
      return jsonResponse({ success: false, error: 'กรุณากรอกเบอร์โทรศัพท์' }, 400);
    }

    // Thai phone validation: 10 digits starting with 0
    const phoneClean = phone.replace(/[-\s]/g, '');
    if (!/^0\d{9}$/.test(phoneClean)) {
      return jsonResponse({ success: false, error: 'เบอร์โทรศัพท์ไม่ถูกต้อง (ตัวอย่าง: 0812345678)' }, 400);
    }

    if (!line_id || typeof line_id !== 'string' || line_id.trim().length < 2) {
      return jsonResponse({ success: false, error: 'กรุณากรอก LINE ID' }, 400);
    }

    const supabase = createServiceClient();
    const source = process.env.NEXT_PUBLIC_BRAND || 'vvip';

    // Rate limiting: max 3 submissions per IP per hour
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      || request.headers.get('x-real-ip')
      || 'unknown';

    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

    // Simple rate limit check - we don't have IP column, so check by phone/line_id frequency
    // and use a broader duplicate check
    const { count: recentCount } = await supabase
      .from('agent_applications')
      .select('*', { count: 'exact', head: true })
      .or(`phone.eq.${phoneClean},line_id.eq.${line_id.trim()}`)
      .gte('created_at', oneHourAgo);

    if (recentCount && recentCount >= 3) {
      return jsonResponse({ success: false, error: 'ส่งคำขอมากเกินไป กรุณาลองใหม่ในภายหลัง' }, 429);
    }

    // Duplicate check: same phone or LINE ID within last 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count: dupCount } = await supabase
      .from('agent_applications')
      .select('*', { count: 'exact', head: true })
      .or(`phone.eq.${phoneClean},line_id.eq.${line_id.trim()}`)
      .gte('created_at', oneDayAgo);

    if (dupCount && dupCount > 0) {
      return jsonResponse({ success: false, error: 'คุณได้ส่งใบสมัครแล้ว กรุณารอการตรวจสอบ' }, 409);
    }

    // Insert application
    const { error } = await supabase
      .from('agent_applications')
      .insert({
        full_name: full_name.trim(),
        phone: phoneClean,
        line_id: line_id.trim(),
        experience: experience?.trim() || null,
        referral_source: referral_source || null,
        source,
      });

    if (error) {
      console.error('Failed to insert agent application:', error);
      return jsonResponse({ success: false, error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' }, 500);
    }

    return jsonResponse({ success: true });
  } catch {
    return jsonResponse({ success: false, error: 'ข้อมูลไม่ถูกต้อง' }, 400);
  }
}
