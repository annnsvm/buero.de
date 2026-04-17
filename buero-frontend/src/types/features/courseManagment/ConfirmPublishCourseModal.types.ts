export type ConfirmPublishCourseModalProps = {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmButtonLabel?: string;
  submittingLabel?: string;
  isSubmitting: boolean;
  onConfirm: () => void | Promise<void>;
};
