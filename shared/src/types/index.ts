// Daily price history for one ticker, as stored and served by /api/stocks/:ticker.
export type PricePoint = [date: string, close: number]; // date is YYYY-MM-DD

export type PriceHistory = {
  symbol: string;
  name: string;
  currency: string;
  prices: PricePoint[]; // oldest first
  // One entry per day, aligned to `prices`. Optional so rows pushed before the
  // backend sent them still render; indicators are null until warmed up.
  open?: number[];
  high?: number[];
  low?: number[];
  volume?: number[];
  sma200?: (number | null)[];
  rsi14?: (number | null)[];
};
