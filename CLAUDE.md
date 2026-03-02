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
- **`shared/`** — Shared TypeScript types consumed by both client and server

Build orchestration is handled by **Turbo**. Deployment targets **Cloudflare Workers** via Wrangler — the server worker serves both the API and the static client build (SPA mode).

### Frontend (`client/src/`)

- `App.tsx` — Root component with React Router routes
- `pages/` — Route-level page components (`Home.tsx`, `Stocks.tsx`)
- `components/` — Reusable UI components; stock-specific ones are grouped under `components/stocks/`

The client determines the API base URL from `VITE_SERVER_URL`:
- Dev: `http://localhost:3000/api`
- Production: `/api` (same origin as the worker)

### Backend (`server/src/index.ts`)

Single-file Hono app. All routes are prefixed with `/api`. The main endpoint is:

- `GET /api/stocks/:ticker` — Proxies a stock quote request to the Finnhub API using `FINNHUB_API_KEY` from environment/secrets.

The server uses Hono's `Bindings` type for Cloudflare Workers secrets.

### Shared Types (`shared/src/types/index.ts`)

Export shared types (e.g., `ApiResponse`) here when a type needs to be used by both client and server. Import them from the `shared` workspace package.

## Environment Variables

- `FINNHUB_API_KEY` — Required by the server to fetch stock data. Set in `server/.env` for local dev; set as a Cloudflare Workers secret for production.
- `VITE_SERVER_URL` — Optional client-side override for the API base URL (defaults based on env).
