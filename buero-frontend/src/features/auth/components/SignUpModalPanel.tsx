import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import ModalBody from '@/components/modal/ui/ModalBody';
import ModalHeader from '@/components/modal/ui/ModalHeader';
import ModalFooter from '@/components/modal/ui/ModalFooter';
import { Button, FormField, Input, Spinner } from '@/components/ui';
import { useAppDispatch } from '@/redux/hooks';
import { signUpSchema } from '@/features/auth/validation/signUpSchema';
import { SignUpFormValues } from '@/types/features/auth/validation.types';
import { openGlobalModal } from '@/redux/slices/ui/uiSlice';
import { Text } from '@/components/layout';
import { signupThunk } from '@/redux/slices/auth/authThunks';
import { ROUTES } from '@/helpers/routes';
import { LOADING_STATUS } from '@/helpers/lodaingStatus';
import { useSelector } from 'react-redux';
import { selectAuthStatus } from '@/redux/slices/auth';
import { createCheckoutSessionThunk } from '@/redux/slices/subscriptions/subscriptionsThunks';
import { consumePendingCourseTrial } from '@/features/courses-catalog/courseTrialFlow';
import { PENDING_CHECKOUT_KEY } from '@/helpers/sessionPendingAuth';

type PendingCheckoutPayload = {
  courseId: string;
  successUrl?: string;
  cancelUrl?: string;
};

export type SignUpModalPanelProps = {
  redirectTo?: string;
  onDismiss: () => void;
};

const SignUpModalPanel: React.FC<SignUpModalPanelProps> = ({ redirectTo, onDismiss }) => {
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
                onDismiss();
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
                onDismiss();
                navigate(ROUTES.COURSES);
                return;
              }
            }
          }
        } catch {
          void 0;
        }
      }

      const didTrial = await consumePendingCourseTrial(navigate, dispatch);
      if (didTrial) {
        onDismiss();
        return;
      }

      onDismiss();
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
          <p className="absolute bottom-16 left-3 text-sm text-[var(--color-error)]">{errors.root.message}</p>
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
  );
};

export default SignUpModalPanel;
