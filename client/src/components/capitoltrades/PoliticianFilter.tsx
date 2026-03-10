import type React from "react";
import type { Politician } from "shared";

interface PoliticianFilterProps {
  politicians: Politician[];
  loading: boolean;
  minValue: number;
  maxTotal: number;
  selected: Politician | null;
  onMinValueChange: (v: number) => void;
  onSelect: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export default function PoliticianFilter({
  politicians,
  loading,
  minValue,
  maxTotal,
  selected,
  onMinValueChange,
  onSelect,
}: PoliticianFilterProps) {
  const filteredPoliticians = politicians.filter(
    (p) => p.total_value >= minValue
  );

  return (
    <>
      <div style={{ marginBottom: "0.75rem" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "0.35rem",
          }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              fontWeight: 500,
            }}
          >
            Min total traded
          </span>
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--green-bright)",
              fontWeight: 600,
            }}
          >
            {minValue === 0 ? "All" : `$${minValue.toLocaleString()}+`}
          </span>
        </div>
        <input
          type="range"
          min={0}
          max={maxTotal}
          step={10000}
          value={minValue}
          onChange={(e) => onMinValueChange(Number(e.target.value))}
          disabled={loading}
          style={{
            width: "100%",
            accentColor: "var(--green-bright)",
            cursor: "pointer",
          }}
        />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "0.2rem",
          }}
        >
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
            $0
          </span>
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
            {filteredPoliticians.length} member
            {filteredPoliticians.length !== 1 ? "s" : ""}
          </span>
          <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>
            ${(maxTotal / 1_000_000).toFixed(1)}M
          </span>
        </div>
      </div>

      <select
        onChange={onSelect}
        defaultValue=""
        disabled={loading}
        style={{
          width: "100%",
          padding: "0.65rem 1rem",
          borderRadius: "8px",
          border: "1px solid var(--border)",
          background: "var(--bg-card)",
          color: selected ? "var(--text-primary)" : "var(--text-muted)",
          fontSize: "0.9rem",
          cursor: "pointer",
          marginBottom: "2rem",
          appearance: "none",
        }}
      >
        <option value="" disabled>
          {loading ? "Loading members..." : "Select a member of Congress..."}
        </option>
        {filteredPoliticians.map((p) => (
          <option key={p.bioguide_id} value={p.bioguide_id}>
            {p.politician_name}
            {p.politician_party
              ? ` · ${p.politician_party === "republican" ? "🐘" : "🫏"}`
              : ""}
            {p.politician_chamber
              ? ` · ${p.politician_chamber === "senate" ? "Senate" : "House"}`
              : ""}
          </option>
        ))}
      </select>
    </>
  );
}
