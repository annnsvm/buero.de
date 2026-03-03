import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  name: string;
  error?: string;
  children: ReactNode;
};

const FormField = ({ label, name, error, children }: FormFieldProps) => {
  return (
    <div className="w-full">
      <label
        htmlFor={name}
      >
        {label}
      </label>
      {children}
      {error && (
        <p role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default FormField;
