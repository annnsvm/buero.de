import type { ButtonHTMLAttributes, ReactNode } from "react";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}
const Button = ({
  children,
  isLoading = false,
  disabled,
  className = "",
  type = "button",
  ...rest
}: ButtonProps) => {

  return (
    <button
      type={type}
      className={className}
      disabled={disabled || isLoading}
      aria-busy={isLoading}
      {...rest}
    >
      {
        children
}
    </button>
  );
};

export default Button;
