import type { ReactNode } from "react";
// TODO: when auth slice is ready, redirect to dashboard if user is logged in

type PublicGuardProps = {
  children: ReactNode;
};

const PublicGuard = ({ children }: PublicGuardProps) => {
  return <>{children}</>;
};

export default PublicGuard;
