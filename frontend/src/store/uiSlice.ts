import { createSlice } from '@reduxjs/toolkit';

interface UiState {
  sidebarCollapsed: boolean;
  activeDrawer: string | null;
}

const initialState: UiState = {
  sidebarCollapsed: false,
  activeDrawer: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleSidebar(state) {
      state.sidebarCollapsed = !state.sidebarCollapsed;
    },
    openDrawer(state, action) {
      state.activeDrawer = action.payload;
    },
    closeDrawer(state) {
      state.activeDrawer = null;
    },
  },
});

export const { toggleSidebar, openDrawer, closeDrawer } = uiSlice.actions;
export default uiSlice.reducer;
