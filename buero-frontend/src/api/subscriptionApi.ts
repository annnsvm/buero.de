import {
  CheckoutSessionResponse,
  CreateCheckoutSessionPayload,
  GetMyCourseAccessResponse,
  GetMyPaymentsResponse,
  PortalSessionResponse,
} from '@/types/api/subscriptionApi.types';
import { apiInstance } from './apiInstance';
import { API_ENDPOINTS } from './apiEndpoints';

export const subscriptionApi = {
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

  createPortalSession: async (): Promise<PortalSessionResponse> => {
    const response = await apiInstance.post<PortalSessionResponse>(
      API_ENDPOINTS.subscriptions.portal,
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
