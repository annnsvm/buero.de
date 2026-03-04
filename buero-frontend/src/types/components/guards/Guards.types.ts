import type { ReactNode } from 'react';

type PrivateGuardProps = {
  children: ReactNode;
};

type PublicGuardProps = {
  children: ReactNode;
};

export type { PrivateGuardProps, PublicGuardProps };
