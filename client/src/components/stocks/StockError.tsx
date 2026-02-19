import type React from "react";

const StockError: React.FC = () => (
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
);

export default StockError;
