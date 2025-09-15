"use client";

import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ icon, error, className = "", ...props }, ref) => {
  return (
    <div className="relative flex items-center w-full">
      {icon && <span className="absolute left-4 text-stuff-mid text-lg">{icon}</span>}
      <input
        ref={ref}
        className={`pl-12 pr-4 py-3 border border-stuff-mid rounded-lg w-full text-base focus:outline-none focus:ring-2 focus:ring-stuff-mid bg-stuff-bg placeholder:text-stuff-mid ${className}`}
        aria-invalid={!!error}
        {...props}
      />
    </div>
  );
});

Input.displayName = "Input";
export default Input;
