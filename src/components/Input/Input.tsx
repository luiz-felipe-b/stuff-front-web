"use client";

import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
  palette?: 'success' | 'danger' | 'warning';
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ icon, error, className = "", palette = 'default', ...props }, ref) => {
  // Variant and palette maps for consistent styling logic with Button
  // const variantMap: Record<string, string> = {
  //   default: "border-2",
  // };
  const paletteMap: Record<string, string> = {
    default: `border-stuff-gray-100 bg-stuff-white text-stuff-black focus:border-stuff-light focus:text-stuff-light ${props.disabled ? "text-stuff-gray-100" : ""} `,
    success: `border-success-base bg-stuff-white text-stuff-black focus:border-success-base focus:text-success-base ${props.disabled ? "text-stuff-gray-100" : ""}`,
    danger: `border-danger-base bg-stuff-white text-stuff-black focus:border-danger-base focus:text-danger-base ${props.disabled ? "text-stuff-gray-100" : ""}`,
    warning: `border-warning-base bg-stuff-white text-stuff-black focus:border-warning-base focus:text-warning-base ${props.disabled ? "text-stuff-gray-100" : ""}`,
  };
  // Only use paletteMap if palette is not default
  const colorClass = paletteMap[palette];
  return (
    <div className="relative flex items-center w-full">
      {icon && <span className="absolute left-4 text-stuff-light text-lg">{icon}</span>}
      <input
        ref={ref}
        className={`${icon ? "pl-12" : "pl-4"} pr-4 py-3 rounded-lg w-full text-base focus:outline-none border-2 border-t-4 placeholder:text-stuff-gray-100 ${colorClass} ${className}`}
        aria-invalid={!!error}
        {...props}
      />
    </div>
  );
});

Input.displayName = "Input";
export default Input;
