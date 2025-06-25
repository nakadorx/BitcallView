'use client'
import { useState, useEffect, useRef, ChangeEvent } from 'react'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import {
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  useTheme,
  useMediaQuery,
  Paper
} from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteIcon from '@mui/icons-material/Delete'
import RefreshIcon from '@mui/icons-material/Refresh'

import { useDispatch, useSelector } from 'react-redux'
import { updatePlanQuantity, removePlan } from '@/redux-store/slices/cart'

import { PayPalScriptProvider } from '@paypal/react-paypal-js'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'
import classnames from 'classnames'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { useForm, Controller } from 'react-hook-form'
import { object, string, pipe, nonEmpty, email as emailValidator } from 'valibot'

import type { RootState } from '@/redux-store'
import { selectCartTotalPrice } from '@/redux-store/slices/cart'
import CustomInputHorizontal from '@core/components/custom-inputs/Horizontal'
import EmbeddedStripePaymentForm from './EmbeddedStripePaymentForm '
import EmbeddedPaypalPaymentForm from './EmbeddedPaypalPaymentForm'
import { useSettings } from '@core/hooks/useSettings'
import EmbeddedNowPaymentsPaymentForm from './EmbeddedNowPaymentsPaymentForm'
import DirectionalIcon from '@components/DirectionalIcon'
import { customLog } from '@/utils/commons'
import api from '@/utils/api'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK)

const cardData = [
  {
    title: (
      <div className='flex items-center gap-4'>
        <div className='flex space-x-2'>
          <Avatar
            variant='rounded'
            sx={{
              backgroundColor: 'action.hover',
              '[data-mui-color-scheme="dark"] &': { backgroundColor: 'common.white' }
            }}
          >
            <img src='/images/logos/visa.png' alt='Visa' style={{ width: '100%', height: 'auto' }} />
          </Avatar>
          <Avatar
            variant='rounded'
            sx={{
              backgroundColor: 'action.hover',
              '[data-mui-color-scheme="dark"] &': { backgroundColor: 'common.white' }
            }}
          >
            <img src='/images/logos/mastercard.png' alt='Mastercard' style={{ width: '601%', height: 'auto' }} />
          </Avatar>
        </div>
        <Typography color='text.primary'>Credit Card</Typography>
      </div>
    ),
    value: 'credit-card',
    isSelected: true
  },
  {
    title: (
      <div className='flex items-center gap-4'>
        <Avatar
          variant='rounded'
          sx={{
            backgroundColor: 'action.hover',
            '[data-mui-color-scheme="dark"] &': { backgroundColor: 'common.white' }
          }}
        >
          <img src='/images/logos/paypal.png' alt='Paypal' style={{ width: '60%', height: 'auto' }} />
        </Avatar>
        <Typography color='text.primary'>Paypal</Typography>
      </div>
    ),
    value: 'paypal'
  },
  {
    title: (
      <div className='flex items-center gap-4'>
        <Avatar
          variant='rounded'
          sx={{
            backgroundColor: 'action.hover',
            '[data-mui-color-scheme="dark"] &': { backgroundColor: 'common.white' }
          }}
        >
          <img src='/images/logos/cryptocurrency.png' alt='Crypto' style={{ width: '70%', height: 'auto' }} />
        </Avatar>
        <Typography color='text.primary'>Crypto</Typography>
      </div>
    ),
    value: 'crypto'
  }
]

const checkoutSchema = object({
  email: pipe(
    string('Email is required'),
    nonEmpty('Email cannot be empty'),
    emailValidator('Please provide a valid email address')
  )
})

type CheckoutFormData = { email: string }

interface PaymentProps {
  data: any[]
  handleNext: () => void
}

const Payment = ({ data, handleNext }) => {
  const theme = useTheme()
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'))

  const [mounted, setMounted] = useState(false)
  const dispatch = useDispatch()
  const [totalPrice, setTotalPrice] = useState('0.00')
  const [openConfirm, setOpenConfirm] = useState(false)
  const [openCartModal, setOpenCartModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<CheckoutFormData | null>(null)
  const [paypalOrderId, setPaypalOrderId] = useState<string | null>(null)
  const [invoiceData, setInvoiceData] = useState<any>(null)
  const [order, setOrder] = useState<any>(null)
  const [cryptoResetKey, setCryptoResetKey] = useState<number>(0)
  const reduxCartTotal = useSelector((state: RootState) => selectCartTotalPrice(state))
  const cartItems = useSelector((state: RootState) => state.cartReducer.plans)
  const initialSelected: string = cardData.find(item => item.isSelected)?.value || ''
  const [selectInput, setSelectInput] = useState<string>(initialSelected)
  const [confirmDeletePlanCode, setConfirmDeletePlanCode] = useState<string | null>(null)
  const [stripeProcessing, setStripeProcessing] = useState(false)
  const [cryptoProcessing, setCryptoProcessing] = useState(false)
  const [paypalProcessing, setPaypalProcessing] = useState(false)
  const [cryptoPaymentStatus, setCryptoPaymentStatus] = useState<'waiting' | 'confirming' | 'confirmed' | null>(null)
  const [openCryptoModal, setOpenCryptoModal] = useState(false)

  const {
    control,
    handleSubmit,
    setFocus,
    reset,
    watch,
    formState: { errors }
  } = useForm<CheckoutFormData>({
    resolver: valibotResolver(checkoutSchema),
    defaultValues: { email: '' }
  })

  const emailRef = useRef<HTMLInputElement | null>(null)
  const stripeFormRef = useRef<{
    triggerPayment: (validatedEmail?: string, validatedCardholderName?: string) => void
    resetForm: () => void
  }>(null)
  const paypalFormRef = useRef<{ triggerPayment: (validatedEmail?: string) => void }>(null)
  const nowPaymentFormRef = useRef<any>(null)

  const onCheckoutClick = () => {
    handleSubmit(
      (data: CheckoutFormData) => {
        customLog('Validated Email(payment.tsx):', data.email)
        setFormData(data)
        if (stripeFormRef.current) {
          stripeFormRef.current.triggerPayment(data?.email)
        } else if (paypalFormRef.current) {
          paypalFormRef.current.triggerPayment(data?.email)
        }
        if (selectInput === 'crypto' && nowPaymentFormRef.current) {
          nowPaymentFormRef.current.triggerSubmit()
        }
      },
      (errors: any) => {
        if (errors.email) {
          setFocus('email')
          emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    )()
  }

  const validateEmailAndScroll = () => {
    return new Promise<void>((resolve, reject) => {
      handleSubmit(
        (data: CheckoutFormData) => {
          customLog('Validated Email:', data.email)
          setFormData(data)
          resolve()
        },
        (errors: any) => {
          if (errors.email) {
            setFocus('email')
            emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
          }
          reject()
        }
      )()
    })
  }

  useEffect(() => {
    setMounted(true)
  }, [])
  useEffect(() => {
    setTotalPrice(reduxCartTotal.toFixed(2))
  }, [reduxCartTotal])

  const { updatePageSettings } = useSettings()
  useEffect(() => {
    updatePageSettings({ skin: 'default' })
  }, [])

  const handlePaymentChange = (prop: string | ChangeEvent<HTMLInputElement>) => {
    if (typeof prop === 'string') {
      setSelectInput(prop)
    } else {
      setSelectInput((prop.target as HTMLInputElement).value)
    }
  }

  // prevent backdrop‐click or ESC from closing
  const handleCloseCryptoModal = (_event: any, reason?: string) => {
    if (reason === 'backdropClick' || reason === 'escapeKeyDown') return
    setOpenCryptoModal(false)
  }

  const onSubmit = (data: CheckoutFormData) => {
    customLog('Validated Email:', data.email)
    setFormData(data)
    setOpenConfirm(true)
  }
  const onError = (errors: any) => {
    if (errors.email) {
      setFocus('email')
      emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }

  const handleQuantityChange = (planCode: string, newQuantity: number) => {
    if (newQuantity < 1) return
    dispatch(updatePlanQuantity({ planCode, quantity: newQuantity }))
  }

  useEffect(() => {
    if (selectInput === 'paypal' && !order) {
      customLog('Paypal selected, proceeding with order creation')
      handleConfirmOrder()
    }
  }, [selectInput, formData, order])

  const handleConfirmOrder = async () => {
    setOpenConfirm(false)
    if (!cartItems || cartItems.length < 1) {
      setOpenCartModal(true)
      return
    }
    setLoading(true)
    const email = watch('email')
    try {
      customLog('email ', email)
      const payload = {
        customerEmail: email,
        plans: cartItems,
        totalPrice: parseFloat(totalPrice),
        paymentMethod: selectInput
      }
      customLog('payload: ', payload)
      let response
      if (selectInput === 'credit-card') {
        response = await api.post('/order-test/order', payload)
      } else if (selectInput === 'paypal') {
        response = await api.post('/order-test/order', payload)
      }
      customLog('response: ', response)
      if (response.data && response.data.error && response.data.data?.missingPlans) {
        const missingPlans: string[] = response.data.data.missingPlans
        missingPlans.forEach(planCode => {
          dispatch(removePlan(planCode))
        })
        setLoading(false)
        return
      }
      if (selectInput === 'credit-card') {
        const { clientSecret, order } = response.data
        customLog('Stripe secret:', clientSecret)
        setOrder(order)
      } else if (selectInput === 'paypal') {
        const { paypalOrderId, order } = response.data
        customLog('PayPal order id:', paypalOrderId)
        setOrder(order)
        setPaypalOrderId(paypalOrderId)
      } else if (selectInput === 'crypto') {
        const { invoice_url, invoiceData, order } = response.data
        customLog('NowPayments invoice URL:', invoice_url)
        setOrder(order)
        setInvoiceData(invoiceData)
      }
    } catch (error) {
      console.error('Order creation failed:', error)
    } finally {
      setLoading(false)
    }
  }

  // Use a container with relative positioning and extra bottom padding for mobile.
  return (
    <>
      {mounted && (
        <Box sx={{ position: 'relative', minHeight: '100vh', backgroundColor: 'background.default' }}>
          {/* Main Content */}
          <section
            style={{
              padding: isDesktop ? '24px' : '0px',
              maxWidth: '100%',
              margin: '0 auto'
            }}
          >
            <Grid container spacing={isDesktop ? 2 : 4}>
              {/* Header Section */}
              <Box sx={{ width: '100%', textAlign: 'center', mb: 4 }}>
                <Typography variant='h3' component='h1' gutterBottom sx={{ color: 'customColors.trinary' }}>
                  Secure Checkout
                </Typography>
                <Typography variant='subtitle1' color='text.secondary'>
                  Review your order and select a payment method to complete your purchase.
                </Typography>
              </Box>

              {/* Special Offer Section */}
              <Grid item xs={12} md={5} sx={{ order: { xs: 1, md: 2 } }}>
                <Box sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, p: { xs: 3, md: 4 } }}>
                  <CardContent
                    sx={{
                      p: 1.75,
                      borderRadius: 2,
                      boxShadow: 3,
                      backgroundColor: 'background.paper'
                    }}
                  >
                    <Box sx={{ mb: 3 }}>
                      <Typography variant='h6' gutterBottom>
                        Special Offer
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                        <TextField fullWidth size='small' placeholder='Enter Promo Code' />
                        <Button variant='outlined'>Apply</Button>
                      </Box>
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 1,
                          backgroundColor: 'action.hover',
                          textAlign: 'center'
                        }}
                      >
                        <Typography variant='body1' fontWeight='medium'>
                          Buying a gift for someone special?
                        </Typography>
                        <Typography variant='body2' color='text.secondary' sx={{ my: 1 }}>
                          Add gift wrap & a personalized card for just $2.
                        </Typography>
                        <Button variant='text' color='primary'>
                          Add Gift Wrap
                        </Button>
                      </Box>
                    </Box>
                  </CardContent>
                  <Box sx={{ mb: 6, mt: 8 }}>
                    <Typography variant='h6' gutterBottom>
                      Order Summary
                    </Typography>
                    {cartItems.map(item => (
                      <Box
                        key={item.planCode}
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          mb: 1
                        }}
                      >
                        <Typography variant='subtitle2' sx={{ flex: 1 }}>
                          {item.name}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton
                            size='small'
                            onClick={() => handleQuantityChange(item.planCode, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <RemoveIcon fontSize='small' />
                          </IconButton>
                          <TextField
                            type='number'
                            size='small'
                            value={item.quantity}
                            onChange={e => handleQuantityChange(item.planCode, Number(e.target.value))}
                            sx={{ width: { xs: 70, sm: 50 }, mx: 1 }}
                            inputProps={{ style: { textAlign: 'center', fontSize: '1rem', padding: '6px' } }}
                          />
                          <IconButton
                            size='small'
                            onClick={() => handleQuantityChange(item.planCode, item.quantity + 1)}
                          >
                            <AddIcon fontSize='small' />
                          </IconButton>
                          <IconButton size='small' onClick={() => setConfirmDeletePlanCode(item.planCode)}>
                            <DeleteIcon fontSize='small' />
                          </IconButton>
                        </Box>
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ p: 3, mb: 4, backgroundColor: 'action.hover', borderRadius: 1, textAlign: 'center' }}>
                    <Typography variant='body1'>A simple start for everyone</Typography>
                    <Typography variant='h4' sx={{ my: 1 }}>
                      USD $ {totalPrice}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography>Total</Typography>
                    <Typography color='text.primary' sx={{ fontWeight: 'medium' }}>
                      $ {totalPrice}
                    </Typography>
                  </Box>
                  {isDesktop &&
                    (selectInput === 'credit-card' || selectInput === 'crypto' || selectInput === 'paypal') && (
                      <Box sx={{ mt: 4 }}>
                        <Button
                          variant='contained'
                          color={cryptoPaymentStatus && selectInput === 'crypto' ? 'inherit' : 'success'}
                          type='submit'
                          endIcon={
                            <DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />
                          }
                          onClick={onCheckoutClick}
                          disabled={
                            stripeProcessing ||
                            loading ||
                            cryptoProcessing ||
                            paypalProcessing ||
                            (selectInput === 'crypto' && cryptoPaymentStatus)
                          }
                          sx={{ width: '100%' }}
                        >
                          {stripeProcessing || loading || paypalProcessing
                            ? 'Processing Payment...'
                            : selectInput === 'crypto' && cryptoPaymentStatus
                              ? cryptoPaymentStatus
                              : 'Proceed With Payment'}
                        </Button>
                      </Box>
                    )}
                  <Typography sx={{ fontSize: '0.7rem', mt: 8 }}>
                    By continuing, you accept our Terms of Services and Privacy Policy. Please note that payments are
                    non-refundable.
                  </Typography>
                </Box>
              </Grid>

              {/* Payment Methods & Forms Section */}
              <Grid item xs={12} md={7} sx={{ order: { xs: 2, md: 1 } }}>
                <Box sx={{ mb: isDesktop ? 0 : 6 }}>
                  <Grid container spacing={isDesktop ? 5 : 4}>
                    {cardData.map((item, index) => (
                      <CustomInputHorizontal
                        key={index}
                        type='radio'
                        name='paymemt-method'
                        data={item}
                        selected={selectInput}
                        handleChange={handlePaymentChange}
                        gridProps={{ sm: 6, xs: 12 }}
                      />
                    ))}
                  </Grid>
                </Box>
                <Controller
                  name='email'
                  control={control}
                  render={({ field }) => (
                    <Grid item xs={12}>
                      <TextField
                        {...field}
                        inputRef={emailRef}
                        label='Email Address'
                        variant='outlined'
                        fullWidth
                        error={Boolean(errors.email)}
                        helperText={errors.email ? errors.email.message : ''}
                        sx={{ mt: 4, mb: 1.2 }}
                      />
                    </Grid>
                  )}
                />

                {selectInput === 'credit-card' && (
                  <Elements stripe={stripePromise}>
                    <EmbeddedStripePaymentForm
                      ref={stripeFormRef}
                      customerEmail={formData?.email || ''}
                      handleNext={handleNext}
                      onProcessingChange={processing => setStripeProcessing(processing)}
                    />
                  </Elements>
                )}
                {selectInput === 'paypal' && (
                  <>
                    {!order ? (
                      <Box
                        sx={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          height: '200px'
                        }}
                      >
                        <CircularProgress />
                        <Typography sx={{ ml: 2 }}>Loading PayPal...</Typography>
                      </Box>
                    ) : (
                      <PayPalScriptProvider
                        options={{
                          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '',
                          currency: 'USD',
                          components: 'buttons'
                        }}
                      >
                        <EmbeddedPaypalPaymentForm
                          ref={paypalFormRef}
                          orderId={order?._id || ''}
                          paypalOrderId={paypalOrderId || ''}
                          totalPrice={totalPrice}
                          customerEmail={formData?.email || ''}
                          handleNext={handleNext}
                          onProcessingChange={setPaypalProcessing}
                        />
                      </PayPalScriptProvider>
                    )}
                  </>
                )}

                {selectInput === 'crypto' && (
                  <Grid item xs={12}>
                    <Box sx={{ mt: 2 }}>
                      <EmbeddedNowPaymentsPaymentForm
                        ref={nowPaymentFormRef}
                        key={cryptoResetKey}
                        customerEmail={formData?.email || ''}
                        handleNext={handleNext}
                        validateEmail={validateEmailAndScroll}
                        onProcessingChange={setCryptoProcessing}
                        onStatusChange={setCryptoPaymentStatus}
                      />
                    </Box>
                  </Grid>
                )}

                {(selectInput === 'credit-card' || selectInput === 'crypto') && (
                  <Box sx={{ mt: 6 }}>
                    <Button
                      variant='outlined'
                      color='secondary'
                      onClick={() => {
                        reset()
                        if (selectInput === 'credit-card' || selectInput === 'crypto') {
                          stripeFormRef.current?.resetForm()
                        }
                        if (selectInput === 'crypto') {
                          setCryptoResetKey(prev => prev + 1)
                        }
                      }}
                      startIcon={<RefreshIcon />}
                    >
                      Reset
                    </Button>
                  </Box>
                )}
              </Grid>
            </Grid>
          </section>

          {/* Fixed Footer Proceed Button for Mobile */}
          {!isDesktop && (selectInput === 'credit-card' || selectInput === 'crypto' || selectInput === 'paypal') && (
            <Paper
              sx={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                py: 2,
                px: 0,
                backgroundColor: theme.palette.background.paper,
                borderTop: '1px solid',
                borderColor: 'divider',
                zIndex: 1300
              }}
              elevation={3}
            >
              <Button
                variant='contained'
                color={cryptoPaymentStatus && selectInput === 'crypto' ? 'inherit' : 'success'}
                type='submit'
                endIcon={<DirectionalIcon ltrIconClass='ri-arrow-right-line' rtlIconClass='ri-arrow-left-line' />}
                onClick={onCheckoutClick}
                disabled={
                  stripeProcessing ||
                  loading ||
                  cryptoProcessing ||
                  paypalProcessing ||
                  (selectInput === 'crypto' && cryptoPaymentStatus)
                }
                sx={{ width: '100%', py: 2, fontSize: '1.2rem' }}
              >
                {stripeProcessing || loading || paypalProcessing
                  ? 'Processing Payment...'
                  : selectInput === 'crypto' && cryptoPaymentStatus
                    ? cryptoPaymentStatus
                    : 'Proceed With Payment'}
              </Button>
            </Paper>
          )}
        </Box>
      )}

      {/* Confirmation and No Items Modals */}
      {confirmDeletePlanCode && (
        <Dialog open={Boolean(confirmDeletePlanCode)} onClose={() => setConfirmDeletePlanCode(null)}>
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography>Are you sure you want to remove this item from your cart?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDeletePlanCode(null)}>Cancel</Button>
            <Button
              color='error'
              onClick={() => {
                dispatch(removePlan(confirmDeletePlanCode))
                setConfirmDeletePlanCode(null)
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* ——— Crypto Dialog ——— */}
      {/* <EmbeddedNowPaymentsPaymentForm
        ref={nowPaymentFormRef}
        key={cryptoResetKey}
        open={openCryptoModal}
        onClose={() => setOpenCryptoModal(false)}
        customerEmail={formData?.email || ''}
        handleNext={handleNext}
        validateEmail={validateEmailAndScroll}
        onProcessingChange={setCryptoProcessing}
        onStatusChange={setCryptoPaymentStatus}
      /> */}
    </>
  )
}

export default Payment
