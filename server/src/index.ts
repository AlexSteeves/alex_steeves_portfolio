import { Hono } from "hono";
import { cors } from "hono/cors";
import MU from "./data/MU.json";

const app = new Hono().basePath("/api");

app.use(cors());

// Price history is downloaded ahead of time (scripts/fetch-prices.ts) and bundled
// with the worker, so requests never wait on a third-party API.
app.get("/stocks/MU", (c) => c.json(MU));

export default app;
