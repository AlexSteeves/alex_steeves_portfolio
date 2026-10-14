import { Hono } from "hono";
import { cors } from "hono/cors";
import { bearerAuth } from "hono/bearer-auth";
import { bodyLimit } from "hono/body-limit";
import type { StockListing } from "shared";
import { parsePriceHistory } from "./validate";

type Bindings = {
  DB: D1Database;
  INGEST_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

app.use(cors());

const TICKER = /^[A-Z0-9.-]{1,10}$/;

// Prices change once a day, so browsers may reuse a read for an hour. This
// spares honest visitors repeat fetches; it does not stop deliberate hammering,
// which needs a Cloudflare rate-limit rule. The wildcard also matches /stocks.
app.get("/stocks/*", async (c, next) => {
  await next();
  if (c.res.ok) c.res.headers.set("Cache-Control", "public, max-age=3600");
});

// Price history is downloaded on the home server and pushed here once a day
// (server-stock-backend repo). The worker only stores and serves it.

// Every ticker that has been pushed, with its company name for the picker's
// search, so the client needs no hardcoded list.
app.get("/stocks", async (c) => {
  const { results } = await c.env.DB.prepare(
    "SELECT symbol, json_extract(data, '$.name') AS name FROM price_history ORDER BY symbol",
  ).all<StockListing>();
  return c.json(results);
});

app.get("/stocks/:ticker", async (c) => {
  const row = await c.env.DB.prepare("SELECT data FROM price_history WHERE symbol = ?")
    .bind(c.req.param("ticker").toUpperCase())
    .first<{ data: string }>();
  if (!row) return c.json({ error: "Unknown ticker" }, 404);
  return c.body(row.data, 200, { "Content-Type": "application/json" });
});

app.put(
  "/stocks/:ticker",
  bodyLimit({ maxSize: 1024 * 1024 }),
  (c, next) => bearerAuth({ token: c.env.INGEST_TOKEN })(c, next),
  async (c) => {
    const symbol = c.req.param("ticker").toUpperCase();
    if (!TICKER.test(symbol)) return c.json({ error: "Invalid ticker" }, 400);
    const history = parsePriceHistory(symbol, await c.req.json().catch(() => null));
    if (typeof history === "string") return c.json({ error: history }, 400);
    await c.env.DB.prepare(
      `INSERT INTO price_history (symbol, data, updated_at) VALUES (?, ?, datetime('now'))
       ON CONFLICT(symbol) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`,
    )
      .bind(symbol, JSON.stringify(history))
      .run();
    return c.json({ symbol, days: history.prices.length });
  },
);

export default app;
