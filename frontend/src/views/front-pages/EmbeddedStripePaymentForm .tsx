import React, { useState, useImperativeHandle, forwardRef, useRef, useEffect } from 'react'
import { useStripe, useElements } from '@stripe/react-stripe-js'
import { useTheme, useMediaQuery } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/redux-store'
import { selectCartTotalPrice } from '@/redux-store/slices/cart'
import CustomStripePaymentForm from './checkout/stripe/StripePaymentForm'
import { customLog } from '@/utils/commons'
import api from '@/utils/api'
import { setEsimOrderDetails } from '@/redux-store/slices/esimorderdetails'
import { custom } from 'valibot'
import { removePlan } from '@/redux-store/slices/cart'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
interface CheckoutFormData {
  email: string
  cardholderName: string
}

interface EnhancedPaymentFormProps {
  customerEmail: string
  plans: any[]
  totalPrice: number
  handleNext: (updatedOrder?: any) => void
  onProcessingChange?: (processing: boolean) => void
}

const EmbeddedStripePaymentForm = forwardRef<
  {
    triggerPayment: (validatedEmail?: string, validatedCardholderName?: string) => void
    resetForm: () => void
  },
  EnhancedPaymentFormProps
>(({ customerEmail, plans, totalPrice, handleNext, onProcessingChange }, ref) => {
  const stripe = useStripe()
  const elements = useElements()
  const dispatch = useDispatch()
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))

  const [processing, setProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [cardBrand, setCardBrand] = useState<string>('')
  const [email, setEmail] = useState<any>()
  const cartTotal = useSelector((state: RootState) => selectCartTotalPrice(state))
  const cartItems = useSelector((state: RootState) => state.cartReducer.plans)

  const commonElementOptions = {
    style: {
      base: {
        fontSize: isSmallScreen ? '18px' : '20px',
        color: theme.palette.secondary.main,
        fontFamily: theme.typography.fontFamily,
        '::placeholder': { color: '#A0A0A0' },
        padding: '12px'
      },
      invalid: { color: '#FF4D49' }
    }
  }

  const handleCardNumberChange = (event: any) => {
    setCardBrand(event.brand)
  }

  // Use a ref to store the validated email immediately.
  const validatedEmailRef = useRef<string>('')

  const handlePayment = async (validatedEmail?: string, validatedCardholderName?: string) => {
    setProcessing(true)
    const emailToUse = validatedEmail
    const cardholderToUse = validatedCardholderName || ''

    customLog('Processing payment (stripe)...')
    const payload = {
      customerEmail: validatedEmailRef.current,
      plans: cartItems,
      totalPrice: parseFloat(cartTotal),
      paymentMethod: 'credit-card'
    }
    customLog('Creating order... Payload:', payload)
    customLog('in embeded stripe form: validatedEmail', validatedEmail)
    customLog('in embeded stripe form: validatedEmailRef.current', validatedEmailRef.current)
    let secret = ''
    let newOrderId = ''
    // TODO: in case missing plans from the back, delete it from localstorage & state (cart)
    let response
    try {
      response = await api.post('/order-test/order', payload)

      // Check if the response includes missingPlans.
      if (response?.data && response?.data?.result?.missingPlans && response?.data?.result?.missingPlans?.length > 0) {
        const missingPlans: string[] = response.data.result.missingPlans
        customLog('Missing official prices for plan codes:', missingPlans)
        // Remove each missing plan from Redux (and localStorage via your slice).
        missingPlans.forEach(planCode => {
          dispatch(removePlan(planCode))
        })
        // notify the user that some items were removed.
        toast.error(
          'Some items in your cart were removed due to recent changes. Please review your cart and try again.'
        )
        return // Exit order creation flow.
      }

      const { clientSecret: fetchedSecret, order } = response.data
      secret = fetchedSecret
      newOrderId = order._id
      customLog('Stripe secret:', secret)
      customLog('Order:', order)
    } catch (error) {
      customLog(response)
      customLog('Error creating order:', error)
      setProcessing(false)
      return
    }

    if (!stripe || !elements) {
      customLog('Stripe or elements not loaded')
      setProcessing(false)
      return
    }

    setErrorMessage('')
    const cardNumberElement = elements.getElement('cardNumber')
    if (!cardNumberElement) {
      setErrorMessage('Card details are not available.')
      setProcessing(false)
      return
    }
    customLog('Card details:', cardNumberElement)

    const { error, paymentIntent } = await stripe.confirmCardPayment(secret, {
      payment_method: {
        card: cardNumberElement,
        billing_details: {
          name: cardholderToUse,
          email: emailToUse
        }
      }
    })

    if (error) {
      customLog('Payment failed:', error.message)
      setErrorMessage(error.message || 'Payment failed')
      setProcessing(false)
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      customLog('Payment succeeded:', paymentIntent)
      customLog('Using order ID:', newOrderId)

      try {
        await api.post('/payment/result', { orderId: newOrderId, paymentIntent })
        customLog('Payment result successfully handled on server.')
      } catch (resultError) {
        customLog('Error handling payment result:', resultError)
      }

      try {
        const response = await api.get(`/order-test/${newOrderId}`)
        customLog('Updated order details:', response.data)
        dispatch(setEsimOrderDetails(response.data))
        handleNext(response.data)
      } catch (fetchError) {
        customLog('Error fetching updated order details:', fetchError)
        handleNext()
      }
    } else {
      customLog('Unexpected payment result:', paymentIntent)
      setProcessing(false)
    }
  }

  const handlePayload = (data: CheckoutFormData) => {
    customLog('Payload received from Stripe form:', data)
    handlePayment(customerEmail, data.cardholderName)
  }

  // Create a ref for the inner CustomStripePaymentForm.
  const customFormRef = useRef<{
    validateAndSubmit: () => void
    resetForm: () => void
  }>(null)

  // Expose two methods from this component by delegating to the inner child.
  useImperativeHandle(ref, () => ({
    triggerPayment: (validatedEmail?: string, validatedCardholderName?: string) => {
      customLog('Triggering payment from EmbeddedStripePaymentForm, validatedEmail: ', validatedEmail)
      validatedEmailRef.current = validatedEmail
      customFormRef.current?.validateAndSubmit()
    },
    resetForm: () => {
      customLog('Resetting EmbeddedStripePaymentForm')
      customFormRef.current?.resetForm()
    }
  }))

  // Inform parent when processing state changes.
  useEffect(() => {
    if (onProcessingChange) {
      onProcessingChange(processing)
    }
  }, [processing, onProcessingChange])

  return (
    <CustomStripePaymentForm
      processing={processing}
      errorMessage={errorMessage}
      commonElementOptions={commonElementOptions}
      handleCardNumberChange={handleCardNumberChange}
      isSmallScreen={isSmallScreen}
      onPayloadSubmit={handlePayload}
      handlePayment={handlePayment}
      ref={customFormRef}
    />
  )
})

export default EmbeddedStripePaymentForm
