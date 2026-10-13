// Everything shown for one stock: pass it a PriceHistory and it renders the
// quote, range picker, price + SMA chart, RSI pane and the stat tiles.
import type React from "react";
import { useMemo, useState } from "react";
import type { PriceHistory } from "shared";
import { formatCompact, formatDay, formatPercent, rangeStart, type Range } from "../../lib/stocks";
import { Bento, RangeTile, StatTile, Tile } from "./Bento";
import LineChart from "./LineChart";
import RangeTabs from "./RangeTabs";

const YEAR = 252; // trading days
const NONE = "—";

function rsiNote(rsi: number): string {
  return rsi >= 70 ? "Overbought, 70 or above" : rsi <= 30 ? "Oversold, 30 or below" : "Neutral, 30 to 70";
}

export default function StockPanel({ data }: { data: PriceHistory }): React.ReactElement {
  const [range, setRange] = useState<Range>("1Y");
  const [hover, setHover] = useState<number | null>(null); // index into the visible slice

  const dates = useMemo(() => data.prices.map(([date]) => date), [data]);
  const closes = useMemo(() => data.prices.map(([, close]) => close), [data]);
  const start = useMemo(() => rangeStart(dates, range), [dates, range]);

  const money = (value: number) => value.toLocaleString("en-US", { style: "currency", currency: data.currency });
  const end = closes.length - 1;
  const at = hover === null ? end : Math.min(end, start + hover);
  const base = closes[start] ?? 0;
  const shown = closes[at] ?? 0;
  const latest = closes[end] ?? 0;
  const change = base ? shown / base - 1 : 0;

  const sma = data.sma200?.[end] ?? null;
  const rsi = data.rsi14?.[end] ?? null;
  const volume = data.volume?.[end];
  const recent = data.volume?.slice(-21, -1) ?? [];
  const average = recent.length ? recent.reduce((sum, v) => sum + v, 0) / recent.length : 0;
  const dayLow = data.low?.[end];
  const dayHigh = data.high?.[end];
  const yearLow = Math.min(...(data.low ?? closes).slice(-YEAR));
  const yearHigh = Math.max(...(data.high ?? closes).slice(-YEAR));

  const hoverSma = data.sma200?.[at] ?? null;
  const hoverRsi = data.rsi14?.[at] ?? null;

  return (
    <Bento layout="stock">
      <Tile area="head">
        <div className="stock-head">
          <div>
            <p className="eyebrow-label">{data.symbol}</p>
            <h2 className="stock-name">{data.name}</h2>
          </div>
          <div className="stock-quote">
            <span className="stock-price">{money(shown)}</span>
            <span className={`stock-change${change < 0 ? " negative" : ""}`}>
              {formatPercent(change)}
              <span className="stock-change-span">
                {hover === null ? ` past ${range}` : ` ${formatDay(dates[start] ?? "")} to ${formatDay(dates[at] ?? "")}`}
              </span>
            </span>
          </div>
        </div>
        <RangeTabs
          name={`range-${data.symbol}`}
          value={range}
          onChange={(next) => {
            setRange(next);
            setHover(null);
          }}
        />
      </Tile>

      <Tile
        area="chart"
        title="Price"
        aside={
          <ul className="legend">
            <li>
              <span className="legend-key primary" />
              Close <b>{money(shown)}</b>
            </li>
            <li>
              <span className="legend-key secondary" />
              200-day SMA <b>{hoverSma === null ? NONE : money(hoverSma)}</b>
            </li>
          </ul>
        }
      >
        <LineChart
          label={`${data.symbol} daily close and 200-day moving average`}
          dates={dates.slice(start)}
          series={[
            { values: (data.sma200 ?? []).slice(start), variant: "secondary" },
            { values: closes.slice(start) },
          ]}
          hover={hover}
          onHover={setHover}
        />
      </Tile>

      <StatTile
        area="rsi"
        title="RSI (14)"
        value={rsi === null ? NONE : rsi.toFixed(1)}
        note={rsi === null ? undefined : rsiNote(rsi)}
      />
      <StatTile
        area="sma"
        title="vs 200-day SMA"
        value={sma === null ? NONE : formatPercent(latest / sma - 1)}
        note={sma === null ? undefined : `Average ${money(sma)}`}
        negative={sma !== null && latest < sma}
      />
      <StatTile
        area="vol"
        title="Volume"
        value={volume === undefined ? NONE : formatCompact(volume)}
        note={volume === undefined || !average ? undefined : `${(volume / average).toFixed(1)}× the 20-day average`}
      />

      <Tile
        area="pane"
        title="RSI (14)"
        aside={
          <ul className="legend">
            <li>
              {formatDay(dates[at] ?? "")} <b>{hoverRsi === null ? NONE : hoverRsi.toFixed(1)}</b>
            </li>
          </ul>
        }
      >
        <LineChart
          label={`${data.symbol} 14-day relative strength index`}
          dates={dates.slice(start)}
          series={[{ values: (data.rsi14 ?? []).slice(start) }]}
          domain={[0, 100]}
          refLines={[30, 70]}
          hover={hover}
          onHover={setHover}
        />
      </Tile>

      <RangeTile
        area="day"
        title="Day range"
        low={dayLow ?? latest}
        high={dayHigh ?? latest}
        value={latest}
        format={money}
      />
      <RangeTile area="year" title="52-week range" low={yearLow} high={yearHigh} value={latest} format={money} />
    </Bento>
  );
}
