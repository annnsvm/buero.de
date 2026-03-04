import { PublicGuardProps } from '@/types/components/guards/Guards.types';

const PublicGuard = ({ children }: PublicGuardProps) => {
  return <>{children}</>;
};

export default PublicGuard;
