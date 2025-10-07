import React from "react";

export interface RadioGroupProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}

const RadioGroup: React.FC<RadioGroupProps> = ({ options, value, onChange }) => (
  <div className="flex flex-wrap gap-2">
    {options.map(opt => (
      <label
        key={opt}
        className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 cursor-pointer select-none transition-colors text-sm font-medium
          ${value === opt ? 'bg-stuff-primary/10 border-stuff-primary text-stuff-primary' : 'bg-white border-stuff-gray-100 text-stuff-mid hover:border-stuff-mid'}`}
      >
        <input
          type="radio"
          checked={value === opt}
          onChange={() => onChange(opt)}
          className="accent-stuff-primary w-4 h-4 rounded-full border-stuff-gray-100 focus:ring-2 focus:ring-stuff-primary"
        />
        <span>{opt}</span>
      </label>
    ))}
  </div>
);

export default RadioGroup;
