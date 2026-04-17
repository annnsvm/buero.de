import { Icon } from '@/components/ui';
import { ICON_NAMES } from '@/helpers/iconNames';
import { BaseDialogProps } from '@/types/components/modal/BaseDialog.types';
import { Title, Close, Content, Overlay, Portal, Root } from '@radix-ui/react-dialog';
import React from 'react';

const BaseDialog: React.FC<BaseDialogProps> = ({
  isOpen,
  handleOpenChange,
  contentClassName,
  closeButtonClassName,
  closeIconColor,
  children,
}) => {
  const defaultContentClass =
    'fixed top-1/2 left-1/2 z-[1001] w-full max-w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 focus:outline-none lg:p-12';
  const closeClasses = [
    'absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-200 sm:right-6 sm:top-6 md:right-8 md:top-8',
    'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]',
    closeButtonClassName ?? 'text-[var(--color-neutral-darkest)] hover:text-[var(--color-primary)]',
  ].join(' ');
  return (
    <Root open={isOpen} onOpenChange={handleOpenChange}>
      <Portal>
        <Overlay className="fixed inset-0 z-[1000] bg-black/40" />
        <Content
          aria-describedby={undefined}
          className={contentClassName ?? defaultContentClass}
        >
          <Title asChild>
            <span className="sr-only">Modal</span>
          </Title>
          {children}
          <Close type="button" className={closeClasses} aria-label="Close dialog">
            <Icon
              name={ICON_NAMES.X}
              className="pointer-events-none"
              color={closeIconColor ?? 'currentColor'}
            />
          </Close>
        </Content>
      </Portal>
    </Root>
  );
};

export default BaseDialog;
