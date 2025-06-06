import { createSlice } from '@reduxjs/toolkit';

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    count: 0,
    items: []
  },
  reducers: {
    addNotification: (state, action) => {
      state.count += 1;
      state.items.push(action.payload);
    },
    clearNotification: (state, action) => {
      state.count = Math.max(0, state.count - 1);
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    resetNotifications: (state) => {
      state.count = 0;
      state.items = [];
    }
  }
});

export const { addNotification, clearNotification, resetNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;