import type React from "react";
import { useEffect, useState } from "react";
import type { PriceHistory, StockListing } from "shared";
import Combobox from "../components/stocks/Combobox";
import StockPanel, { CycleTiles } from "../components/stocks/StockPanel";
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
      {history.cycle && <CycleTiles cycle={history.cycle} />}
      <p className="stock-footnote">
        Last close {history.prices[history.prices.length - 1]?.[0]}. Source: Yahoo Finance.
        {history.cycle && ` Fundamentals to the quarter ended ${history.cycle.quarterEnd}, from SEC filings.`}
      </p>
    </section>
  );
}

const LAST_VIEWED = "stock"; // localStorage key
const FIRST_VISIT = "MU"; // the one stock with a cycle summary

export default function Stocks(): React.ReactElement {
  const [tickers, setTickers] = useState<StockListing[]>([]);
  const [ticker, setTicker] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getJson<(StockListing | string)[]>("/stocks")
      .then((rows) => {
        // Browsers cache this for an hour and it used to be bare symbols.
        const list = rows.map((row) => (typeof row === "string" ? { symbol: row, name: "" } : row));
        const wanted = [localStorage.getItem(LAST_VIEWED), FIRST_VISIT];
        setTickers(list);
        setTicker(wanted.find((symbol) => list.some((row) => row.symbol === symbol)) ?? list[0]?.symbol ?? null);
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
          <Combobox
            label="Stock"
            options={tickers}
            value={ticker}
            onChange={(symbol) => {
              localStorage.setItem(LAST_VIEWED, symbol);
              setTicker(symbol);
            }}
          />
          {/* key remounts the panel so range and loading state reset per stock */}
          <Stock key={ticker} ticker={ticker} />
        </div>
      )}
    </main>
  );
}
