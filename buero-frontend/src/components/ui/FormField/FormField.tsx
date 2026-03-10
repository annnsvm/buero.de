import type { FormFieldProps } from '@/types/components/ui/FormField.type';

const FormField = ({ label, name, error, children }: FormFieldProps) => {
  return (
    <div className="relative flex w-full flex-col">
      {label ? <label htmlFor={name}>{label}</label> : null}
      {children}
      {error ? (
        <p id={`${name}-error`} role="alert" className="mt-1 text-sm text-[var(--color-error)]">
          {error}
        </p>
      ) : null}
    </div>
  );
};

export default FormField;
