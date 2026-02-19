export interface StockQuote {
  c: number;   // current price
  h: number;   // day high
  l: number;   // day low
  o: number;   // open
  pc: number;  // previous close
  d: number;   // change
  dp: number;  // change percent
  t: number;   // timestamp (unix)
}

export type FetchState = "loading" | "success" | "error";

export interface TickerMeta {
  symbol: string;
  name: string;
  exchange: string;
}

export const fmt = (n: number): string =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
