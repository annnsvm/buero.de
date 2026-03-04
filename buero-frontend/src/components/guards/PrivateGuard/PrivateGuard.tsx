import { PrivateGuardProps } from '@/types/components/guards/Guards.types';

const PrivateGuard = ({ children }: PrivateGuardProps) => {
  return <>{children}</>;
};

export default PrivateGuard;
