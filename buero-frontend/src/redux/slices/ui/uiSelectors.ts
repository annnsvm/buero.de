import { GlobalModalState } from "@/types/components/modal/GlobalModalType.types";
import { RootState } from "@/types/redux/store.types";

const selectGlobalLoading = (state: RootState): boolean => state.ui.globalLoading;

const selectGlobalModal = (state: RootState): GlobalModalState => state.ui.globalModal;

export { selectGlobalLoading, selectGlobalModal };

