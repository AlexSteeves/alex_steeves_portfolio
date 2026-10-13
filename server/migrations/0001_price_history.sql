-- One row per ticker holding the whole PriceHistory JSON.
-- ponytail: blob per ticker; move to one row per (symbol, date) when something needs to query a date range.
CREATE TABLE price_history (
  symbol TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
