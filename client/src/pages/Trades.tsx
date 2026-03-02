import { useEffect, useState } from "react";
import type {
  Politician,
  PoliticianCommittee,
  TradeRow,
  TradesResponse,
} from "shared";

const SERVER_URL = import.meta.env.DEV ? "http://localhost:3000/api" : "/api";
const LIMIT = 100;


function CommitteeCard({ c }: { c: PoliticianCommittee }) {
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

function formatDate(raw: string | null, friendly: boolean): string {
  if (!raw) return "—";
  if (!friendly) return raw;
  const d = new Date(raw + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function TradeRow_({
  t,
  isLast,
  friendlyDate,
}: {
  t: TradeRow;
  isLast: boolean;
  friendlyDate: boolean;
}) {
  return (
    <tr
      style={{ borderBottom: isLast ? "none" : "1px solid var(--border)" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--bg-card-hover)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "")}
    >
      <td
        style={{
          padding: "0.7rem 1.25rem",
          color: "var(--text-muted)",
          whiteSpace: "nowrap",
          fontSize: "0.85rem",
        }}
      >
        {formatDate(t.tx_date, friendlyDate)}
      </td>
      <td style={{ padding: "0.7rem 1.25rem" }}>
        <span
          style={{
            color: "var(--green-bright)",
            fontWeight: 600,
            fontFamily: "monospace",
            fontSize: "0.875rem",
          }}
        >
          {t.issuer_ticker ?? "—"}
        </span>
        {t.issuer_name && (
          <span
            style={{
              display: "block",
              fontSize: "0.75rem",
              color: "var(--text-muted)",
            }}
          >
            {t.issuer_name}
          </span>
        )}
      </td>
      <td style={{ padding: "0.7rem 1.25rem" }}>
        <span
          className={`badge ${t.tx_type === "buy" ? "badge-green" : "badge-red"}`}
        >
          {t.tx_type ?? "—"}
        </span>
      </td>
      <td
        style={{
          padding: "0.7rem 1.25rem",
          color: "var(--text-secondary)",
          fontSize: "0.85rem",
          whiteSpace: "nowrap",
        }}
      >
        {t.value ?? "—"}
      </td>
    </tr>
  );
}

function Skeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="skeleton"
          style={{ height: "40px", borderRadius: "6px" }}
        />
      ))}
    </div>
  );
}

export default function Trades() {
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [selected, setSelected] = useState<Politician | null>(null);
  const [committees, setCommittees] = useState<PoliticianCommittee[]>([]);
  const [trades, setTrades] = useState<TradeRow[]>([]);
  const [tradeCount, setTradeCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingPols, setLoadingPols] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [friendlyDate, setFriendlyDate] = useState(true);

  // Load politician list once
  useEffect(() => {
    fetch(`${SERVER_URL}/politicians`)
      .then((r) => r.json() as Promise<Politician[]>)
      .then((data) => {
        setPoliticians(data);
        setLoadingPols(false);
      })
      .catch(() => setLoadingPols(false));
  }, []);

  // Load committees + trades when politician or page changes
  useEffect(() => {
    if (!selected) return;
    setLoadingDetail(true);

    const controller = new AbortController();
    const { signal } = controller;

    Promise.all([
      fetch(`${SERVER_URL}/politicians/${selected.bioguide_id}/committees`, { signal }).then(
        (r) => r.json() as Promise<PoliticianCommittee[]>
      ),
      fetch(
        `${SERVER_URL}/trades?politician=${encodeURIComponent(selected.politician_name)}&limit=${LIMIT}&page=${page}`,
        { signal }
      ).then((r) => r.json() as Promise<TradesResponse>),
    ])
      .then(([cData, tData]) => {
        setCommittees(cData);
        setTrades(tData.data);
        setTradeCount(tData.count);
        setLoadingDetail(false);
      })
      .catch((err) => {
        if (err.name === "AbortError") return;
        setLoadingDetail(false);
      });

    return () => controller.abort();
  }, [selected, page]);

  function handleSelect(e: React.ChangeEvent<HTMLSelectElement>) {
    const pol =
      politicians.find((p) => p.bioguide_id === e.target.value) ?? null;
    setSelected(pol);
    setPage(1);
    setCommittees([]);
    setTrades([]);
    setTradeCount(0);
  }

  const totalPages = Math.ceil(tradeCount / LIMIT);
  const parentCommittees = committees.filter((c) => c.committee_id.length <= 4);

  return (
    <main className="page">
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            color: "var(--text-primary)",
            marginBottom: "0.25rem",
          }}
        >
          Capitol Trades
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
          Congressional stock trades — select a member to explore their activity
        </p>
      </div>

      {/* Dropdown */}
      <select
        onChange={handleSelect}
        defaultValue=""
        disabled={loadingPols}
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
          {loadingPols
            ? "Loading members..."
            : "Select a member of Congress..."}
        </option>
        {politicians.map((p) => (
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

      {/* Detail view */}
      {selected && (
        <>
          {/* Committees */}
          <div style={{ marginBottom: "2rem" }}>
            <p className="section-title" style={{ marginBottom: "0.75rem" }}>
              Committee Memberships
            </p>
            {loadingDetail ? (
              <Skeleton rows={3} />
            ) : parentCommittees.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                No committee data found.
              </p>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                {parentCommittees.map((c) => (
                  <CommitteeCard key={c.committee_id} c={c} />
                ))}
              </div>
            )}
          </div>

          {/* Trades */}
          <div>
            <p className="section-title" style={{ marginBottom: "0.75rem" }}>
              Trades
              {tradeCount > 0 && (
                <span
                  style={{
                    marginLeft: "0.5rem",
                    color: "var(--text-muted)",
                    fontWeight: 400,
                    textTransform: "none",
                    letterSpacing: 0,
                  }}
                >
                  · {tradeCount.toLocaleString()} total
                </span>
              )}
            </p>

            {loadingDetail ? (
              <Skeleton rows={8} />
            ) : trades.length === 0 ? (
              <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
                No trades found.
              </p>
            ) : (
              <>
                <div
                  className="card"
                  style={{ padding: 0, overflow: "hidden" }}
                >
                  <div style={{ overflowX: "auto" }}>
                    <table
                      style={{ width: "100%", borderCollapse: "collapse" }}
                    >
                      <thead>
                        <tr
                          style={{
                            borderBottom: "1px solid var(--border)",
                            background: "var(--bg-secondary)",
                          }}
                        >
                          <th
                            style={{
                              padding: "0.65rem 1.25rem",
                              whiteSpace: "nowrap",
                            }}
                          >
                            <label
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "0.4rem",
                                cursor: "pointer",
                                color: "var(--text-muted)",
                                fontWeight: 600,
                                fontSize: "0.72rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                              }}
                            >
                              Date
                              <input
                                type="checkbox"
                                checked={friendlyDate}
                                onChange={(e) =>
                                  setFriendlyDate(e.target.checked)
                                }
                                style={{
                                  cursor: "pointer",
                                  accentColor: "var(--green-bright)",
                                }}
                              />
                            </label>
                          </th>
                          {["Ticker", "Type", "Value"].map((h) => (
                            <th
                              key={h}
                              style={{
                                padding: "0.65rem 1.25rem",
                                textAlign: "left",
                                color: "var(--text-muted)",
                                fontWeight: 600,
                                fontSize: "0.72rem",
                                textTransform: "uppercase",
                                letterSpacing: "0.08em",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {trades.map((t, i) => (
                          <TradeRow_
                            key={t.id}
                            t={t}
                            isLast={i === trades.length - 1}
                            friendlyDate={friendlyDate}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {totalPages > 1 && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginTop: "1rem",
                    }}
                  >
                    <button
                      className="btn"
                      onClick={() => setPage((p) => p - 1)}
                      disabled={page === 1}
                    >
                      ← Prev
                    </button>
                    <span
                      style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}
                    >
                      Page {page} of {totalPages}
                    </span>
                    <button
                      className="btn"
                      onClick={() => setPage((p) => p + 1)}
                      disabled={page === totalPages}
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </main>
  );
}
