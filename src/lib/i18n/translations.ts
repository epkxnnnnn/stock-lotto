export type Language = 'th' | 'lo';

const translations: Record<string, { th: string; lo: string }> = {
  // Nav
  'nav.home': { th: 'หน้าแรก', lo: 'ໜ້າຫຼັກ' },
  'nav.results': { th: 'ผลหวย', lo: 'ຜົນຫວຍ' },
  'nav.schedule': { th: 'ตารางเวลา', lo: 'ຕາຕະລາງ' },
  'nav.rates': { th: 'อัตราจ่าย', lo: 'ອັດຕາຈ່າຍ' },
  'nav.agent': { th: 'สมัครตัวแทน', lo: 'ສະໝັກຕົວແທນ' },
  'nav.about': { th: 'เกี่ยวกับ', lo: 'ກ່ຽວກັບ' },

  // Status badges
  'status.open': { th: 'เปิดรับ', lo: 'ເປີດຮັບ' },
  'status.closed': { th: 'ปิดรับแล้ว', lo: 'ປິດຮັບແລ້ວ' },
  'status.resulted': { th: 'ออกผลแล้ว', lo: 'ອອກຜົນແລ້ວ' },
  'status.pending': { th: 'รอผล', lo: 'ລໍຖ້າຜົນ' },
  'status.live': { th: 'LIVE', lo: 'LIVE' },

  // Countdown
  'countdown.hours': { th: 'ชั่วโมง', lo: 'ຊົ່ວໂມງ' },
  'countdown.minutes': { th: 'นาที', lo: 'ນາທີ' },
  'countdown.seconds': { th: 'วินาที', lo: 'ວິນາທີ' },
  'countdown.nextSettlement': { th: 'รอบถัดไป', lo: 'ຮອບຕໍ່ໄປ' },
  'countdown.closesAt': { th: 'ปิดรับเวลา', lo: 'ປິດຮັບເວລາ' },

  // Section titles
  'section.todayResults': { th: 'ผลหวยวันนี้', lo: 'ຜົນຫວຍມື້ນີ້' },
  'section.yesterdayResults': { th: 'ผลหวยล่าสุด (เมื่อวาน)', lo: 'ຜົນຫວຍລ່າສຸດ (ມື້ວານ)' },
  'section.upcomingRounds': { th: 'รอบที่กำลังจะมา', lo: 'ຮອບທີ່ກຳລັງຈະມາ' },
  'section.marketOverview': { th: 'ภาพรวมตลาด', lo: 'ພາບລວມຕະຫຼາດ' },
  'section.settledMarkets': { th: 'ตลาดที่ออกผลแล้ว', lo: 'ຕະຫຼາດທີ່ອອກຜົນແລ້ວ' },
  'section.latestResults': { th: 'ผลล่าสุด', lo: 'ຜົນລ່າສຸດ' },

  // Table headers
  'table.asset': { th: 'ตลาด', lo: 'ຕະຫຼາດ' },
  'table.symbol': { th: 'สัญลักษณ์', lo: 'ສັນຍາລັກ' },
  'table.lastResult': { th: 'ผลล่าสุด', lo: 'ຜົນລ່າສຸດ' },
  'table.status': { th: 'สถานะ', lo: 'ສະຖານະ' },
  'table.settlement': { th: 'เวลาปิด', lo: 'ເວລາປິດ' },
  'table.number': { th: 'เลข 3 ตัว', lo: 'ເລກ 3 ໂຕ' },
  'table.number2d': { th: 'เลข 2 ตัว', lo: 'ເລກ 2 ໂຕ' },
  'table.closeTime': { th: 'เวลาปิด', lo: 'ເວລາປິດ' },
  'table.resultTime': { th: 'เวลาออกผล', lo: 'ເວລາອອກຜົນ' },
  'table.allMarkets': { th: 'ทุกตลาด', lo: 'ທຸກຕະຫຼາດ' },

  // Ticker
  'ticker.settled': { th: 'ออกผล', lo: 'ອອກຜົນ' },
  'ticker.waiting': { th: 'รอผล', lo: 'ລໍຖ້າ' },

  // Hero / Chart area
  'hero.todayChart': { th: 'ผลประจำวัน', lo: 'ຜົນປະຈຳວັນ' },
  'hero.nextSettlement': { th: 'ปิดรอบถัดไป', lo: 'ປິດຮອບຕໍ່ໄປ' },

  // Results page
  'results.title': { th: 'ผลหวยย้อนหลัง', lo: 'ຜົນຫວຍຍ້ອນຫຼັງ' },
  'results.selectDate': { th: 'เลือกวันที่', lo: 'ເລືອກວັນທີ' },
  'results.progress': { th: 'ออกผลแล้ว', lo: 'ອອກຜົນແລ້ວ' },
  'results.rounds': { th: 'รอบ', lo: 'ຮອບ' },
  'results.noResults': { th: 'ไม่พบผลหวยสำหรับวันที่เลือก', lo: 'ບໍ່ພົບຜົນຫວຍສຳລັບວັນທີ່ເລືອກ' },

  // Schedule page
  'schedule.title': { th: 'ตารางเวลาออกผล', lo: 'ຕາຕະລາງເວລາອອກຜົນ' },
  'schedule.morning': { th: 'รอบเช้า', lo: 'ຮອບເຊົ້າ' },
  'schedule.afternoon': { th: 'รอบบ่าย', lo: 'ຮອບບ່າຍ' },
  'schedule.evening': { th: 'รอบเย็น / ค่ำ', lo: 'ຮອບແລງ / ຄ່ຳ' },
  'schedule.openTime': { th: 'เวลาเปิด', lo: 'ເວລາເປີດ' },
  'schedule.closeTime': { th: 'เวลาปิด', lo: 'ເວລາປິດ' },
  'schedule.announceTime': { th: 'เวลาออกผล', lo: 'ເວລາອອກຜົນ' },

  // Rates page
  'rates.title': { th: 'อัตราจ่าย', lo: 'ອັດຕາຈ່າຍ' },
  'rates.type': { th: 'ประเภท', lo: 'ປະເພດ' },
  'rates.rate': { th: 'อัตรา', lo: 'ອັດຕາ' },
  'rates.description': { th: 'รายละเอียด', lo: 'ລາຍລະອຽດ' },
  'rates.topRates': { th: 'อัตราจ่ายยอดนิยม', lo: 'ອັດຕາຈ່າຍຍອດນິຍົມ' },
  'rates.allRates': { th: 'อัตราจ่ายทั้งหมด', lo: 'ອັດຕາຈ່າຍທັງໝົດ' },
  'rates.ignored': { th: 'เลขที่ไม่รับ', lo: 'ເລກທີ່ບໍ່ຮັບ' },

  // About page
  'about.title': { th: 'เกี่ยวกับเรา', lo: 'ກ່ຽວກັບພວກເຮົາ' },
  'about.features': { th: 'จุดเด่น', lo: 'ຈຸດເດັ່ນ' },
  'about.markets': { th: 'ตลาดทั้งหมด', lo: 'ຕະຫຼາດທັງໝົດ' },
  'about.contact': { th: 'ติดต่อ', lo: 'ຕິດຕໍ່' },

  // Agent page
  'agent.title': { th: 'สมัครตัวแทน', lo: 'ສະໝັກຕົວແທນ' },
  'agent.benefits': { th: 'สิทธิประโยชน์', lo: 'ສິດທິປະໂຫຍດ' },
  'agent.requirements': { th: 'คุณสมบัติ', lo: 'ຄຸນສົມບັດ' },
  'agent.register': { th: 'ลงทะเบียน', lo: 'ລົງທະບຽນ' },

  // Common
  'common.loading': { th: 'กำลังโหลด...', lo: 'ກຳລັງໂຫລດ...' },
  'common.error': { th: 'เกิดข้อผิดพลาด', lo: 'ເກີດຂໍ້ຜິດພາດ' },
  'common.noData': { th: 'ไม่มีข้อมูล', lo: 'ບໍ່ມີຂໍ້ມູນ' },
  'common.today': { th: 'วันนี้', lo: 'ມື້ນີ້' },
  'common.yesterday': { th: 'เมื่อวาน', lo: 'ມື້ວານ' },

  // Footer
  'footer.copyright': { th: 'สงวนลิขสิทธิ์', lo: 'ສະຫງວນລິຂະສິດ' },
};

export default translations;
