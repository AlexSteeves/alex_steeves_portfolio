import type React from "react";
import { useEffect, useState } from "react";
import type { FetchState, StockQuote, TickerMeta } from "./types";
import { fmt } from "./types";
import StockHeader from "./StockHeader";
import PriceHero from "./PriceHero";
import StatCard from "./StatCard";
import StockSkeleton from "./StockSkeleton";
import StockError from "./StockError";

const SERVER_URL = import.meta.env.DEV ? "http://localhost:3000/api" : "/api";

interface StockTickerProps {
  meta: TickerMeta;
}

const StockTicker: React.FC<StockTickerProps> = ({ meta }) => {
  const [stock, setStock] = useState<StockQuote | null>(null);
  const [fetchState, setFetchState] = useState<FetchState>("loading");

  useEffect(() => {
    fetch(`${SERVER_URL}/stocks/${meta.symbol.toLowerCase()}`)
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
  }, [meta.symbol]);

  return (
    <section style={{ marginBottom: "2.5rem" }}>
      <StockHeader
        meta={meta}
        stock={stock}
        showBadge={fetchState === "success"}
      />

      {fetchState === "loading" && <StockSkeleton />}
      {fetchState === "error" && <StockError />}

      {fetchState === "success" && stock !== null && (
        <>
          <PriceHero stock={stock} />

          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <StatCard label="Open" value={`$${fmt(stock.o)}`} />
            <StatCard label="High" value={`$${fmt(stock.h)}`} accent />
            <StatCard label="Low" value={`$${fmt(stock.l)}`} />
            <StatCard label="Prev Close" value={`$${fmt(stock.pc)}`} />
          </div>

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
    </section>
  );
};

export default StockTicker;
