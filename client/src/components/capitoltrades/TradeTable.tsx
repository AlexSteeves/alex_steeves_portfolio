import type { TradeRow } from "shared";
import TradeTableRow from "./TradeTableRow";
import Skeleton from "./Skeleton";

interface TradeTableProps {
  loading: boolean;
  trades: TradeRow[];
  tradeCount: number;
  page: number;
  totalPages: number;
  friendlyDate: boolean;
  publicOnly: boolean;
  onPageChange: (page: number) => void;
  onFriendlyDateChange: (v: boolean) => void;
  onPublicOnlyChange: (v: boolean) => void;
}

export default function TradeTable({
  loading,
  trades,
  tradeCount,
  page,
  totalPages,
  friendlyDate,
  publicOnly,
  onPageChange,
  onFriendlyDateChange,
  onPublicOnlyChange,
}: TradeTableProps) {
  const visibleTrades = publicOnly
    ? trades.filter((t) => t.issuer_ticker !== "" && t.issuer_ticker !== null)
    : trades;

  return (
    <div>
      <label
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.4rem",
          marginBottom: "0.75rem",
          cursor: "pointer",
          width: "fit-content",
        }}
      >
        <input
          type="checkbox"
          checked={publicOnly}
          onChange={(e) => onPublicOnlyChange(e.target.checked)}
          style={{ cursor: "pointer", accentColor: "var(--green-bright)" }}
        />
        <span
          style={{
            fontSize: "0.8rem",
            color: "var(--text-secondary)",
            fontWeight: 500,
          }}
        >
          Public stocks only
        </span>
      </label>

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

      {loading ? (
        <Skeleton rows={8} />
      ) : trades.length === 0 ? (
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          No trades found.
        </p>
      ) : (
        <>
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
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
                            onFriendlyDateChange(e.target.checked)
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
                  {visibleTrades.map((t, i) => (
                    <TradeTableRow
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
                onClick={() => onPageChange(page - 1)}
                disabled={page === 1}
              >
                ← Prev
              </button>
              <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                Page {page} of {totalPages}
              </span>
              <button
                className="btn"
                onClick={() => onPageChange(page + 1)}
                disabled={page === totalPages}
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
