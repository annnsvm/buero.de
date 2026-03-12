type AuthStatus = 'idle' | 'loading' | 'succeeded' | 'error';

type AuthState = {
  isAuthenticated: boolean;
  status: AuthStatus;
  error: string | null;
  accessToken: string | null;
};


type LoginPayload = {
  email: string;
  password: string;
  redirectTo?: string;
};

type SignUpPayload = {
  email: string;
  password: string;
  role?: 'student' | 'teacher';
  language?: 'en' | 'de';
  redirectTo?: string;
};

export type { AuthStatus, AuthState, LoginPayload, SignUpPayload };
