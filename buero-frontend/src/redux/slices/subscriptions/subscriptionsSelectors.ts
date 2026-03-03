import type { RootState } from "../../store";

export const selectSubscription = (state: RootState) =>
  state.subscriptions.subscription;
export const selectSubscriptionStatus = (state: RootState) =>
  state.subscriptions.status;
export const selectHasActiveAccess = (state: RootState): boolean => {
  const sub = state.subscriptions.subscription;
  if (!sub) return false;
  return sub.status === "active" || sub.status === "trialing";
};
