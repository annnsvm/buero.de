import { GlobalModalState } from "@/types/components/modal/GlobalModalType.types";
import type { RootState } from '@/redux/rootReducer';

const selectGlobalLoading = (state: RootState): boolean => state.ui.globalLoading;

const selectGlobalModal = (state: RootState): GlobalModalState => state.ui.globalModal;

export { selectGlobalLoading, selectGlobalModal };

