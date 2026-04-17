export type ConfirmDeleteEntityModalProps = {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmButtonLabel?: string;
  isSubmitting: boolean;
  onConfirm: () => void | Promise<void>;
};
