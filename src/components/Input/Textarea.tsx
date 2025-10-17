"use client";

import React, { forwardRef } from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  icon?: React.ReactNode;
  error?: string;
  palette?: 'success' | 'danger' | 'warning';
}

const paletteMap: Record<string, string> = {
  default: "border-stuff-gray-100 bg-stuff-white text-stuff-black focus:border-stuff-mid focus:text-stuff-mid",
  success: "border-success-base bg-stuff-white text-stuff-black focus:border-success-base focus:text-success-base",
  danger: "border-danger-base bg-stuff-white text-stuff-black focus:border-danger-base focus:text-danger-base",
  warning: "border-warning-base bg-stuff-white text-stuff-black focus:border-warning-base focus:text-warning-base",
};

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ icon, error, className = "", palette = 'default', ...props }, ref) => {
  const colorClass = paletteMap[palette];
  return (
    <div className="relative flex items-center w-full">
      {icon && <span className="absolute left-4 text-stuff-mid text-lg">{icon}</span>}
      <textarea
        ref={ref}
        className={`${icon ? "pl-12" : "pl-4"} pr-4 py-3 rounded-lg w-full text-base focus:outline-none border-2 border-t-4 placeholder:text-stuff-gray-100 resize-none ${colorClass} ${className}`}
        aria-invalid={!!error}
        {...props}
      />
      {error && <span className="text-stuff-danger text-xs mt-1 block">{error}</span>}
    </div>
  );
});

Textarea.displayName = "Textarea";
export default Textarea;
