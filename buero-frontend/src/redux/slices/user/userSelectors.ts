import { RootState } from "@/types/redux/store.types";


export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const selectUserStatus = (state: RootState) => state.user.status;
export const selectUserError = (state: RootState) => state.user.error;
export const selectUserRole = (state: RootState) => state.user.currentUser?.role;
