// Hairline bento grid. The grid's gap shows the border colour through, so
// cells are divided by 1px rules and never drawn as filled cards. Layouts are
// named grid-template-areas in App.css; a Tile picks its area.
import type React from "react";

export function Bento({ layout, children }: { layout: string; children: React.ReactNode }): React.ReactElement {
  return <div className={`bento bento-${layout}`}>{children}</div>;
}

type TileProps = {
  area: string;
  title?: string;
  aside?: React.ReactNode; // right side of the title row: legend, readout
  children: React.ReactNode;
};

export function Tile({ area, title, aside, children }: TileProps): React.ReactElement {
  return (
    <section className="tile" style={{ gridArea: area }}>
      {(title || aside) && (
        <header className="tile-header">
          {title && <h3 className="eyebrow-label">{title}</h3>}
          {aside}
        </header>
      )}
      {children}
    </section>
  );
}

type StatProps = {
  area: string;
  title: string;
  value: string;
  note?: string;
  negative?: boolean;
};

// One headline number with a line of context.
export function StatTile({ area, title, value, note, negative }: StatProps): React.ReactElement {
  return (
    <Tile area={area} title={title}>
      <p className={`stat-value${negative ? " negative" : ""}`}>{value}</p>
      {note && <p className="stat-note">{note}</p>}
    </Tile>
  );
}

type RangeProps = {
  area: string;
  title: string;
  low: number;
  high: number;
  value: number;
  format: (value: number) => string;
};

// Where a value sits between a low and a high. A tick, not a knob: it is a
// readout and should not look draggable.
export function RangeTile({ area, title, low, high, value, format }: RangeProps): React.ReactElement {
  const position = high > low ? Math.min(1, Math.max(0, (value - low) / (high - low))) : 0.5;
  return (
    <Tile area={area} title={title}>
      <div
        className="range-bar"
        role="img"
        aria-label={`${format(value)}, between a low of ${format(low)} and a high of ${format(high)}`}
      >
        <span className="range-bar-tick" style={{ left: `${position * 100}%` }} />
      </div>
      <div className="range-bar-ends">
        <span>{format(low)}</span>
        <span>{format(high)}</span>
      </div>
    </Tile>
  );
}
