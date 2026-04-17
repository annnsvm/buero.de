import React, { useState } from 'react';
import { BaseDialog, ModalBody, ModalFooter } from '@/components/modal';
import { Button, Spinner } from '@/components/ui';
import type { ConfirmPublishCourseModalProps } from '@/types/features/courseManagment/ConfirmPublishCourseModal.types';

const ConfirmPublishCourseModal: React.FC<ConfirmPublishCourseModalProps> = ({
  isOpen,
  handleOpenChange,
  title,
  description,
  confirmButtonLabel = 'Publish',
  submittingLabel = 'Publishing',
  isSubmitting,
  onConfirm,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleClose = () => {
    if (isSubmitting) return;
    setError(null);
    handleOpenChange(false);
  };

  const handleConfirm = async () => {
    if (isSubmitting) return;
    setError(null);
    try {
      await onConfirm();
      handleOpenChange(false);
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'response' in err
          ? (err as { response?: { data?: { message?: string } } }).response?.data?.message
          : err instanceof Error
            ? err.message
            : 'Request failed';
      setError(Array.isArray(message) ? message.join(', ') : String(message));
    }
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (!open && isSubmitting) return;
    if (!open) handleClose();
    else handleOpenChange(open);
  };

  return (
    <BaseDialog
      isOpen={isOpen}
      handleOpenChange={handleDialogOpenChange}
      openCloseAnimation
      contentClassName="relative z-[1] w-full max-w-[560px] rounded-2xl bg-white p-6 focus:outline-none lg:p-12"
    >
      <ModalBody>
        <div className="flex flex-col items-center justify-center gap-2">
          <p className="text-center text-[1.25rem] font-bold text-[var(--color-text-primary)]">{title}</p>
        </div>
        <p className="mt-4 whitespace-pre-line text-center text-sm text-[var(--color-text-secondary)]">
          {description}
        </p>
        {error ? (
          <p role="alert" className="mt-3 text-center text-sm text-[var(--color-error)]">
            {error}
          </p>
        ) : null}
      </ModalBody>
      <ModalFooter className="mt-6 flex flex-row justify-center gap-2">
        <Button type="button" variant="outlineDark" onClick={handleClose} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="button" variant="solid" onClick={handleConfirm} disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="inline-flex items-center gap-2">
              <Spinner variant="onPrimary" className="size-5" />
              {submittingLabel}
            </span>
          ) : (
            confirmButtonLabel
          )}
        </Button>
      </ModalFooter>
    </BaseDialog>
  );
};

export default ConfirmPublishCourseModal;
