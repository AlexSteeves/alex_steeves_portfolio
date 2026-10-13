import type React from "react";
import { useEffect, useState } from "react";
import type { PriceHistory } from "shared";
import PriceChart from "../components/stocks/PriceChart";
import { API_URL } from "../lib/constants";

const TICKER = "MU";

export default function Stocks(): React.ReactElement {
  const [history, setHistory] = useState<PriceHistory | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_URL}/stocks/${TICKER}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed (${res.status})`);
        return res.json() as Promise<PriceHistory>;
      })
      .then(setHistory)
      .catch((err: Error) => setError(err.message));
  }, []);

  const first = history?.prices[0];
  const latest = history?.prices.at(-1);
  const change = first && latest ? (latest[1] / first[1] - 1) * 100 : 0;
  const format = (value: number) =>
    value.toLocaleString("en-US", { style: "currency", currency: history?.currency ?? "USD" });

  return (
    <main className="page stocks-page">
      <div className="page-header">
        <h1 className="page-title">Stocks</h1>
        <p className="page-subtitle">Daily closing prices, last five years.</p>
      </div>

      {error && <p className="page-subtitle">Couldn't load prices: {error}</p>}

      {history && first && latest && (
        <section>
          <div className="stock-header">
            <div>
              <p className="eyebrow-label">{history.symbol}</p>
              <h2 className="stock-name">{history.name}</h2>
            </div>
            <div className="stock-quote">
              <span className="stock-price">{format(latest[1])}</span>
              <span className={`stock-change${change < 0 ? " negative" : ""}`}>
                {change >= 0 ? "+" : ""}
                {change.toFixed(1)}% since {first[0]}
              </span>
            </div>
          </div>
          <PriceChart prices={history.prices} format={format} />
          <p className="stock-footnote">Last close {latest[0]}. Source: Yahoo Finance.</p>
        </section>
      )}
    </main>
  );
}
