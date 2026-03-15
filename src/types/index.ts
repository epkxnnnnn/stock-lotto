export type Brand = 'vvip' | 'platinum';
export type Theme = 'gold' | 'platinum';
export type ResultStatus = 'open' | 'closed' | 'resulted';

export interface Market {
  code: string;
  labelTh: string;
  labelLo?: string;
  flagEmoji: string;
  openTime: string;      // HH:mm UTC+7 (from Khong plan_detail.open)
  closeTime: string;     // HH:mm UTC+7 (from Khong plan_detail.close)
  announceTime: string;  // HH:mm UTC+7 (from Khong plan_detail.announ)
  order: number;
  khongTemplateId: number;  // Khong lottery_templates.id
  khongSlug: string;        // Khong lottery_templates.slug
  resultSourceUrl?: string; // URL for auto-fetching results
  stockSymbol: string;     // TradingView symbol e.g. "TVC:NI225"
  stockIndex: string;      // Human-readable e.g. "Nikkei 225"
}

export type GenerationMethod = 'auto' | 'manual' | 'stock_ref';

export interface StockResult {
  id: string;
  source: Brand;
  market: string;
  marketLabelTh: string;
  marketLabelLo?: string;
  flagEmoji: string;
  winningNumber: string | null;
  winningNumber2d: string | null;
  roundDate: string; // YYYY-MM-DD
  closeTime: string; // ISO timestamp
  resultTime: string | null;
  status: ResultStatus;
  generationMethod: GenerationMethod | null;
  resultHash: string | null;
  referencePrice: string | null;
  generationSeed: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BrandConfig {
  brand: Brand;
  theme: Theme;
  siteName: string;
  siteNameTh: string;
  domain: string;
  logoText: string;
}

export interface PayoutRate {
  type: string;
  rate: number;
  description: string;
}
