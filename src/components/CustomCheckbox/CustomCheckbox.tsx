import React from "react";

interface CustomCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ checked, onChange, disabled }) => (
  <span
    className={`inline-flex items-center justify-center w-5 h-5 rounded-full border-2 transition-colors duration-150 ${checked ? 'bg-stuff-light border-none' : 'bg-stuff-white border-stuff-light'} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
    tabIndex={0}
    role="checkbox"
    aria-checked={checked}
    onClick={e => {
      if (!disabled) onChange(!checked);
    }}
    onKeyDown={e => {
      if (!disabled && (e.key === ' ' || e.key === 'Enter')) {
        e.preventDefault();
        onChange(!checked);
      }
    }}
  >
    {checked && (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-white">
        <path d="M4 8.5L7 11.5L12 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )}
  </span>
);

export default CustomCheckbox;
