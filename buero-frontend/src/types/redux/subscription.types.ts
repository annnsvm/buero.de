import { PaymentDTO, SubscriptionSummary } from "../api/subscriptionApi.types";

type SubscriptionsState = {
  subscription: SubscriptionSummary | null;
  payments: PaymentDTO[];
  status: 'idle' | 'loading' | 'error';
  error: string | null;
};

export type { SubscriptionsState };
