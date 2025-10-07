import React from "react";


export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  palette?: 'success' | 'danger' | 'warning' | 'default';
  options: { value: string; label: string }[];
    placeholder?: string;
  }


const paletteMap: Record<string, string> = {
  default: "border-stuff-gray-100 bg-stuff-white text-stuff-black focus:border-stuff-mid focus:text-stuff-mid",
  success: "border-success-base bg-stuff-white text-stuff-black focus:border-success-base focus:text-success-base",
  danger: "border-danger-base bg-stuff-white text-stuff-black focus:border-danger-base focus:text-danger-base",
  warning: "border-warning-base bg-stuff-white text-stuff-black focus:border-warning-base focus:text-warning-base",
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, palette = 'default', icon, options, className = "", ...props }, ref) => {
    const colorClass = paletteMap[palette];
    return (
      <div className="w-full">
        {label && (
          <label className="block text-stuff-mid font-medium mb-1">{label}</label>
        )}
        <select
          ref={ref}
        className={`${icon ? "pl-12" : "pl-4"} pr-4 py-3 rounded-lg w-full text-base focus:outline-none border-2 border-t-4 placeholder:text-stuff-gray-100 ${colorClass} ${className}`}
          aria-invalid={!!error}
          value={props.value === undefined ? "" : props.value}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <span className="text-stuff-danger text-xs mt-1 block">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
