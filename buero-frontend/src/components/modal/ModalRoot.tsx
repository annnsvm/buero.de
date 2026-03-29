import React from 'react';
import { ModalRootProps } from '@/types/components/modal/ModalRoot.types';
import { LoginModal, SignUpModal } from '@/features/auth';
import { CourseInfoModal, ContactSupportModal } from '@/features/courses-catalog';
import AddVocabularyModal from '@/features/course-learning/AddVocabularyModal/AddVocabularyModal';
import { closeGlobalModal } from '@/redux/slices/ui/uiSlice';
import { useDispatch } from 'react-redux';
import useModal from './context/useModal';
import type { UiModalPayload } from '@/types/components/modal/UIModalType.types';

const ModalRoot: React.FC<ModalRootProps> = ({ globalModal, uiModalStack }) => {
  const dispatch = useDispatch();
  const { popUiModal } = useModal();
   
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

  const renderUiModalByType = (item: UiModalPayload, index: number) => {
    const modalKey = `${item.type}-${index}`;
    const commonProps = {
      isOpen: true,
      handleOpenChange: (open: boolean) => {
        if (!open) {
          popUiModal();
        }
      },
    };

    switch (item.type) {
      case 'courseInfo':
        return (
          <CourseInfoModal
            key={modalKey}
            {...commonProps}
            courseId={item.courseId}
            course={item.course}
          />
        );

      case 'contactSupport':
        return (
          <ContactSupportModal
            key={modalKey}
            {...commonProps}
            subject={item.subject}
            courseId={item.courseId}
            prefillEmail={item.prefillEmail}
          />
        );

      case 'addVocabulary':
        return (
          <AddVocabularyModal
            key={modalKey}
            {...commonProps}
          />
        );

      case 'addVocabularySuccess':
      case 'confirm':
      default:
        return null;
    }
  };

  const renderUiModals = () => {
    if (!uiModalStack.length) return null;

    return uiModalStack.map((item, index) => {
      const isTop = index === uiModalStack.length - 1;

      if (!isTop) return null;

      return renderUiModalByType(item, index);
    });
  };

  return (
    <>
      {renderGlobalModal()}
      {renderUiModals()}
    </>
  );
};

// 
export default ModalRoot;
