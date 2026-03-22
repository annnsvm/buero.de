export type ConfirmPublishCourseModalProps = {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmButtonLabel?: string;
  /** Текст біля спінера під час запиту (напр. «Publishing» / «Unpublishing»). */
  submittingLabel?: string;
  isSubmitting: boolean;
  onConfirm: () => void | Promise<void>;
};
