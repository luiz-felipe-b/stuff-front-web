"use client";

import React, { forwardRef } from 'react';
import { ButtonProps } from './types/Button.types';
import './styles/button.scss';

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
  
  const classNames = [
    'button',
    `button--${size}`,
    `button--${variant}`,
    `button--${palette}`,
    isIconOnly && 'button--icon-only',
    loading && 'button--loading',
    fullWidth && 'button--full-width',
    className
  ].filter(Boolean).join(' ');

  const content = (
    <span className="button__content">
      {(iconBefore || loading) && (
        <span className="button__icon">
          {loading ? null : iconBefore}
        </span>
      )}
      {children && (
        <span className="button__text">
          {children}
        </span>
      )}
      {iconAfter && !loading && (
        <span className="button__icon">
          {iconAfter}
        </span>
      )}
    </span>
  );

  if (as === 'a') {
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