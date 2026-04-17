import React, { forwardRef } from 'react';
import type SimpleBarCore from 'simplebar-core';
import SimpleBar from 'simplebar-react';

export type ModalScrollAreaProps = {
  children: React.ReactNode;
  className?: string;
  contentGutter?: boolean;
};

const ModalScrollArea = forwardRef<SimpleBarCore | null, ModalScrollAreaProps>(
  ({ children, className = '', contentGutter = false }, ref) => {
    const rootClass = [
      'simplebar-buero-modal',
      'min-h-0 min-w-0 w-full flex-1',
      contentGutter ? 'simplebar-buero-modal--content-gutter' : '',
      className,
    ]
      .filter(Boolean)
      .join(' ');

    return (
      <SimpleBar ref={ref} className={rootClass}>
        {children}
      </SimpleBar>
    );
  },
);

ModalScrollArea.displayName = 'ModalScrollArea';

export default ModalScrollArea;
