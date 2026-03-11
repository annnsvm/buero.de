import { ReactNode } from 'react';
import { UIModalStack, UIModalStackItem } from './UIModalType.types';

type ModalContextValue = {
  uiModalStack: UIModalStack;
  pushUiModal: (item: UIModalStackItem) => void;
  popUiModal: () => void;
  clearUiModal: () => void;
};

type ModalProviderProps = {
  children: ReactNode;
};

export type { ModalContextValue, ModalProviderProps };
