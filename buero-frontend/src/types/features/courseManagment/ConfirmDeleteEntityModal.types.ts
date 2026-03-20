export type ConfirmDeleteEntityModalProps = {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  title: string;
  /** Основний текст (може містити переноси рядків через \n) */
  description: string;
  confirmButtonLabel?: string;
  isSubmitting: boolean;
  onConfirm: () => void | Promise<void>;
};
