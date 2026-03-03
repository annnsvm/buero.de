import { createSlice } from "@reduxjs/toolkit";

export type SubscriptionsState = {
  subscription: {
    status: string;
    currentPeriodEnd: string | null;
    trialEndsAt: string | null;
  } | null;
  payments: unknown[];
  status: "idle" | "loading" | "error";
  error: string | null;
};

const initialState: SubscriptionsState = {
  subscription: null,
  payments: [],
  status: "idle",
  error: null,
};

const subscriptionsSlice = createSlice({
  name: "subscriptions",
  initialState,
  reducers: {},
  extraReducers: () => {},
});

export const subscriptionsReducer = subscriptionsSlice.reducer;
