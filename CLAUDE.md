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
- `components/` — grouped by feature:
  - `portfolio/` — Hero, About, Experience, Skills, ProjectsSection, Contact, NoiseCanvas, TimelineDivider (shared shape-cycling divider between Experience/Projects entries)
  - `nav/` — NavBar, ThemeToggle
  - `projects/` — ProjectCard, shared project data
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

Single-file Hono app, prefixed with `/api`. Currently just a CORS-enabled skeleton with no routes — the Senate Watch (Supabase-backed) and Toronto Events (City of Toronto open data) routes were removed along with their frontend features and will be rebuilt when those features return.

### Shared Types & Constants (`shared/src/`)

Currently empty (`export {}`) — types and constants lived here for the now-removed Senate Watch/Toronto Events features. Add new shared types/constants here when client and server need to agree on a shape.

## Environment Variables

- `VITE_SERVER_URL` — Optional client-side override for the API base URL (defaults based on env).
