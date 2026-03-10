import type { PoliticianCommittee } from "shared";
import CommitteeCard from "./CommitteeCard";
import Skeleton from "./Skeleton";

export default function CommitteeList({
  loading,
  committees,
}: {
  loading: boolean;
  committees: PoliticianCommittee[];
}) {
  const parentCommittees = committees.filter((c) => c.committee_id.length <= 4);

  return (
    <div style={{ marginBottom: "2rem" }}>
      <p className="section-title" style={{ marginBottom: "0.75rem" }}>
        Committee Memberships
      </p>
      {loading ? (
        <Skeleton rows={3} />
      ) : parentCommittees.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          No committee data found.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {parentCommittees.map((c) => (
            <CommitteeCard key={c.committee_id} c={c} />
          ))}
        </div>
      )}
    </div>
  );
}
