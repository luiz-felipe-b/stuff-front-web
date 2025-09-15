"use client";

import React, { forwardRef } from 'react';
import { ButtonProps } from './types/Button.types';
// Tailwind migration: removed button.scss import

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  size = 'md',
  variant = 'primary',
  palette = 'default',
  iconBefore,
  iconAfter,
  loading = false,
  fullWidth = false,
  disabled = false,
  className = '',
  as = 'button',
  href,
  target,
  ...props
}, ref) => {
  const isIconOnly = !children && (iconBefore || iconAfter);

  // Tailwind classes for variants, palettes, sizes
  const base = "inline-flex items-center justify-center font-semibold transition focus:outline-none disabled:opacity-60";
  const sizeMap = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
  };
  const variantMap: Record<string, string> = {
    primary: "bg-stuff-mid text-white hover:bg-stuff-dark",
    secondary: "bg-white text-stuff-mid border border-stuff-mid hover:bg-stuff-bg",
    outline: "bg-transparent text-stuff-mid border border-stuff-mid hover:bg-stuff-bg",
    tertiary: "bg-stuff-bg text-stuff-mid border border-stuff-bg hover:bg-stuff-mid hover:text-white",
  };
  const paletteMap = {
    default: "",
    success: "bg-green-600 hover:bg-green-700 text-white",
    danger: "bg-red-600 hover:bg-red-700 text-white",
  };
  const iconOnly = isIconOnly ? "p-2" : "";
  const loadingClass = loading ? "opacity-60 cursor-wait" : "";
  const fullWidthClass = fullWidth ? "w-full" : "";

  // Compose classes
  const classNames = [
    base,
    sizeMap[size],
    variantMap[variant],
    palette !== "default" ? paletteMap[palette] : "",
    iconOnly,
    loadingClass,
    fullWidthClass,
    className,
  ].filter(Boolean).join(" ");

  const content = (
    <span className="flex items-center gap-2">
      {(iconBefore || loading) && (
        <span className="flex items-center">
          {loading ? null : iconBefore}
        </span>
      )}
      {children && (
        <span>{children}</span>
      )}
      {iconAfter && !loading && (
        <span className="flex items-center">{iconAfter}</span>
      )}
    </span>
  );

  if (as === "a") {
    return (
      <a
        href={href}
        target={target}
        className={classNames}
        {...(props as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      ref={ref}
      className={classNames}
      disabled={disabled || loading}
      {...props}
    >
      {content}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;