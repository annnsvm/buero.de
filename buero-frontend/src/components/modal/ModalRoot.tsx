import React from 'react';
import { ModalRootProps } from '@/types/components/modal/ModalRoot.types';
import { LoginModal, SignUpModal } from '@/features/auth';
import { closeGlobalModal } from '@/redux/slices/ui/uiSlice';
import { useDispatch } from 'react-redux';

const ModalRoot: React.FC<ModalRootProps> = ({ globalModal, uiModalStack }) => {
  const dispatch = useDispatch();

  const renderGlobalModal = () => {
    if (globalModal.type === null) return null;
    if (globalModal.type === 'login') {
      return (
        <LoginModal
          isOpen
          handleOpenChange={(isOpen) => {
            if (!isOpen) {
              dispatch(closeGlobalModal());
            }
          }}
          redirectTo={globalModal.redirectTo}
        />
      );
    }

    if (globalModal.type === 'signup') {
      return (
        <SignUpModal
          isOpen
          handleOpenChange={(open) => {
            if (!open) dispatch(closeGlobalModal());
          }}
          redirectTo={globalModal.redirectTo}
        />
      );
    }
    return null;
  };

  //   const renderUiModals = () => {
  //     if (!uiModalStack.length) return null;

  //     return uiModalStack.map((item, index) => {
  //       const isTop = index === uiModalStack.length - 1;
  //       return null;
  //     });
  //   };
  return (
    <>
      {renderGlobalModal()}
      {/* {renderUiModals()} */}
    </>
  );
};

export default ModalRoot;
