import React from "react";
import { SwitchProps } from "./Switch.types";

const Switch: React.FC<SwitchProps> = ({ checked, onChange, disabled = false, label, className = "" }) => {
  return (
    <label className={`inline-flex items-center cursor-pointer select-none ${disabled ? 'opacity-60 pointer-events-none' : ''} ${className}`}>
      <span className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={e => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <span
          className={`block w-11 h-6 rounded-full transition-colors duration-200
            ${checked ? 'bg-success-light' : 'bg-danger-light'}`}
        ></span>
        <span
          className={`absolute left-1 top-1 w-4 h-4 rounded-full bg-stuff-white shadow transition-transform duration-200
            ${checked ? 'translate-x-5' : ''}`}
        ></span>
      </span>
      {label && <span className={`ml-3 text-md ${checked ? 'text-success-light' : 'text-danger-light'} font-extrabold`}>{label}</span>}
    </label>
  );
};

export default Switch;
