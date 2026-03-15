export interface MarketDescription {
  descriptionTh: string;
  exchangeName: string;
  exchangeCountry: string;
  tradingHoursTh: string;
  seoKeywords: string[];
}

const marketDescriptions: Record<string, MarketDescription> = {
  dow_jones: {
    descriptionTh: 'ดัชนีดาวโจนส์ (Dow Jones Industrial Average) เป็นดัชนีหุ้นที่เก่าแก่และมีชื่อเสียงที่สุดในโลก ประกอบด้วยหุ้นบริษัทชั้นนำ 30 บริษัทในสหรัฐอเมริกา เป็นตัวชี้วัดสุขภาพเศรษฐกิจของสหรัฐฯ และส่งผลกระทบต่อตลาดทั่วโลก',
    exchangeName: 'New York Stock Exchange (NYSE)',
    exchangeCountry: 'สหรัฐอเมริกา',
    tradingHoursTh: '21:30 - 04:00 น. (เวลาไทย)',
    seoKeywords: ['หวยหุ้นดาวโจนส์', 'ผลดาวโจนส์วันนี้', 'Dow Jones', 'หุ้นอเมริกา', 'ดัชนีดาวโจนส์'],
  },
  nikkei_am: {
    descriptionTh: 'ดัชนีนิเคอิ 225 (Nikkei 225) รอบเช้า เป็นดัชนีหุ้นหลักของตลาดหลักทรัพย์โตเกียว ประกอบด้วยหุ้นชั้นนำ 225 บริษัทในญี่ปุ่น รอบเช้าเปิดซื้อขายตั้งแต่เช้าตรู่ถึงช่วงสาย เหมาะสำหรับผู้ที่ต้องการติดตามผลในช่วงเช้า',
    exchangeName: 'Tokyo Stock Exchange (TSE)',
    exchangeCountry: 'ญี่ปุ่น',
    tradingHoursTh: '07:00 - 09:00 น. (เวลาไทย)',
    seoKeywords: ['หวยหุ้นนิเคอิเช้า', 'ผลนิเคอิเช้าวันนี้', 'Nikkei 225', 'หุ้นญี่ปุ่นเช้า'],
  },
  nikkei_pm: {
    descriptionTh: 'ดัชนีนิเคอิ 225 (Nikkei 225) รอบบ่าย เป็นช่วงซื้อขายภาคบ่ายของตลาดหลักทรัพย์โตเกียว ราคาหุ้นในช่วงนี้มักมีความผันผวนจากข่าวสารระหว่างวัน เหมาะสำหรับผู้ที่ต้องการผลหวยช่วงบ่าย',
    exchangeName: 'Tokyo Stock Exchange (TSE)',
    exchangeCountry: 'ญี่ปุ่น',
    tradingHoursTh: '10:30 - 13:00 น. (เวลาไทย)',
    seoKeywords: ['หวยหุ้นนิเคอิบ่าย', 'ผลนิเคอิบ่ายวันนี้', 'Nikkei 225 บ่าย', 'หุ้นญี่ปุ่นบ่าย'],
  },
  china_am: {
    descriptionTh: 'ดัชนี Shanghai Composite รอบเช้า เป็นดัชนีหลักของตลาดหลักทรัพย์เซี่ยงไฮ้ สะท้อนภาพรวมตลาดหุ้นจีนแผ่นดินใหญ่ รอบเช้าเปิดซื้อขายตั้งแต่เช้าตรู่ เหมาะสำหรับผู้ที่ต้องการติดตามตลาดจีนช่วงเช้า',
    exchangeName: 'Shanghai Stock Exchange (SSE)',
    exchangeCountry: 'จีน',
    tradingHoursTh: '08:30 - 10:30 น. (เวลาไทย)',
    seoKeywords: ['หวยหุ้นจีนเช้า', 'ผลหุ้นจีนเช้าวันนี้', 'Shanghai Composite', 'หุ้นจีนเช้า'],
  },
  china_pm: {
    descriptionTh: 'ดัชนี Shanghai Composite รอบบ่าย เป็นช่วงซื้อขายภาคบ่ายของตลาดเซี่ยงไฮ้ ราคาหุ้นช่วงนี้ได้รับอิทธิพลจากข่าวเศรษฐกิจจีนและนโยบายรัฐบาล เหมาะสำหรับผู้ที่ต้องการผลหวยช่วงบ่าย',
    exchangeName: 'Shanghai Stock Exchange (SSE)',
    exchangeCountry: 'จีน',
    tradingHoursTh: '12:00 - 14:00 น. (เวลาไทย)',
    seoKeywords: ['หวยหุ้นจีนบ่าย', 'ผลหุ้นจีนบ่ายวันนี้', 'Shanghai Composite บ่าย', 'หุ้นจีนบ่าย'],
  },
  hangseng_am: {
    descriptionTh: 'ดัชนีฮั่งเส็ง (Hang Seng Index) รอบเช้า เป็นดัชนีหลักของตลาดหลักทรัพย์ฮ่องกง ประกอบด้วยหุ้นชั้นนำ 80 บริษัท รอบเช้าเปิดซื้อขายตั้งแต่เช้า เหมาะสำหรับผู้ที่สนใจตลาดฮ่องกงช่วงเช้า',
    exchangeName: 'Hong Kong Stock Exchange (HKEX)',
    exchangeCountry: 'ฮ่องกง',
    tradingHoursTh: '08:30 - 11:00 น. (เวลาไทย)',
    seoKeywords: ['หวยหุ้นฮั่งเส็งเช้า', 'ผลฮั่งเส็งเช้าวันนี้', 'Hang Seng', 'หุ้นฮ่องกงเช้า'],
  },
  hangseng_pm: {
    descriptionTh: 'ดัชนีฮั่งเส็ง (Hang Seng Index) รอบบ่าย เป็นช่วงซื้อขายภาคบ่ายของตลาดฮ่องกง ราคาหุ้นมักผันผวนจากตลาดจีนแผ่นดินใหญ่และข่าวสารระหว่างวัน เหมาะสำหรับผู้ที่ต้องการผลหวยช่วงบ่าย',
    exchangeName: 'Hong Kong Stock Exchange (HKEX)',
    exchangeCountry: 'ฮ่องกง',
    tradingHoursTh: '12:00 - 15:00 น. (เวลาไทย)',
    seoKeywords: ['หวยหุ้นฮั่งเส็งบ่าย', 'ผลฮั่งเส็งบ่ายวันนี้', 'Hang Seng บ่าย', 'หุ้นฮ่องกงบ่าย'],
  },
  taiwan: {
    descriptionTh: 'ดัชนี TAIEX เป็นดัชนีหลักของตลาดหลักทรัพย์ไต้หวัน สะท้อนภาพรวมหุ้นในตลาดไต้หวัน โดยเฉพาะอุตสาหกรรมเซมิคอนดักเตอร์ที่มีบทบาทสำคัญในห่วงโซ่อุปทานโลก',
    exchangeName: 'Taiwan Stock Exchange (TWSE)',
    exchangeCountry: 'ไต้หวัน',
    tradingHoursTh: '07:00 - 12:30 น. (เวลาไทย)',
    seoKeywords: ['หวยหุ้นไต้หวัน', 'ผลหุ้นไต้หวันวันนี้', 'TAIEX', 'หุ้นไต้หวัน'],
  },
  korea: {
    descriptionTh: 'ดัชนี KOSPI เป็นดัชนีหลักของตลาดหลักทรัพย์เกาหลีใต้ ประกอบด้วยหุ้นชั้นนำอย่าง Samsung, Hyundai, LG และบริษัทเทคโนโลยีระดับโลกมากมาย',
    exchangeName: 'Korea Exchange (KRX)',
    exchangeCountry: 'เกาหลีใต้',
    tradingHoursTh: '07:00 - 13:30 น. (เวลาไทย)',
    seoKeywords: ['หวยหุ้นเกาหลี', 'ผลหุ้นเกาหลีวันนี้', 'KOSPI', 'หุ้นเกาหลี'],
  },
  vietnam_am: {
    descriptionTh: 'ดัชนี VN-Index รอบเช้า เป็นดัชนีหลักของตลาดหลักทรัพย์โฮจิมินห์ สะท้อนภาพรวมตลาดหุ้นเวียดนามที่เติบโตอย่างรวดเร็ว รอบเช้าเปิดซื้อขายตั้งแต่เช้า',
    exchangeName: 'Ho Chi Minh Stock Exchange (HOSE)',
    exchangeCountry: 'เวียดนาม',
    tradingHoursTh: '08:00 - 10:30 น. (เวลาไทย)',
    seoKeywords: ['หวยหุ้นเวียดนามเช้า', 'ผลหุ้นเวียดนามเช้าวันนี้', 'VN-Index', 'หุ้นเวียดนามเช้า'],
  },
  vietnam_pm: {
    descriptionTh: 'ดัชนี VN-Index รอบบ่าย เป็นช่วงซื้อขายภาคบ่ายของตลาดหลักทรัพย์โฮจิมินห์ ราคาหุ้นช่วงบ่ายมักผันผวนจากปัจจัยทั้งในและต่างประเทศ',
    exchangeName: 'Ho Chi Minh Stock Exchange (HOSE)',
    exchangeCountry: 'เวียดนาม',
    tradingHoursTh: '12:00 - 14:00 น. (เวลาไทย)',
    seoKeywords: ['หวยหุ้นเวียดนามบ่าย', 'ผลหุ้นเวียดนามบ่ายวันนี้', 'VN-Index บ่าย', 'หุ้นเวียดนามบ่าย'],
  },
  vietnam_eve: {
    descriptionTh: 'ดัชนี VN-Index รอบเย็น เป็นช่วงซื้อขายพิเศษของตลาดเวียดนาม ให้ผลหวยในช่วงเย็นหลังตลาดส่วนใหญ่ปิดทำการแล้ว เหมาะสำหรับผู้ที่ต้องการลุ้นรอบเย็น',
    exchangeName: 'Ho Chi Minh Stock Exchange (HOSE)',
    exchangeCountry: 'เวียดนาม',
    tradingHoursTh: '14:30 - 16:30 น. (เวลาไทย)',
    seoKeywords: ['หวยหุ้นเวียดนามเย็น', 'ผลหุ้นเวียดนามเย็นวันนี้', 'VN-Index เย็น', 'หุ้นเวียดนามเย็น'],
  },
  singapore: {
    descriptionTh: 'ดัชนี Straits Times Index (STI) เป็นดัชนีหลักของตลาดหลักทรัพย์สิงคโปร์ ประกอบด้วยหุ้นชั้นนำ 30 บริษัท สะท้อนภาพรวมเศรษฐกิจสิงคโปร์ที่เป็นศูนย์กลางการเงินของเอเชีย',
    exchangeName: 'Singapore Exchange (SGX)',
    exchangeCountry: 'สิงคโปร์',
    tradingHoursTh: '07:30 - 16:00 น. (เวลาไทย)',
    seoKeywords: ['หวยหุ้นสิงคโปร์', 'ผลหุ้นสิงคโปร์วันนี้', 'Straits Times', 'STI', 'หุ้นสิงคโปร์'],
  },
  russia: {
    descriptionTh: 'ดัชนี MOEX Russia เป็นดัชนีหลักของตลาดหลักทรัพย์มอสโก ประกอบด้วยหุ้นชั้นนำของรัสเซีย โดยเฉพาะบริษัทพลังงานและทรัพยากรธรรมชาติ',
    exchangeName: 'Moscow Exchange (MOEX)',
    exchangeCountry: 'รัสเซีย',
    tradingHoursTh: '13:50 - 22:50 น. (เวลาไทย)',
    seoKeywords: ['หวยหุ้นรัสเซีย', 'ผลหุ้นรัสเซียวันนี้', 'MOEX', 'หุ้นรัสเซีย'],
  },
  uk: {
    descriptionTh: 'ดัชนี FTSE 100 เป็นดัชนีหลักของตลาดหลักทรัพย์ลอนดอน ประกอบด้วยหุ้น 100 บริษัทที่มีมูลค่าตลาดสูงสุดในสหราชอาณาจักร เป็นดัชนีที่สำคัญที่สุดในยุโรป',
    exchangeName: 'London Stock Exchange (LSE)',
    exchangeCountry: 'สหราชอาณาจักร',
    tradingHoursTh: '14:00 - 22:30 น. (เวลาไทย)',
    seoKeywords: ['หวยหุ้นอังกฤษ', 'ผลหุ้นอังกฤษวันนี้', 'FTSE 100', 'หุ้นอังกฤษ'],
  },
  germany: {
    descriptionTh: 'ดัชนี DAX เป็นดัชนีหลักของตลาดหลักทรัพย์แฟรงก์เฟิร์ต ประกอบด้วยหุ้นชั้นนำ 40 บริษัทในเยอรมนี รวมถึง Siemens, BMW, SAP และ Volkswagen',
    exchangeName: 'Frankfurt Stock Exchange (XETRA)',
    exchangeCountry: 'เยอรมนี',
    tradingHoursTh: '14:00 - 22:30 น. (เวลาไทย)',
    seoKeywords: ['หวยหุ้นเยอรมัน', 'ผลหุ้นเยอรมันวันนี้', 'DAX', 'หุ้นเยอรมัน'],
  },
};

export function getMarketDescription(marketCode: string): MarketDescription | undefined {
  return marketDescriptions[marketCode];
}

export default marketDescriptions;
