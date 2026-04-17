import { subscriptionApi } from '@/api/subscriptionApi';
import { getErrorMessage } from '@/helpers/getErrorMessage';
import { CheckoutSessionResponse, CreateCheckoutSessionPayload, GetMyCourseAccessResponse, GetMyPaymentsResponse, PortalSessionResponse, SubscriptionSummary } from '@/types/api/subscriptionApi.types';
import { createAsyncThunk } from '@reduxjs/toolkit';

const buildSubscriptionSummary = (accessList: GetMyCourseAccessResponse): SubscriptionSummary => {
  if (!accessList || accessList.length === 0)
    return {
      status: 'none',
      currentPeriodEnd: null,
      trialEndsAt: null,
    };
  const now = new Date().getTime();
  const activeTrial = accessList.find((access) => {
    if (!access.trialEndsAt) return false;
    if (access.accessType !== 'trial') return false;

    const trialEnd = new Date(access.trialEndsAt);
    return trialEnd.getTime() > now;
  });

  if (activeTrial) {
    return {
      status: 'trialing',
      currentPeriodEnd: null,
      trialEndsAt: activeTrial?.trialEndsAt ?? null,
    };
  }

  const paidAccess = accessList.find(
    (access) => access.accessType === 'purchase' || access.accessType === 'subscription',
  );

  if (paidAccess) {
    return {
      status: 'active',
      currentPeriodEnd: paidAccess.currentPeriodEnd,
      trialEndsAt: paidAccess.trialEndsAt,
    };
  }

  return {
    status: 'none',
    currentPeriodEnd: null,
    trialEndsAt: null,
  };
};

export const fetchSubscriptionStatusThunk = createAsyncThunk<
  SubscriptionSummary,
  void,
  { rejectValue: string }
>('subscriptions/fetchStatus', async (_, { rejectWithValue }) => {
  try {
    const accessList: GetMyCourseAccessResponse = await subscriptionApi.getMyAccess();
    const summary = buildSubscriptionSummary(accessList);
    return summary;
  } catch (error: unknown) {
    const message = getErrorMessage(error, 'Failed to load subscription status');
    return rejectWithValue(message);
  }
});

export const fetchPaymentsHistoryThunk = createAsyncThunk<
  GetMyPaymentsResponse,
  void,
  { rejectValue: string }
>('subscriptions/fetchPaymentsHistory', async (_, { rejectWithValue }) => {
  try {
    const payments: GetMyPaymentsResponse = await subscriptionApi.getMyPayments();
    return payments;
  } catch (error: unknown) {
    const message = getErrorMessage(error, 'Failed to load payments history');
    return rejectWithValue(message);
  }
});

export const createCheckoutSessionThunk = createAsyncThunk<
  CheckoutSessionResponse,
  CreateCheckoutSessionPayload,
  { rejectValue: string }
>('subscriptions/createCheckoutSession', async (payload, { rejectWithValue }) => {
  try {
    const result = await subscriptionApi.createCheckoutSession(payload);
    return result;
  } catch (error: unknown) {
    const message = getErrorMessage(error, 'Failed to start checkout');
    return rejectWithValue(message);
  }
});

export const createPortalSessionThunk = createAsyncThunk<
  PortalSessionResponse,
  void,
  { rejectValue: string }
>('subscriptions/createPortalSession', async (_, { rejectWithValue }) => {
  try {
    const result = await subscriptionApi.createPortalSession();
    return result;
  } catch (error: unknown) {
    const message = getErrorMessage(error, 'Failed to open billing portal');
    return rejectWithValue(message);
  }
});