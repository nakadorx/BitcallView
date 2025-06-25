'use client'
import React, { useState, useEffect, useCallback, forwardRef, useImperativeHandle } from 'react'
import {
  Container,
  Paper,
  Typography,
  Button,
  Backdrop,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  Grid,
  FormControl,
  TextField,
  InputLabel
} from '@mui/material'
import { useDispatch } from 'react-redux'
import { customLog } from '@/utils/commons'
import api from '@/utils/api'
import { setEsimOrderDetails } from '@/redux-store/slices/esimorderdetails'

interface EmbeddedPaypalPaymentFormProps {
  orderId: string
  totalPrice: string // expected as a dollar string, e.g., "25.00"
  customerEmail: string
  handleNext: (updatedOrder?: any) => void
  onProcessingChange?: (processing: boolean) => void // New prop
}

interface PaymentStatusResponse {
  status: string
  // additional properties can be added if needed
}

interface PaymentStatusOverlayProps {
  orderId: string
  paypalOrderId: string
  approvalUrl: string
  onPaymentSuccess: (data: any) => void
}

const PaymentStatusOverlay: React.FC<PaymentStatusOverlayProps> = ({
  orderId,
  paypalOrderId,
  approvalUrl,
  onPaymentSuccess
}) => {
  const [checking, setChecking] = useState(false)
  const [error, setError] = useState('')
  const [paymentStatus, setPaymentStatus] = useState('pending')
  const [counter, setCounter] = useState(20)

  // Define user-friendly steps
  const steps = ['Waiting for Payment', 'Payment Approved', 'Payment Completed', 'Payment Cancelled']

  // Map raw status to step index
  const getActiveStep = (status: string): number => {
    if (status === 'COMPLETED') return 2
    if (status === 'APPROVED') return 1
    if (status === 'VOIDED') return 3
    return 0 // for CREATED, SAVED, PAYER_ACTION_REQUIRED, or pending
  }

  const checkPaymentStatus = useCallback(async () => {
    customLog('Initiating checkPaymentStatus')
    try {
      setChecking(true)
      customLog('Sending to handlePaypalOrderCheck, orderId:', orderId, 'paypalOrderId:', paypalOrderId)
      const response = await api.post<PaymentStatusResponse>(`/payment/handlePaypalOrderCheck`, {
        orderId,
        paypalOrderId
      })
      customLog('Response from handlePaypalOrderCheck:', response.data)
      const { status } = response.data
      setPaymentStatus(status)
      // If successful, trigger onPaymentSuccess.
      if (status === 'COMPLETED' || status === 'PAID' || status === 'captured') {
        onPaymentSuccess(response.data)
      }
      setChecking(false)
      setCounter(15) // reset counter after each check
    } catch (err) {
      setError('Error checking payment status.')
      setChecking(false)
    }
  }, [orderId, paypalOrderId, onPaymentSuccess])

  // Countdown timer: refresh check automatically every 15 seconds.
  useEffect(() => {
    const timer = setInterval(() => {
      setCounter(prev => {
        if (prev <= 1) {
          checkPaymentStatus()
          return 15
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [checkPaymentStatus])

  return (
    <Backdrop open={true} style={{ zIndex: 9999, color: '#fff' }}>
      <Paper
        sx={{
          p: 4,
          textAlign: 'center',
          // backgroundColor: 'rgba(0,0,0,0.8)',
          maxWidth: '400px',
          margin: 'auto'
        }}
      >
        <Typography variant='h6' gutterBottom>
          Awaiting Payment Confirmation
        </Typography>
        <Stepper activeStep={getActiveStep(paymentStatus)} alternativeLabel sx={{ mb: 2 }}>
          {steps.map((label, index) => (
            <Step key={index}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Typography variant='body1' gutterBottom>
          Current Status:{' '}
          {paymentStatus === 'CREATED' || paymentStatus === 'SAVED' || paymentStatus === 'PAYER_ACTION_REQUIRED'
            ? 'Waiting for Payment'
            : paymentStatus === 'APPROVED'
              ? 'Payment Approved'
              : paymentStatus === 'COMPLETED'
                ? 'Payment Completed'
                : paymentStatus === 'VOIDED'
                  ? 'Payment Cancelled'
                  : paymentStatus}
        </Typography>
        <Typography variant='body2' gutterBottom>
          Next refresh in: {counter} seconds
        </Typography>
        <Typography variant='body2' gutterBottom>
          Once your payment is successfully completed, you'll automatically receive an email with your order and cart
          details.
        </Typography>
        {error && (
          <Typography variant='body2' color='error'>
            {error}
          </Typography>
        )}
        <Button
          variant='contained'
          color='primary'
          onClick={checkPaymentStatus}
          sx={{ mt: 2 }}
          startIcon={checking ? <CircularProgress size={20} color='warning' /> : null}
        >
          Manual Check Payment
        </Button>
        <Typography variant='body2' sx={{ mt: 2 }}>
          Having trouble?{' '}
          <Button
            variant='text'
            color='secondary'
            onClick={() => {
              const isMobile = /Mobi|Android/i.test(navigator.userAgent)
              if (isMobile) {
                window.open(approvalUrl, '_blank')
              } else {
                const popupWidth = 600
                const popupHeight = 600
                const left = window.screenX + (window.outerWidth - popupWidth) / 2
                const top = window.screenY + (window.outerHeight - popupHeight) / 2
                const features = `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable,scrollbars=yes,status=1`
                window.open(approvalUrl, 'PayPalCheckout', features)
              }
            }}
          >
            Open Payment Link Again
          </Button>
        </Typography>
      </Paper>
    </Backdrop>
  )
}

// Wrap the inner component in forwardRef to expose triggerPayment.
const EmbeddedPaypalPaymentFormInner = forwardRef<
  { triggerPayment: (validatedEmail?: string) => void },
  EmbeddedPaypalPaymentFormProps
>((props, ref) => {
  const dispatch = useDispatch()
  const [showOverlay, setShowOverlay] = useState(false)
  const [approvalUrl, setApprovalUrl] = useState('')
  const [paypalOrderId, setPaypalOrderId] = useState('')

  const handleCustomButtonClick = async (email?: string) => {
    props.onProcessingChange && props.onProcessingChange(true)

    customLog('executing handleCustomButtonClick')
    if (email) {
      customLog('Validated email received in paypal compon:', email)
    }
    try {
      // Convert totalPrice (assumed in dollars) to cents.
      const amountCents = Math.round(parseFloat(props.totalPrice) * 100)
      customLog('email: ', email)
      const response = await api.post('/payment/create-paypal-order', {
        email,
        orderId: props.orderId,
        amount: amountCents,
        currency: 'usd'
      })
      const { approvalUrl, paypalOrderId } = response.data
      customLog('Response data:', response.data)
      setApprovalUrl(approvalUrl)
      setPaypalOrderId(paypalOrderId)
      customLog('Received approval URL:', approvalUrl, 'and PayPal order ID:', paypalOrderId)

      // Open the payment link appropriately for mobile vs. desktop.
      const isMobile = /Mobi|Android/i.test(navigator.userAgent)
      if (isMobile) {
        window.open(approvalUrl, '_blank')
      } else {
        const popupWidth = 600
        const popupHeight = 600
        const left = window.screenX + (window.outerWidth - popupWidth) / 2
        const top = window.screenY + (window.outerHeight - popupHeight) / 2
        const features = `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable,scrollbars=yes,status=1`
        window.open(approvalUrl, 'PayPalCheckout', features)
      }
      // Show the overlay to poll for payment status.
      setShowOverlay(true)
    } catch (error) {
      customLog('Error creating PayPal order:', error)
    } finally {
      props.onProcessingChange && props.onProcessingChange(false)
    }
  }

  // Expose handleCustomButtonClick to parent via ref.
  useImperativeHandle(ref, () => ({
    triggerPayment: handleCustomButtonClick
  }))

  const handlePaymentSuccess = (data: any) => {
    // Payment was successful—update order details and proceed.
    dispatch(setEsimOrderDetails(data))
    props.handleNext(data)
  }

  return (
    <Container maxWidth='sm' sx={{ mt: 4, mb: 4 }}>
      <Typography variant='h4' className='mbe-6'>
        Billing Details
      </Typography>
      <Grid container spacing={5}>
        <Grid item xs={12} sm={6}>
          <TextField fullWidth label='Full Name' id='name-input' placeholder='John Doe' />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            label='Billing Zip / Postal Code'
            id='postal-code-input'
            placeholder='123456'
            fullWidth
            type='number'
          />
        </Grid>
      </Grid>
      {showOverlay && approvalUrl && paypalOrderId && (
        <PaymentStatusOverlay
          orderId={props.orderId}
          paypalOrderId={paypalOrderId}
          approvalUrl={approvalUrl}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}
    </Container>
  )
})

const EmbeddedPaypalPaymentForm = forwardRef<
  { triggerPayment: (validatedEmail?: string) => void },
  EmbeddedPaypalPaymentFormProps
>((props, ref) => {
  return <EmbeddedPaypalPaymentFormInner {...props} ref={ref} />
})

export default EmbeddedPaypalPaymentForm
