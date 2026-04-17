import { ReactNode } from 'react';

type BaseDialogProps = {
  isOpen: boolean;
  handleOpenChange: (isOpen: boolean) => void;
  titleId?: string;
  descriptionId?: string;
  openCloseAnimation?: boolean;
  onExitAnimationComplete?: () => void;
  contentClassName?: string;
  closeButtonClassName?: string;
  closeIconColor?: string;
  children: ReactNode;
};

export type { BaseDialogProps };
