# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Status

**Pre-implementation phase.** The project has specifications and HTML mockups but no source code yet. Initialize with `npx create-next-app@latest . --typescript --tailwind --app --src-dir` before building.

## Reference Files

- `stockvvip-mockup.html` — Complete UI mockup for VVIP (gold) theme with exact CSS variables and layout
- `stockplatinums-mockup.html` — Complete UI mockup for Platinum (silver) theme with exact CSS variables and layout
- `SQUAD-PROMPTS.md` — Agent-based implementation roadmap with 6 specialized agent prompts and execution order

## Project Overview

Two independent stock lottery result websites served from a **single Next.js codebase** with environment-based theming:

- **stockvvip.com** — หวยหุ้น VVIP (13 rounds/day) — Dark + Gold theme
- **stockplatinums.com** — หวยหุ้น แพลทินัม (15 rounds/day) — Dark + Silver/Platinum theme

Both sites are **results-only** (no betting, no member system). They display winning numbers publicly with **anti-scraping protection** and provide an **authenticated API** for whitelisted agents.

Both **KBIZ289** and **Khong.vip** platforms consume results from both sources.

## Tech Stack

- **Frontend:** Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **Database:** Supabase (PostgreSQL + Realtime + Edge Functions + RLS)
- **Hosting:** Vercel (same repo deployed twice with different env vars)
- **CDN/Security:** Cloudflare (WAF, Bot Management, Rate Limiting, DNS)
- **Notifications:** LINE Messaging API (separate OA per site)
- **Fonts:** Prompt (Thai text), Orbitron (numbers/digital), Bebas Neue (headings)

## Repository Structure

```
stock-lotto/
├── CLAUDE.md
├── .env.local.vvip          # stockvvip.com env
├── .env.local.platinum       # stockplatinums.com env
├── src/
│   ├── app/
│   │   ├── page.tsx          # Homepage — results grid + countdowns
│   │   ├── results/page.tsx  # Historical results archive
│   │   ├── rates/page.tsx    # Payout rate tables
│   │   ├── about/page.tsx    # About the source
│   │   ├── line/page.tsx     # LINE OA connect page
│   │   ├── admin/            # Protected admin panel (manual entry)
│   │   │   ├── page.tsx
│   │   │   └── layout.tsx
│   │   └── api/
│   │       ├── v1/
│   │       │   ├── results/
│   │       │   │   ├── today/route.ts
│   │       │   │   ├── latest/route.ts
│   │       │   │   ├── [date]/route.ts
│   │       │   │   └── history/route.ts
│   │       │   ├── schedule/route.ts
│   │       │   ├── rates/route.ts
│   │       │   └── status/route.ts
│   │       ├── internal/
│   │       │   └── results/route.ts   # Frontend data endpoint (signed tokens)
│   │       └── webhook/
│   │           └── notify/route.ts    # Trigger LINE + agent webhooks
│   ├── components/
│   │   ├── ResultCard.tsx
│   │   ├── CountdownTimer.tsx
│   │   ├── CountdownStrip.tsx
│   │   ├── ResultsGrid.tsx
│   │   ├── PayoutTable.tsx
│   │   ├── HeroNextRound.tsx
│   │   ├── LineFloatButton.tsx
│   │   ├── NumberRenderer.tsx         # SVG anti-scrape number display
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── AdminResultEntry.tsx
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── types.ts
│   │   ├── theme/
│   │   │   ├── config.ts              # Brand config from env vars
│   │   │   ├── colors.ts             # VVIP gold vs Platinum silver
│   │   │   └── rounds.ts             # Market definitions per source
│   │   ├── anti-scrape/
│   │   │   ├── encrypt.ts            # AES encrypt/decrypt payload
│   │   │   ├── font-map.ts           # Glyph shuffle mapping
│   │   │   └── token.ts              # Signed request tokens
│   │   ├── api/
│   │   │   ├── auth.ts               # API key validation + rate limiting
│   │   │   ├── middleware.ts          # Agent API middleware
│   │   │   └── webhook.ts            # Webhook delivery with retries
│   │   └── line/
│   │       └── notify.ts             # LINE push notification
│   ├── config/
│   │   ├── markets-vvip.ts            # 13 VVIP markets with close times
│   │   ├── markets-platinum.ts        # 15 Platinum markets with close times
│   │   └── payout-rates.ts           # Rate tables
│   └── types/
│       └── index.ts
├── supabase/
│   ├── migrations/
│   │   ├── 001_stock_results.sql
│   │   ├── 002_agent_api_keys.sql
│   │   ├── 003_api_usage_logs.sql
│   │   └── 004_rls_policies.sql
│   └── functions/
│       ├── auto-pull-results/        # Cron: fetch from source API
│       └── webhook-dispatch/         # Trigger: push to agents + LINE
├── public/
│   ├── fonts/                        # Obfuscated number fonts
│   └── images/
├── tailwind.config.ts
├── next.config.ts
└── package.json
```

## Environment Variables

| Variable | VVIP | Platinum |
|----------|------|----------|
| `NEXT_PUBLIC_BRAND` | `vvip` | `platinum` |
| `NEXT_PUBLIC_SITE_NAME` | `Stock VVIP` | `Stock Platinums` |
| `NEXT_PUBLIC_SITE_NAME_TH` | `หวยหุ้น VVIP` | `หวยหุ้น แพลทินัม` |
| `NEXT_PUBLIC_THEME` | `gold` | `platinum` |
| `NEXT_PUBLIC_DOMAIN` | `stockvvip.com` | `stockplatinums.com` |
| `NEXT_PUBLIC_LINE_URL` | (VVIP LINE OA URL) | (Platinum LINE OA URL) |
| `SUPABASE_URL` | shared | shared |
| `SUPABASE_ANON_KEY` | shared | shared |
| `SUPABASE_SERVICE_KEY` | shared | shared |
| `ENCRYPTION_KEY` | (rotates every 30min) | (rotates every 30min) |
| `HMAC_SECRET` | per-site | per-site |
| `LINE_CHANNEL_TOKEN` | per-site | per-site |

## Database Tables

### stock_results
- `id` uuid PK
- `source` text — "vvip" or "platinum"
- `market` text — e.g., "dow_jones", "nikkei_am", "hangseng_pm"
- `market_label_th` text — Thai display name
- `market_label_lo` text — Lao display name (nullable)
- `flag_emoji` text — country flag
- `winning_number` text — 3-digit result (null = pending)
- `round_date` date
- `close_time` timestamptz
- `result_time` timestamptz (nullable)
- `status` text — "open" / "closed" / "resulted"
- `created_at` / `updated_at` timestamptz

### agent_api_keys
- `id` uuid PK
- `agent_name` text
- `api_key` text (SHA-256 hashed)
- `allowed_sources` text[] — ["vvip"], ["platinum"], or both
- `allowed_ips` inet[] (nullable)
- `rate_limit` int (default 60/min)
- `is_active` boolean
- `webhook_url` text (nullable)
- `last_used_at` / `created_at` timestamptz

### api_usage_logs
- `id` bigint PK
- `agent_id` uuid FK
- `endpoint` text
- `ip_address` inet
- `response_code` int
- `created_at` timestamptz

## Anti-Scraping Strategy (3 Layers)

### Layer 1: Rendering Protection
- Numbers rendered as **SVG elements** with randomized class names
- **AES-encrypted JSON payload** — client-side decrypt + render (key rotates every 30min)
- **Custom font with shuffled glyphs** — DOM character ≠ visual character (mapping rotates daily)
- **Honeypot divs** — hidden fake numbers to poison scrapers

### Layer 2: Network Protection (Cloudflare)
- WAF rules blocking known bots/headless browsers
- Rate limiting: 30 req/min per IP on results pages
- Cloudflare Turnstile CAPTCHA on suspicious traffic
- Browser integrity check (canvas fingerprint, WebGL, timezone)

### Layer 3: API-Level Protection
- Internal data endpoint uses short-lived JWT (5min expiry) bound to session
- CORS locked to stockvvip.com and stockplatinums.com only
- HMAC request signing with rotating secret

## Agent API

- **Auth:** API key via `X-API-Key` header (whitelist-only, manual approval)
- **Rate limit:** configurable per agent (default 60/min)
- **IP whitelist:** optional per agent

### Endpoints
| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/results/today` | Today's results (filter by `?source=`) |
| GET | `/api/v1/results/latest` | Latest result per market |
| GET | `/api/v1/results/:date` | Results for specific date |
| GET | `/api/v1/results/history` | Archive (paginated, max 30 days) |
| GET | `/api/v1/schedule` | Today's round schedule |
| GET | `/api/v1/rates` | Payout rate tables |
| GET | `/api/v1/status` | Health check + key status |

### Webhook Push
- POST to agent's `webhook_url` on new result publish
- `X-Webhook-Signature` header with HMAC-SHA256
- 3 retries with exponential backoff (5s, 30s, 5min)

## Market Definitions

### VVIP (13 rounds) — stockvvip.com
| Market Code | Thai Name | Flag | Close Time (UTC+7) |
|---|---|---|---|
| `dow_jones` | ดาวโจนส์ VVIP | 🇺🇸 | 14:01 |
| `nikkei_am` | นิเคอิ(เช้า) VVIP | 🇯🇵 | 22:50 |
| `vietnam_am` | เวียดนาม เช้า | 🇻🇳 | 23:25 |
| `china_am` | จีน(เช้า) VVIP | 🇨🇳 | 23:50 |
| `hangseng_am` | ฮั่งเส็ง(เช้า) VVIP | 🇭🇰 | 00:25 |
| `taiwan` | ไต้หวัน VVIP | 🇹🇼 | 01:20 |
| `korea` | เกาหลี VVIP | 🇰🇷 | 02:25 |
| `nikkei_pm` | นิเคอิ(บ่าย) VVIP | 🇯🇵 | 03:10 |
| `vietnam_pm` | เวียดนาม บ่าย VVIP | 🇻🇳 | 03:55 |
| `china_pm` | จีน(บ่าย) VVIP | 🇨🇳 | 04:15 |
| `hangseng_pm` | ฮั่งเส็ง(บ่าย) VVIP | 🇭🇰 | 05:10 |
| `vietnam_eve` | เวียดนาม VVIP เย็น | 🇻🇳 | 06:30 |
| `singapore` | สิงคโปร์ VVIP | 🇸🇬 | 06:50 |

### Platinum (15 rounds) — stockplatinums.com
| Market Code | Thai Name | Flag | Close Time (UTC+7) |
|---|---|---|---|
| `nikkei_am` | หุ้นนิเคอิ แพลทินัม เช้า | 🇯🇵 | 22:40 |
| `china_am` | หุ้นจีน แพลทินัม เช้า | 🇨🇳 | 23:45 |
| `hangseng_am` | หุ้นฮั่งเส็ง แพลทินัม เช้า | 🇭🇰 | 00:20 |
| `vietnam_am` | หุ้นเวียดนาม แพลทินัม เช้า | 🇻🇳 | 01:15 |
| `taiwan` | หุ้นไต้หวัน แพลทินัม | 🇹🇼 | 01:30 |
| `korea` | หุ้นเกาหลี แพลทินัม | 🇰🇷 | 02:20 |
| `nikkei_pm` | หุ้นนิเคอิ แพลทินัม บ่าย | 🇯🇵 | 03:10 |
| `china_pm` | หุ้นจีน แพลทินัม บ่าย | 🇨🇳 | 04:15 |
| `hangseng_pm` | หุ้นฮั่งเส็ง แพลทินัม บ่าย | 🇭🇰 | 05:10 |
| `singapore` | หุ้นสิงคโปร์ แพลทินัม | 🇸🇬 | 05:40 |
| `vietnam_pm` | หุ้นเวียดนาม แพลทินัม บ่าย | 🇻🇳 | 06:20 |
| `russia` | หุ้นรัสเซีย แพลทินัม | 🇷🇺 | 12:10 |
| `uk` | หุ้นอังกฤษ แพลทินัม | 🇬🇧 | 13:00 |
| `germany` | หุ้นเยอรมัน แพลทินัม | 🇩🇪 | 13:05 |
| `dow_jones` | หุ้นดาวโจนส์ แพลทินัม | 🇺🇸 | 13:15 |

## Key Architecture Decisions

### Single Codebase, Dual Deployment
One Next.js app deployed twice on Vercel with different env vars. `NEXT_PUBLIC_BRAND` ("vvip" or "platinum") drives all theming, market schedules, and content. Theme config lives in `lib/theme/` — never hardcode brand-specific colors or market data.

### Data Flow
1. Results enter via admin panel OR auto-pull Edge Function (cron)
2. Supabase Realtime pushes updates to connected frontends
3. Webhook dispatch Edge Function notifies LINE + agent webhook URLs
4. Agent API serves results to whitelisted consumers (KBIZ289, Khong.vip)

### Anti-Scraping Architecture
Numbers are never plain text in DOM. Three layers work together:
- `NumberRenderer` component renders SVG with randomized classes
- AES-encrypted payload from server, decrypted client-side (key rotates 30min)
- Custom font with shuffled glyph mapping (rotates daily)
The internal data endpoint (`/api/internal/results`) uses short-lived JWTs distinct from the public Agent API auth.

### Shared vs Per-Site
- **Shared:** Supabase database (both sources in same tables, filtered by `source` column), codebase, deployment config
- **Per-site:** ENV vars, LINE OA, HMAC secrets, Cloudflare config, domain

## Code Conventions

- **Language:** TypeScript strict mode, no `any` types
- **Styling:** Tailwind CSS only — no inline styles, no CSS modules
- **Theme:** Use CSS variables from `lib/theme/colors.ts` — never hardcode brand colors
- **Components:** React Server Components by default; use `"use client"` only when needed
- **Thai text:** Always use `font-thai` (Prompt) class; numbers use `font-mono` (Orbitron)
- **Data fetching:** Supabase client for server components, Realtime subscriptions for live updates
- **Error handling:** Always handle Supabase errors with proper fallbacks
- **API responses:** Consistent JSON shape: `{ success: boolean, data?: T, error?: string }`
- **Naming:** Files in kebab-case, components in PascalCase, utils in camelCase

## Build & Deploy

```bash
# Initial setup (project not yet scaffolded)
npx create-next-app@latest . --typescript --tailwind --app --src-dir
npm install @supabase/supabase-js @supabase/ssr

# Dev (VVIP theme)
cp .env.local.vvip .env.local
npm run dev

# Dev (Platinum theme)
cp .env.local.platinum .env.local
npm run dev

# Build
npm run build

# Supabase migrations
npx supabase db push

# Supabase local development
npx supabase start
npx supabase db reset
```

## Implementation Order

Follow this sequence (detailed prompts in SQUAD-PROMPTS.md):
1. **Database** — Migrations, RLS policies, types.ts (no dependencies)
2. **Frontend + API** — In parallel after DB schema exists
3. **Anti-scrape** — After frontend has basic NumberRenderer placeholder
4. **Admin** — After database + API routes are functional
5. **Integrations** — LINE + Edge Functions last (depends on everything)

## Testing Checklist

- [ ] Both themes render correctly (swap env and verify)
- [ ] Countdown timers tick down accurately and auto-refresh on zero
- [ ] Results update in real-time via Supabase Realtime
- [ ] SVG number rendering works (numbers not in DOM as text)
- [ ] Admin panel: can enter results, status transitions correctly
- [ ] Agent API: auth works, rate limiting works, IP whitelist works
- [ ] Webhook: fires on result publish, retries on failure
- [ ] LINE notification: pushes on new result
- [ ] Mobile responsive on all pages
- [ ] Cloudflare rules active (test with curl + headless browser)
