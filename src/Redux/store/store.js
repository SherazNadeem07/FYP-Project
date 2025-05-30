
import { configureStore } from '@reduxjs/toolkit'
import featuresReducer from '../Slices/featureCardSlice'

export const store = configureStore({
  reducer: {
    features: featuresReducer,
   
  },
})