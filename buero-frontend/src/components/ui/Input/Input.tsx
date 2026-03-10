import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = ({ error, id, className, ...rest }: InputProps) => {
  return (
      <input id={id} aria-invalid={!!error} aria-describedby={error} {...rest} className={`${className} outline-none`}/>
  );
};

export default Input;
