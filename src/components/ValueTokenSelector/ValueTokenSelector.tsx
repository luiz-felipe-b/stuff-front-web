import React from "react";
import CustomCheckbox from "../CustomCheckbox/CustomCheckbox";

interface ValueTokenSelectorProps {
  options: string[];
  value: string[]; // Always an array for multiselection
  onChange: (newValue: string[]) => void;
}

const ValueTokenSelector: React.FC<ValueTokenSelectorProps> = ({ options, value, onChange }) => {
  const selected = Array.isArray(value) ? value : [];

  const handleToggle = (opt: string, checked: boolean) => {
    let updated: string[];
    if (checked) {
      updated = [...selected, opt];
    } else {
      updated = selected.filter(v => v !== opt);
    }
    onChange(updated);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => {
        const isChecked = selected.includes(opt);
        return (
          <label
            key={opt}
            className={`flex items-center gap-2 px-2 py-1 rounded-lg border-2 border-b-4 transition-colors duration-150 ${isChecked ? 'bg-stuff-light border-stuff-mid text-stuff-white' : 'bg-stuff-white border-stuff-light text-stuff-light'}`}
            style={{ cursor: 'pointer' }}
            onClick={e => {
              if ((e.target as HTMLElement).tagName.toLowerCase() === 'input') return;
              handleToggle(opt, !isChecked);
            }}
          >
            <CustomCheckbox
              checked={isChecked}
              onChange={checked => handleToggle(opt, checked)}
            />
            <span>{opt}</span>
          </label>
        );
      })}
    </div>
  );
};

export default ValueTokenSelector;