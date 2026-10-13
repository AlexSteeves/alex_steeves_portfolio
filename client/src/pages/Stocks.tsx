import type React from "react";
import { useEffect, useState } from "react";
import type { PriceHistory } from "shared";
import StockPanel from "../components/stocks/StockPanel";
import Tabs from "../components/stocks/Tabs";
import { API_URL } from "../lib/constants";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json() as Promise<T>;
}

function Stock({ ticker }: { ticker: string }): React.ReactElement | null {
  const [history, setHistory] = useState<PriceHistory | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getJson<PriceHistory>(`/stocks/${ticker}`)
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
  const [tickers, setTickers] = useState<string[]>([]);
  const [ticker, setTicker] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getJson<string[]>("/stocks")
      .then((list) => {
        setTickers(list);
        setTicker(list[0] ?? null);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  return (
    <main className="page stocks-page">
      <div className="page-header">
        <h1 className="page-title">Stocks</h1>
        <p className="page-subtitle">Daily closes, 200-day average and RSI.</p>
      </div>
      {error && <p className="page-subtitle">Couldn't load the stock list: {error}</p>}
      {ticker && (
        <div className="stock-list">
          <Tabs name="ticker" legend="Stock" options={tickers} value={ticker} onChange={setTicker} />
          {/* key remounts the panel so range and loading state reset per stock */}
          <Stock key={ticker} ticker={ticker} />
        </div>
      )}
    </main>
  );
}
