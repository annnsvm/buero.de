type GlobalModalType = 'login' | 'signup' | 'resetPassword' | 'paymentCard' | null;

type GlobalModalState =
  | { type: null }
  | { type: 'login'; redirectTo?: string }
  | { type: 'signup'; redirectTo?: string; prefillEmail?: string }
  | { type: 'resetPassword'; prefillEmail?: string }
  | { type: 'paymentCard'; courseId: string; price: number; currency: string };

export type { GlobalModalType, GlobalModalState };
