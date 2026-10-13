// Downloads 5 years of daily closes from Yahoo Finance into src/data/<TICKER>.json.
// Run from server/: bun run fetch-prices MU
import type { PriceHistory, PricePoint } from "shared";

const symbol = (process.argv[2] ?? "MU").toUpperCase();

const res = await fetch(
  `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?range=5y&interval=1d`,
  { headers: { "User-Agent": "Mozilla/5.0" } },
);
if (!res.ok) throw new Error(`Yahoo returned ${res.status} for ${symbol}`);

const result = (await res.json()).chart.result[0];
const timestamps: number[] = result.timestamp;
const closes: (number | null)[] = result.indicators.quote[0].close;

const prices: PricePoint[] = [];
timestamps.forEach((t, i) => {
  const close = closes[i];
  if (close == null) return; // Yahoo leaves gaps as null
  prices.push([new Date(t * 1000).toISOString().slice(0, 10), Math.round(close * 100) / 100]);
});

const history: PriceHistory = {
  symbol,
  name: result.meta.longName ?? symbol,
  currency: result.meta.currency,
  prices,
};

const path = `${import.meta.dir}/../src/data/${symbol}.json`;
await Bun.write(path, JSON.stringify(history) + "\n");
console.log(`${symbol}: ${prices.length} days, ${prices[0]?.[0]} to ${prices.at(-1)?.[0]}`);
