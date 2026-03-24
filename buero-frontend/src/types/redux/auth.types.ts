type AuthStatus = 'idle' | 'loading' | 'succeeded' | 'error';

type AuthState = {
  isAuthenticated: boolean;
  status: AuthStatus;
  error: string | null;
};


type LoginPayload = {
  email: string;
  password: string;
  redirectTo?: string;
};

type SignUpPayload = {
  name: string;
  email: string;
  password: string;
  role?: 'student' | 'teacher';
  language?: 'en' | 'de';
  redirectTo?: string;
};

type User = {
  id: string;
  email: string;
  role: 'student' | 'teacher';
  language: 'en' | 'de';
};

export type { AuthStatus, AuthState, LoginPayload, SignUpPayload, User };
