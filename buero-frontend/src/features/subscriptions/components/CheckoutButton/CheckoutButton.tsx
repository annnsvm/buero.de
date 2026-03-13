import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectSubscriptionStatus } from "@/redux/slices/subscriptions";
import { createCheckoutSessionThunk } from "@/redux/slices/subscriptions/subscriptionsThunks";
import { CheckoutButtonProps } from "@/types/components/ui/CheckoutButton.types";
import React from "react";

const CheckoutButton: React.FC<CheckoutButtonProps> = ({
  courseId,
  successUrl,
  cancelUrl,
  label = 'Buy course',
}) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectSubscriptionStatus);
  const isLoading = status === 'loading';

  const handleClick = async () => {
    if (isLoading) return;

    const resultAction = await dispatch(
      createCheckoutSessionThunk({ courseId, successUrl, cancelUrl }),
    );

    if (createCheckoutSessionThunk.fulfilled.match(resultAction)) {
      const url = resultAction.payload.url;
      if (url) {
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
      className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? 'Redirecting…' : label}
    </button>
  );
};

export default CheckoutButton;