import { Hono } from "hono";
import { cors } from "hono/cors";
import { bearerAuth } from "hono/bearer-auth";
import { bodyLimit } from "hono/body-limit";
import type { PriceHistory } from "shared";

type Bindings = {
  DB: D1Database;
  INGEST_TOKEN: string;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");

app.use(cors());

// Price history is downloaded on the home server and pushed here once a day
// (server-stock-backend repo). The worker only stores and serves it.
// Every ticker that has been pushed, so the client needs no hardcoded list.
app.get("/stocks", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT symbol FROM price_history ORDER BY symbol").all<{ symbol: string }>();
  return c.json(results.map((row) => row.symbol));
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
    const history = await c.req.json<PriceHistory>().catch(() => null);
    if (history?.symbol !== symbol || !Array.isArray(history.prices) || !history.prices.length) {
      return c.json({ error: "Invalid price history" }, 400);
    }
    // Per-day columns must line up with prices, or the client indexes past the end.
    const columns = [history.open, history.high, history.low, history.volume, history.sma200, history.rsi14];
    if (columns.some((col) => col !== undefined && (!Array.isArray(col) || col.length !== history.prices.length))) {
      return c.json({ error: "Column length does not match prices" }, 400);
    }
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
