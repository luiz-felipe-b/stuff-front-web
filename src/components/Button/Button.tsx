"use client";

import React, { forwardRef } from 'react';
import clsx from 'clsx';
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
  const base = "inline-flex items-center justify-center font-semibold transition focus:outline-none disabled:opacity-60 rounded-2xl shadow-[2px_4px_0_0_rgba(0,0,0,0.1)] border active:shadow-none active:translate-y-[2px]";
  const sizeMap = {
    sm: "text-sm px-3 py-1.5",
    md: "text-base px-4 py-2",
    lg: "text-lg px-6 py-3",
  };
  // Variant colors (cartoonish, playful)
  const variantMap: Record<string, string> = {
    primary: "border-2",
    secondary: "border-2 bg-transparent",
    tertiary: "border-transparent bg-transparent",
  };
  const paletteMap: Record<string, string> = {
    default: "bg-stuff-light text-stuff-white border-stuff-mid",
    success: "bg-success-light text-stuff-white border-success-base",
    danger: "bg-danger-light text-stuff-white border-danger-base",
    warning: "bg-warning-light text-stuff-white border-warning-base",
  };
  // Compose classes
  const classNames = clsx(
    base,
    sizeMap[size],
    paletteMap[palette],
    variantMap[variant],
    isIconOnly && "p-2",
    loading && "opacity-60 cursor-wait",
    fullWidth && "w-full",
    disabled
      ? "opacity-60 cursor-not-allowed border-b-2 border-t-4 border-l-2 border-r-2"
      : "border-b-4 border-t-2 border-l-2 border-r-2 cursor-pointer active:border-b-2 active:border-t-4",
    className
  );

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