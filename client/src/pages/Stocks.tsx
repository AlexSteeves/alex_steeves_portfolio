import type React from "react";
import StockTicker from "../components/stocks/StockTicker";
import type { TickerMeta } from "../components/stocks/types";

const TICKERS: TickerMeta[] = [
  { symbol: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ" },
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ" },
];

export default function Stocks(): React.ReactElement {
  return (
    <main className="page">
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", color: "var(--text-primary)", marginBottom: "0.25rem" }}>
          Stocks
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Live quotes via Finnhub
        </p>
      </div>

      {TICKERS.map((ticker) => (
        <StockTicker key={ticker.symbol} meta={ticker} />
      ))}
    </main>
  );
}
