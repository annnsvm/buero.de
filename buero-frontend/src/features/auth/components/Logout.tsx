import { Button } from '@/components/ui';
import { useAppDispatch } from '@/redux/hooks';
import { logOutThunk } from '@/redux/slices/auth/authThunks';
import { LogoutProps } from '@/types/features/auth/Logout.types';
import React from 'react';

const Logout: React.FC<LogoutProps> = ({ isLight}) => {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(logOutThunk());
  };

  return (
    <Button variant={isLight ? 'primary' : 'outlineDark'} onClick={handleClick}>
      Logout
    </Button>
  );
};

export default Logout;
