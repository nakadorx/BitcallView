// Third-party Imports
import { configureStore } from '@reduxjs/toolkit'

// Slice Imports
import cartReducer from '@/redux-store/slices/cart'
import esimOrderDetailsReducer from '@/redux-store/slices/esimorderdetails'

export const store = configureStore({
  reducer: {
    cartReducer,
    esimorderdetails: esimOrderDetailsReducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false })
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
