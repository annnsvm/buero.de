type LoginModalProps = {
  isOpen: boolean;
  handleOpenChange: (isOpen: boolean) => void;
  redirectTo?: string;
};

type SignUpModalProps = LoginModalProps;

export type { LoginModalProps, SignUpModalProps };
