import { expect, test } from "bun:test";
import { parsePriceHistory } from "./validate";

const good = {
  symbol: "MU",
  name: "Micron Technology, Inc.",
  currency: "USD",
  prices: [["2026-10-09", 980.1], ["2026-10-12", 989.04]],
  open: [975, 985],
  high: [990, 1002.67],
  low: [970, 978.5],
  volume: [20000000, 23711800],
  sma200: [null, 705.24],
  rsi14: [43.1, 44.66],
};
const bad = (change: Record<string, unknown>) => parsePriceHistory("MU", { ...good, ...change });

test("accepts the fetcher's shape and the older closes-only shape", () => {
  expect(parsePriceHistory("MU", good)).toEqual(good);
  const { symbol, name, currency, prices } = good;
  expect(parsePriceHistory("MU", { symbol, name, currency, prices })).toEqual({ symbol, name, currency, prices });
});

const cycle = {
  quarterEnd: "2026-09-03",
  grossMargin: 0.868,
  inventoryDays: 142,
  priorInventoryDays: 122,
  pe: 12.8,
  evEbitda: null,
  peaks: [{ end: "2018-08-30", grossMargin: 0.61, pe: 4.6, evEbitda: 3.2 }],
  buyers: ["MSFT", "ORCL"],
  capexQuarter: "2026Q2",
  capexGrowth: 0.865,
};

test("accepts a cycle summary, strips its unknown fields, rejects a malformed one", () => {
  expect(parsePriceHistory("MU", { ...good, cycle })).toEqual({ ...good, cycle });
  const extra = { ...cycle, note: "<script>", peaks: [{ ...cycle.peaks[0], note: "x" }] };
  expect(parsePriceHistory("MU", { ...good, cycle: extra })).toEqual({ ...good, cycle });
  expect(bad({ cycle: { ...cycle, grossMargin: "87%" } })).toBe("Invalid cycle");
  expect(bad({ cycle: { ...cycle, peaks: [{ end: "2018", grossMargin: 0.61, pe: 4.6, evEbitda: 3.2 }] } })).toBe("Invalid cycle");
  expect(bad({ cycle: { ...cycle, buyers: ["<b>"] } })).toBe("Invalid cycle");
  expect(bad({ cycle: { ...cycle, capexQuarter: "soon" } })).toBe("Invalid cycle");
  expect(bad({ cycle: "high" })).toBe("Invalid cycle");
});

test("drops fields it does not know", () => {
  expect(parsePriceHistory("MU", { ...good, extra: "<script>" })).toEqual(good);
});

test("rejects bodies the page could not render", () => {
  expect(parsePriceHistory("MU", null)).toBeString();
  expect(parsePriceHistory("MU", [])).toBeString();
  expect(parsePriceHistory("AAPL", good)).toBe("Symbol does not match the URL");
  expect(bad({ name: "" })).toBe("Invalid name");
  expect(bad({ name: "x".repeat(201) })).toBe("Invalid name");
  expect(bad({ currency: "dollars" })).toBe("Invalid currency");
  expect(bad({ currency: "usd" })).toBe("Invalid currency");
  expect(bad({ prices: [] })).toBe("Invalid prices");
  expect(bad({ prices: Array(3001).fill(["2026-10-12", 1]) })).toBe("Invalid prices");
  expect(bad({ prices: [["2026-10-09", "980"], ["2026-10-12", 989]] })).toBe("Invalid price point");
  expect(bad({ prices: [["Oct 9", 980], ["2026-10-12", 989]] })).toBe("Invalid price point");
  expect(bad({ prices: [["2026-10-09", 980, 1], ["2026-10-12", 989]] })).toBe("Invalid price point");
  expect(bad({ volume: [1] })).toBe("Invalid volume"); // wrong length
  expect(bad({ high: [990, "1002"] })).toBe("Invalid high");
  expect(bad({ open: [null, 985] })).toBe("Invalid open"); // only indicators may be null
  expect(bad({ rsi14: [43.1, "x"] })).toBe("Invalid rsi14");
  expect(bad({ sma200: "none" })).toBe("Invalid sma200");
});
