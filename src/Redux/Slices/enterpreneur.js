import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk to fetch JSON data
export const fetchEntrepreneurs = createAsyncThunk(
  "entrepreneurs/fetchEntrepreneurs",
  async () => {
    const response = await fetch("/enterpreneur.json");
    const data = await response.json();
    return data;
  }
);

const entrepreneursSlice = createSlice({
  name: "entrepreneurs",
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

export default entrepreneursSlice.reducer;
