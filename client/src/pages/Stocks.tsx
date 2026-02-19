import type React from "react";
import { useEffect, useState } from "react";

const SERVER_URL = import.meta.env.DEV ? "http://localhost:3000/api" : "/api";

interface StockQuote {
  c: number;   // current price
  h: number;   // day high
  l: number;   // day low
  o: number;   // open
  pc: number;  // previous close
  d: number;   // change
  dp: number;  // change percent
  t: number;   // timestamp (unix)
}

type FetchState = "loading" | "success" | "error";

interface StatCardProps {
  label: string;
  value: string;
  accent?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, accent = false }) => (
  <div className="card" style={{ flex: 1, minWidth: "140px" }}>
    <p
      style={{
        fontSize: "0.7rem",
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "var(--text-muted)",
        marginBottom: "0.5rem",
      }}
    >
      {label}
    </p>
    <p
      style={{
        fontSize: "1.25rem",
        fontWeight: 700,
        color: accent ? "var(--green-bright)" : "var(--text-primary)",
        letterSpacing: "-0.02em",
      }}
    >
      {value}
    </p>
  </div>
);

const fmt = (n: number): string =>
  n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function Stocks(): React.ReactElement {
  const [stock, setStock] = useState<StockQuote | null>(null);
  const [fetchState, setFetchState] = useState<FetchState>("loading");

  useEffect(() => {
    fetch(`${SERVER_URL}/stocks/aapl`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json() as Promise<StockQuote>;
      })
      .then((data) => {
        setStock(data);
        setFetchState("success");
      })
      .catch((err) => {
        console.error(err);
        setFetchState("error");
      });
  }, []);

  const isPositive = stock !== null && stock.d >= 0;
  const changeSign = isPositive ? "+" : "";

  return (
    <main className="page">
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "0.75rem",
          marginBottom: "2rem",
        }}
      >
        <div>
          <h1
            style={{
              fontSize: "2rem",
              marginBottom: "0.25rem",
              color: "var(--text-primary)",
            }}
          >
            AAPL
          </h1>
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Apple Inc. &middot; NASDAQ
          </p>
        </div>

        {fetchState === "success" && stock !== null && (
          <span
            className={`badge ${isPositive ? "badge-green" : "badge-red"}`}
            style={{ fontSize: "0.8rem", padding: "0.3rem 0.75rem" }}
          >
            {changeSign}
            {fmt(stock.d)} ({changeSign}
            {fmt(stock.dp)}%)
          </span>
        )}
      </div>

      {/* Loading */}
      {fetchState === "loading" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <div className="skeleton" style={{ height: "80px", borderRadius: "10px" }} />
          <div
            style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}
          >
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="skeleton"
                style={{ flex: 1, minWidth: "140px", height: "88px", borderRadius: "10px" }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {fetchState === "error" && (
        <div
          className="card"
          style={{
            borderColor: "rgba(224,92,92,0.25)",
            color: "var(--red-accent)",
            textAlign: "center",
            padding: "2.5rem",
          }}
        >
          <p style={{ fontWeight: 600, marginBottom: "0.25rem" }}>
            Failed to load stock data
          </p>
          <p style={{ fontSize: "0.825rem", color: "var(--text-muted)" }}>
            The API may be unavailable or the key may be missing.
          </p>
        </div>
      )}

      {/* Data */}
      {fetchState === "success" && stock !== null && (
        <>
          {/* Current price hero card */}
          <div
            className="card"
            style={{
              marginBottom: "0.75rem",
              background: "var(--green-dark)",
              borderColor: "var(--green-mid)",
            }}
          >
            <p
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "var(--green-accent)",
                marginBottom: "0.5rem",
              }}
            >
              Current Price
            </p>
            <p
              style={{
                fontSize: "2.5rem",
                fontWeight: 700,
                color: "var(--green-light)",
                letterSpacing: "-0.03em",
              }}
            >
              ${fmt(stock.c)}
            </p>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <StatCard label="Open" value={`$${fmt(stock.o)}`} />
            <StatCard label="High" value={`$${fmt(stock.h)}`} accent />
            <StatCard label="Low" value={`$${fmt(stock.l)}`} />
            <StatCard label="Prev Close" value={`$${fmt(stock.pc)}`} />
          </div>

          {/* Timestamp */}
          {stock.t > 0 && (
            <p
              style={{
                marginTop: "1.25rem",
                fontSize: "0.75rem",
                color: "var(--text-muted)",
                textAlign: "right",
              }}
            >
              Last updated:{" "}
              {new Date(stock.t * 1000).toLocaleTimeString("en-US", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          )}
        </>
      )}
    </main>
  );
}
