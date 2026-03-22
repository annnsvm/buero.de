import React from "react";
import { InputProps } from "@/types/components/ui/Input.types";



const Input: React.FC<InputProps> = ({ error, id, className = '', onChange = () => {}, ...rest }: InputProps) => {
  const borderClass = error
    ? 'border border-[var(--color-error)] focus-visible:shadow-[var(--shadow-input-error)]'
    : 'border border-[var(--color-border-default)] focus-visible:shadow-[var(--shadow-input-default)]';

  return (
    <input
      id={id}
      onChange={onChange}
      aria-describedby={error ? `${id}-error` : undefined}
      {...rest}
      className={`w-full rounded-[12px] px-4 py-2 transition-all outline-none focus-visible:ring-0 focus-visible:ring-offset-0 ${borderClass} ${className}`}
    />
  );
};

export default Input;
