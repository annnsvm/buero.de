import type { RootState } from '../../store';

export const selectProfileActiveTab = (state: RootState) => state.profileView.activeTab;
