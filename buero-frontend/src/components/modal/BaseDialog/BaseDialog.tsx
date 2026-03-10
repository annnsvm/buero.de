import { Icon } from '@/components/ui';
import { ICON_NAMES } from '@/helpers/iconNames';
import { BaseDialogProps } from '@/types/components/modal/BaseDialog.types';
import { Close, Content, Overlay, Portal, Root } from '@radix-ui/react-dialog';
import React from 'react';

const BaseDialog: React.FC<BaseDialogProps> = ({
  isOpen,
  handleOpenChange,
  titleId,
  descriptionId,
  children,
}) => {
  return (
    <Root open={isOpen} onOpenChange={handleOpenChange}>
      <Portal>
        <Overlay />
        <Content aria-labelledby={titleId} aria-describedby={descriptionId}>
          {children}
          <Close>
            <Icon name={ICON_NAMES.X} />
          </Close>
        </Content>
      </Portal>
    </Root>
  );
};

export default BaseDialog;
