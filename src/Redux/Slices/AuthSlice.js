
import { createSlice } from '@reduxjs/toolkit';
import { setCookie, deleteCookie } from 'cookies-next';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
  },
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      // Store token in localStorage and cookies
      localStorage.setItem('token', action.payload.token);
      setCookie('token', action.payload.token, { maxAge: 7 * 24 * 60 * 60 }); // 7 days
      console.log('AuthSlice: Stored token in localStorage and cookies:', action.payload.token);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      deleteCookie('token');
      console.log('AuthSlice: Cleared token from localStorage and cookies');
    },
  },
});

export const { loginSuccess, logout } = authSlice.actions;
export default authSlice.reducer;
