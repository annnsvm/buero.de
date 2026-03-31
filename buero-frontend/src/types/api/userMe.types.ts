type UserMeApiUser = {
    id: string;
    name:string;
    avatarUrl?: string;
    email: string;
    role: 'student' | 'teacher';
    language: 'en' | 'de';
  };
  
  type UserMeApiProfile = Record<string, unknown>;
  
  type UserMeResponse = {
    user: UserMeApiUser;
    profile: UserMeApiProfile;
  };
  
  type PatchUserProfilePayload = {
    name?: string;
    avatarUrl?: string;
    timezone?: string;
    language?: 'en' | 'de';
    bio?: string;
    isActive?: boolean;
  };
  
  export type { UserMeApiUser, UserMeApiProfile, UserMeResponse, PatchUserProfilePayload };
  