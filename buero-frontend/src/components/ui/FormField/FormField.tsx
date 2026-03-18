import type { FormFieldProps } from '@/types/components/ui/FormField.type';

const FormField = ({ label, name, error, children, className }: FormFieldProps) => {
  return (
    <div className={`relative flex w-full flex-col pb-5 ${className}`}>
      {label ? <label htmlFor={name}>{label}</label> : null}
      {children}
      {error ? (
        <p
          id={`${name}-error`}
          role="alert"
          className="absolute -bottom-1 left-3 mt-1 text-sm text-[var(--color-error)]"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default FormField;
