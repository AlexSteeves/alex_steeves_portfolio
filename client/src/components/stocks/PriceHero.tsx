import type React from "react";
import type { StockQuote } from "./types";
import { fmt } from "./types";

interface PriceHeroProps {
  stock: StockQuote;
}

const PriceHero: React.FC<PriceHeroProps> = ({ stock }) => (
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
);

export default PriceHero;
