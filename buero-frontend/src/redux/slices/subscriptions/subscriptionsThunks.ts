import { createAsyncThunk } from "@reduxjs/toolkit";

// TODO: fetchSubscriptionStatus, createCheckoutSession, createPortalSession when API is ready

export const fetchSubscriptionStatusThunk = createAsyncThunk(
  "subscriptions/fetchStatus",
  async () => null
);
