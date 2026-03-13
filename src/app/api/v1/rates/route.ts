import type { NextRequest } from 'next/server';
import { withApiAuth, apiResponse } from '@/lib/api/middleware';
import { payoutRates } from '@/config/payout-rates';

export const GET = withApiAuth(async (_request: NextRequest) => {
  return apiResponse(payoutRates);
});
