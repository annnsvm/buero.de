import type { ButtonHTMLAttributes, ReactNode } from "react";

const BASE_CLASSES =
  "inline-flex items-center justify-center px-6 py-2.5 rounded-[100px] border transition-all duration-200 ease-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]";

const VARIANT_CLASSES = {
  outline:
    "border-[var(--opacity-white-60)] text-[var(--color-white)] hover:bg-[var(--color-primary-foreground)] hover:border-[var(--color-primary-foreground)]",
  outlineDark:
    "border-[var(--color-border-default)] text-[var(--color-text-primary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]",
  solid:
    "border-[var(--color-primary-foreground)] bg-[var(--color-primary-foreground)] text-[var(--color-white)] hover:bg-[var(--opacity-neutral-darkest-15)] hover:border-[var(--opacity-white-60)] hover:text-[var(--color-primary-foreground)]",
} as const;

type ButtonVariant = keyof typeof VARIANT_CLASSES;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  variant?: ButtonVariant;
}

const Button = ({
  children,
  isLoading = false,
  disabled,
  className = "",
  type = "button",
  variant = "outline",
  ...rest
}: ButtonProps) => {
  const combinedClassName = [
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={combinedClassName}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...rest}
    >
      {children}
    </button>
  );
};

export default Button;
