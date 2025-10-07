import React from "react";

export interface MultiCheckboxProps {
  options: string[];
  value: string[];
  onChange: (value: string[]) => void;
}

const MultiCheckbox: React.FC<MultiCheckboxProps> = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(opt => {
      const checked = value.includes(opt);
      return (
        <label
          key={opt}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer select-none transition-colors text-sm font-medium
            ${checked ? 'bg-stuff-primary/10 border-stuff-primary text-stuff-primary' : 'bg-white border-stuff-gray-100 text-stuff-mid hover:border-stuff-mid'}`}
        >
          <input
            type="checkbox"
            checked={checked}
            onChange={e => {
              if (e.target.checked) {
                onChange([...value, opt]);
              } else {
                onChange(value.filter(v => v !== opt));
              }
            }}
            className="accent-stuff-primary w-4 h-4 rounded border-stuff-gray-100 focus:ring-2 focus:ring-stuff-primary"
          />
          <span>{opt}</span>
        </label>
      );
    })}
  </div>
);

export default MultiCheckbox;
