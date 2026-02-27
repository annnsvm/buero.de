import type { RootState } from "../../store";

export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectUserStatus = (state: RootState) => state.user.status;
export const selectUserError = (state: RootState) => state.user.error;
