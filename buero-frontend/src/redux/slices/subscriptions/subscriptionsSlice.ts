import { PaymentDTO, SubscriptionSummary } from '@/types/api/subscriptionApi.types';
import { SubscriptionsState } from '@/types/redux/subscription.types';
import { createSlice, isAnyOf, PayloadAction } from '@reduxjs/toolkit';
import { fetchPaymentsHistoryThunk, fetchSubscriptionStatusThunk } from './subscriptionsThunks';

const initialState: SubscriptionsState = {
  subscription: null,
  payments: [],
  status: 'idle',
  error: null,
};

const subscriptionsSlice = createSlice({
  name: 'subscriptions',
  initialState,
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(
        fetchSubscriptionStatusThunk.fulfilled,
        (state, action: PayloadAction<SubscriptionSummary>) => {
          state.status = 'idle';
          state.error = null;
          state.subscription = action.payload;
        },
      )
      .addCase(
        fetchPaymentsHistoryThunk.fulfilled,
        (state, action: PayloadAction<PaymentDTO[]>) => {
          state.status = 'idle';
          state.error = null;
          state.payments = action.payload;
        },
      )
      .addMatcher(
        isAnyOf(fetchSubscriptionStatusThunk.pending, fetchPaymentsHistoryThunk.pending),
        (state) => {
          state.status = 'loading';
          state.error = null;
        },
      )
      .addMatcher(
        isAnyOf(fetchSubscriptionStatusThunk.rejected, fetchPaymentsHistoryThunk.rejected),
        (state, action) => {
          state.status = 'error';
          state.error = (action.payload as string) ?? 'Subscription request failed';
        },
      ),
});

export const subscriptionsReducer = subscriptionsSlice.reducer;
