// Displays a single Toronto event with date, location, category, and free/paid status.
import type React from "react";
import type { TorontoEvent } from "shared";
import { formatDateRange, formatLocation } from "./helper";

type Props = { event: TorontoEvent };

function EventCard({ event }: Props): React.ReactElement {
  return (
    <div className="card event-card">
      <div className="event-card-badges">
        <span
          className={`badge ${event.free_event === "Yes" ? "event-badge-free" : "event-badge-paid"}`}
        >
          {event.free_event === "Yes" ? "Free" : "Paid"}
        </span>
        {event.event_category.slice(0, 2).map((cat) => (
          <span key={cat} className="badge event-badge-category">
            {cat}
          </span>
        ))}
      </div>

      <div className="event-card-name">{event.event_name}</div>

      <div className="event-card-meta">
        <div className="event-card-meta-row">
          <span>📅</span>
          <span>
            {formatDateRange(event.event_startdate, event.event_enddate)}
          </span>
        </div>
        <div className="event-card-meta-row">
          <span>📍</span>
          <span>{formatLocation(event.event_locations)}</span>
        </div>
      </div>

      {event.short_description && (
        <p className="event-card-desc">{event.short_description}</p>
      )}

      {event.event_website && (
        <div className="event-card-footer">
          <a
            href={event.event_website}
            target="_blank"
            rel="noopener noreferrer"
            className="event-card-link"
          >
            Visit website →
          </a>
        </div>
      )}
    </div>
  );
}

export default EventCard;
