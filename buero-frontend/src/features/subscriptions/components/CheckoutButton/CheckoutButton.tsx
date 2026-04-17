import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { selectIsAuthenticated } from '@/redux/slices/auth';
import { selectSubscriptionStatus } from '@/redux/slices/subscriptions';
import { createCheckoutSessionThunk } from '@/redux/slices/subscriptions/subscriptionsThunks';
import { openGlobalModal } from '@/redux/slices/ui/uiSlice';
import { CheckoutButtonProps } from '@/types/components/ui/CheckoutButton.types';
import { PENDING_CHECKOUT_KEY, clearPendingTrialSession } from '@/helpers/sessionPendingAuth';
import React from 'react';

const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  courseId,
  successUrl,
  cancelUrl,
  className = '',
  label = 'Buy course',
}) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectSubscriptionStatus);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = status === 'loading';

  const handleClick = async () => {
    if (isLoading) return;

    if (!isAuthenticated) {
      clearPendingTrialSession();
      sessionStorage.setItem(
        PENDING_CHECKOUT_KEY,
        JSON.stringify({ courseId, successUrl, cancelUrl }),
      );
      dispatch(
        openGlobalModal({
          type: 'login',
          redirectTo: '/courses',
        }),
      );
      return;
    }

    const resultAction = await dispatch(
      createCheckoutSessionThunk({ courseId, successUrl, cancelUrl }),
    );

    if (createCheckoutSessionThunk.fulfilled.match(resultAction)) {
      const url = resultAction.payload.url;
      if (url) {
        sessionStorage.setItem('stripe_return', 'pending');
        window.location.href = url;
      }
      return;
    }
  };

  return (
  <button
    type="button"
    onClick={handleClick}
    disabled={isLoading}
    className={
      className
        ? className
        : 'bg-primary hover:bg-primary/90 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60'
    }
  >
    {isLoading ? 'Redirecting…' : label}
  </button>)
};

export default CheckoutButton;
