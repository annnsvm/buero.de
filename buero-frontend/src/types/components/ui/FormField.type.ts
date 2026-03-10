import type { ReactNode } from 'react';

type FormFieldProps = {
  label?: string;
  name: string;
  error?: string;
  children: ReactNode;
};

export type { FormFieldProps };
