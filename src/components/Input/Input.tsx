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
    default: "border-stuff-gray-100 bg-stuff-white text-stuff-mid focus:border-stuff-mid",
    success: "border-success-base bg-stuff-white text-stuff-mid focus:border-success-base",
    danger: "border-danger-base bg-stuff-white text-stuff-mid focus:border-danger-base",
    warning: "border-warning-base bg-stuff-white text-stuff-mid focus:border-warning-base",
  };
  // Only use paletteMap if palette is not default
  const colorClass = paletteMap[palette];
  return (
    <div className="relative flex items-center w-full">
      {icon && <span className="absolute left-4 text-stuff-mid text-lg">{icon}</span>}
      <input
        ref={ref}
        className={`pl-12 pr-4 py-3 rounded-lg w-full text-base focus:outline-none border-2 border-t-4 placeholder:text-stuff-gray-100 ${colorClass} ${className}`}
        aria-invalid={!!error}
        {...props}
      />
    </div>
  );
});

Input.displayName = "Input";
export default Input;
