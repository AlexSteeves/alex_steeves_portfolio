import { useEffect, useState } from "react";
import type {
  Politician,
  PoliticianCommittee,
  TradeRow,
  TradesResponse,
} from "shared";
import PoliticianFilter from "../components/capitoltrades/PoliticianFilter";
import CommitteeList from "../components/capitoltrades/CommitteeList";
import TradeTable from "../components/capitoltrades/TradeTable";

const SERVER_URL = import.meta.env.DEV ? "http://localhost:3000/api" : "/api";
const LIMIT = 100;

export default function SenateWatch() {
  const [politicians, setPoliticians] = useState<Politician[]>([]);
  const [selected, setSelected] = useState<Politician | null>(null);
  const [committees, setCommittees] = useState<PoliticianCommittee[]>([]);
  const [trades, setTrades] = useState<TradeRow[]>([]);
  const [tradeCount, setTradeCount] = useState(0);
  const [page, setPage] = useState(1);
  const [loadingPols, setLoadingPols] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [friendlyDate, setFriendlyDate] = useState(true);
  const [minValue, setMinValue] = useState(0);
  const [publicOnly, setPublicOnly] = useState(false);

  useEffect(() => {
    fetch(`${SERVER_URL}/politicians`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<Politician[]>;
      })
      .then((data) => {
        setPoliticians(Array.isArray(data) ? data : []);
        setLoadingPols(false);
      })
      .catch(() => setLoadingPols(false));
  }, []);

  useEffect(() => {
    if (!selected) return;
    setLoadingDetail(true);

    const controller = new AbortController();
    const { signal } = controller;

    Promise.all([
      fetch(`${SERVER_URL}/politicians/${selected.bioguide_id}/committees`, {
        signal,
      }).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<PoliticianCommittee[]>;
      }),
      fetch(
        `${SERVER_URL}/trades?politician=${encodeURIComponent(selected.politician_name)}&limit=${LIMIT}&page=${page}`,
        { signal },
      ).then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<TradesResponse>;
      }),
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

  const maxTotal = Math.max(0, ...politicians.map((p) => p.total_value));
  const totalPages = Math.ceil(tradeCount / LIMIT);

  return (
    <main className="page">
      <div style={{ marginBottom: "2rem" }}>
        <h1
          style={{
            fontSize: "2rem",
            color: "var(--text-primary)",
            marginBottom: "0.5rem",
          }}
        >
          Senate Watch
        </h1>
        <div
          style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}
        >
          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Senate trades are sourced from{" "}
            <a
              href="https://capitoltrades.com"
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--green-bright)" }}
            >
              Capitol Trades
            </a>
            .
          </p>

          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Committee memberships sourced from the{" "}
            <a
              href="https://github.com/unitedstates/congress-legislators"
              target="_blank"
              rel="noreferrer"
              style={{ color: "var(--green-bright)" }}
            >
              unitedstates/congress-legislators
            </a>{" "}
            open data project.
          </p>

          <p style={{ color: "var(--text-secondary)", fontSize: "0.875rem" }}>
            Use the slider to filter members by total traded value, then select
            a member to view their committee assignments and individual trades.
          </p>
        </div>
      </div>

      <PoliticianFilter
        politicians={politicians}
        loading={loadingPols}
        minValue={minValue}
        maxTotal={maxTotal}
        selected={selected}
        onMinValueChange={(v) => {
          setMinValue(v);
          setSelected(null);
        }}
        onSelect={handleSelect}
      />

      {selected && (
        <>
          <CommitteeList loading={loadingDetail} committees={committees} />
          <TradeTable
            loading={loadingDetail}
            trades={trades}
            tradeCount={tradeCount}
            page={page}
            totalPages={totalPages}
            friendlyDate={friendlyDate}
            publicOnly={publicOnly}
            onPageChange={setPage}
            onFriendlyDateChange={setFriendlyDate}
            onPublicOnlyChange={setPublicOnly}
          />
        </>
      )}
    </main>
  );
}
