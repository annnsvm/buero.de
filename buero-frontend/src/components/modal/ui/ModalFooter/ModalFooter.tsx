import React from 'react'
import { ModalFooterProps } from '@/types/components/modal/ui/ModalFooter.types';

const ModalFooter: React.FC<ModalFooterProps> = ({ children }) => (
  <footer className="mt-2 flex flex-col items-center gap-2 text-sm text-[color:var(--color-text-muted)]">
    {children}
  </footer>
);

export default ModalFooter