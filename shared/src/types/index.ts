// Daily price history for one ticker, as stored and served by /api/stocks/:ticker.
export type PricePoint = [date: string, close: number]; // date is YYYY-MM-DD

export type PriceHistory = {
  symbol: string;
  name: string;
  currency: string;
  prices: PricePoint[]; // oldest first
};
