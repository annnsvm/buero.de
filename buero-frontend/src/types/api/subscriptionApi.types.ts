type SubscriptionAccessType = 'trial' | 'purchase' | 'subscription';

type SubscriptionStatus = 'none' | 'trialing' | 'active' | 'canceled' | 'past_due' | 'incomplete';

interface CourseAccessDTO {
  id: string;
  courseId: string;
  accessType: SubscriptionAccessType;
  currentPeriodEnd?: string | null;
  trialEndsAt?: string | null;
  paymentId?: string | null;
  subscriptionId?: string | null;
  createdAt: string;
  canceledAt?: string | null;
}

type GetMyCourseAccessResponse = CourseAccessDTO[];

interface SubscriptionSummary {
  status: SubscriptionStatus;
  currentPeriodEnd?: string | null;
  trialEndsAt?: string | null;
}

interface PaymentDTO {
  id: string;
  userId: string;
  courseId: string | null;
  subscriptionId: string | null;
  stripeInvoiceId: string | null;
  amount: number;
  currency: string;
  status: 'succeeded' | 'pending' | 'failed' | 'canceled' | string;
  created_at: string;
}

type GetMyPaymentsResponse = PaymentDTO[];

interface CreateCheckoutSessionPayload {
  courseId: string;
  successUrl?: string;
  cancelUrl?: string;
}

interface CheckoutSessionResponse {
  url: string;
}

interface PortalSessionResponse {
  url: string;
}

export type{
  CourseAccessDTO,
  GetMyCourseAccessResponse,
  SubscriptionSummary,
  PaymentDTO,
  GetMyPaymentsResponse,
  CreateCheckoutSessionPayload,
  CheckoutSessionResponse,
  PortalSessionResponse,
};