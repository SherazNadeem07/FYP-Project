// AuthSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { setCookie, deleteCookie } from 'cookies-next';

export const loginUser = createAsyncThunk('auth/loginUser', async ({ email, password }, { rejectWithValue }) => {
  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });
    const data = await response.json();
    console.log('loginUser API response:', { status: response.status, data });
    if (!response.ok) throw new Error(data.error || 'Login failed');
    setCookie('token', data.token, {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });
    return {
      user: {
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        fullName: data.user.full_name,
        title: data.user.title || '',
        bio: data.user.bio || '',
        phone: data.user.phone || '',
        website: data.user.website || '',
        linkedin: data.user.linkedin || '',
        twitter: data.user.twitter || '',
        profileImage: data.user.profile_image_url || '',
      },
      token: data.token,
    };
  } catch (error) {
    console.error('loginUser error:', error.message);
    return rejectWithValue(error.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: null,
    isAuthenticated: false,
    status: 'idle',
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.status = 'idle';
      state.error = null;
      deleteCookie('token');
      console.log('AuthSlice: Cleared token from cookies');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        console.log('AuthSlice: Login success:', { user: state.user, token: state.token });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
        console.log('AuthSlice: Login failed:', action.payload);
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;