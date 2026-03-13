import { ROUTES } from '@/helpers/routes';
import { useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated } from '@/redux/slices/auth';
import { PrivateGuardProps } from '@/types/components/guards/Guards.types';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateGuard = ({ children }: PrivateGuardProps) => {
 const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to={ROUTES.HOME} 
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return <>{children}</>;
};

export default PrivateGuard;
