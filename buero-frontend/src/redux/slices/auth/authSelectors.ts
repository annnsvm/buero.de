import type { RootState } from "../../store";

export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.isAuthenticated;

export const selectAccessToken = (state: RootState): string | null =>
  state.auth.accessToken;

export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
