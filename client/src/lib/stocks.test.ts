import { expect, test } from "bun:test";
import { rangeStart } from "./stocks";

const dates = ["2025-12-30", "2025-12-31", "2026-01-02", "2026-01-05", "2026-01-06", "2026-01-07", "2026-01-08", "2026-01-09"];

test("rangeStart", () => {
  expect(rangeStart(dates, "1W")).toBe(2); // 2026-01-02 is exactly 7 days before the last close
  expect(rangeStart(dates, "YTD")).toBe(1); // baseline is the prior year's last close
  expect(rangeStart(dates, "5Y")).toBe(0); // less history than the range
  expect(rangeStart([], "1M")).toBe(0);
});
