import type { ReactNode } from "react";

type PrivateGuardProps = {
  children: ReactNode;
};

const PrivateGuard = ({ children }: PrivateGuardProps) => {
  return <>{children}</>;
};

export default PrivateGuard;
