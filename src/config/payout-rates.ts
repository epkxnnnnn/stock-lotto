import type { PayoutRate } from '@/types';

export const payoutRates: PayoutRate[] = [
  { type: '3 ตัวบน', rate: 850, description: 'ทายเลข 3 ตัวตรงตามลำดับ' },
  { type: '3 ตัวโต๊ด', rate: 120, description: 'ทายเลข 3 ตัวไม่ต้องเรียงลำดับ' },
  { type: '2 ตัวบน', rate: 92, description: 'ทายเลข 2 ตัวท้าย (บน)' },
  { type: '2 ตัวล่าง', rate: 92, description: 'ทายเลข 2 ตัวท้าย (ล่าง)' },
  { type: 'วิ่งบน', rate: 3.2, description: 'ทายเลขวิ่ง 1 ตัว (บน)' },
  { type: 'วิ่งล่าง', rate: 4.2, description: 'ทายเลขวิ่ง 1 ตัว (ล่าง)' },
];
