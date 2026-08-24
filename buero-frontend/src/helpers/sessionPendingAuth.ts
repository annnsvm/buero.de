export const PENDING_CHECKOUT_KEY = 'pending_checkout';
export const PENDING_TRIAL_KEY = 'pending_trial';
/** Виставляється перед редіректом на платіжну сторінку, щоб /purchase/* не відкривався напряму. */
export const PAYMENT_RETURN_KEY = 'payment_return';
/** orderReference поточної оплати: WayForPay не гарантує, що поверне його в URL. */
export const PENDING_ORDER_KEY = 'pending_order_reference';

export const savePendingOrderReference = (orderReference: string): void => {
  try {
    sessionStorage.setItem(PENDING_ORDER_KEY, orderReference);
  } catch {
    void 0;
  }
};

export const readPendingOrderReference = (): string | null => {
  try {
    return sessionStorage.getItem(PENDING_ORDER_KEY);
  } catch {
    return null;
  }
};

export const clearPendingOrderReference = (): void => {
  try {
    sessionStorage.removeItem(PENDING_ORDER_KEY);
  } catch {
    void 0;
  }
};

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
