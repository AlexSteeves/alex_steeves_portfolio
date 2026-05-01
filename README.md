# Alex Steeves — Portfolio

[![Live Site](https://img.shields.io/badge/Live%20Site-alexsteeves.dev-blue?style=flat-square)](https://alexsteeves.dev)

A full-stack personal portfolio and web application suite deployed on Cloudflare's edge network. The site serves as both a professional profile and a collection of tools built around real data sources — from U.S. Senate financial disclosures to live city event feeds.

Built with React, TypeScript, Hono, and Cloudflare Workers.

---

## Pages

| Page | Description |
|------|-------------|
| **Portfolio** | Professional profile, skills, and background. |
| **Projects** | Overview of current and past projects. |
| **Senate Watch** | Cross-references U.S. senator stock trades against the committees they sit on, sourced from public Senate financial disclosure data. |
| **Toronto Events** | Live in-person events pulled from the City of Toronto Open Data portal. Filters out online-only events and duplicates — just things actually happening nearby. |

---

## Project Structure

```
/
├── client/       # React frontend application
├── server/       # Hono API server (Cloudflare Workers)
├── shared/       # Shared TypeScript types and utilities
├── turbo.json    # Turborepo pipeline configuration
└── wrangler.jsonc # Cloudflare Workers deployment config
```

---

## Getting Started

### Installation

```bash
git clone https://github.com/AlexSteeves/alex_steeves_portfolio.git
cd alex_steeves_portfolio
bun install
```

### Development

```bash
bun run dev          # Start all workspaces
bun run dev:client   # Start client only
bun run dev:server   # Start server only
```

### Deployment

```bash
bun run build
bun run deploy
```

---

## License

This project is open for exploration. Feel free to reference or learn from the code — attribution is appreciated.

© 2025 Alex Steeves
