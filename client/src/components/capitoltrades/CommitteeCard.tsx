import type { PoliticianCommittee } from "shared";

export default function CommitteeCard({ c }: { c: PoliticianCommittee }) {
  const info = c.committees;
  if (!info) return null;
  const isChair = c.role === "Chairman" || c.role === "Chairwoman";
  const isRanking = c.role === "Ranking Member";

  return (
    <div
      className="card"
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: "1rem",
        padding: "0.875rem 1.25rem",
      }}
    >
      <div>
        <span
          style={{
            color: "var(--text-primary)",
            fontSize: "0.875rem",
            fontWeight: 500,
          }}
        >
          {info.name}
        </span>
        {info.sector && (
          <span
            style={{
              marginLeft: "0.625rem",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
            }}
          >
            · {info.sector}
          </span>
        )}
      </div>
      {(isChair || isRanking) && (
        <span
          className={`badge ${isChair ? "badge-green" : ""}`}
          style={
            isRanking
              ? {
                  background: "rgba(91,141,217,0.12)",
                  color: "#5b8dd9",
                  border: "1px solid rgba(91,141,217,0.2)",
                }
              : {}
          }
        >
          {c.role}
        </span>
      )}
    </div>
  );
}
