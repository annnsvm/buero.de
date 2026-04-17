import { ReactNode } from 'react';

type BaseDialogProps = {
  isOpen: boolean;
  handleOpenChange: (isOpen: boolean) => void;
  titleId?: string;
  descriptionId?: string;
  /** Плавна поява/зникнення overlay і панелі (Radix data-state + CSS keyframes). */
  openCloseAnimation?: boolean;
  /** Викликається після анімації закриття контенту (або одразу при prefers-reduced-motion). */
  onExitAnimationComplete?: () => void;
  contentClassName?: string;
  /** Додаткові класи для кнопки закриття (напр. text-white / text-neutral для контрасту). */
  closeButtonClassName?: string;
  /** Явний колір іконки X (SVG fill) — надійніше за text-* для спрайт-іконок. */
  closeIconColor?: string;
  children: ReactNode;
};

export type { BaseDialogProps };
