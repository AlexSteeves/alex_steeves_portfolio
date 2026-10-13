import type { PriceHistory } from "shared";

const MAX_DAYS = 3000; // 5 years is ~1260; leaves room without accepting anything huge
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);

// Checks an uploaded body and returns a copy holding only the known fields, so
// nothing unexpected is stored or served. Returns a string describing the
// first problem instead when the body is not a usable PriceHistory.
export function parsePriceHistory(symbol: string, body: unknown): PriceHistory | string {
  if (typeof body !== "object" || body === null) return "Body is not an object";
  const b = body as Record<string, unknown>;

  if (b.symbol !== symbol) return "Symbol does not match the URL";
  if (typeof b.name !== "string" || !b.name || b.name.length > 200) return "Invalid name";
  // Anything else makes the browser's currency formatter throw.
  if (typeof b.currency !== "string" || !/^[A-Z]{3}$/.test(b.currency)) return "Invalid currency";

  const prices = b.prices;
  if (!Array.isArray(prices) || !prices.length || prices.length > MAX_DAYS) return "Invalid prices";
  for (const point of prices) {
    if (!Array.isArray(point) || point.length !== 2 || typeof point[0] !== "string" || !DATE.test(point[0]) || !isNumber(point[1])) {
      return "Invalid price point";
    }
  }

  const history: PriceHistory = { symbol, name: b.name, currency: b.currency, prices: prices as PriceHistory["prices"] };

  // Per-day columns must line up with prices, or the client indexes past the end.
  for (const key of ["open", "high", "low", "volume"] as const) {
    const column = b[key];
    if (column === undefined) continue;
    if (!Array.isArray(column) || column.length !== prices.length || !column.every(isNumber)) return `Invalid ${key}`;
    history[key] = column;
  }
  for (const key of ["sma200", "rsi14"] as const) {
    const column = b[key];
    if (column === undefined) continue;
    // Indicators are null until they have enough history.
    if (!Array.isArray(column) || column.length !== prices.length || !column.every((v) => v === null || isNumber(v))) {
      return `Invalid ${key}`;
    }
    history[key] = column;
  }
  return history;
}
