import { ReactNode } from 'react';

type BaseDialogProps = {
  isOpen: boolean;
  handleOpenChange: (isOpen: boolean) => void;
  titleId?: string;
  descriptionId?: string;
  contentClassName?: string;
  /** Додаткові класи для кнопки закриття (напр. text-white / text-neutral для контрасту). */
  closeButtonClassName?: string;
  /** Явний колір іконки X (SVG fill) — надійніше за text-* для спрайт-іконок. */
  closeIconColor?: string;
  children: ReactNode;
};

export type { BaseDialogProps };
