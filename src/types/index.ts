export type Brand = 'vvip' | 'platinum';
export type Theme = 'gold' | 'platinum';
export type ResultStatus = 'open' | 'closed' | 'resulted';

export interface Market {
  code: string;
  labelTh: string;
  labelLo?: string;
  flagEmoji: string;
  closeTime: string; // HH:mm format in UTC+7
  order: number;
}

export type GenerationMethod = 'auto' | 'manual';

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
  createdAt: string;
  updatedAt: string;
}

export interface BrandConfig {
  brand: Brand;
  theme: Theme;
  siteName: string;
  siteNameTh: string;
  domain: string;
  lineUrl: string;
  logoText: string;
}

export interface PayoutRate {
  type: string;
  rate: number;
  description: string;
}
