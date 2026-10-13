// Time-range picker. Native radios: one choice, arrow-key navigation and
// screen-reader state come from the browser.
import type React from "react";
import { RANGES, type Range } from "../../lib/stocks";

type Props = {
  name: string; // unique per panel so groups on one page stay independent
  value: Range;
  onChange: (range: Range) => void;
};

export default function RangeTabs({ name, value, onChange }: Props): React.ReactElement {
  return (
    <fieldset className="range-tabs">
      <legend className="visually-hidden">Time range</legend>
      {RANGES.map((range) => (
        <label key={range} className="range-tab">
          <input type="radio" name={name} checked={range === value} onChange={() => onChange(range)} />
          <span>{range}</span>
        </label>
      ))}
    </fieldset>
  );
}
