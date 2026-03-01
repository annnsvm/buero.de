import type { ReactNode } from "react";

type PublicGuardProps = {
  children: ReactNode;
};

const PublicGuard = ({ children }: PublicGuardProps) => {
  return <>{children}</>;
};

export default PublicGuard;
