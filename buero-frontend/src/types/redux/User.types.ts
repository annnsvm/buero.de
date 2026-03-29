type User = {
  id: string;
  email: string;
  role: 'student' | 'teacher';
  language: 'en' | 'de';
  name?: string; 
  avatarUrl?: string;
  
  bio?: string;
  isActive?: boolean;
  timezone?: string;
  level?: string;
};

export type { User };
