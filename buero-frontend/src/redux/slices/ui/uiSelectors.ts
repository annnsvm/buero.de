import type { RootState } from "../../store";

export const selectGlobalLoading = (state: RootState): boolean =>
  state.ui.globalLoading;
