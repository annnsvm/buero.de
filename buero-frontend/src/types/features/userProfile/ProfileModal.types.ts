import type { PatchUserProfilePayload } from '@/types/api/userMe.types';

type ProfileModalProps = {
  isOpen: boolean;
  handleOpenChange: (open: boolean) => void;
  onProfileSave?: (payload: PatchUserProfilePayload) => void;
  onAvatarSelect?: (file: File | null) => void;
};

export type { ProfileModalProps };
