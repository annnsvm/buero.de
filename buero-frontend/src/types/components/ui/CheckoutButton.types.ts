type CheckoutButtonProps = {
  courseId: string;
  successUrl?: string;
  cancelUrl?: string;
  label?: string;
  className?: string;
  /** Called when guest must authenticate before checkout (e.g. close course modal). */
  onRequireAuth?: () => void;
};

export type { CheckoutButtonProps };