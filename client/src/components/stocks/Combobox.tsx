// Stock picker: a button showing the current ticker opens a list with its own
// search field, which starts empty so typing always searches. Matches on
// ticker or company name. Base UI supplies the behaviour; the look is in App.css.
import { Combobox as Base } from "@base-ui/react/combobox";
import type React from "react";
import type { StockListing } from "shared";

type Props = {
  label: string;
  options: StockListing[];
  value: string; // symbol
  onChange: (symbol: string) => void;
};

export default function Combobox({ label, options, value, onChange }: Props): React.ReactElement {
  return (
    <Base.Root
      items={options}
      value={options.find((option) => option.symbol === value) ?? null}
      onValueChange={(next) => next && onChange(next.symbol)}
      // The text the search matches against.
      itemToStringLabel={(option) => `${option.symbol} ${option.name}`}
      autoHighlight
    >
      <Base.Trigger className="combobox" aria-label={`${label}: ${value}`}>
        {value}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M2.5 4.5 6 8l3.5-3.5" />
        </svg>
      </Base.Trigger>
      <Base.Portal>
        <Base.Positioner className="combobox-positioner" align="start" sideOffset={4}>
          <Base.Popup className="combobox-popup" aria-label={label}>
            <Base.Input
              className="combobox-search"
              aria-label={`Search ${label.toLowerCase()}s`}
              placeholder="Ticker or company"
              spellCheck={false}
            />
            <Base.Empty className="combobox-empty">No match</Base.Empty>
            <Base.List className="combobox-list">
              {(option: StockListing) => (
                <Base.Item key={option.symbol} value={option} className="combobox-item">
                  <b>{option.symbol}</b>
                  <span>{option.name}</span>
                  <Base.ItemIndicator>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
                      <path d="m2.5 6.5 2.5 2.5 4.5-5.5" />
                    </svg>
                  </Base.ItemIndicator>
                </Base.Item>
              )}
            </Base.List>
          </Base.Popup>
        </Base.Positioner>
      </Base.Portal>
    </Base.Root>
  );
}
