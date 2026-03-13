'use client';

import { useState, useEffect, useCallback } from 'react';
import SectionTitle from '@/components/SectionTitle';

interface Agent {
  id: string;
  agent_name: string;
  allowed_sources: string[];
  rate_limit: number;
  is_active: boolean;
  webhook_url: string | null;
  last_used_at: string | null;
  created_at: string;
}

export default function AgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);

  // Create form
  const [name, setName] = useState('');
  const [sources, setSources] = useState<string[]>(['vvip', 'platinum']);
  const [rateLimit, setRateLimit] = useState(60);
  const [webhookUrl, setWebhookUrl] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchAgents = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/admin/agents');
    const data = await res.json();
    if (data.success) setAgents(data.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setCreating(true);

    const res = await fetch('/api/admin/agents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        agent_name: name.trim(),
        allowed_sources: sources,
        rate_limit: rateLimit,
        webhook_url: webhookUrl.trim() || null,
      }),
    });
    const data = await res.json();

    if (data.success) {
      setNewKey(data.api_key);
      setName('');
      setWebhookUrl('');
      setShowCreate(false);
      await fetchAgents();
    } else {
      alert('Error: ' + data.error);
    }
    setCreating(false);
  };

  const toggleActive = async (agent: Agent) => {
    await fetch('/api/admin/agents', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: agent.id, is_active: !agent.is_active }),
    });
    await fetchAgents();
  };

  const deleteAgent = async (agent: Agent) => {
    if (!confirm(`Delete agent "${agent.agent_name}"?`)) return;
    await fetch('/api/admin/agents', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: agent.id }),
    });
    await fetchAgents();
  };

  return (
    <div className="py-10">
      <SectionTitle>&#x1F511; Agent API Keys</SectionTitle>

      {/* New key banner */}
      {newKey && (
        <div className="bg-[rgba(46,204,113,0.1)] border border-[rgba(46,204,113,0.3)] rounded-[14px] p-5 mb-6">
          <p className="text-[var(--accent-green)] text-sm font-semibold mb-2">
            API Key Created — Copy it now, it won&apos;t be shown again!
          </p>
          <div className="flex items-center gap-3">
            <code className="flex-1 bg-[var(--bg-primary)] px-4 py-2 rounded-lg text-sm font-mono text-[var(--brand-light)] break-all select-all">
              {newKey}
            </code>
            <button
              onClick={() => {
                navigator.clipboard.writeText(newKey);
              }}
              className="px-3 py-2 rounded-lg text-xs font-semibold bg-[var(--bg-card)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-all shrink-0"
            >
              Copy
            </button>
          </div>
          <button
            onClick={() => setNewKey(null)}
            className="text-xs text-[var(--text-muted)] mt-3 hover:text-[var(--text-secondary)]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Create button / form */}
      {!showCreate ? (
        <button
          onClick={() => setShowCreate(true)}
          className="mb-6 px-5 py-2.5 rounded-lg text-sm font-semibold bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-light)] text-[var(--bg-primary)] hover:opacity-90 transition-opacity"
        >
          + Create Agent Key
        </button>
      ) : (
        <form
          onSubmit={handleCreate}
          className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 mb-6 space-y-4"
        >
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">New Agent</h3>

          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Agent Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. KBIZ289, Khong.vip"
              className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)]"
              required
            />
          </div>

          <div>
            <label className="text-xs text-[var(--text-muted)] block mb-1">Allowed Sources</label>
            <div className="flex gap-4">
              {['vvip', 'platinum'].map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <input
                    type="checkbox"
                    checked={sources.includes(s)}
                    onChange={(e) => {
                      if (e.target.checked) setSources((p) => [...p, s]);
                      else setSources((p) => p.filter((x) => x !== s));
                    }}
                    className="accent-[var(--brand-primary)]"
                  />
                  {s.toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-[var(--text-muted)] block mb-1">Rate Limit (req/min)</label>
              <input
                type="number"
                value={rateLimit}
                onChange={(e) => setRateLimit(parseInt(e.target.value, 10) || 60)}
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)]"
              />
            </div>
            <div className="flex-1">
              <label className="text-xs text-[var(--text-muted)] block mb-1">Webhook URL (optional)</label>
              <input
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://..."
                className="w-full bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg px-4 py-2 text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--brand-primary)]"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-[var(--brand-primary)] to-[var(--brand-light)] text-[var(--bg-primary)] hover:opacity-90 disabled:opacity-50"
            >
              {creating ? 'Creating...' : 'Generate Key'}
            </button>
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-5 py-2 rounded-lg text-sm text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Agents list */}
      {loading ? (
        <p className="text-[var(--text-muted)] text-sm">Loading...</p>
      ) : agents.length === 0 ? (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-10 text-center">
          <p className="text-[var(--text-muted)] text-sm">No agents configured yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className={`bg-[var(--bg-card)] border rounded-[14px] p-5 ${
                agent.is_active ? 'border-[var(--border)]' : 'border-[var(--accent-red)]/20 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">
                      {agent.agent_name}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                        agent.is_active
                          ? 'bg-[rgba(46,204,113,0.15)] text-[var(--accent-green)]'
                          : 'bg-[rgba(231,76,60,0.15)] text-[var(--accent-red)]'
                      }`}
                    >
                      {agent.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  <div className="text-xs text-[var(--text-muted)] space-y-0.5">
                    <p>Sources: {agent.allowed_sources.join(', ')}</p>
                    <p>Rate: {agent.rate_limit} req/min</p>
                    {agent.webhook_url && <p>Webhook: {agent.webhook_url}</p>}
                    <p>
                      Last used:{' '}
                      {agent.last_used_at
                        ? new Date(agent.last_used_at).toLocaleString('th-TH')
                        : 'Never'}
                    </p>
                    <p>Created: {new Date(agent.created_at).toLocaleDateString('th-TH')}</p>
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => toggleActive(agent)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-secondary)] border border-[var(--border)] text-[var(--text-secondary)] hover:text-[var(--brand-primary)] transition-all"
                  >
                    {agent.is_active ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => deleteAgent(agent)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[var(--bg-secondary)] border border-[rgba(231,76,60,0.3)] text-[var(--accent-red)] hover:bg-[rgba(231,76,60,0.1)] transition-all"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
