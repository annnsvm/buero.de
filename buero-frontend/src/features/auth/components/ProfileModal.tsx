import React, { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectCurrentUser, selectUserError, selectUserStatus } from '@/redux/slices/user/userSelectors';
import { patchUserProfileThunk } from '@/redux/slices/user/userThunks';
import { BaseDialog } from '@/components/modal';
import { Button, FormField, Icon, Input } from '@/components/ui';
import { ICON_NAMES } from '@/helpers/iconNames';
import type { ProfileModalProps } from '@/types/features/userProfile/ProfileModal.types';
import type { PatchUserProfilePayload } from '@/types/api/userMe.types';

const inputSurfaceClass =
  'rounded-[12px] border-0 bg-[var(--opacity-neutral-darkest-5)] px-4 py-2 text-[1.125rem] leading-[1.5] text-[var(--color-text-primary)] placeholder:text-[var(--opacity-neutral-darkest-60)]';

const deriveDisplayLabel = (email: string, displayName?: string) => {
  if (displayName?.trim()) return displayName.trim();
  const local = email.split('@')[0];
  return local ? local.replace(/[._-]/g, ' ') : '';
};

const greetingName = (label: string) => {
  const first = label.trim().split(/\s+/)[0];
  return first || 'there';
};

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  handleOpenChange,
  onProfileSave,
  onAvatarSelect,
}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const userStatus = useAppSelector(selectUserStatus);
  const userError = useAppSelector(selectUserError);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [retypePassword, setRetypePassword] = useState('');

  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showRetypePwd, setShowRetypePwd] = useState(false);

  const snapshotRef = useRef({
    name: '',
    bio: '',
    isActive: true,
  });

  const revokeLocalPreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setLocalAvatarUrl(null);
  };

  useEffect(() => {
    if (!isOpen || !user) return;
    
    
    const initialName = user.name?.trim() || deriveDisplayLabel(user.email, user.name);

    snapshotRef.current = {
      name: initialName,
      bio: user.bio ?? '',
      isActive: user.isActive !== false,
    };
    
    setName(initialName);
    setBio(user.bio ?? '');
    setIsActive(user.isActive !== false);
    setFormError(null);

    setCurrentPassword('');
    setNewPassword('');
    setRetypePassword('');

    revokeLocalPreview();
    if (fileInputRef.current) fileInputRef.current.value = '';
    

  }, [isOpen, user?.id, user?.email, user?.bio, user?.isActive, user?.name]);
  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const handleClose = () => {
    handleOpenChange(false);
  };

  const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
      setFormError('Use JPG, PNG or WebP (max 5 MB when upload is enabled).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image must be 5 MB or smaller.');
      return;
    }
    setFormError(null);
    revokeLocalPreview();
    const url = URL.createObjectURL(file);
    previewUrlRef.current = url;
    setLocalAvatarUrl(url);
    onAvatarSelect?.(file);
  };

  const handleResetToSnapshot = () => {
    const s = snapshotRef.current;
    setName(s.name);
    setBio(s.bio);
    setIsActive(s.isActive);
    setFormError(null);

    setCurrentPassword('');
    setNewPassword('');
    setRetypePassword('');

    revokeLocalPreview();
    onAvatarSelect?.(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSave = async () => {
    if (!user) return;
    setFormError(null);

    const payload: PatchUserProfilePayload =
      user.role === 'student'
        ? {
            name: name.trim() || undefined,
          }
        : {
            name: name.trim() || undefined,
            bio: bio.trim() || undefined,
            isActive,
          };

          try {
            
            await dispatch(patchUserProfileThunk(payload)).unwrap();
 
            onProfileSave?.(payload);
            snapshotRef.current = {
              name,
              bio,
              isActive,
            };
      
            setCurrentPassword('');
            setNewPassword('');
            setRetypePassword('');
      
            handleClose();
          } catch (e) {
      const msg = typeof e === 'string' ? e : 'Update failed';
      setFormError(msg);
    }
  };

  if (!user) return null;

  const avatarSrc = localAvatarUrl ?? user.avatarUrl;
  const submitting = userStatus === 'loading';

  return (
    <BaseDialog
      isOpen={isOpen}
      handleOpenChange={(open) => {
        if (!open) handleClose();
        else handleOpenChange(open);
      }}
      contentClassName="fixed top-1/2 left-1/2 z-[1001] w-full max-w-[min(100vw-2rem,560px)] max-h-[min(90vh,800px)] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl bg-white p-6 focus:outline-none lg:p-10"
    >
      <div className="flex flex-1 flex-col overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[var(--opacity-neutral-darkest-15)]">
        
        <div className="text-center">
          <h2 id="profile-dialog-title" className="text-[40px] font-semibold text-[var(--color-neutral-darker)] sm:text-[50px]">
          Hi, {greetingName(user.name || deriveDisplayLabel(user.email))}!
          </h2>
          <p id="profile-dialog-description" className="mt-2 text-[1rem] text-[var(--color-text-secondary)]">
            You can manage your account here.
          </p>
        </div>

        <div className="relative mx-auto mt-6 flex w-fit flex-col items-center">
          <div className="relative h-[100px] w-[100px] overflow-hidden rounded-full bg-[var(--opacity-neutral-darkest-10)]">
            {avatarSrc ? (
              <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-3xl font-semibold text-[var(--color-text-secondary)]">
                {greetingName(user.name || deriveDisplayLabel(user.email)).slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-[#FFB8A1] text-white shadow-sm transition-opacity hover:opacity-90"
            aria-label="Change profile photo"
          >
            <Icon name={ICON_NAMES.CAMERA} size={14} color="currentColor" ariaHidden />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handleAvatarChange}
          />
        </div>

        <div className="mt-8 flex flex-col gap-5">
          
          <FormField name="profile-name" label="Name">
            <Input
              id="profile-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Current Name"
              className={inputSurfaceClass}
            />
          </FormField>

          <FormField name="profile-email" label="Email address">
            <Input
              id="profile-email"
              value={user.email}
              readOnly
              aria-readonly="true"
              className={`${inputSurfaceClass} cursor-not-allowed opacity-80`}
            />
          </FormField>

          <FormField name="profile-current-password" label="Current password">
            <div className="relative">
              <Input
                id="profile-current-password"
                type={showCurrentPwd ? "text" : "password"}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="**********"
                className={`${inputSurfaceClass} w-full pr-12`}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                onClick={() => setShowCurrentPwd(!showCurrentPwd)}
              >
                <Icon name={showCurrentPwd ? "icon-eye-off" : "icon-eye"} size={20} />
              </button>
            </div>
          </FormField>

          <FormField name="profile-new-password" label="New password">
            <div className="relative">
              <Input
                id="profile-new-password"
                type={showNewPwd ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="**********"
                className={`${inputSurfaceClass} w-full pr-12`}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                onClick={() => setShowNewPwd(!showNewPwd)}
              >
                <Icon name={showNewPwd ? "icon-eye-off" : "icon-eye"} size={20} />
              </button>
            </div>
          </FormField>

          <FormField name="profile-retype-password" label="Retype new password">
            <div className="relative">
              <Input
                id="profile-retype-password"
                type={showRetypePwd ? "text" : "password"}
                value={retypePassword}
                onChange={(e) => setRetypePassword(e.target.value)}
                placeholder="**********"
                className={`${inputSurfaceClass} w-full pr-12`}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                onClick={() => setShowRetypePwd(!showRetypePwd)}
              >
                <Icon name={showRetypePwd ? "icon-eye-off" : "icon-eye"} size={20} />
              </button>
            </div>
          </FormField>
       

          {user.role === 'teacher' ? (
            <>
              <FormField name="profile-bio" label="Bio">
                <textarea
                  id="profile-bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  className={`${inputSurfaceClass} min-h-[88px] resize-y`}
                />
              </FormField>
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-primary)]">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="h-4 w-4 rounded border"
                />
                Active profile
              </label>
            </>
          ) : null}

          {formError || userError ? (
            <p className="text-sm text-[var(--color-error)]">{formError ?? userError}</p>
          ) : null}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              type="button"
              variant="outlineDark"
              className="sm:min-w-[120px] rounded-full"
              onClick={handleResetToSnapshot}
              disabled={submitting}
            >
              Change
            </Button>
            <Button
              type="button"
              variant="solid"
              className="sm:min-w-[120px] rounded-full"
              onClick={() => void handleSave()}
              disabled={submitting}
            >
              {submitting ? 'Saving…' : 'Save'}
            </Button>
          </div>
        </div>
      </div>
    </BaseDialog>
  );
};

export default ProfileModal;
