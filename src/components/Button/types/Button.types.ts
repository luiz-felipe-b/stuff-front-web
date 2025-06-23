import { ReactNode } from 'react';

export type ButtonSize = 'sm' | 'md' | 'lg';
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary';
export type ButtonPalette = 'default' | 'danger' | 'success';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button content */
  children?: ReactNode;
  /** Button size */
  size?: ButtonSize;
  /** Button visual variant */
  variant?: ButtonVariant;
  /** Color palette */
  palette?: ButtonPalette;
  /** Icon to display before text */
  iconBefore?: ReactNode;
  /** Icon to display after text */
  iconAfter?: ReactNode;
  /** Loading state */
  loading?: boolean;
  /** Full width button */
  fullWidth?: boolean;
  /** Button as link */
  as?: 'button' | 'a';
  /** Href for link buttons */
  href?: string;
  /** Target for link buttons */
  target?: string;
}

export interface ButtonGroupProps {
  children: ReactNode;
  /** Vertical orientation */
  vertical?: boolean;
  /** Attached buttons (no gap) */
  attached?: boolean;
  /** Full width group */
  fullWidth?: boolean;
  className?: string;
}