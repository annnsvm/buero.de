import { VARIANT_CLASSES } from '@/helpers/buttoVariantClasses';
import { ButtonHTMLAttributes, ReactNode } from 'react';

type ButtonVariant = keyof typeof VARIANT_CLASSES;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  variant?: ButtonVariant;
}

export type { ButtonProps };
