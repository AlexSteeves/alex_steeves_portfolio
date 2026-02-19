import type React from "react";

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

export default StatCard;
