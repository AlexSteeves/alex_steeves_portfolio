// Fetches all upcoming City of Toronto events once, then filters and paginates client-side.
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { TorontoEvent, TorontoEventsResponse } from "shared";
import EventCard from "../components/toronto/EventCard";

const LOADING_WORDS = [
  "Plotting",
  "Scheming",
  "Pondering",
  "Deliberating",
  "Calculating",
  "Reasoning",
  "Contemplating",
  "Strategizing",
];

const SERVER_URL = import.meta.env.DEV ? "http://localhost:3000/api" : "/api";
const PAGE_SIZE = 50;

export default function TorontoEvents() {
  const [allEvents, setAllEvents] = useState<TorontoEvent[]>([]);
  const [page, setPage] = useState(1);
  const [freeOnly, setFreeOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wordIdx, setWordIdx] = useState(0);

  useEffect(() => {
    if (!loading) return;
    const id = setInterval(
      () => setWordIdx((i) => (i + 1) % LOADING_WORDS.length),
      1500,
    );
    return () => clearInterval(id);
  }, [loading]);

  useEffect(() => {
    fetch(`${SERVER_URL}/toronto-events?limit=50`)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json() as Promise<TorontoEventsResponse>;
      })
      .then((data) => {
        setAllEvents(data.events);
        setLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const filtered = freeOnly
    ? allEvents.filter((e) => e.free_event === "Yes")
    : allEvents;

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const events = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleFreeToggle() {
    setFreeOnly((f) => !f);
    setPage(1);
  }

  return (
    <div className="page">
      <div className="toronto-header">
        <h1 className="toronto-title">Toronto Events</h1>
        <p className="toronto-subtitle">
          Upcoming events from the City of Toronto Open Data portal.
        </p>
      </div>

      <div className="toronto-toolbar">
        <label className="toronto-toggle">
          <input
            type="checkbox"
            checked={freeOnly}
            onChange={handleFreeToggle}
          />
          Free events only
        </label>
        {!loading && (
          <span className="toronto-count">
            {filtered.length} event{filtered.length !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {loading && (
        <div style={{ textAlign: "center", padding: "4rem 0" }}>
          <div className="spinner" style={{ margin: "0 auto 1.5rem" }} />
          <div
            style={{
              position: "relative",
              height: "1.5rem",
              overflow: "hidden",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={wordIdx}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.3, ease: [0.33, 1, 0.68, 1] }}
                style={{
                  position: "absolute",
                  width: "100%",
                  fontSize: "0.875rem",
                  color: "var(--text-muted)",
                  margin: 0,
                }}
              >
                {LOADING_WORDS[wordIdx]}...
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
      )}

      {error && <p className="toronto-empty">Failed to load events: {error}</p>}

      {!loading && !error && (
        <>
          <div className="toronto-grid">
            {events.length === 0 ? (
              <p className="toronto-empty">No upcoming events found.</p>
            ) : (
              events.map((event) => <EventCard key={event.id} event={event} />)
            )}
          </div>

          {totalPages > 1 && (
            <div className="toronto-pagination">
              <button
                className="btn"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                ← Prev
              </button>
              <span className="toronto-page-info">
                {page} / {totalPages}
              </span>
              <button
                className="btn"
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
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
