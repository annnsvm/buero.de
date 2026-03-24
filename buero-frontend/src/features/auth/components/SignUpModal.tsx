import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import BaseDialog from '@/components/modal/BaseDialog/BaseDialog';
import ModalBody from '@/components/modal/ui/ModalBody';
import ModalHeader from '@/components/modal/ui/ModalHeader';
import ModalFooter from '@/components/modal/ui/ModalFooter';
import { Button, FormField, Input, Spinner } from '@/components/ui';
import { useAppDispatch } from '@/redux/hooks';
import { signUpSchema } from '@/features/auth/validation/signUpSchema';
import { SignUpFormValues } from '@/types/features/auth/validation.types';
import { SignUpModalProps } from '@/types/features/auth/LoginModal.types';
import { closeGlobalModal, openGlobalModal } from '@/redux/slices/ui/uiSlice';
import { Text } from '@/components/layout';
import { signupThunk } from '@/redux/slices/auth/authThunks';
import { ROUTES } from '@/helpers/routes';
import { LOADING_STATUS } from '@/helpers/lodaingStatus';
import { useSelector } from 'react-redux';
import { selectAuthStatus } from '@/redux/slices/auth';

const SignUpModal: React.FC<SignUpModalProps> = ({ isOpen, handleOpenChange, redirectTo }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loadingStatus = useSelector(selectAuthStatus);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const handleClose = () => {
    handleOpenChange(false);
    dispatch(closeGlobalModal());
  };

  const onSubmit = handleSubmit(async (values) => {
    try {
      await dispatch(
        signupThunk({
          name: values.name.trim(),
          email: values.email,
          password: values.password,
          redirectTo,
        }),
      ).unwrap();

      handleClose();
      navigate(redirectTo ?? ROUTES.COURSES);
    } catch (error) {
      const message =
        typeof error === 'string'
          ? error
          : error instanceof Error
            ? error.message
            : 'Sign up failed';

      setError('root', { type: 'server', message });
    }
  });

  return (
    <BaseDialog isOpen={isOpen} handleOpenChange={handleOpenChange}>
      <ModalBody>
        <ModalHeader title="Sign Up" description="Create a new account" className="mb-8" />

        <form onSubmit={onSubmit} className="relative flex flex-col gap-4">
          <FormField name="name" error={errors.name?.message}>
            <Input
              id="signup-name"
              type="text"
              placeholder="Name"
              autoComplete="name"
              className="rounded-[12px] bg-[var(--opacity-neutral-darkest-5)] px-4 py-2 text-[1.125rem] leading-[1.5] text-[var(--color-text-primary)] placeholder:text-[var(--opacity-neutral-darkest-60)]"
              {...register('name')}
            />
          </FormField>

          <FormField name="email" error={errors.email?.message}>
            <Input
              id="signup-email"
              type="email"
              placeholder="Email"
              autoComplete="email"
              className="rounded-[12px] bg-[var(--opacity-neutral-darkest-5)] px-4 py-2 text-[1.125rem] leading-[1.5] text-[var(--color-text-primary)] placeholder:text-[var(--opacity-neutral-darkest-60)]"
              {...register('email')}
            />
          </FormField>

          <FormField name="password" error={errors.password?.message}>
            <Input
              id="signup-password"
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              className="rounded-[12px] bg-[var(--opacity-neutral-darkest-5)] px-4 py-2 text-[1.125rem] leading-[1.5] text-[var(--color-text-primary)] placeholder:text-[var(--opacity-neutral-darkest-60)]"
              {...register('password')}
            />
          </FormField>

          {errors.root && (
            <p className="absolute bottom-16 left-3 text-sm text-[var(--color-error)]">
              {errors.root.message}
            </p>
          )}

          <Button type="submit" disabled={isSubmitting} className="mt-2 w-full" variant="solid">
            {loadingStatus === LOADING_STATUS.LOADING ? <Spinner /> : 'Sign Up'}
          </Button>
        </form>
        <ModalFooter>
          <button
            type="button"
            className="hover:text-[var(--color-primary)]"
            onClick={() => {
              dispatch(
                openGlobalModal({
                  type: 'login',
                  redirectTo,
                }),
              );
            }}
          >
            <Text label={'Switch to Log In'} className="text-[1.125rem]">
              Already have an account? Log In
            </Text>
          </button>
        </ModalFooter>
      </ModalBody>
    </BaseDialog>
  );
};

export default SignUpModal;
