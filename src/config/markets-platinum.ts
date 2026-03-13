import type { Market } from '@/types';

export const platinumMarkets: Market[] = [
  { code: 'nikkei_am', labelTh: 'หุ้นนิเคอิ แพลทินัม เช้า', flagEmoji: '🇯🇵', closeTime: '22:40', order: 1 },
  { code: 'china_am', labelTh: 'หุ้นจีน แพลทินัม เช้า', flagEmoji: '🇨🇳', closeTime: '23:45', order: 2 },
  { code: 'hangseng_am', labelTh: 'หุ้นฮั่งเส็ง แพลทินัม เช้า', flagEmoji: '🇭🇰', closeTime: '00:20', order: 3 },
  { code: 'vietnam_am', labelTh: 'หุ้นเวียดนาม แพลทินัม เช้า', flagEmoji: '🇻🇳', closeTime: '01:15', order: 4 },
  { code: 'taiwan', labelTh: 'หุ้นไต้หวัน แพลทินัม', flagEmoji: '🇹🇼', closeTime: '01:30', order: 5 },
  { code: 'korea', labelTh: 'หุ้นเกาหลี แพลทินัม', flagEmoji: '🇰🇷', closeTime: '02:20', order: 6 },
  { code: 'nikkei_pm', labelTh: 'หุ้นนิเคอิ แพลทินัม บ่าย', flagEmoji: '🇯🇵', closeTime: '03:10', order: 7 },
  { code: 'china_pm', labelTh: 'หุ้นจีน แพลทินัม บ่าย', flagEmoji: '🇨🇳', closeTime: '04:15', order: 8 },
  { code: 'hangseng_pm', labelTh: 'หุ้นฮั่งเส็ง แพลทินัม บ่าย', flagEmoji: '🇭🇰', closeTime: '05:10', order: 9 },
  { code: 'singapore', labelTh: 'หุ้นสิงคโปร์ แพลทินัม', flagEmoji: '🇸🇬', closeTime: '05:40', order: 10 },
  { code: 'vietnam_pm', labelTh: 'หุ้นเวียดนาม แพลทินัม บ่าย', flagEmoji: '🇻🇳', closeTime: '06:20', order: 11 },
  { code: 'russia', labelTh: 'หุ้นรัสเซีย แพลทินัม', flagEmoji: '🇷🇺', closeTime: '12:10', order: 12 },
  { code: 'uk', labelTh: 'หุ้นอังกฤษ แพลทินัม', flagEmoji: '🇬🇧', closeTime: '13:00', order: 13 },
  { code: 'germany', labelTh: 'หุ้นเยอรมัน แพลทินัม', flagEmoji: '🇩🇪', closeTime: '13:05', order: 14 },
  { code: 'dow_jones', labelTh: 'หุ้นดาวโจนส์ แพลทินัม', flagEmoji: '🇺🇸', closeTime: '13:15', order: 15 },
];
