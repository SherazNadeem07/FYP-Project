
import { configureStore } from '@reduxjs/toolkit'
import featuresReducer from '../Slices/featureCardSlice'
import authReducer from '../Slices/AuthSlice'

export const store = configureStore({
  reducer: {
    features: featuresReducer,
   auth:authReducer,
  },
})