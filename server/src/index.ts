import { Hono } from 'hono'
import { cors } from 'hono/cors'
import type { ApiResponse } from 'shared'

type Bindings = {
  FINNHUB_API_KEY: string
}

const app = new Hono<{ Bindings: Bindings }>().basePath("/api")

app.use(cors())

app.get("/stocks/:ticker", async (c) => {
  const symbol = c.req.param('ticker').toUpperCase()
  const apiKey = c.env.FINNHUB_API_KEY || process.env.FINNHUB_API_KEY
  const res = await fetch(
    `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${apiKey}`
  );
  const data = await res.json();
  return c.json(data);
});

export default app
