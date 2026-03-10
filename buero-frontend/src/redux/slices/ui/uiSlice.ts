import { GlobalModalState } from '@/types/components/modal/GlobalModalType.types';
import { UiState } from '@/types/redux/UISlice.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: UiState = {
  globalLoading: false,
  globalModal: { type: null },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setGlobalLoading: (state, action: { payload: boolean }) => {
      state.globalLoading = action.payload;
    },
    openGlobalModal: (state, action: PayloadAction<Exclude<GlobalModalState, { type: null }>>) => {
      state.globalModal = action.payload;
    },

    closeGlobalModal: (state) => {
      state.globalModal = { type: null }
    },
  },
});

export const uiReducer = uiSlice.reducer;
export const { setGlobalLoading, openGlobalModal, closeGlobalModal } = uiSlice.actions;
