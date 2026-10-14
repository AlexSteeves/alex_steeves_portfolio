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
  cycle?: Cycle;
};

// Where a cyclical stock sits in its cycle, computed on the home server from
// SEC filings. Multiples are null when the trailing figure is a loss.
export type CyclePeak = { end: string; grossMargin: number; pe: number | null; evEbitda: number | null };

export type Cycle = {
  quarterEnd: string; // latest fiscal quarter filed, YYYY-MM-DD
  grossMargin: number; // fraction, that quarter
  inventoryDays: number | null;
  priorInventoryDays: number | null; // one quarter earlier
  pe: number | null; // latest close over trailing four quarters
  evEbitda: number | null;
  peaks: CyclePeak[]; // past confirmed gross-margin peaks, oldest first
  buyers: string[]; // tickers whose combined capex is tracked
  capexQuarter: string | null; // calendar quarter, e.g. 2026Q2
  capexGrowth: number | null; // fraction, on the same quarter a year earlier
};
