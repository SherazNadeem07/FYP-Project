// src/redux/slices/AuthSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { setCookie, deleteCookie } from 'cookies-next';

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null
};

const AuthSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.token = action.payload.token;
      setCookie('token', action.payload.token);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      deleteCookie('token');
    },
  },
});

export const { loginSuccess, logout } = AuthSlice.actions;
export default AuthSlice.reducer;