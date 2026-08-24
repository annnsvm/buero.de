import {
  CheckoutSessionResponse,
  CreateCheckoutSessionPayload,
  GetMyCourseAccessResponse,
  GetMyPaymentsResponse,
  SyncCheckoutResponse,
} from '@/types/api/subscriptionApi.types';
import { apiInstance } from './apiInstance';
import { API_ENDPOINTS } from './apiEndpoints';

export const subscriptionApi = {
  syncCheckoutSession: async (orderReference: string): Promise<SyncCheckoutResponse> => {
    const response = await apiInstance.post<SyncCheckoutResponse>(
      API_ENDPOINTS.subscriptions.syncCheckout,
      { order_reference: orderReference },
    );
    return response.data;
  },

  getMyAccess: async () => {
    const response = await apiInstance.get<GetMyCourseAccessResponse>(
      API_ENDPOINTS.subscriptions.myAccess,
    );
    return response.data;
  },

  createCheckoutSession: async (
    payload: CreateCheckoutSessionPayload,
  ): Promise<CheckoutSessionResponse> => {
    const response = await apiInstance.post<CheckoutSessionResponse>(
      API_ENDPOINTS.subscriptions.checkout,
      {
        course_id: payload.courseId,
        success_url: payload.successUrl,
        cancel_url: payload.cancelUrl,
      },
    );
    return response.data;
  },

  getMyPayments: async (): Promise<GetMyPaymentsResponse> => {
    const response = await apiInstance.get<GetMyPaymentsResponse>(
      API_ENDPOINTS.payments.myPayments,
    );
    return response.data;
  },
};
