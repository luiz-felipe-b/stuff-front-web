"use client";

import React from "react";
import clsx from "clsx";

export interface ToggleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    pressed: boolean;
    palette?: "primary" | "secondary" | "success" | "danger" | "outline";
    size?: "sm" | "md" | "lg";
    children: React.ReactNode;
    disabled?: boolean;
    className?: string;
}

const paletteMap: Record<string, string> = {
    primary: "bg-stuff-light text-stuff-white border-stuff-mid",
    success: "bg-success-light text-stuff-white border-success-base",
    danger: "bg-danger-light text-stuff-white border-danger-base",
    warning: "bg-warning-light text-stuff-white border-warning-base",
};

const sizeMap: Record<string, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
};

const ToggleButton = React.forwardRef<HTMLButtonElement, ToggleButtonProps>(
    ({ pressed, palette = "primary", size = "md", children, className = "", disabled = false, ...props }, ref) => {
        return (
            <button
                ref={ref}
                type="button"
                aria-pressed={pressed}
                className={clsx(
                    "inline-flex items-center justify-center font-semibold transition focus:outline-none disabled:opacity-60 rounded-2xl border active:shadow-none active:translate-y-[2px]",
                    paletteMap[palette],
                    sizeMap[size],
                    pressed ? "border-b-2 border-t-4 border-l-2 border-r-2 opacity-60 shadow-none" : "border-b-4 border-t-2 border-l-2 border-r-2 shadow-[2px_4px_0_0_rgba(0,0,0,0.1)]",
                    disabled
                        ? "opacity-60 cursor-not-allowed border-b-2 border-t-4 border-l-2 border-r-2"
                        : "cursor-pointer active:border-b-2 active:border-t-4",
                    className
                )}
                {...props}
            >
                {children}
            </button>
        );
    }
);

ToggleButton.displayName = "ToggleButton";
export default ToggleButton;
