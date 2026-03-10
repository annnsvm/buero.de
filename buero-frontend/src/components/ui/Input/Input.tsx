import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = ({ error, id, className = '', ...rest }: InputProps) => {
  const borderClass = error
    ? 'border-2 border-[var(--color-error)] focus-visible:ring-[var(--color-error)]'
    : 'border border-[var(--color-border-default)]';

  return (
    <input
      id={id}
      aria-invalid={!!error}
      aria-describedby={error ? `${id}-error` : undefined}
      {...rest}
      className={`w-full rounded-[12px] px-4 py-2 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-offset-0 ${borderClass} ${className}`.trim()}
    />
  );
};

export default Input;
