import type React from "react";
import type { StockQuote, TickerMeta } from "./types";
import { fmt } from "./types";

interface StockHeaderProps {
  meta: TickerMeta;
  stock: StockQuote | null;
  showBadge: boolean;
}

const StockHeader: React.FC<StockHeaderProps> = ({ meta, stock, showBadge }) => {
  const isPositive = stock !== null && stock.d >= 0;
  const sign = isPositive ? "+" : "";

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "0.75rem",
        marginBottom: "1.25rem",
      }}
    >
      <div>
        <h2
          style={{
            fontSize: "1.5rem",
            marginBottom: "0.25rem",
            color: "var(--text-primary)",
          }}
        >
          {meta.symbol}
        </h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          {meta.name} &middot; {meta.exchange}
        </p>
      </div>

      {showBadge && stock !== null && (
        <span
          className={`badge ${isPositive ? "badge-green" : "badge-red"}`}
          style={{ fontSize: "0.8rem", padding: "0.3rem 0.75rem" }}
        >
          {sign}
          {fmt(stock.d)} ({sign}
          {fmt(stock.dp)}%)
        </span>
      )}
    </div>
  );
};

export default StockHeader;
