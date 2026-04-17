import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectCurrentUser, selectUserError } from '@/redux/slices/user/userSelectors';
import { patchUserProfileThunk } from '@/redux/slices/user/userThunks';
import { BaseDialog, ModalScrollArea } from '@/components/modal';
import { Button, FormField, Icon, Input, Spinner } from '@/components/ui';
import { apiInstance } from '@/api/apiInstance';
import { ICON_NAMES } from '@/helpers/iconNames';
import { profileSchema, type ProfileFormValues } from '@/features/profile/validation/profileSchema';
import type { ProfileModalProps } from '@/types/features/userProfile/ProfileModal.types';



const inputSurfaceClass =
  'rounded-[12px] border-0 bg-[var(--opacity-neutral-darkest-5)] px-4 py-2 text-[1.125rem] leading-[1.5] text-[var(--color-text-primary)] placeholder:text-[var(--opacity-neutral-darkest-60)]';

const deriveDisplayLabel = (email: string, displayName?: string) => {
  if (displayName?.trim()) return displayName.trim();
  const local = email.split('@')[0];
  return local ? local.replace(/[._-]/g, ' ') : '';
};

const greetingName = (label: string) => {
  const first = label.trim().split(/\s+/)[0];
  if (!first) return 'there';
  return first.charAt(0).toUpperCase() + first.slice(1);
};


const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  handleOpenChange,
  onExitAnimationComplete,
  onProfileSave,
  onAvatarSelect,
}) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const userError = useAppSelector(selectUserError);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showRetypePwd, setShowRetypePwd] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      bio: '',
      isActive: true,
      currentPassword: '',
      newPassword: '',
      retypePassword: '',
    },
  });

  const revokeLocalPreview = () => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setLocalAvatarUrl(null);
  };

  useEffect(() => {
    if (isOpen && user) {
      reset({
        name: user.name?.trim() || deriveDisplayLabel(user.email, user.name),
        bio: user.bio ?? '',
        isActive: user.isActive !== false,
        currentPassword: '',
        newPassword: '',
        retypePassword: '',
      });
      setFormError(null);
      revokeLocalPreview();
    }
  }, [isOpen, user, reset]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  const handleClose = () => {
    reset();
    handleOpenChange(false);
  };

  const handleAvatarChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!/^image\/(jpeg|png|webp)$/i.test(file.type)) {
      setFormError('Use JPG, PNG or WebP (max 5 MB).');
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
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!user) return;
    setFormError(null);

    const isChangingPassword = !!data.currentPassword || !!data.newPassword;

    try {
      if (isChangingPassword) {
        await apiInstance.post('/auth/change-password', {
          current_password: data.currentPassword,
          new_password: data.newPassword,
        });
      }

      const payload: any = { name: data.name };
      if (user.role === 'teacher') {
        payload.bio = data.bio;
        payload.isActive = data.isActive;
      }
      
      await dispatch(patchUserProfileThunk(payload)).unwrap();

      const avatarFile = fileInputRef.current?.files?.[0];
      if (avatarFile) {
        onAvatarSelect?.(avatarFile);
      }

      onProfileSave?.(payload);
      handleClose();

    } catch (e: any) {
      const msg = e.response?.data?.message || (typeof e === 'string' ? e : 'Update failed');
      setFormError(msg);
    }
  });

  if (!user) return null;
  const avatarSrc = localAvatarUrl ?? user.avatarUrl;

  return (
    <BaseDialog
      isOpen={isOpen}
      handleOpenChange={(open) => {
        if (!open) handleClose();
        else handleOpenChange(open);
      }}
      openCloseAnimation
      onExitAnimationComplete={onExitAnimationComplete}
      contentClassName="relative z-[1] flex max-h-[min(90vh,800px)] w-full max-w-[min(100vw-2rem,760px)] flex-col overflow-hidden rounded-2xl bg-white pt-6 pr-0 pb-6 pl-6 focus:outline-none sm:pl-8 lg:pt-10 lg:pb-10 lg:pl-10 lg:pr-0"
    >
      <ModalScrollArea contentGutter>
        <div className="flex flex-col">
        
        <div className="text-center">
          <h2 id="profile-dialog-title" className="text-[40px] font-semibold text-[var(--color-neutral-darker)] sm:text-[50px]">
          Hi, {greetingName(user.name || deriveDisplayLabel(user.email))}!
          </h2>
          <p id="profile-dialog-description" className="mt-2 text-[1rem] text-[var(--color-text-secondary)]">
            You can manage your account here.
          </p>
        </div>

        <div className="relative mx-auto mt-6 flex w-fit flex-col items-center">
          <div className="relative h-[100px] w-[100px] overflow-hidden rounded-full bg-[var(--color-primary)]">
            {avatarSrc ? (
              <img src={avatarSrc} alt="" className="h-full w-full object-cover" />
            ) : (
              <span className="flex h-full w-full items-center justify-center text-3xl font-semibold text-white">
                {greetingName(user.name || deriveDisplayLabel(user.email)).slice(0, 1).toUpperCase()}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute right-0 bottom-0 flex h-8 w-8 items-center justify-center rounded-full border-1 border-[var(--color-dawn-pink-base)] bg-[var(--color-dawn-pink-base)] text-white shadow-sm transition-opacity hover:opacity-90"
            aria-label="Change profile photo"
          >
            <Icon name={ICON_NAMES.FLIP_AVATAR} size={24} ariaHidden />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={handleAvatarChange}
          />
        </div>

        <form onSubmit={onSubmit} className="mt-8 flex flex-col gap-5 max-w-[560px] w-full mx-auto">
          
          <FormField name="profile-name" label="Name" error={errors.name?.message}>
            <Input
              id="profile-name"
              placeholder="Current Name"
              className={inputSurfaceClass}
              {...register('name')}
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

          <FormField name="profile-current-password" label="Current password" error={errors.currentPassword?.message}>
            <div className="relative">
              <Input
                id="profile-current-password"
                type={showCurrentPwd ? "text" : "password"}
                placeholder="**********"
                className={`${inputSurfaceClass} w-full pr-12`}
                {...register('currentPassword')}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                onClick={() => setShowCurrentPwd(!showCurrentPwd)}
              >
                <Icon name={showCurrentPwd ? ICON_NAMES.EYE_PSW_HIDE : ICON_NAMES.EYE_PSW_SHOW} size={20} />
              </button>
            </div>
          </FormField>

          <FormField name="profile-new-password" label="New password" error={errors.newPassword?.message}>
            <div className="relative">
              <Input
                id="profile-new-password"
                type={showNewPwd ? "text" : "password"}
                placeholder="**********"
                className={`${inputSurfaceClass} w-full pr-12`}
                {...register('newPassword')}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                onClick={() => setShowNewPwd(!showNewPwd)}
              >
                <Icon name={showNewPwd ? ICON_NAMES.EYE_PSW_HIDE : ICON_NAMES.EYE_PSW_SHOW} size={20} />
              </button>
            </div>
          </FormField>

          <FormField name="profile-retype-password" label="Retype new password" error={errors.retypePassword?.message}>
            <div className="relative">
              <Input
                id="profile-retype-password"
                type={showRetypePwd ? "text" : "password"}
                placeholder="**********"
                className={`${inputSurfaceClass} w-full pr-12`}
                {...register('retypePassword')}
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                onClick={() => setShowRetypePwd(!showRetypePwd)}
              >
                <Icon name={showRetypePwd ? ICON_NAMES.EYE_PSW_HIDE : ICON_NAMES.EYE_PSW_SHOW} size={20} />
              </button>
            </div>
          </FormField>

          {user.role === 'teacher' ? (
            // <>
              <FormField name="profile-bio" label="Bio" error={errors.bio?.message}>
                <textarea
                  id="profile-bio"
                  rows={3}
                  className={`${inputSurfaceClass} min-h-[88px] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--opacity-neutral-darkest-15)] transition-shadow`}
                  {...register('bio')}
                />
              </FormField>
          ) : null}

          {(formError || userError) ? (
            <p className="text-sm text-[var(--color-error)]">{formError ?? userError}</p>
          ) : null}

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button type="button" variant="outlineDark" className="sm:min-w-[120px] rounded-full" onClick={() => reset()} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" variant="solid" className="sm:min-w-[120px] rounded-full" disabled={isSubmitting}>
              {isSubmitting ? <Spinner /> : 'Save'}
            </Button>
          </div>
        </form>
        </div>
      </ModalScrollArea>
    </BaseDialog>
  );
};

export default ProfileModal;
