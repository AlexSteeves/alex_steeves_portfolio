// Single-choice tab row. Native radios: one choice, arrow-key navigation and
// screen-reader state come from the browser.
import type React from "react";

type Props<T extends string> = {
  name: string; // unique per group so groups on one page stay independent
  legend: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  fit?: boolean; // on phones, share one row equally instead of wrapping
};

export default function Tabs<T extends string>({ name, legend, options, value, onChange, fit }: Props<T>): React.ReactElement {
  return (
    <fieldset className={`tabs${fit ? " tabs-fit" : ""}`}>
      <legend className="visually-hidden">{legend}</legend>
      {options.map((option) => (
        <label key={option} className="tab">
          <input type="radio" name={name} checked={option === value} onChange={() => onChange(option)} />
          <span>{option}</span>
        </label>
      ))}
    </fieldset>
  );
}
