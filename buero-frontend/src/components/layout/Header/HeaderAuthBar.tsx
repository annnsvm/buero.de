import React from 'react';
import Button from '../../ui/Button';
import { HeaderNavAuthTrialProps } from '@/types/components/layout/Header.types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { openGlobalModal } from '@/redux/slices/ui/uiSlice';
import { selectIsAuthenticated } from '@/redux/slices/auth';
import { Logout } from '@/features/auth';
import { UserAccountMenu } from '@/features/profile';

const HeaderAuthBar: React.FC<HeaderNavAuthTrialProps> = ({
  isLight=false,
  from = '',
  className = '',
}) => {
  const dispatch = useAppDispatch();
  const isAuthenticate = useAppSelector(selectIsAuthenticated);

  const handleOpenLogin = () => {
    dispatch(
      openGlobalModal({
        type: 'login',
        redirectTo: '/courses',
      }),
    );
  };
  const handleOpenSignUp = () => {
    dispatch(
      openGlobalModal({
        type: 'signup',
        redirectTo: '/courses',
      }),
    );
  };

  return (
    <div className={['flex gap-2', className].join(' ')}>
    {isAuthenticate ? (
      <UserAccountMenu isLight={isLight} from={from} className={from ? 'w-full' : ''} />
    ) : (
        <>
          <Button
            variant={isLight ? 'primary' : 'outlineDark'}
            aria-label="Sign in"
            className={from ? 'w-full' : ''}
            onClick={handleOpenLogin}
          >
            Sign in
          </Button>
          <Button
            variant={isLight ? 'primary' : 'outlineDark'}
            aria-label="Sign up"
            className={from ? 'w-full' : ''}
            onClick={handleOpenSignUp}
          >
            Sign up
          </Button>
        </>
      )
    
    }
      
    </div>
  );
};

export default HeaderAuthBar;
