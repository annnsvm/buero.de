import { ModalContextValue } from '@/types/components/modal/ModalContext.types';
import { useContext } from 'react';
import ModalContext from './ModalContext';

const useModal = (): ModalContextValue => {
  const context = useContext(ModalContext);
  if (!context) throw new Error('useModal must be used within a ModalProvider');
  return context;
};

export default useModal;
