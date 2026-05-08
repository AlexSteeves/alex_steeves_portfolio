import Select from "react-select";
import type { Politician } from "shared";

interface PoliticianFilterProps {
  politicians: Politician[];
  loading: boolean;
  minValue: number;
  maxTotal: number;
  selected: Politician | null;
  onMinValueChange: (v: number) => void;
  onSelect: (pol: Politician | null) => void;
}

type Option = { value: string; label: string; meta: string };

function toOptions(politicians: Politician[]): Option[] {
  return politicians.map((p) => ({
    value: p.bioguide_id,
    label: p.politician_name,
    meta: [
      p.politician_party === "republican" ? "🐘" : p.politician_party === "democrat" ? "🫏" : "",
      p.politician_chamber === "senate" ? "Senate" : p.politician_chamber === "house" ? "House" : "",
    ]
      .filter(Boolean)
      .join(" · "),
  }));
}

const selectStyles = {
  control: (base: object, state: { isFocused: boolean }) => ({
    ...base,
    background: "var(--bg-card)",
    border: `1px solid ${state.isFocused ? "var(--green-accent)" : "var(--border)"}`,
    borderRadius: "8px",
    boxShadow: "none",
    minHeight: "38px",
    "&:hover": { borderColor: "var(--border-hover)" },
  }),
  menu: (base: object) => ({
    ...base,
    background: "var(--bg-card)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
    overflow: "hidden",
  }),
  menuList: (base: object) => ({
    ...base,
    padding: "0.25rem",
    maxHeight: "220px",
  }),
  option: (base: object, state: { isFocused: boolean; isSelected: boolean }) => ({
    ...base,
    background: state.isSelected
      ? "var(--green-dark)"
      : state.isFocused
        ? "var(--bg-card-hover)"
        : "transparent",
    borderRadius: "6px",
    color: "var(--text-primary)",
    fontSize: "0.85rem",
    padding: "0.4rem 0.75rem",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }),
  singleValue: (base: object) => ({
    ...base,
    color: "var(--text-primary)",
    fontSize: "0.875rem",
  }),
  placeholder: (base: object) => ({
    ...base,
    color: "var(--text-muted)",
    fontSize: "0.875rem",
  }),
  input: (base: object) => ({
    ...base,
    color: "var(--text-primary)",
    fontSize: "0.875rem",
  }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base: object) => ({
    ...base,
    color: "var(--text-muted)",
    padding: "0 0.5rem",
    "&:hover": { color: "var(--text-secondary)" },
  }),
  clearIndicator: (base: object) => ({
    ...base,
    color: "var(--text-muted)",
    padding: "0 0.25rem",
    "&:hover": { color: "var(--text-secondary)" },
  }),
  noOptionsMessage: (base: object) => ({
    ...base,
    color: "var(--text-muted)",
    fontSize: "0.85rem",
  }),
};

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

  const options = toOptions(filteredPoliticians);
  const selectedOption = selected
    ? options.find((o) => o.value === selected.bioguide_id) ?? null
    : null;

  function handleChange(opt: Option | null) {
    const pol = opt
      ? (politicians.find((p) => p.bioguide_id === opt.value) ?? null)
      : null;
    onSelect(pol);
  }

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

      <div style={{ marginBottom: "2rem" }}>
        <Select<Option>
          options={options}
          value={selectedOption}
          onChange={handleChange}
          isLoading={loading}
          isDisabled={loading}
          isClearable
          placeholder="Search members..."
          noOptionsMessage={() => "No members found"}
          formatOptionLabel={(opt) => (
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{opt.label}</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{opt.meta}</span>
            </div>
          )}
          styles={selectStyles}
        />
      </div>
    </>
  );
}
