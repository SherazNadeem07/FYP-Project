import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchEntrepreneurs = createAsyncThunk(
  'entrepreneurs/fetchData',
  async () => {
    const response = await fetch('/enterpreneur.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json(); 
    return data;
  }
);

const entrepreneurSlice = createSlice({
  name: 'entrepreneurs', 
  initialState: {
    list: [], 
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntrepreneurs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEntrepreneurs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload; 
      })
      .addCase(fetchEntrepreneurs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default entrepreneurSlice.reducer;