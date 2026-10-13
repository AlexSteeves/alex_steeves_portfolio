import { expect, test } from "bun:test";
import app from "./index";

// Just enough of D1 for the three queries the worker runs.
function fakeEnv() {
  const rows = new Map<string, string>();
  const DB = {
    prepare: (sql: string) => {
      let args: string[] = [];
      const statement = {
        bind: (...values: string[]) => ((args = values), statement),
        first: async () => (rows.has(args[0]!) ? { data: rows.get(args[0]!) } : null),
        all: async () => ({ results: [...rows.keys()].sort().map((symbol) => ({ symbol })) }),
        run: async () => (sql.startsWith("INSERT") ? rows.set(args[0]!, args[1]!) : undefined),
      };
      return statement;
    },
  };
  return { DB, INGEST_TOKEN: "secret" } as never;
}

const body = { symbol: "MU", name: "Micron", currency: "USD", prices: [["2026-10-12", 989.04]] };
const put = (env: never, ticker: string, payload: unknown, token = "secret") =>
  app.request(`/api/stocks/${ticker}`, {
    method: "PUT",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: typeof payload === "string" ? payload : JSON.stringify(payload),
  }, env);

test("upload needs the token", async () => {
  const env = fakeEnv();
  expect((await put(env, "MU", body, "wrong")).status).toBe(401);
  expect((await app.request("/api/stocks/MU", { method: "PUT", body: "{}" }, env)).status).toBe(401);
  expect(await (await app.request("/api/stocks", {}, env)).json()).toEqual([]);
});

test("a valid upload is stored, listed and served with a cache header", async () => {
  const env = fakeEnv();
  expect((await put(env, "mu", { ...body, junk: 1 })).status).toBe(200);

  const list = await app.request("/api/stocks", {}, env);
  expect(await list.json()).toEqual(["MU"]);
  expect(list.headers.get("Cache-Control")).toBe("public, max-age=3600");

  const one = await app.request("/api/stocks/MU", {}, env);
  expect(await one.json()).toEqual(body); // unknown field was dropped
  expect(one.headers.get("Cache-Control")).toBe("public, max-age=3600");
});

test("errors are not cached", async () => {
  const missing = await app.request("/api/stocks/NOPE", {}, fakeEnv());
  expect(missing.status).toBe(404);
  expect(missing.headers.get("Cache-Control")).toBeNull();
});

test("bad uploads are rejected and store nothing", async () => {
  const env = fakeEnv();
  expect((await put(env, "MU", { ...body, currency: "dollars" })).status).toBe(400);
  expect((await put(env, "MU", "not json")).status).toBe(400);
  expect((await put(env, "AAPL", body)).status).toBe(400); // symbol mismatch
  expect((await put(env, "WAY-TOO-LONG-TICKER", { ...body, symbol: "WAY-TOO-LONG-TICKER" })).status).toBe(400);
  expect((await put(env, "BRK.B", { ...body, symbol: "BRK.B" })).status).toBe(200); // dots are real tickers
  expect(await (await app.request("/api/stocks", {}, env)).json()).toEqual(["BRK.B"]);
});
