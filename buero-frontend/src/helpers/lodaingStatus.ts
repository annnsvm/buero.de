import { AuthStatus } from '@/types/redux/auth.types';

const LOADING_STATUS = {
  IDLE: 'idle' as AuthStatus,
  LOADING: 'loading' as AuthStatus,
  ERROR: 'error' as AuthStatus,
} as const;

export { LOADING_STATUS };
