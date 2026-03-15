'use client';

import { useState, useCallback } from 'react';
import { useI18n } from '@/lib/i18n';
import StockChart from '@/components/StockChart';
import FlagIcon from '@/components/FlagIcon';
import NumberRenderer from '@/components/NumberRenderer';

interface MarketOption {
  code: string;
  labelTh: string;
  flagEmoji: string;
}

interface VerifyResult {
  source: string;
  market: string;
  marketLabelTh: string;
  flagEmoji: string;
  roundDate: string;
  winningNumber: string | null;
  winningNumber2d: string | null;
  closeTime: string;
  resultTime: string | null;
  status: string;
  generationMethod: string | null;
  generationSeed: string | null;
  referencePrice: string | null;
  resultHash: string | null;
  stockSymbol: string | null;
  stockIndex: string | null;
  verified: boolean | null;
}

interface VerifyClientProps {
  brand: string;
  markets: MarketOption[];
}

export default function VerifyClient({ brand, markets }: VerifyClientProps) {
  const { t } = useI18n();
  const [selectedMarket, setSelectedMarket] = useState(markets[0]?.code ?? '');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' })
  );
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' });

  async function handleVerify() {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/v1/verify?source=${brand}&market=${selectedMarket}&date=${selectedDate}`);
      const json = await res.json();

      if (json.success) {
        setResult(json.data);
      } else {
        setError(json.error ?? t('common.error'));
      }
    } catch {
      setError(t('common.error'));
    } finally {
      setLoading(false);
    }
  }

  const [copied, setCopied] = useState<string | null>(null);

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 1500);
  }, []);

  const methodBadge = (method: string | null) => {
    if (method === 'stock_ref') return { label: t('verify.stockRef'), color: 'bg-blue-500/15 text-blue-400 border-blue-500/25' };
    if (method === 'auto') return { label: t('verify.provablyFair'), color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' };
    return { label: t('verify.manual'), color: 'bg-[var(--text-muted)]/15 text-[var(--text-muted)] border-[var(--text-muted)]/25' };
  };

  return (
    <div className="py-6 space-y-6">
      <h1 className="text-lg font-semibold text-[var(--text-primary)]">
        {t('verify.title')}
      </h1>

      {/* How it works */}
      <div className="panel p-4 space-y-3">
        <h2 className="text-sm font-semibold text-[var(--text-primary)]">
          {t('verify.howItWorks')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-blue-400 text-xs font-semibold px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                {t('verify.weekday')}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {t('verify.weekdayDesc')}
            </p>
          </div>
          <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-emerald-400 text-xs font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">
                {t('verify.weekend')}
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {t('verify.weekendDesc')}
            </p>
          </div>
          <div className="bg-[var(--bg-primary)] border border-[var(--border)] rounded p-3">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[var(--brand-primary)] text-xs font-semibold px-1.5 py-0.5 rounded bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20">
                Hash
              </span>
            </div>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              {t('verify.hashDesc')}
            </p>
          </div>
        </div>
      </div>

      {/* Lookup Form */}
      <div className="panel p-4">
        <h2 className="text-sm font-semibold text-[var(--text-primary)] mb-3">
          {t('verify.lookup')}
        </h2>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-[10px] text-[var(--text-muted)] mb-1">{t('table.asset')}</label>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              disabled={loading}
              className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors [color-scheme:dark] disabled:opacity-50"
            >
              {markets.map((m) => (
                <option key={m.code} value={m.code}>
                  {m.flagEmoji} {m.labelTh}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] text-[var(--text-muted)] mb-1">{t('results.selectDate')}</label>
            <input
              type="date"
              value={selectedDate}
              max={todayStr}
              onChange={(e) => setSelectedDate(e.target.value)}
              disabled={loading}
              className="bg-[var(--bg-primary)] border border-[var(--border)] rounded px-3 py-1.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors [color-scheme:dark] disabled:opacity-50"
            />
          </div>
          <button
            type="button"
            onClick={handleVerify}
            disabled={loading}
            aria-busy={loading}
            className="px-4 py-1.5 rounded text-sm font-medium bg-[var(--brand-primary)] text-[var(--bg-primary)] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? t('common.loading') : t('verify.check')}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="panel p-4 border-red-500/30">
          <p className="text-sm text-red-400">{error}</p>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="panel p-4 space-y-4">
          {/* Header */}
          <div className="flex items-center gap-3">
            <FlagIcon emoji={result.flagEmoji} size={32} />
            <div>
              <div className="text-sm font-semibold text-[var(--text-primary)]">
                {result.marketLabelTh}
              </div>
              <div className="text-[10px] text-[var(--text-muted)] font-[family-name:var(--font-mono)]">
                {result.roundDate}
              </div>
            </div>
            {result.status === 'resulted' && (
              <span className={`ml-auto inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded border ${methodBadge(result.generationMethod).color}`}>
                {methodBadge(result.generationMethod).label}
              </span>
            )}
          </div>

          {/* Numbers */}
          {result.winningNumber ? (
            <div className="flex items-center gap-4 py-2">
              <NumberRenderer number={result.winningNumber} size="lg" />
              {result.winningNumber2d && (
                <span className="text-[var(--text-secondary)] font-[family-name:var(--font-mono)] text-lg">
                  {result.winningNumber2d}
                </span>
              )}
            </div>
          ) : (
            <p className="text-sm text-[var(--text-muted)]">{t('status.pending')}</p>
          )}

          {/* TradingView Chart */}
          {result.stockSymbol && result.status === 'resulted' && (
            <div>
              <div className="text-[10px] text-[var(--text-muted)] mb-1.5">
                {result.stockIndex}
              </div>
              <StockChart symbol={result.stockSymbol} height={250} />
            </div>
          )}

          {/* Verification Details */}
          {result.status === 'resulted' && (
            <div className="space-y-2 border-t border-[var(--border)] pt-3">
              {/* Reference Price (stock_ref) */}
              {result.referencePrice && (
                <DetailRow
                  label={t('verify.refPrice')}
                  value={result.referencePrice}
                  onCopy={() => copyToClipboard(result.referencePrice!)}
                  isCopied={copied === result.referencePrice}
                />
              )}

              {/* Seed (auto / provably fair) */}
              {result.generationSeed && (
                <DetailRow
                  label="Seed"
                  value={result.generationSeed}
                  onCopy={() => copyToClipboard(result.generationSeed!)}
                  isCopied={copied === result.generationSeed}
                  mono
                />
              )}

              {/* Result Hash */}
              {result.resultHash && (
                <DetailRow
                  label="Hash (SHA-256)"
                  value={result.resultHash}
                  onCopy={() => copyToClipboard(result.resultHash!)}
                  isCopied={copied === result.resultHash}
                  mono
                />
              )}

              {/* Verification Status */}
              {result.verified !== null && (
                <div className="flex items-center gap-2 pt-1">
                  {result.verified ? (
                    <>
                      <svg className="w-4 h-4 text-emerald-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs text-emerald-400 font-medium">{t('verify.verified')}</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xs text-red-400 font-medium">{t('verify.tampered')}</span>
                    </>
                  )}
                </div>
              )}

              {/* OpenSSL command for Provably Fair */}
              {result.generationMethod === 'auto' && result.generationSeed && (
                <div className="mt-3 bg-[var(--bg-primary)] border border-[var(--border)] rounded p-3">
                  <div className="text-[10px] text-[var(--text-muted)] mb-1">{t('verify.verifyCommand')}</div>
                  <code className="text-[10px] text-[var(--text-secondary)] font-[family-name:var(--font-mono)] break-all select-all">
                    echo -n &quot;stock-lotto-v1|{result.source}|{result.market}|{result.roundDate}&quot; | openssl dgst -sha256 -mac HMAC -macopt hexkey:{result.generationSeed}
                  </code>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DetailRow({
  label,
  value,
  onCopy,
  isCopied,
  mono,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  isCopied?: boolean;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-[10px] text-[var(--text-muted)] shrink-0 pt-0.5 w-24">{label}</span>
      <span
        className={`text-[11px] text-[var(--text-secondary)] break-all select-all flex-1 ${
          mono ? 'font-[family-name:var(--font-mono)]' : ''
        }`}
      >
        {value}
      </span>
      <button
        type="button"
        onClick={onCopy}
        className={`shrink-0 transition-colors p-0.5 ${isCopied ? 'text-emerald-400' : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'}`}
        title={isCopied ? 'Copied!' : 'Copy'}
      >
        {isCopied ? (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2" strokeWidth="2" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" strokeWidth="2" />
          </svg>
        )}
      </button>
    </div>
  );
}
