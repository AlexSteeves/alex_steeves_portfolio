// Daily line chart: one or more series over a shared date axis, with a
// crosshair the parent controls so several charts can scrub together.
// Plain SVG sized to its container; x is the trading-day index, so weekends
// and holidays leave no gaps.
import type React from "react";
import { useLayoutEffect, useRef, useState } from "react";

const MARGIN = { top: 8, right: 8, bottom: 24, left: 48 };
const X_LABEL_WIDTH = 56;

export type Series = {
  values: (number | null)[]; // aligned to dates; null leaves a gap
  variant?: "primary" | "secondary";
};

type Props = {
  label: string;
  dates: string[]; // YYYY-MM-DD, oldest first
  series: Series[];
  domain?: [number, number]; // fixed y range; fitted to the data when omitted
  refLines?: number[]; // labelled reference lines that replace the y ticks
  hover: number | null;
  onHover: (index: number | null) => void;
};

// Round tick spacing up to 1, 2 or 5 times a power of ten.
function niceStep(range: number, count: number): number {
  const raw = range / count || 1;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const unit = raw / pow;
  return (unit <= 1 ? 1 : unit <= 2 ? 2 : unit <= 5 ? 5 : 10) * pow;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Year boundaries for multi-year spans, month boundaries for multi-month
// spans, otherwise individual days.
function xTicks(dates: string[]): { index: number; text: string }[] {
  const month = (d: string) => MONTHS[Number(d.slice(5, 7)) - 1] ?? "";
  const ticks: { index: number; text: string }[] = [];
  dates.forEach((date, i) => {
    const prev = dates[i - 1];
    if (dates.length > 400) {
      if (prev && prev.slice(0, 4) !== date.slice(0, 4)) ticks.push({ index: i, text: date.slice(0, 4) });
    } else if (dates.length > 45) {
      if (prev && prev.slice(0, 7) !== date.slice(0, 7)) ticks.push({ index: i, text: month(date) });
    } else {
      ticks.push({ index: i, text: `${month(date)} ${Number(date.slice(8))}` });
    }
  });
  return ticks;
}

export default function LineChart({ label, dates, series, domain, refLines, hover, onHover }: Props): React.ReactElement {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setSize({ width: el.clientWidth, height: el.clientHeight });
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const { width, height } = size;
  const plotW = Math.max(0, width - MARGIN.left - MARGIN.right);
  const plotH = Math.max(0, height - MARGIN.top - MARGIN.bottom);
  const last = Math.max(1, dates.length - 1);

  let yMin: number;
  let yMax: number;
  let yTicks: number[];
  if (domain) {
    [yMin, yMax] = domain;
    yTicks = refLines ?? [];
  } else {
    const all = series.flatMap((s) => s.values).filter((v): v is number => v !== null);
    const lo = all.length ? Math.min(...all) : 0;
    const hi = all.length ? Math.max(...all) : 1;
    const step = niceStep(hi - lo, 4);
    yMin = Math.floor(lo / step) * step;
    yMax = Math.ceil(hi / step) * step;
    if (yMax === yMin) yMax = yMin + step;
    yTicks = refLines ?? [];
    if (!refLines) for (let v = yMin; v <= yMax + step / 2; v += step) yTicks.push(v);
  }

  const x = (i: number) => MARGIN.left + (i / last) * plotW;
  const y = (v: number) => MARGIN.top + (1 - (v - yMin) / (yMax - yMin)) * plotH;

  // Drop labels until they have room, always keeping the spacing even.
  const allTicks = xTicks(dates);
  const every = Math.max(1, Math.ceil((allTicks.length * X_LABEL_WIDTH) / Math.max(1, plotW)));
  const ticks = allTicks.filter((_, i) => i % every === 0);

  const path = (values: (number | null)[]) => {
    let d = "";
    let pen = false;
    values.forEach((v, i) => {
      if (v === null) pen = false;
      else {
        d += `${pen ? "L" : "M"}${x(i).toFixed(1)},${y(v).toFixed(1)}`;
        pen = true;
      }
    });
    return d;
  };

  function handleMove(e: React.PointerEvent<SVGSVGElement>) {
    const px = e.clientX - e.currentTarget.getBoundingClientRect().left;
    const i = Math.round(((px - MARGIN.left) / Math.max(1, plotW)) * last);
    onHover(Math.min(dates.length - 1, Math.max(0, i)));
  }

  // Arrow keys scrub the same crosshair the pointer does.
  function handleKey(e: React.KeyboardEvent<SVGSVGElement>) {
    const step = e.key === "ArrowLeft" ? -1 : e.key === "ArrowRight" ? 1 : 0;
    if (!step) return;
    e.preventDefault();
    onHover(Math.min(dates.length - 1, Math.max(0, (hover ?? dates.length - 1) + step)));
  }

  return (
    <div className="line-chart" ref={wrapRef}>
      {width > 0 && height > 0 && (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label={`${label}, ${dates[0]} to ${dates[dates.length - 1]}`}
          tabIndex={0}
          // Clicking does nothing, so it shouldn't take focus and draw the ring; Tab still does.
          onMouseDown={(e) => e.preventDefault()}
          onPointerMove={handleMove}
          onPointerLeave={() => onHover(null)}
          onKeyDown={handleKey}
          onBlur={() => onHover(null)}
        >
          {yTicks.map((tick) => (
            <g key={tick}>
              <line className="line-chart-grid" x1={MARGIN.left} x2={width - MARGIN.right} y1={y(tick)} y2={y(tick)} />
              <text className="line-chart-label" x={MARGIN.left - 8} y={y(tick)} textAnchor="end" dominantBaseline="middle">
                {tick.toLocaleString("en-US")}
              </text>
            </g>
          ))}
          {ticks.map(({ index, text }) => (
            <text key={index} className="line-chart-label" x={x(index)} y={height - 4} textAnchor="middle">
              {text}
            </text>
          ))}
          {series.map((s, i) => (
            <path key={i} className={`line-chart-line ${s.variant ?? "primary"}`} d={path(s.values)} />
          ))}
          {hover !== null && hover < dates.length && (
            <>
              <line className="line-chart-crosshair" x1={x(hover)} x2={x(hover)} y1={MARGIN.top} y2={MARGIN.top + plotH} />
              {series.map((s, i) => {
                const v = s.values[hover];
                return v == null ? null : <circle key={i} className="line-chart-dot" cx={x(hover)} cy={y(v)} r={4} />;
              })}
            </>
          )}
        </svg>
      )}
    </div>
  );
}
