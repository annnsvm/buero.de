type CurrentUser = {
    id: string;
    name:string;
    email: string;
    role: 'student' | 'teacher';
    language: string;
    avatarUrl?: string;
    displayName?: string;
    timezone?: string;
    level?: string;
    bio?: string;
    isActive?: boolean;
  };
  
  export type { CurrentUser };
  