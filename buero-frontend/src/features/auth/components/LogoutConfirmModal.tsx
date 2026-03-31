import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/redux/hooks';
import { logOutThunk } from '@/redux/slices/auth/authThunks';
import { closeGlobalModal } from '@/redux/slices/ui/uiSlice';
import { BaseDialog, ModalBody, ModalHeader } from '@/components/modal';
import { Button, Spinner } from '@/components/ui';
import { ROUTES } from '@/helpers/routes';
import type { LogoutConfirmModalProps } from '@/types/features/auth/LogoutConfirmModal.types';

const LogoutConfirmModal: React.FC<LogoutConfirmModalProps> = ({
  isOpen,
  handleOpenChange,
}) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleClose = () => {
    setError(null);
    handleOpenChange(false);
  };

  const handleConfirmLogout = async () => {
    setError(null);
    setIsLoggingOut(true);
    try {
      await dispatch(logOutThunk()).unwrap();
      dispatch(closeGlobalModal());
      navigate(ROUTES.COURSES);
    } catch (e) {
      const message =
        typeof e === 'string' ? e : e instanceof Error ? e.message : 'Logout failed';
      setError(message);
      setIsLoggingOut(false);
    }
  };

  return (
    <BaseDialog
      isOpen={isOpen}
      handleOpenChange={(open) => {
        if (!open) handleClose();
        else handleOpenChange(open);
      }}
      contentClassName="fixed top-1/2 left-1/2 z-[1001] w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 focus:outline-none lg:p-10"
    >
      <ModalBody>
        <ModalHeader
          title="Log out?"
          description="You will need to sign in again to access your courses and progress."
          className="mb-8 pr-8"
        />
        {error ? <p className="mb-4 text-sm text-[var(--color-error)]">{error}</p> : null}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outlineDark" className="sm:min-w-[100px]" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="button"
            variant="solid"
            className="sm:min-w-[100px]"
            onClick={handleConfirmLogout}
            disabled={isLoggingOut}
            isLoading={isLoggingOut}
          >
            {isLoggingOut ? <Spinner /> : 'Logout'}
          </Button>
        </div>
      </ModalBody>
    </BaseDialog>
  );
};

export default LogoutConfirmModal;
