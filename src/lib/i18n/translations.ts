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

  // Verify page
  'nav.verify': { th: 'ตรวจสอบ', lo: 'ກວດສອບ' },
  'verify.title': { th: 'ตรวจสอบผลหวยหุ้น', lo: 'ກວດສອບຜົນຫວຍຮຸ້ນ' },
  'verify.howItWorks': { th: 'วิธีตรวจสอบ', lo: 'ວິທີກວດສອບ' },
  'verify.weekday': { th: 'วันจันทร์-ศุกร์', lo: 'ວັນຈັນ-ສຸກ' },
  'verify.weekend': { th: 'วันเสาร์-อาทิตย์', lo: 'ວັນເສົາ-ອາທິດ' },
  'verify.weekdayDesc': { th: 'อ้างอิงจากดัชนีตลาดหุ้นจริง — เลขมาจากราคาดัชนีตลาดหุ้น ณ เวลาปิดรอบ พร้อมกราฟแสดงราคาจริง', lo: 'ອ້າງອີງຈາກດັດສະນີຕະຫຼາດຮຸ້ນຈິງ — ເລກມາຈາກລາຄາດັດສະນີ ນ ເວລາປິດຮອບ' },
  'verify.weekendDesc': { th: 'Provably Fair — เลขคำนวณจาก Seed ด้วย HMAC-SHA256 เผยแพร่ Seed ให้ตรวจสอบได้', lo: 'Provably Fair — ເລກຄຳນວນຈາກ Seed ດ້ວຍ HMAC-SHA256 ເຜີຍແຜ່ Seed ໃຫ້ກວດສອບໄດ້' },
  'verify.hashDesc': { th: 'Hash ยืนยันความถูกต้อง — ป้องกันการแก้ไขข้อมูลย้อนหลัง ทุกผลหวยมี SHA-256 hash ล็อกไว้', lo: 'Hash ຢືນຢັນຄວາມຖືກຕ້ອງ — ປ້ອງກັນການແກ້ໄຂຂໍ້ມູນຍ້ອນຫຼັງ' },
  'verify.lookup': { th: 'ค้นหาผลหวยเพื่อตรวจสอบ', lo: 'ຊອກຫາຜົນຫວຍເພື່ອກວດສອບ' },
  'verify.check': { th: 'ตรวจสอบ', lo: 'ກວດສອບ' },
  'verify.stockRef': { th: 'อ้างอิงตลาดหุ้น', lo: 'ອ້າງອີງຕະຫຼາດຮຸ້ນ' },
  'verify.provablyFair': { th: 'Provably Fair', lo: 'Provably Fair' },
  'verify.manual': { th: 'Manual', lo: 'Manual' },
  'verify.refPrice': { th: 'ราคาอ้างอิง', lo: 'ລາຄາອ້າງອີງ' },
  'verify.verified': { th: 'ผ่านการตรวจสอบ — Hash ตรงกัน', lo: 'ຜ່ານການກວດສອບ — Hash ກົງກັນ' },
  'verify.tampered': { th: 'ไม่ผ่าน — Hash ไม่ตรงกัน', lo: 'ບໍ່ຜ່ານ — Hash ບໍ່ກົງກັນ' },
  'verify.verifyCommand': { th: 'คำสั่งตรวจสอบด้วย OpenSSL:', lo: 'ຄຳສັ່ງກວດສອບດ້ວຍ OpenSSL:' },

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
