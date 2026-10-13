// Daily price history for one ticker, as served by GET /api/stocks/MU.
export type PricePoint = [date: string, close: number]; // date is YYYY-MM-DD

export type PriceHistory = {
  symbol: string;
  name: string;
  currency: string;
  prices: PricePoint[]; // oldest first
};
