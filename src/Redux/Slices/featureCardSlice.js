import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const fetchFeaturesData = createAsyncThunk(
  'features/fetchData',
  async () => {
    const response = await fetch('/featurecardmock.json');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json(); 
    return data;
  }
);

const featuresSlice = createSlice({
  name: 'features',
  initialState: {
    cards: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeaturesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeaturesData.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload;
      })
      .addCase(fetchFeaturesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default featuresSlice.reducer;