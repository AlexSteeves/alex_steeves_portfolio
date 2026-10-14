import type { Cycle, PriceHistory } from "shared";

const MAX_DAYS = 3000; // 5 years is ~1260; leaves room without accepting anything huge
const DATE = /^\d{4}-\d{2}-\d{2}$/;

const isNumber = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const isNumberOrNull = (v: unknown): v is number | null => v === null || isNumber(v);
const isDate = (v: unknown): v is string => typeof v === "string" && DATE.test(v);

// Returns a copy holding only the known fields, or null when any is malformed.
function parseCycle(body: unknown): Cycle | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;
  const { quarterEnd, grossMargin, inventoryDays, priorInventoryDays, pe, evEbitda, peaks, buyers, capexQuarter, capexGrowth } = b;
  if (!isDate(quarterEnd) || !isNumber(grossMargin)) return null;
  if (![inventoryDays, priorInventoryDays, pe, evEbitda, capexGrowth].every(isNumberOrNull)) return null;
  if (capexQuarter !== null && (typeof capexQuarter !== "string" || !/^\d{4}Q[1-4]$/.test(capexQuarter))) return null;
  if (!Array.isArray(buyers) || buyers.length > 20 || !buyers.every((v) => typeof v === "string" && /^[A-Z0-9.-]{1,10}$/.test(v))) return null;
  if (!Array.isArray(peaks) || peaks.length > 20) return null;
  const cleanPeaks = [];
  for (const peak of peaks as Record<string, unknown>[]) {
    if (typeof peak !== "object" || peak === null) return null;
    const { end, grossMargin, pe, evEbitda } = peak;
    if (!isDate(end) || !isNumber(grossMargin) || !isNumberOrNull(pe) || !isNumberOrNull(evEbitda)) return null;
    cleanPeaks.push({ end, grossMargin, pe, evEbitda });
  }
  return {
    quarterEnd, grossMargin, pe, evEbitda, capexQuarter, buyers,
    inventoryDays: inventoryDays as number | null,
    priorInventoryDays: priorInventoryDays as number | null,
    capexGrowth: capexGrowth as number | null,
    peaks: cleanPeaks,
  } as Cycle;
}

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
  if (b.cycle !== undefined) {
    const cycle = parseCycle(b.cycle);
    if (!cycle) return "Invalid cycle";
    history.cycle = cycle;
  }
  return history;
}
