import { ChevronDown } from "lucide-react";
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
  default: "border-stuff-gray-100 bg-stuff-white text-stuff-black focus:border-stuff-light focus:text-stuff-light",
  success: "border-success-base bg-stuff-white text-stuff-black focus:border-success-base focus:text-success-base",
  danger: "border-danger-base bg-stuff-white text-stuff-black focus:border-danger-base focus:text-danger-base",
  warning: "border-warning-base bg-stuff-white text-stuff-black focus:border-warning-base focus:text-warning-base",
};


const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, palette = 'default', icon, options, className = "", ...props }, ref) => {
    const colorClass = paletteMap[palette];
  const [focused, setFocused] = React.useState(false);
  const isDisabled = !!props.disabled;
    return (
      <div className="w-full relative">
        {label && (
          <label className="block text-stuff-light font-medium mb-1">{label}</label>
        )}
        <div className="relative">
          <select
            ref={ref}
            className={
              `${icon ? "pl-12" : "pl-4"} pr-10 py-3 rounded-lg w-full text-base focus:outline-none border-2 border-t-4 placeholder:text-stuff-gray-100 ${colorClass} ${className} appearance-none [-webkit-appearance:none] [-moz-appearance:none]` +
              (isDisabled ? " bg-stuff-gray-100 text-stuff-gray-100 cursor-not-allowed opacity-60" : "")
            }
            aria-invalid={!!error}
            value={props.value === undefined ? "" : props.value}
            onFocus={e => { setFocused(true); props.onFocus && props.onFocus(e); }}
            onBlur={e => { setFocused(false); props.onBlur && props.onBlur(e); }}
            disabled={isDisabled}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {/* Chevron icon */}
          <span
            className={`pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 transition-transform duration-200 ${focused ? 'rotate-180 text-stuff-light' : 'text-stuff-gray-100'}`}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <ChevronDown size={20} />
          </span>
        </div>
        {error && <span className="stuff-danger-light text-xs mt-1 block">{error}</span>}
      </div>
    );
  }
);

Select.displayName = "Select";
export default Select;
