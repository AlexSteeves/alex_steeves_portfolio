// Searchable single-choice picker: type to filter, arrows and Enter (or a
// click) to choose. Base UI supplies the behaviour; the look is in App.css.
import { Combobox as Base } from "@base-ui/react/combobox";
import type React from "react";

type Props = {
  label: string;
  options: string[];
  value: string;
  onChange: (value: string) => void;
};

export default function Combobox({ label, options, value, onChange }: Props): React.ReactElement {
  return (
    // Clearing the text reports null; ignore it so a stock always stays selected.
    <Base.Root items={options} value={value} onValueChange={(next) => next && onChange(next)} autoHighlight>
      <Base.InputGroup className="combobox">
        <Base.Input aria-label={label} placeholder="Search" spellCheck={false} />
        <Base.Trigger className="combobox-trigger" aria-label={`Show ${label.toLowerCase()} list`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
            <path d="M2.5 4.5 6 8l3.5-3.5" />
          </svg>
        </Base.Trigger>
      </Base.InputGroup>
      <Base.Portal>
        <Base.Positioner className="combobox-positioner" align="start" sideOffset={4}>
          <Base.Popup className="combobox-popup">
            <Base.Empty className="combobox-empty">No match</Base.Empty>
            <Base.List>
              {(option: string) => (
                <Base.Item key={option} value={option} className="combobox-item">
                  {option}
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
