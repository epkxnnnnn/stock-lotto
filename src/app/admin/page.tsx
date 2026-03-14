'use client';

import { useState, useEffect, useCallback } from 'react';
import { vvipMarkets } from '@/config/markets-vvip';
import { platinumMarkets } from '@/config/markets-platinum';
import AdminResultEntry from '@/components/AdminResultEntry';
import SectionTitle from '@/components/SectionTitle';
import type { Market } from '@/types';

interface DbResult {
  id: string;
  source: string;
  market: string;
  winning_number: string | null;
  winning_number_2d: string | null;
  status: string;
}

type ActiveBrand = 'vvip' | 'platinum';

export default function AdminPage() {
  const [activeBrand, setActiveBrand] = useState<ActiveBrand>('vvip');
  const [selectedDate, setSelectedDate] = useState(
    new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Bangkok' })
  );
  const [dbResults, setDbResults] = useState<DbResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [savingMarkets, setSavingMarkets] = useState<Set<string>>(new Set());
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [generateResult, setGenerateResult] = useState<string | null>(null);

  const markets: Market[] = activeBrand === 'vvip' ? vvipMarkets : platinumMarkets;

  const fetchResults = useCallback(async () => {
    setLoading(true);
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { data } = await supabase
        .from('stock_results')
        .select('id, source, market, winning_number, winning_number_2d, status')
        .eq('source', activeBrand)
        .eq('round_date', selectedDate)
        .order('close_time', { ascending: true });

      setDbResults((data as DbResult[]) ?? []);
    } catch (err) {
      console.error('Failed to fetch results:', err);
    }
    setLoading(false);
  }, [activeBrand, selectedDate]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  const handleSeed = async () => {
    setSeeding(true);
    try {
      const res = await fetch('/api/admin/seed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchResults();
      } else {
        alert('Seed failed: ' + data.error);
      }
    } catch {
      alert('Seed request failed');
    }
    setSeeding(false);
  };

  const handleSyncKhong = async () => {
    setSyncing(true);
    setSyncResult(null);
    try {
      const res = await fetch('/api/admin/sync-khong', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ days: 7 }),
      });
      const data = await res.json();
      if (data.success) {
        setSyncResult(`Synced ${data.synced} results, seeded ${data.seeded} rows, skipped ${data.skipped}`);
        await fetchResults();
      } else {
        setSyncResult(`Error: ${data.error}`);
      }
    } catch {
      setSyncResult('Sync request failed');
    }
    setSyncing(false);
  };

  const handleGenerate = async () => {
    setGenerating(true);
    setGenerateResult(null);
    try {
      const res = await fetch('/api/admin/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ source: activeBrand, date: selectedDate }),
      });
      const data = await res.json();
      if (data.success) {
        setGenerateResult(`Generated ${data.generated} results${data.failed > 0 ? ` (${data.failed} failed)` : ''}`);
        await fetchResults();
      } else {
        setGenerateResult(`Error: ${data.error}`);
      }
    } catch {
      setGenerateResult('Generate request failed');
    }
    setGenerating(false);
  };

  const handleSave = async (marketCode: string, winningNumber: string, winningNumber2d: string) => {
    setSavingMarkets((prev) => new Set(prev).add(marketCode));
    try {
      const res = await fetch('/api/admin/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: activeBrand,
          market: marketCode,
          winning_number: winningNumber,
          winning_number_2d: winningNumber2d,
          round_date: selectedDate,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchResults();
      } else {
        alert('Save failed: ' + data.error);
      }
    } catch {
      alert('Save request failed');
    }
    setSavingMarkets((prev) => {
      const next = new Set(prev);
      next.delete(marketCode);
      return next;
    });
  };

  const resultedCount = dbResults.filter((r) => r.status === 'resulted').length;
  const totalCount = markets.length;

  return (
    <div className="py-10">
      <SectionTitle>&#x2699;&#xFE0F; Admin Dashboard</SectionTitle>

      {/* Brand switcher */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setActiveBrand('vvip')}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeBrand === 'vvip'
              ? 'bg-gradient-to-r from-[#d4a829] to-[#f0d060] text-[#0a0a0f]'
              : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[#d4a829]'
          }`}
        >
          VVIP (13 rounds)
        </button>
        <button
          onClick={() => setActiveBrand('platinum')}
          className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeBrand === 'platinum'
              ? 'bg-gradient-to-r from-[#a8b4c4] to-[#d0dae8] text-[#080a0e]'
              : 'bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[#a8b4c4]'
          }`}
        >
          Platinum (15 rounds)
        </button>
      </div>

      {/* Date + controls */}
      <div className="flex items-center gap-4 mb-4 flex-wrap">
        <label className="text-sm text-[var(--text-secondary)]">วันที่:</label>
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)] transition-colors [color-scheme:dark]"
        />
        <button
          onClick={handleSeed}
          disabled={seeding}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary)] transition-all disabled:opacity-50"
        >
          {seeding ? 'Seeding...' : 'Seed Schedule'}
        </button>
        <button
          onClick={fetchResults}
          disabled={loading}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary)] transition-all disabled:opacity-50"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
        <button
          onClick={handleSyncKhong}
          disabled={syncing}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--bg-card)] border border-emerald-800 text-emerald-400 hover:bg-emerald-900/30 hover:border-emerald-600 transition-all disabled:opacity-50"
        >
          {syncing ? 'Syncing...' : 'Sync from Khong (7 days)'}
        </button>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-[var(--bg-card)] border border-amber-700 text-amber-400 hover:bg-amber-900/30 hover:border-amber-500 transition-all disabled:opacity-50"
        >
          {generating ? 'Generating...' : `Generate (${activeBrand.toUpperCase()})`}
        </button>
      </div>
      {(syncResult || generateResult) && (
        <div className="flex flex-col gap-2 mb-4">
          {syncResult && (
            <div className={`px-4 py-2 rounded-lg text-xs ${
              syncResult.startsWith('Error') || syncResult.includes('failed')
                ? 'bg-red-900/20 border border-red-800 text-red-400'
                : 'bg-emerald-900/20 border border-emerald-800 text-emerald-400'
            }`}>
              {syncResult}
            </div>
          )}
          {generateResult && (
            <div className={`px-4 py-2 rounded-lg text-xs ${
              generateResult.startsWith('Error') || generateResult.includes('failed')
                ? 'bg-red-900/20 border border-red-800 text-red-400'
                : 'bg-amber-900/20 border border-amber-800 text-amber-400'
            }`}>
              {generateResult}
            </div>
          )}
        </div>
      )}

      {/* Stats bar */}
      <div className="flex items-center gap-4 mb-6 text-xs text-[var(--text-muted)]">
        <span>
          {activeBrand.toUpperCase()} &mdash; {selectedDate}
        </span>
        <span>|</span>
        <span>
          {dbResults.length === 0
            ? 'No rows seeded yet'
            : `${resultedCount}/${totalCount} resulted`}
        </span>
        {resultedCount === totalCount && totalCount > 0 && (
          <span className="text-[var(--accent-green)] font-semibold">All done!</span>
        )}
      </div>

      {/* Market entry grid */}
      {dbResults.length === 0 && !loading ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-10 text-center">
          <p className="text-[var(--text-muted)] text-sm mb-4">
            No schedule rows for {selectedDate}. Click &quot;Seed Schedule&quot; to create them.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {markets.map((market) => {
            const dbRow = dbResults.find((r) => r.market === market.code);
            const isSaving = savingMarkets.has(market.code);
            return (
              <AdminResultEntry
                key={`${activeBrand}-${market.code}`}
                market={market}
                savedNumber={dbRow?.winning_number ?? undefined}
                savedNumber2d={dbRow?.winning_number_2d ?? undefined}
                status={
                  isSaving
                    ? 'saving'
                    : dbRow?.status === 'resulted'
                      ? 'saved'
                      : 'pending'
                }
                onSave={(num, num2d) => handleSave(market.code, num, num2d)}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
