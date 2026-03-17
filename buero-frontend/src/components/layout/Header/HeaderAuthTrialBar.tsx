import React from 'react';
import Button from '../../ui/Button';
import { HeaderNavAuthTrialProps } from '@/types/components/layout/Header.types';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { openGlobalModal } from '@/redux/slices/ui/uiSlice';
import { selectIsAuthenticated } from '@/redux/slices/auth';
import { Logout } from '@/features/auth';

const HeaderAuthTrialBar: React.FC<HeaderNavAuthTrialProps> = ({
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
  return (
    <div className={['flex gap-2', className].join(' ')}>
      {isAuthenticate ? (
        <Logout isLight={isLight}/>
      ) : (
        <Button
          variant={isLight ? 'primary' : 'outlineDark'}
          aria-label="Sign in"
          className={from ? 'w-full' : ''}
          onClick={handleOpenLogin}
        >
          Sign in
        </Button>
      )}
      <Button variant="solid" aria-label="Start free trial" className={from ? 'w-full' : ''}>
        Start free trial
      </Button>
    </div>
  );
};

export default HeaderAuthTrialBar;
