import { Button } from '@/components/ui';
import { useAppDispatch } from '@/redux/hooks';
import { logOutThunk } from '@/redux/slices/auth/authThunks';
import React from 'react';

const Logout: React.FC = () => {
  const dispatch = useAppDispatch();
  const handleClick = () => {
    dispatch(logOutThunk());
  };

  return (
    <Button variant="primary" onClick={handleClick}>
      Logout
    </Button>
  );
};

export default Logout;
