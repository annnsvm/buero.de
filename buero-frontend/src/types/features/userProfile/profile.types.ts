import type { PatchUserProfilePayload } from '@/types/api/userMe.types';

/**
 * Реальне тіло PATCH /api/users/me (див. docs/modules/01-users.md, UpdateProfileDto).
 */
type ProfilePatchPayload = PatchUserProfilePayload;

/** @deprecated Використовуйте ProfilePatchPayload / PatchUserProfilePayload */
type ProfileUpdatePayload = {
  displayName: string;
  currentPassword?: string;
  newPassword?: string;
};

export type { ProfilePatchPayload, ProfileUpdatePayload };
