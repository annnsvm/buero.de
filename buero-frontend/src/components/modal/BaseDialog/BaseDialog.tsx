import { Icon } from '@/components/ui';
import { ICON_NAMES } from '@/helpers/iconNames';
import { BaseDialogProps } from '@/types/components/modal/BaseDialog.types';
import { Title, Close, Content, Overlay, Portal, Root } from '@radix-ui/react-dialog';
import React from 'react';

const BaseDialog: React.FC<BaseDialogProps> = ({
  isOpen,
  handleOpenChange,
  // Додав
  contentClassName,
  // 
  children,
}) => {
  const defaultContentClass =
    'fixed top-1/2 left-1/2 z-[1001] w-full max-w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 focus:outline-none lg:p-12';
  return (
    <Root open={isOpen} onOpenChange={handleOpenChange}>
      <Portal>
        <Overlay className="fixed inset-0 z-[1000] bg-black/40" />
        <Content
          aria-describedby={undefined}
          className={contentClassName ?? defaultContentClass}
          // className="fixed top-1/2 left-1/2 z-[1001] w-full max-w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 focus:outline-none lg:p-12"
        >
          <Title asChild>
            <span className="sr-only">Modal</span>
          </Title>
          {children}
          <Close className="absolute top-4 right-4">
            <Icon name={ICON_NAMES.X} />
          </Close>
        </Content>
      </Portal>
    </Root>
  );
};

export default BaseDialog;
