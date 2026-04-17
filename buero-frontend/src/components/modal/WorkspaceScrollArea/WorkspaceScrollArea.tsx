import React, { forwardRef } from 'react';
import type SimpleBarCore from 'simplebar-core';
import SimpleBar from 'simplebar-react';

export type WorkspaceScrollAreaProps = {
  children: React.ReactNode;
  className?: string;
};

const WorkspaceScrollArea = forwardRef<SimpleBarCore | null, WorkspaceScrollAreaProps>(
  ({ children, className = '' }, ref) => {
    const rootClass = ['simplebar-buero-panel', 'min-h-0 min-w-0', className].filter(Boolean).join(' ');

    return (
      <SimpleBar ref={ref} className={rootClass}>
        {children}
      </SimpleBar>
    );
  },
);

WorkspaceScrollArea.displayName = 'WorkspaceScrollArea';

export default WorkspaceScrollArea;
