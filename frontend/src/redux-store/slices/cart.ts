import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

export interface EsimPlan {
  planCode: string
  name: string
  customFlag: string
  countryName: string
  countryCode: string
  price: number
  currency: any
  quantity: number
  validity?: string
  validityType: any
  capacity?: string
  capacityUnit?: string
}

interface EsimPlansState {
  plans: EsimPlan[]
}

// Helper to load initial state from localStorage if available.
const getInitialState = (): EsimPlansState => {
  if (typeof window !== 'undefined') {
    const storedCart = localStorage.getItem('cart')

    if (storedCart) {
      return { plans: JSON.parse(storedCart) }
    }
  }

  return { plans: [] }
}

const initialState: EsimPlansState = getInitialState()

const cartSlice = createSlice({
  name: 'esimPlans',
  initialState,
  reducers: {
    addPlan: (state, action: PayloadAction<EsimPlan>) => {
      const existingPlan = state.plans.find(plan => plan.planCode === action.payload.planCode)

      if (existingPlan) {
        existingPlan.quantity += action.payload.quantity
      } else {
        state.plans.push(action.payload)
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state.plans))
      }
    },
    updatePlanQuantity: (state, action: PayloadAction<{ planCode: string; quantity: number }>) => {
      const plan = state.plans.find(plan => plan.planCode === action.payload.planCode)

      if (plan) {
        plan.quantity = action.payload.quantity
      }

      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state.plans))
      }
    },
    removePlan: (state, action: PayloadAction<string>) => {
      state.plans = state.plans.filter(plan => plan.planCode !== action.payload)

      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state.plans))
      }
    },
    clearCart: state => {
      state.plans = []

      if (typeof window !== 'undefined') {
        localStorage.removeItem('cart')
      }
    }
  }
})

// Selector to compute the total price from the cart state.
export const selectCartTotalPrice = (state: { cartReducer?: EsimPlansState }): any =>
  state.cartReducer?.plans?.reduce((acc, plan) => acc + plan.price * plan.quantity, 0)

export const { addPlan, updatePlanQuantity, removePlan, clearCart } = cartSlice.actions
export default cartSlice.reducer
