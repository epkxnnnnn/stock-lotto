import { NextRequest, NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/server';

function jsonResponse(data: Record<string, unknown>, status = 200) {
  return NextResponse.json(data, { status });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { contact_name, contact_phone, line_id, system_name, system_url, use_case, expected_volume, webhook_url } = body;

    // Required field validation
    if (!contact_name || typeof contact_name !== 'string' || contact_name.trim().length < 2) {
      return jsonResponse({ success: false, error: 'กรุณากรอกชื่อผู้ติดต่อ' }, 400);
    }

    if (!contact_phone || typeof contact_phone !== 'string') {
      return jsonResponse({ success: false, error: 'กรุณากรอกเบอร์โทรศัพท์' }, 400);
    }

    const phoneClean = contact_phone.replace(/[-\s]/g, '');
    if (!/^0\d{9}$/.test(phoneClean)) {
      return jsonResponse({ success: false, error: 'เบอร์โทรศัพท์ไม่ถูกต้อง (ตัวอย่าง: 0812345678)' }, 400);
    }

    if (!line_id || typeof line_id !== 'string' || line_id.trim().length < 2) {
      return jsonResponse({ success: false, error: 'กรุณากรอก LINE ID' }, 400);
    }

    if (!system_name || typeof system_name !== 'string' || system_name.trim().length < 2) {
      return jsonResponse({ success: false, error: 'กรุณากรอกชื่อระบบ/เว็บไซต์' }, 400);
    }

    if (!use_case || typeof use_case !== 'string' || use_case.trim().length < 10) {
      return jsonResponse({ success: false, error: 'กรุณาอธิบายการใช้งาน API อย่างน้อย 10 ตัวอักษร' }, 400);
    }

    // URL validation (optional fields)
    if (system_url && typeof system_url === 'string' && system_url.trim()) {
      try {
        new URL(system_url.trim().startsWith('http') ? system_url.trim() : `https://${system_url.trim()}`);
      } catch {
        return jsonResponse({ success: false, error: 'URL ของระบบไม่ถูกต้อง' }, 400);
      }
    }

    if (webhook_url && typeof webhook_url === 'string' && webhook_url.trim()) {
      try {
        new URL(webhook_url.trim());
      } catch {
        return jsonResponse({ success: false, error: 'Webhook URL ไม่ถูกต้อง' }, 400);
      }
    }

    const supabase = createServiceClient();
    const source = process.env.NEXT_PUBLIC_BRAND || 'vvip';

    // Duplicate check: same phone or LINE ID within last 24h
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

    const { count: dupCount } = await supabase
      .from('api_access_requests')
      .select('*', { count: 'exact', head: true })
      .or(`contact_phone.eq.${phoneClean},line_id.eq.${line_id.trim()}`)
      .gte('created_at', oneDayAgo);

    if (dupCount && dupCount > 0) {
      return jsonResponse({ success: false, error: 'คุณได้ส่งคำขอแล้ว กรุณารอการตรวจสอบ' }, 409);
    }

    const { error } = await supabase
      .from('api_access_requests')
      .insert({
        contact_name: contact_name.trim(),
        contact_phone: phoneClean,
        line_id: line_id.trim(),
        system_name: system_name.trim(),
        system_url: system_url?.trim() || null,
        use_case: use_case.trim(),
        expected_volume: expected_volume || null,
        webhook_url: webhook_url?.trim() || null,
        requested_sources: [source],
        source,
      });

    if (error) {
      console.error('Failed to insert API access request:', error);
      return jsonResponse({ success: false, error: 'เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง' }, 500);
    }

    return jsonResponse({ success: true });
  } catch {
    return jsonResponse({ success: false, error: 'ข้อมูลไม่ถูกต้อง' }, 400);
  }
}
