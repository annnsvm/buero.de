import React, { useCallback } from 'react';
import { ModalProviderProps } from '@/types/components/modal/ModalContext.types';
import { UIModalStack, UIModalStackItem } from '@/types/components/modal/UIModalType.types';
import { useSelector } from 'react-redux';
import { selectGlobalModal } from '@/redux/slices/ui/uiSelectors';
import ModalRoot from '../ModalRoot';
import ModalContext from './ModalContext';

const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [uiModalStack, setUiModalStack] = React.useState<UIModalStack>([]);
   const globalModal = useSelector(selectGlobalModal);

   const pushUiModal = useCallback((item: UIModalStackItem) => {
     setUiModalStack((prev) => [...prev, item]);
   }, []);

   const popUiModal = useCallback(() => {
     setUiModalStack((prev) => prev.slice(0, -1));
   }, []);

   const clearUiModal = useCallback(() => {
     setUiModalStack([]);
   }, []);

   const contextValue = {
     uiModalStack,
     pushUiModal,
     popUiModal,
     clearUiModal,
   };

   return (
     <ModalContext.Provider value={contextValue}>
       {children}
       <ModalRoot globalModal={globalModal} uiModalStack={uiModalStack} />
     </ModalContext.Provider>
   );
};

export default ModalProvider;
