import React from 'react';
import { ModalBodyProps } from '@/types/components/modal/ui/ModalBody.types';

const ModalBody: React.FC<ModalBodyProps> = ({ children }) => (
  <div className="flex w-full max-w-md flex-col gap-6">{children}</div>
);

export default ModalBody;
