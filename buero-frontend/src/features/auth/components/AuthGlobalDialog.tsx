import React from 'react';
import { BaseDialog } from '@/components/modal';
import LoginModalPanel from './LoginModalPanel';
import SignUpModalPanel from './SignUpModalPanel';

export type AuthGlobalDialogProps = {
  variant: 'login' | 'signup';
  isOpen: boolean;
  redirectTo?: string;
  onRequestClose: () => void;
  onExitAnimationComplete: () => void;
};

const AuthGlobalDialog: React.FC<AuthGlobalDialogProps> = ({
  variant,
  isOpen,
  redirectTo,
  onRequestClose,
  onExitAnimationComplete,
}) => {
  return (
    <BaseDialog
      isOpen={isOpen}
      handleOpenChange={(open) => {
        if (!open) {
          onRequestClose();
        }
      }}
      openCloseAnimation
      onExitAnimationComplete={onExitAnimationComplete}
    >
      {variant === 'login' ? (
        <LoginModalPanel redirectTo={redirectTo} onDismiss={onRequestClose} />
      ) : (
        <SignUpModalPanel redirectTo={redirectTo} onDismiss={onRequestClose} />
      )}
    </BaseDialog>
  );
};

export default AuthGlobalDialog;
