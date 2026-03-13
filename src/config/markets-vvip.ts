import type { Market } from '@/types';

export const vvipMarkets: Market[] = [
  { code: 'dow_jones', labelTh: 'ดาวโจนส์ VVIP', flagEmoji: '🇺🇸', closeTime: '14:01', order: 1 },
  { code: 'nikkei_am', labelTh: 'นิเคอิ(เช้า) VVIP', flagEmoji: '🇯🇵', closeTime: '22:50', order: 2 },
  { code: 'vietnam_am', labelTh: 'เวียดนาม เช้า', flagEmoji: '🇻🇳', closeTime: '23:25', order: 3 },
  { code: 'china_am', labelTh: 'จีน(เช้า) VVIP', flagEmoji: '🇨🇳', closeTime: '23:50', order: 4 },
  { code: 'hangseng_am', labelTh: 'ฮั่งเส็ง(เช้า) VVIP', flagEmoji: '🇭🇰', closeTime: '00:25', order: 5 },
  { code: 'taiwan', labelTh: 'ไต้หวัน VVIP', flagEmoji: '🇹🇼', closeTime: '01:20', order: 6 },
  { code: 'korea', labelTh: 'เกาหลี VVIP', flagEmoji: '🇰🇷', closeTime: '02:25', order: 7 },
  { code: 'nikkei_pm', labelTh: 'นิเคอิ(บ่าย) VVIP', flagEmoji: '🇯🇵', closeTime: '03:10', order: 8 },
  { code: 'vietnam_pm', labelTh: 'เวียดนาม บ่าย VVIP', flagEmoji: '🇻🇳', closeTime: '03:55', order: 9 },
  { code: 'china_pm', labelTh: 'จีน(บ่าย) VVIP', flagEmoji: '🇨🇳', closeTime: '04:15', order: 10 },
  { code: 'hangseng_pm', labelTh: 'ฮั่งเส็ง(บ่าย) VVIP', flagEmoji: '🇭🇰', closeTime: '05:10', order: 11 },
  { code: 'vietnam_eve', labelTh: 'เวียดนาม VVIP เย็น', flagEmoji: '🇻🇳', closeTime: '06:30', order: 12 },
  { code: 'singapore', labelTh: 'สิงคโปร์ VVIP', flagEmoji: '🇸🇬', closeTime: '06:50', order: 13 },
];
