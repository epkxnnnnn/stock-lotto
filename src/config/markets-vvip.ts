import type { Market } from '@/types';

export const vvipMarkets: Market[] = [
  { code: 'dow_jones', labelTh: 'ดาวโจนส์ VVIP', flagEmoji: '🇺🇸', openTime: '05:00', closeTime: '00:01', announceTime: '00:30', order: 1, khongTemplateId: 93, khongSlug: 'dowjone_vip' },
  { code: 'nikkei_am', labelTh: 'นิเคอิ(เช้า) VVIP', flagEmoji: '🇯🇵', openTime: '05:00', closeTime: '08:50', announceTime: '09:05', order: 2, khongTemplateId: 99, khongSlug: 'nikkei_vip_mo' },
  { code: 'vietnam_am', labelTh: 'เวียดนาม VVIP เช้า', flagEmoji: '🇻🇳', openTime: '05:00', closeTime: '09:25', announceTime: '09:40', order: 3, khongTemplateId: 104, khongSlug: 'vietnam_vip_mo' },
  { code: 'china_am', labelTh: 'จีน(เช้า) VVIP', flagEmoji: '🇨🇳', openTime: '05:00', closeTime: '09:50', announceTime: '10:05', order: 4, khongTemplateId: 100, khongSlug: 'china_vip_mo' },
  { code: 'hangseng_am', labelTh: 'ฮั่งเส็ง(เช้า) VVIP', flagEmoji: '🇭🇰', openTime: '05:00', closeTime: '10:25', announceTime: '10:35', order: 5, khongTemplateId: 101, khongSlug: 'hunseng_vip_mo' },
  { code: 'taiwan', labelTh: 'ไต้หวัน VVIP', flagEmoji: '🇹🇼', openTime: '05:00', closeTime: '11:20', announceTime: '11:35', order: 6, khongTemplateId: 102, khongSlug: 'taiwan_vip' },
  { code: 'korea', labelTh: 'เกาหลี VVIP', flagEmoji: '🇰🇷', openTime: '05:00', closeTime: '12:25', announceTime: '12:35', order: 7, khongTemplateId: 103, khongSlug: 'kr_vip' },
  { code: 'nikkei_pm', labelTh: 'นิเคอิ(บ่าย) VVIP', flagEmoji: '🇯🇵', openTime: '04:00', closeTime: '13:10', announceTime: '13:25', order: 8, khongTemplateId: 96, khongSlug: 'nikkei_vip_af' },
  { code: 'vietnam_pm', labelTh: 'เวียดนาม VVIP บ่าย', flagEmoji: '🇻🇳', openTime: '04:00', closeTime: '13:55', announceTime: '14:10', order: 9, khongTemplateId: 105, khongSlug: 'vietnam_vip_af' },
  { code: 'china_pm', labelTh: 'จีน(บ่าย) VVIP', flagEmoji: '🇨🇳', openTime: '04:00', closeTime: '14:15', announceTime: '14:45', order: 10, khongTemplateId: 97, khongSlug: 'china_vip_af' },
  { code: 'hangseng_pm', labelTh: 'ฮั่งเส็ง(บ่าย) VVIP', flagEmoji: '🇭🇰', openTime: '04:00', closeTime: '15:10', announceTime: '15:25', order: 11, khongTemplateId: 98, khongSlug: 'hunseng_vip_af' },
  { code: 'vietnam_eve', labelTh: 'เวียดนาม VVIP เย็น', flagEmoji: '🇻🇳', openTime: '04:00', closeTime: '16:30', announceTime: '16:45', order: 12, khongTemplateId: 106, khongSlug: 'vietnam_vip_ev' },
  { code: 'singapore', labelTh: 'สิงคโปร์ VVIP', flagEmoji: '🇸🇬', openTime: '04:00', closeTime: '16:50', announceTime: '17:05', order: 13, khongTemplateId: 84, khongSlug: 'singapore_vip' },
];
