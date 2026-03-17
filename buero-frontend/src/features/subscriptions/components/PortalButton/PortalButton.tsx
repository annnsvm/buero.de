import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { selectSubscriptionStatus } from "@/redux/slices/subscriptions";
import { createPortalSessionThunk } from "@/redux/slices/subscriptions/subscriptionsThunks";
import PortalButtonProps from "@/types/features/subscriptions/PortalButton.types";
import React from "react";

const PortalButton: React.FC<PortalButtonProps> = ({ label = 'Manage billing' }) => {
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectSubscriptionStatus);
  const isLoading = status === 'loading';

  const handleClick = async () => {
    if (isLoading) return;

    const resultAction = await dispatch(createPortalSessionThunk());

    if (createPortalSessionThunk.fulfilled.match(resultAction)) {
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
      className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? 'Opening…' : label}
    </button>
  );
};

export default PortalButton;