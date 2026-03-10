import type { TradeRow } from "shared";
import { formatDate } from "./utils";

export default function TradeTableRow({
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
