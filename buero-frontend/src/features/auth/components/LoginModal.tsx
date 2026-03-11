import React from 'react';
import { useNavigate } from 'react-router-dom';
import loginSchema from '../validation/loginSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '@/redux/hooks';
import { LoginModalProps } from '@/types/features/auth/LoginModal.types';
import { Button, FormField, Input } from '@/components/ui';
import { loginThunk } from '@/redux/slices/auth/authThunks';
import { LoginFormValues } from '@/types/features/auth/validation.types';
import { BaseDialog, ModalBody, ModalFooter, ModalHeader } from '@/components/modal';
import { Text } from '@/components/layout';
import { openGlobalModal } from '@/redux/slices/ui/uiSlice';
import { ROUTES } from '@/helpers/routes';

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, handleOpenChange, redirectTo }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleClose = () => {
    handleOpenChange(false);
  };

  const handleSubmitLogin = handleSubmit(async (values) => {
    const result = await dispatch(
      loginThunk({
        email: values.email,
        password: values.password,
        redirectTo,
      }),
    );

    if (loginThunk.fulfilled.match(result)) {
      handleClose();
      navigate(redirectTo ?? ROUTES.COURSES);
    } else {
      const message = (result.payload as string) ?? 'Login failed';
      setError('root', { type: 'server', message });
    }
  });

  return (
    <BaseDialog
      isOpen={isOpen}
      handleOpenChange={(open) => {
        if (!open) {
          handleClose();
          return;
        }
        handleOpenChange(open);
      }}
      titleId="login-dialog-title"
      descriptionId="login-dialog-description"
    >
      <ModalBody>
        <ModalHeader
          title="Log In"
          description="Sign in to continue your German learning journey."
          className="mb-8"
        />

        <form onSubmit={handleSubmitLogin} className="flex flex-col gap-4">
          <FormField name="login-email" error={errors.email?.message}>
            <Input
              id="login-email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              className="rounded-[12px] bg-[var(--opacity-neutral-darkest-5)] px-4 py-2 text-[1.125rem] leading-[1.5] text-[var(--color-text-primary)] placeholder:text-[var(--opacity-neutral-darkest-60)]"
              {...register('email')}
            />
          </FormField>

          <FormField name="login-password" error={errors.password?.message}>
            <Input
              id="login-password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
              className="rounded-[12px] bg-[var(--opacity-neutral-darkest-5)] px-4 py-2 text-[1.125rem] leading-[1.5] text-[var(--color-text-primary)] placeholder:text-[var(--opacity-neutral-darkest-60)]"
              {...register('password')}
            />
          </FormField>

          <Button type="submit" isLoading={isSubmitting} className="mt-2 w-full" variant="solid">
            Log In
          </Button>
        </form>

        <ModalFooter>
          <button
            type="button"
            className="hover:text-[var(--color-primary)]"
            onClick={() => {
              dispatch(
                openGlobalModal({
                  type: 'signup',
                  redirectTo,
                }),
              );
            }}
          >
            <Text label={'Switch to Sign Up'} className="text-[1.125rem]">
              Don&apos;t have an account? Sign Up
            </Text>
          </button>
        </ModalFooter>
      </ModalBody>
    </BaseDialog>
  );
};

export default LoginModal;
