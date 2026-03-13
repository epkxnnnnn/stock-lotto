import type { Metadata } from 'next';
import { getBrandConfig } from '@/lib/theme/config';
import SectionTitle from '@/components/SectionTitle';

const docsConfig = getBrandConfig();

export const metadata: Metadata = {
  title: `API Documentation — ${docsConfig.siteName} Agent API`,
  description: `${docsConfig.siteName} Agent API documentation. REST API for whitelisted agents — results, schedules, rates, webhooks. API key authentication, rate limiting, IP whitelist.`,
  openGraph: {
    title: `API Documentation — ${docsConfig.siteName} Agent API`,
    description: `REST API documentation for ${docsConfig.siteName} agents. Results, schedules, rates, and webhook push.`,
    url: '/api-docs',
  },
  alternates: { canonical: '/api-docs' },
  robots: { index: false, follow: false },
};

const endpoints = [
  {
    method: 'GET',
    path: '/api/v1/results/today',
    description: "Today's results for all markets",
    params: '?source=vvip or ?source=platinum (optional)',
  },
  {
    method: 'GET',
    path: '/api/v1/results/latest',
    description: 'Latest result per market',
    params: '?source=vvip (optional)',
  },
  {
    method: 'GET',
    path: '/api/v1/results/:date',
    description: 'Results for a specific date',
    params: 'Date format: YYYY-MM-DD (e.g. /api/v1/results/2026-03-13)',
  },
  {
    method: 'GET',
    path: '/api/v1/results/history',
    description: 'Historical results (paginated, max 30 days)',
    params: '?source=&market=&page=1&limit=50',
  },
  {
    method: 'GET',
    path: '/api/v1/schedule',
    description: "Today's market schedule with close times",
    params: '?source=vvip (optional)',
  },
  {
    method: 'GET',
    path: '/api/v1/rates',
    description: 'Payout rate tables',
    params: 'None',
  },
  {
    method: 'GET',
    path: '/api/v1/status',
    description: 'Health check + your API key info',
    params: 'None',
  },
];

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="bg-[var(--bg-primary)] rounded-lg p-4">
      <pre className="text-xs font-mono text-[var(--text-secondary)] whitespace-pre-wrap">{children}</pre>
    </div>
  );
}

function InlineCode({ children }: { children: string }) {
  return (
    <code className="bg-[var(--bg-secondary)] px-1.5 py-0.5 rounded text-[var(--brand-light)] text-xs">
      {children}
    </code>
  );
}

export default function ApiDocsPage() {
  const config = getBrandConfig();
  const domain = config.domain;

  return (
    <div className="py-10 max-w-4xl mx-auto">
      <SectionTitle>API Documentation</SectionTitle>

      <p className="text-sm text-[var(--text-secondary)] mb-8 leading-relaxed">
        {config.siteNameTh} Agent API for whitelisted consumers (KBIZ289, Khong.vip, etc.)
      </p>

      {/* Auth section */}
      <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 mb-6">
        <h3 className="font-heading text-lg tracking-[2px] text-[var(--brand-primary)] mb-4">
          Authentication
        </h3>
        <div className="text-sm text-[var(--text-secondary)] space-y-3 leading-relaxed">
          <p>
            All API requests require an API key via the <InlineCode>X-API-Key</InlineCode> header.
          </p>
          <p>
            Keys are issued manually by the admin. Contact us to request access.
          </p>
          <CodeBlock>{`curl -H "X-API-Key: sk_your_api_key_here" \\
  https://${domain}/api/v1/results/today`}</CodeBlock>
        </div>
      </section>

      {/* Rate limiting */}
      <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 mb-6">
        <h3 className="font-heading text-lg tracking-[2px] text-[var(--brand-primary)] mb-4">
          Rate Limiting
        </h3>
        <div className="text-sm text-[var(--text-secondary)] space-y-2">
          <p>Default: <strong>60 requests/minute</strong> per API key (configurable per agent).</p>
          <p>Exceeding the limit returns <InlineCode>429 Too Many Requests</InlineCode>.</p>
        </div>
      </section>

      {/* Endpoints */}
      <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 mb-6">
        <h3 className="font-heading text-lg tracking-[2px] text-[var(--brand-primary)] mb-4">
          Endpoints
        </h3>
        <div className="space-y-4">
          {endpoints.map((ep) => (
            <div key={ep.path} className="border-b border-[var(--border)] pb-4 last:border-0 last:pb-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[rgba(46,204,113,0.15)] text-[var(--accent-green)]">
                  {ep.method}
                </span>
                <code className="text-sm font-mono text-[var(--brand-light)]">{ep.path}</code>
              </div>
              <p className="text-xs text-[var(--text-secondary)] mb-1">{ep.description}</p>
              <p className="text-xs text-[var(--text-muted)]">{ep.params}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Response example */}
      <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 mb-6">
        <h3 className="font-heading text-lg tracking-[2px] text-[var(--brand-primary)] mb-4">
          Response Format
        </h3>
        <div className="text-sm text-[var(--text-secondary)] space-y-3">
          <p>All responses follow this structure:</p>
          <CodeBlock>{`// Success
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "source": "vvip",
      "market": "dow_jones",
      "market_label_th": "ดาวโจนส์ VVIP",
      "flag_emoji": "🇺🇸",
      "winning_number": "847",
      "winning_number_2d": "53",
      "round_date": "2026-03-13",
      "close_time": "2026-03-13T14:01:00+07:00",
      "result_time": "2026-03-13T14:02:00+07:00",
      "status": "resulted",
      "generation_method": "auto"
    }
  ]
}

// Error
{ "success": false, "error": "Error message" }`}</CodeBlock>
        </div>
      </section>

      {/* Webhook */}
      <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 mb-6">
        <h3 className="font-heading text-lg tracking-[2px] text-[var(--brand-primary)] mb-4">
          Webhook Push
        </h3>
        <div className="text-sm text-[var(--text-secondary)] space-y-3 leading-relaxed">
          <p>
            When a new result is published, we POST to your registered webhook URL automatically.
          </p>
          <CodeBlock>{`// POST to your webhook_url
// Header: X-Webhook-Signature: <HMAC-SHA256>

{
  "event": "result.published",
  "source": "vvip",
  "market": "dow_jones",
  "market_label_th": "ดาวโจนส์ VVIP",
  "flag_emoji": "🇺🇸",
  "winning_number": "847",
  "winning_number_2d": "53",
  "round_date": "2026-03-13",
  "timestamp": "2026-03-13T14:02:00Z"
}`}</CodeBlock>
          <div className="text-xs text-[var(--text-muted)] space-y-1">
            <p>Retries: 3 attempts with exponential backoff (5s, 30s, 5min)</p>
            <p>Timeout: 10 seconds per attempt</p>
          </div>
        </div>
      </section>

      {/* Code examples */}
      <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 mb-6">
        <h3 className="font-heading text-lg tracking-[2px] text-[var(--brand-primary)] mb-4">
          Code Examples
        </h3>

        <p className="text-xs text-[var(--text-muted)] mb-2">JavaScript / Node.js:</p>
        <CodeBlock>{`const API_KEY = 'sk_your_api_key_here';
const BASE = 'https://${domain}';

const res = await fetch(BASE + '/api/v1/results/today?source=vvip', {
  headers: { 'X-API-Key': API_KEY }
});
const { success, data } = await res.json();
const results = data.filter(r => r.status === 'resulted');`}</CodeBlock>

        <p className="text-xs text-[var(--text-muted)] mb-2 mt-4">Python:</p>
        <CodeBlock>{`import requests

API_KEY = 'sk_your_api_key_here'
BASE = 'https://${domain}'

res = requests.get(
    f'{BASE}/api/v1/results/today',
    headers={'X-API-Key': API_KEY},
    params={'source': 'vvip'}
)
data = res.json()['data']`}</CodeBlock>

        <p className="text-xs text-[var(--text-muted)] mb-2 mt-4">PHP:</p>
        <CodeBlock>{`$apiKey = 'sk_your_api_key_here';
$url = 'https://${domain}/api/v1/results/today?source=vvip';

$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["X-API-Key: $apiKey"]);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
$response = json_decode(curl_exec($ch), true);
curl_close($ch);

$results = $response['data'];`}</CodeBlock>
      </section>

      {/* Webhook receiver example */}
      <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6 mb-6">
        <h3 className="font-heading text-lg tracking-[2px] text-[var(--brand-primary)] mb-4">
          Webhook Receiver Example
        </h3>

        <p className="text-xs text-[var(--text-muted)] mb-2">Node.js / Express:</p>
        <CodeBlock>{`const crypto = require('crypto');
const WEBHOOK_SECRET = 'your_shared_secret';

app.post('/webhook/stock-results', (req, res) => {
  // Verify signature
  const signature = req.headers['x-webhook-signature'];
  const expected = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature !== expected) {
    return res.status(401).json({ error: 'Invalid signature' });
  }

  const { event, source, market, winning_number } = req.body;
  console.log(\`New result: \${market} = \${winning_number}\`);

  // Process the result...

  res.json({ ok: true });
});`}</CodeBlock>
      </section>

      {/* Status codes */}
      <section className="bg-[var(--bg-card)] border border-[var(--border)] rounded-[14px] p-6">
        <h3 className="font-heading text-lg tracking-[2px] text-[var(--brand-primary)] mb-4">
          Status Codes
        </h3>
        <div className="space-y-2 text-sm">
          {[
            { code: '200', desc: 'Success', color: 'text-[var(--accent-green)]' },
            { code: '400', desc: 'Bad request (invalid params)', color: 'text-[var(--brand-primary)]' },
            { code: '401', desc: 'Missing or invalid API key', color: 'text-[var(--accent-red)]' },
            { code: '403', desc: 'Source not allowed / IP not whitelisted', color: 'text-[var(--accent-red)]' },
            { code: '429', desc: 'Rate limit exceeded', color: 'text-[var(--accent-red)]' },
            { code: '500', desc: 'Internal server error', color: 'text-[var(--accent-red)]' },
          ].map((s) => (
            <div key={s.code} className="flex items-center gap-3">
              <code className={`text-xs font-mono font-bold px-2 py-0.5 rounded bg-[var(--bg-secondary)] ${s.color}`}>
                {s.code}
              </code>
              <span className="text-[var(--text-secondary)]">{s.desc}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
