import type { Market } from '@/types';

export const platinumMarkets: Market[] = [
  { code: 'nikkei_am', labelTh: 'หุ้นนิเคอิ แพลทินัม เช้า', labelLo: 'ຮຸ້ນນິເຄອິ ແພລທິນັມ ເຊົ້າ', flagEmoji: '🇯🇵', openTime: '04:00', closeTime: '08:40', announceTime: '09:00', order: 1, khongTemplateId: 52, khongSlug: 'share_nikkei_special_mo' },
  { code: 'china_am', labelTh: 'หุ้นจีน แพลทินัม เช้า', labelLo: 'ຮຸ້ນຈີນ ແພລທິນັມ ເຊົ້າ', flagEmoji: '🇨🇳', openTime: '04:00', closeTime: '09:45', announceTime: '10:00', order: 2, khongTemplateId: 54, khongSlug: 'share_china_special_mo' },
  { code: 'hangseng_am', labelTh: 'หุ้นฮั่งเส็ง แพลทินัม เช้า', labelLo: 'ຮຸ້ນຮັ່ງເສັງ ແພລທິນັມ ເຊົ້າ', flagEmoji: '🇭🇰', openTime: '04:00', closeTime: '10:20', announceTime: '10:35', order: 3, khongTemplateId: 56, khongSlug: 'share_hunseng_special_mo' },
  { code: 'vietnam_am', labelTh: 'หุ้นเวียดนาม แพลทินัม เช้า', labelLo: 'ຮຸ້ນຫວຽດນາມ ແພລທິນັມ ເຊົ້າ', flagEmoji: '🇻🇳', openTime: '04:00', closeTime: '11:15', announceTime: '11:35', order: 4, khongTemplateId: 61, khongSlug: 'share_vietnam_special_mo' },
  { code: 'taiwan', labelTh: 'หุ้นไต้หวัน แพลทินัม', labelLo: 'ຮຸ້ນໄຕ້ຫວັນ ແພລທິນັມ', flagEmoji: '🇹🇼', openTime: '04:00', closeTime: '11:30', announceTime: '11:55', order: 5, khongTemplateId: 58, khongSlug: 'share_taiwan_special' },
  { code: 'korea', labelTh: 'หุ้นเกาหลี แพลทินัม', labelLo: 'ຮຸ້ນເກົາຫຼີ ແພລທິນັມ', flagEmoji: '🇰🇷', openTime: '04:00', closeTime: '12:20', announceTime: '12:35', order: 6, khongTemplateId: 59, khongSlug: 'share_kr_af' },
  { code: 'nikkei_pm', labelTh: 'หุ้นนิเคอิ แพลทินัม บ่าย', labelLo: 'ຮຸ້ນນິເຄອິ ແພລທິນັມ ບ່າຍ', flagEmoji: '🇯🇵', openTime: '04:00', closeTime: '13:10', announceTime: '13:30', order: 7, khongTemplateId: 53, khongSlug: 'share_nikkei_special_af' },
  { code: 'china_pm', labelTh: 'หุ้นจีน แพลทินัม บ่าย', labelLo: 'ຮຸ້ນຈີນ ແພລທິນັມ ບ່າຍ', flagEmoji: '🇨🇳', openTime: '04:00', closeTime: '14:15', announceTime: '14:45', order: 8, khongTemplateId: 55, khongSlug: 'share_china_special_af' },
  { code: 'hangseng_pm', labelTh: 'หุ้นฮั่งเส็ง แพลทินัม บ่าย', labelLo: 'ຮຸ້ນຮັ່ງເສັງ ແພລທິນັມ ບ່າຍ', flagEmoji: '🇭🇰', openTime: '04:00', closeTime: '15:10', announceTime: '15:35', order: 9, khongTemplateId: 57, khongSlug: 'share_hunseng_special_af' },
  { code: 'singapore', labelTh: 'หุ้นสิงคโปร์ แพลทินัม', labelLo: 'ຮຸ້ນສິງກະໂປ ແພລທິນັມ', flagEmoji: '🇸🇬', openTime: '04:00', closeTime: '15:40', announceTime: '16:30', order: 10, khongTemplateId: 60, khongSlug: 'share_singapore_special' },
  { code: 'vietnam_pm', labelTh: 'หุ้นเวียดนาม แพลทินัม บ่าย', labelLo: 'ຮຸ້ນຫວຽດນາມ ແພລທິນັມ ບ່າຍ', flagEmoji: '🇻🇳', openTime: '04:00', closeTime: '16:20', announceTime: '16:35', order: 11, khongTemplateId: 62, khongSlug: 'share_vietnam_special_af' },
  { code: 'russia', labelTh: 'หุ้นรัสเซีย แพลทินัม', labelLo: 'ຮຸ້ນຣັດເຊຍ ແພລທິນັມ', flagEmoji: '🇷🇺', openTime: '04:00', closeTime: '22:10', announceTime: '22:35', order: 12, khongTemplateId: 63, khongSlug: 'share_russia_special' },
  { code: 'uk', labelTh: 'หุ้นอังกฤษ แพลทินัม', labelLo: 'ຮຸ້ນອັງກິດ ແພລທິນັມ', flagEmoji: '🇬🇧', openTime: '04:00', closeTime: '23:00', announceTime: '23:30', order: 13, khongTemplateId: 64, khongSlug: 'share_uk_special' },
  { code: 'germany', labelTh: 'หุ้นเยอรมัน แพลทินัม', labelLo: 'ຮຸ້ນເຢຍລະມັນ ແພລທິນັມ', flagEmoji: '🇩🇪', openTime: '04:00', closeTime: '23:05', announceTime: '23:35', order: 14, khongTemplateId: 65, khongSlug: 'share_german_special' },
  { code: 'dow_jones', labelTh: 'หุ้นดาวโจนส์ แพลทินัม', labelLo: 'ຮຸ້ນດາວໂຈນ ແພລທິນັມ', flagEmoji: '🇺🇸', openTime: '04:00', closeTime: '23:15', announceTime: '23:45', order: 15, khongTemplateId: 66, khongSlug: 'dowjone_special' },
];
