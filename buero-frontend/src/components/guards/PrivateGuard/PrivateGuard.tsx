import type { ReactNode } from "react";
// TODO: when auth slice is ready, redirect to /auth if user is not logged in

type PrivateGuardProps = {
  children: ReactNode;
};

const PrivateGuard = ({ children }: PrivateGuardProps) => {
  return <>{children}</>;
};

export default PrivateGuard;
