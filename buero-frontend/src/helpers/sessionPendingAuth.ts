export const PENDING_CHECKOUT_KEY = 'pending_checkout';
export const PENDING_TRIAL_KEY = 'pending_trial';

export const clearPendingCheckoutSession = (): void => {
  try {
    sessionStorage.removeItem(PENDING_CHECKOUT_KEY);
  } catch {
    void 0;
  }
};

export const clearPendingTrialSession = (): void => {
  try {
    sessionStorage.removeItem(PENDING_TRIAL_KEY);
  } catch {
    void 0;
  }
};

export const clearAllPendingAuthCourseSession = (): void => {
  clearPendingCheckoutSession();
  clearPendingTrialSession();
};
