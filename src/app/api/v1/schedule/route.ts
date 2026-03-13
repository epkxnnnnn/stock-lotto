import type { NextRequest } from 'next/server';
import { withApiAuth, apiResponse } from '@/lib/api/middleware';
import { vvipMarkets } from '@/config/markets-vvip';
import { platinumMarkets } from '@/config/markets-platinum';

export const GET = withApiAuth(async (request: NextRequest, context) => {
  const source = request.nextUrl.searchParams.get('source');
  const today = new Date().toISOString().split('T')[0];

  const schedule: object[] = [];

  if (!source || (source === 'vvip' && context.allowedSources.includes('vvip'))) {
    for (const market of vvipMarkets) {
      schedule.push({
        source: 'vvip',
        market: market.code,
        marketLabelTh: market.labelTh,
        flagEmoji: market.flagEmoji,
        closeTime: `${today}T${market.closeTime}:00+07:00`,
        order: market.order,
      });
    }
  }

  if (!source || (source === 'platinum' && context.allowedSources.includes('platinum'))) {
    for (const market of platinumMarkets) {
      schedule.push({
        source: 'platinum',
        market: market.code,
        marketLabelTh: market.labelTh,
        flagEmoji: market.flagEmoji,
        closeTime: `${today}T${market.closeTime}:00+07:00`,
        order: market.order,
      });
    }
  }

  return apiResponse(schedule);
});
