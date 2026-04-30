// Fetches all upcoming City of Toronto events once, then filters and paginates client-side.
import { useEffect, useState } from "react";
import type { TorontoEvent, TorontoEventsResponse } from "shared";
import EventCard from "../components/toronto/EventCard";

const SERVER_URL = import.meta.env.DEV ? "http://localhost:3000/api" : "/api";
const PAGE_SIZE = 50;

export default function TorontoEvents() {
  const [allEvents, setAllEvents] = useState<TorontoEvent[]>([]);
  const [page, setPage] = useState(1);
  const [freeOnly, setFreeOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        <p
          className="toronto-count"
          style={{ textAlign: "center", padding: "3rem 0" }}
        >
          Loading… (fetching from Toronto Open Data, may take a moment)
        </p>
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
