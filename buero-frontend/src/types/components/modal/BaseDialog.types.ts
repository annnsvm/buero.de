import { ReactNode } from 'react';

type BaseDialogProps = {
  isOpen: boolean;
  handleOpenChange: (isOpen: boolean) => void;
  titleId?: string;
  descriptionId?: string;
  contentClassName?: string;
  children: ReactNode;
};

export type { BaseDialogProps };
