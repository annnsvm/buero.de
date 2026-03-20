export type CreateCourseModuleModalProps = {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  initialTitle?: string;
  mode?: 'create' | 'edit';
  onSubmitModule: (payload: { title: string }) => Promise<void>;
};

