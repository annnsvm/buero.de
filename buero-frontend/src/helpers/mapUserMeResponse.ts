import type { CurrentUser } from '@/types/redux/currentUser.types';
import type { UserMeResponse } from '@/types/api/userMe.types';

const isRecord = (v: unknown): v is Record<string, unknown> =>
  v !== null && typeof v === 'object' && !Array.isArray(v);

const mapUserMeResponseToCurrentUser = (data: unknown): CurrentUser => {
  if (!isRecord(data)) {
    throw new Error('Invalid /users/me response');
  }
  const userRaw = data.user;
  const profileRaw = data.profile;
  if (!isRecord(userRaw)) {
    throw new Error('Invalid /users/me response: missing user');
  }
  const profile = isRecord(profileRaw) ? profileRaw : {};

  const id = String(userRaw.id ?? '');
  const email = String(userRaw.email ?? '');
  const role = userRaw.role === 'teacher' ? 'teacher' : 'student';
  const lang = userRaw.language === 'de' ? 'de' : 'en';
  const name = typeof userRaw.name === 'string' ? userRaw.name : undefined;
  const avatarUrl = typeof userRaw.avatarUrl === 'string' ? userRaw.avatarUrl : undefined;

  const base: CurrentUser = {
    id,
    email,
    role,
    language: lang,
    name,
    avatarUrl,
  };

  if (role === 'student') {
    const tz = profile.timezone;
    const level = profile.level;
    return {
      ...base,
      timezone: typeof tz === 'string' ? tz : undefined,
      level: level != null ? String(level) : undefined,
    };
  }

  const bio = profile.bio;
  const isActive = profile.isActive;
  return {
    ...base,
    bio: typeof bio === 'string' ? bio : bio == null ? undefined : String(bio),
    isActive: typeof isActive === 'boolean' ? isActive : undefined,
  };
};

const isUserMeResponseShape = (data: unknown): data is UserMeResponse => {
  if (!isRecord(data)) return false;
  return isRecord(data.user) && data.profile !== undefined;
};

export { mapUserMeResponseToCurrentUser, isUserMeResponseShape };
