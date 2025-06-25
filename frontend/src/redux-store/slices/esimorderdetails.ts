import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

interface EsimOrderDetailsState {
  data: any | null
}

const initialState: EsimOrderDetailsState = {
  data: null
}

const esimOrderDetailsSlice = createSlice({
  name: 'esimorderdetails',
  initialState,
  reducers: {
    setEsimOrderDetails(state, action: PayloadAction<any>) {
      state.data = action.payload
    },
    clearEsimOrderDetails(state) {
      state.data = null
    }
  }
})

export const { setEsimOrderDetails, clearEsimOrderDetails } = esimOrderDetailsSlice.actions
export default esimOrderDetailsSlice.reducer
