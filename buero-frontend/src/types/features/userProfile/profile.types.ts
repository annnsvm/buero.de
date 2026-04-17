import type { PatchUserProfilePayload } from '@/types/api/userMe.types';

type ProfilePatchPayload = PatchUserProfilePayload;

type ProfileUpdatePayload = {
  displayName: string;
  currentPassword?: string;
  newPassword?: string;
};

export type { ProfilePatchPayload, ProfileUpdatePayload };
