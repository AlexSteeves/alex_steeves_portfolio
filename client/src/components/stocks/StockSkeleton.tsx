import type React from "react";

const StockSkeleton: React.FC = () => (
  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
    <div className="skeleton" style={{ height: "80px", borderRadius: "10px" }} />
    <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
      {[1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="skeleton"
          style={{ flex: 1, minWidth: "140px", height: "88px", borderRadius: "10px" }}
        />
      ))}
    </div>
  </div>
);

export default StockSkeleton;
