import type React from "react";
import { useEffect, useState } from "react";
import type { PriceHistory } from "shared";
import StockPanel from "../components/stocks/StockPanel";
import { API_URL } from "../lib/constants";

const TICKERS = ["MU"];

function Stock({ ticker }: { ticker: string }): React.ReactElement | null {
  const [history, setHistory] = useState<PriceHistory | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/stocks/${ticker}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json() as Promise<PriceHistory>;
      })
      .then(setHistory)
      .catch((err: Error) => setError(err.message));
  }, [ticker]);

  if (error) return <p className="page-subtitle">Couldn't load {ticker}: {error}</p>;
  if (!history?.prices.length) return null;
  return (
    <section>
      <StockPanel data={history} />
      <p className="stock-footnote">
        Last close {history.prices[history.prices.length - 1]?.[0]}. Source: Yahoo Finance.
      </p>
    </section>
  );
}

export default function Stocks(): React.ReactElement {
  return (
    <main className="page stocks-page">
      <div className="page-header">
        <h1 className="page-title">Stocks</h1>
        <p className="page-subtitle">Daily closes, 200-day average and RSI.</p>
      </div>
      <div className="stock-list">
        {TICKERS.map((ticker) => (
          <Stock key={ticker} ticker={ticker} />
        ))}
      </div>
    </main>
  );
}
