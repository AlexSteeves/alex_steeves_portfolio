# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Use `bun` as the package manager (not npm or yarn).

```bash
# Development (all workspaces)
bun run dev

# Development (individual)
bun run dev:client
bun run dev:server

# Build
bun run build

# Lint
bun run lint

# Type-check
bun run type-check

# Deploy to Cloudflare Workers
bun run deploy
```

## Architecture

This is a full-stack TypeScript monorepo using the [bhvr](https://github.com/stevedylandev/bhvr) template with three workspaces:

- **`client/`** — React 19 + Vite frontend (SPA)
- **`server/`** — Hono API running on Cloudflare Workers
- **`shared/`** — Shared TypeScript types and constants consumed by both client and server

Build orchestration is handled by **Turbo**. Deployment targets **Cloudflare Workers** via Wrangler — the server worker serves both the API and the static client build (SPA mode).

### Frontend (`client/src/`)

- `App.tsx` — Root component: `ThemeProvider` wraps everything, then `MotionConfig` (respects `prefers-reduced-motion`), `BrowserRouter`, `SmoothScroll` (Lenis)
- `pages/` — Route-level page components:
  - `Portfolio.tsx` (`/`) — composes the portfolio home page from `components/portfolio/`
  - `ProjectsPage.tsx` (`/projects`) — full project list, lazy-loaded
  - `Stocks.tsx` (`/stocks`) — ticker tabs from `GET /api/stocks`, one `StockPanel` for the selected ticker fetched from `/api/stocks/:ticker`, lazy-loaded. No ticker list in the client: a stock appears once the backend has pushed it
- `components/` — grouped by feature:
  - `portfolio/` — Hero, About, Experience, Skills, ProjectsSection, Contact, NoiseCanvas, TimelineDivider (shared shape-cycling divider between Experience/Projects entries)
  - `nav/` — NavBar, ThemeToggle
  - `projects/` — ProjectCard, shared project data
  - `stocks/` — reusable stock components, all hand-rolled (no chart library). `StockPanel` takes a `PriceHistory` and composes the rest: `Bento`/`Tile`/`StatTile`/`RangeTile` (hairline bento grid; layouts are `grid-template-areas` under `.bento-<layout>` in `App.css`, a tile picks its `area`), `Combobox` (Base UI, the stock picker: a button plus a search field inside the list, matching ticker or company name), `Tabs` (native radio group, the time ranges), `LineChart` (SVG, parent-controlled crosshair so the price and RSI charts scrub together). Range slicing and formatters live in `lib/stocks.ts` (`bun test` in `client/`).
  - Stocks spacing: only the `--space-*` tokens on `.stocks-page` (4px minimum, even values). The 1px bento gap is a hairline, not spacing.
  - `ThemeProvider.tsx` — theme state (localStorage-backed, `data-theme` attribute on `<html>`)
- `lib/motion.ts` — shared framer-motion variants (`slideMask`, `fadeInUp`, `staggerContainer`, `wordReveal`, `viewportOnce`); reuse these instead of declaring new ad hoc variants
- `lib/constants.ts` — `CONTACT_EMAIL`, `GITHUB_URL`, `LINKEDIN_URL`
- `lib/ThemeContext.ts` / `lib/useTheme.ts` — theme context + `useTheme()` hook (`[theme, toggleTheme]`)

Senate Watch (`/senate-watch`) and Toronto Events (`/toronto-events`) were removed (out of date) — see git history (commit before their removal) if rebuilding them.

**Theme**: monochrome design system, light and dark via a `data-theme` attribute set by `ThemeProvider`/`useTheme()`. **Light is the default** for first-time visitors; the choice persists in `localStorage` once toggled. An inline script in `index.html` sets `data-theme` before first paint to avoid a flash of the wrong theme. Colors are CSS custom properties in `index.css` (`--bg-primary`, `--text-primary`, etc.) — the bare `:root` holds the light values, `:root[data-theme="dark"]` overrides them. No hardcoded colors in components; always reference the custom properties (or hardcode responsibly if it's a one-off shadow/overlay that shouldn't flip with theme).

Animation: **framer-motion** is the standard for all entrance/scroll-linked/transition animation, plus **Lenis** for smooth scroll (separate concern, wraps the whole app in `SmoothScroll`). Do not reach for other animation libraries — extend `lib/motion.ts` instead.

Styling is plain global CSS: `index.css` (tokens/reset) + `App.css` (component styles, utility classes like `.btn`/`.section`/`.page-header`/`.tag-row`/`.eyebrow-label`). No boxed "card" component — About/Skills/Experience/Projects/Contact all render flush against the page background with hairline dividers, not gradient-filled panels (that read as generic/templated). Prefer adding a utility class in `App.css` over inline `style={{}}` for any value that's static and could repeat; dynamic/computed values (framer-motion's animated `style`) are fine inline.

The client determines the API base URL from `VITE_SERVER_URL`:
- Dev: `http://localhost:3000/api`
- Production: `/api` (same origin as the worker)

### Backend (`server/src/index.ts`)

Single-file Hono app, prefixed with `/api`.

- `GET /api/stocks/:ticker` — returns a `PriceHistory` (5 years of daily closes, plus optional per-day `open`/`high`/`low`/`volume`/`sma200`/`rsi14` columns aligned to `prices`) from the D1 table `price_history` (one JSON row per ticker). Indicators are computed by the backend, never in the client or worker.
- `GET /api/stocks` — sorted list of every ticker in `price_history`. Successful reads carry `Cache-Control: public, max-age=3600` (browser caching only). Tests: `bun test` in `server/`.
- `PUT /api/stocks/:ticker` — replaces that row. Requires `Authorization: Bearer $INGEST_TOKEN`. The body is checked by `parsePriceHistory` in `server/src/validate.ts`, which also drops any field it does not know, so a new field from the backend must be added there (and to `PriceHistory`) or it is silently discarded.

The worker never downloads prices itself. The private `server-stock-backend` repo runs on the home server (CT103), downloads every ticker in its `tickers.txt` from Yahoo Finance once a day and PUTs each result here.

D1: database `portfolio`, binding `DB`, migrations in `server/migrations/`. Apply with `bunx wrangler d1 migrations apply portfolio --remote` (or `--local` for `wrangler dev`, which starts with an empty local database — easiest is to run the client against production data with `VITE_SERVER_URL=https://alexsteeves.dev/api`).

The Senate Watch (Supabase-backed) and Toronto Events (City of Toronto open data) routes were removed along with their frontend features and will be rebuilt when those features return.

### Shared Types & Constants (`shared/src/`)

`types/index.ts` holds `PriceHistory` / `PricePoint` for the stocks route. Add new shared types/constants here when client and server need to agree on a shape.

## Environment Variables

- `INGEST_TOKEN` — Worker secret (`wrangler secret put INGEST_TOKEN`; `.dev.vars` locally) that authorises `PUT /api/stocks/:ticker`. The same value lives in `.env` beside the backend's `compose.yaml` on CT103.
- `VITE_SERVER_URL` — Optional client-side override for the API base URL (defaults based on env).
