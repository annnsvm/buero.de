import React from 'react';

import { ModalRootProps } from '@/types/components/modal/ModalRoot.types';

const ModalRoot: React.FC<ModalRootProps> = ({ globalModal, uiModalStack }) => {


  const renderGlobalModal = () => {
    if (globalModal.type === null) return null;

    return null;
  };

  const renderUiModals = () => {
    if (!uiModalStack.length) return null;

    return uiModalStack.map((item, index) => {
      const isTop = index === uiModalStack.length - 1;
      return null;
    });
  };
  return (
    <>
      {renderGlobalModal()}
      {renderUiModals()}
    </>
  );
};

export default ModalRoot;
