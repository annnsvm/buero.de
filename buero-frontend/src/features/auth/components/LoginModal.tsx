import React from 'react';
import { useNavigate } from 'react-router-dom';
import loginSchema from '../validation/loginSchema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAppDispatch } from '@/redux/hooks';
import { LoginModalProps } from '@/types/features/auth/LoginModal.types';
import { Button, FormField, Input, Spinner } from '@/components/ui';
import { loginThunk } from '@/redux/slices/auth/authThunks';
import { LoginFormValues } from '@/types/features/auth/validation.types';
import { BaseDialog, ModalBody, ModalFooter, ModalHeader } from '@/components/modal';
import { Text } from '@/components/layout';
import { openGlobalModal } from '@/redux/slices/ui/uiSlice';
import { ROUTES } from '@/helpers/routes';
import { useSelector } from 'react-redux';
import { selectAuthStatus } from '@/redux/slices/auth';
import { LOADING_STATUS } from '@/helpers/lodaingStatus';
import { createCheckoutSessionThunk } from '@/redux/slices/subscriptions/subscriptionsThunks';

const PENDING_CHECKOUT_KEY = 'pending_checkout';

type PendingCheckoutPayload = {
  courseId: string;
  successUrl?: string;
  cancelUrl?: string;
};

const LoginModal: React.FC<LoginModalProps> = ({ isOpen, handleOpenChange, redirectTo }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const loadingStatus = useSelector(selectAuthStatus);

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
    try {
      await dispatch(
        loginThunk({
          email: values.email,
          password: values.password,
          redirectTo,
        }),
      ).unwrap();

      handleClose();

      const pendingCheckoutRaw = sessionStorage.getItem(PENDING_CHECKOUT_KEY);
      if (pendingCheckoutRaw) {
        sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
        try {
          const pendingCheckout = JSON.parse(pendingCheckoutRaw) as PendingCheckoutPayload;
          if (pendingCheckout.courseId) {
            const checkoutAction = await dispatch(
              createCheckoutSessionThunk({
                courseId: pendingCheckout.courseId,
                successUrl: pendingCheckout.successUrl,
                cancelUrl: pendingCheckout.cancelUrl,
              }),
            );
            if (createCheckoutSessionThunk.fulfilled.match(checkoutAction)) {
              const checkoutUrl = checkoutAction.payload.url;
              if (checkoutUrl) {
                sessionStorage.setItem('stripe_return', 'pending');
                window.location.href = checkoutUrl;
                return;
              }
            }
            if (createCheckoutSessionThunk.rejected.match(checkoutAction)) {
              const checkoutError =
                typeof checkoutAction.payload === 'string'
                  ? checkoutAction.payload
                  : checkoutAction.error?.message ?? '';
              const normalizedCheckoutError = checkoutError.toLowerCase();
              const alreadyHasAccess =
                normalizedCheckoutError.includes('already own') ||
                normalizedCheckoutError.includes('already have access') ||
                normalizedCheckoutError.includes('already have trial access');
              if (alreadyHasAccess) {
                navigate(ROUTES.COURSES);
                return;
              }
            }
          }
        } catch {
          // ignore malformed session payload, fallback to regular redirect
        }
      }

      navigate(redirectTo ?? ROUTES.COURSES);
    } catch (error) {
      const message =
        typeof error === 'string'
          ? error
          : error instanceof Error
            ? error.message
            : 'Login failed';

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

          {errors.root && <p className="text-[var(--color-error)]">{errors.root.message}</p>}

          <Button type="submit" disabled={isSubmitting} className="mt-2 w-full" variant="solid">
            {loadingStatus === LOADING_STATUS.LOADING ? <Spinner /> : 'Log In'}
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
