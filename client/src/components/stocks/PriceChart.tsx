// Single-series daily close line chart with a crosshair + tooltip.
// Plain SVG sized to its container; x is the trading-day index, so weekends
// and holidays leave no gaps.
import type React from "react";
import { useLayoutEffect, useRef, useState } from "react";
import type { PricePoint } from "shared";

const HEIGHT = 380;
const MARGIN = { top: 12, right: 12, bottom: 28, left: 48 };

// Round tick spacing up to 1, 2 or 5 times a power of ten.
function niceStep(range: number, count: number): number {
  const raw = range / count;
  const pow = 10 ** Math.floor(Math.log10(raw));
  const unit = raw / pow;
  return (unit <= 1 ? 1 : unit <= 2 ? 2 : unit <= 5 ? 5 : 10) * pow;
}

type Props = {
  prices: PricePoint[];
  format: (value: number) => string;
};

export default function PriceChart({ prices, format }: Props): React.ReactElement {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);
  const [hover, setHover] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    setWidth(el.clientWidth);
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const plotW = Math.max(0, width - MARGIN.left - MARGIN.right);
  const plotH = HEIGHT - MARGIN.top - MARGIN.bottom;
  const last = prices.length - 1;

  const closes = prices.map(([, close]) => close);
  const step = niceStep(Math.max(...closes) - Math.min(...closes), 4);
  const yMin = Math.floor(Math.min(...closes) / step) * step;
  const yMax = Math.max(...closes);
  const yTicks: number[] = [];
  for (let v = yMin; v <= yMax; v += step) yTicks.push(v);

  // First trading day of each calendar year.
  const yearTicks: { index: number; year: string }[] = [];
  prices.forEach(([date], i) => {
    const prev = prices[i - 1];
    if (prev && prev[0].slice(0, 4) !== date.slice(0, 4)) {
      yearTicks.push({ index: i, year: date.slice(0, 4) });
    }
  });

  const x = (i: number) => MARGIN.left + (i / last) * plotW;
  const y = (v: number) => MARGIN.top + (1 - (v - yMin) / (yMax - yMin)) * plotH;
  const path = prices.map(([, close], i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(close).toFixed(1)}`).join("");

  function handleMove(e: React.PointerEvent<SVGSVGElement>) {
    const px = e.clientX - e.currentTarget.getBoundingClientRect().left;
    const i = Math.round(((px - MARGIN.left) / plotW) * last);
    setHover(Math.min(last, Math.max(0, i)));
  }

  const hovered = hover === null ? undefined : prices[hover];

  return (
    <div className="price-chart" ref={wrapRef}>
      {width > 0 && (
        <svg
          width={width}
          height={HEIGHT}
          role="img"
          aria-label={`Daily closing price from ${prices[0]?.[0]} to ${prices[last]?.[0]}`}
          onPointerMove={handleMove}
          onPointerLeave={() => setHover(null)}
        >
          {yTicks.map((tick) => (
            <g key={tick}>
              <line className="price-chart-grid" x1={MARGIN.left} x2={width - MARGIN.right} y1={y(tick)} y2={y(tick)} />
              <text className="price-chart-label" x={MARGIN.left - 8} y={y(tick)} textAnchor="end" dominantBaseline="middle">
                {tick}
              </text>
            </g>
          ))}
          {yearTicks.map(({ index, year }) => (
            <text key={year} className="price-chart-label" x={x(index)} y={HEIGHT - 8} textAnchor="middle">
              {year}
            </text>
          ))}
          <path className="price-chart-line" d={path} />
          {hover !== null && hovered && (
            <>
              <line className="price-chart-crosshair" x1={x(hover)} x2={x(hover)} y1={MARGIN.top} y2={MARGIN.top + plotH} />
              <circle className="price-chart-dot" cx={x(hover)} cy={y(hovered[1])} r={4} />
            </>
          )}
        </svg>
      )}
      {hover !== null && hovered && (
        <div
          className="price-chart-tooltip"
          // Flip to the left of the crosshair past the midpoint so it never clips.
          style={x(hover) > width / 2 ? { right: width - x(hover) + 12 } : { left: x(hover) + 12 }}
        >
          <span className="price-chart-tooltip-value">{format(hovered[1])}</span>
          <span className="price-chart-tooltip-date">{hovered[0]}</span>
        </div>
      )}
    </div>
  );
}
