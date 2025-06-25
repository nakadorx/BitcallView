import React, { useState, useImperativeHandle, forwardRef } from 'react'
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js'
import { Box, Grid, TextField, Typography, Alert, FormControl, InputLabel, FormHelperText } from '@mui/material'
import { customLog } from '@/utils/commons'
import { object, string, pipe, nonEmpty, email as emailValidator } from 'valibot'

export type CheckoutFormData = {
  email: string
  cardholderName: string
}

interface CustomStripePaymentFormProps {
  customerEmail: string
  processing: boolean
  errorMessage: string | null
  commonElementOptions: any
  handleCardNumberChange: (event: any) => void
  onPayloadSubmit: (data: CheckoutFormData) => void
  isSmallScreen: boolean
}

// Custom component for Card Number with floating label
const StripeCardNumberField = ({ options, onChange, error }) => {
  const [focused, setFocused] = useState(false)
  const [valuePresent, setValuePresent] = useState(false)

  const handleOnChange = event => {
    onChange(event)
    setValuePresent(!event.empty)
  }

  return (
    <FormControl sx={{ mt: 0.5 }} variant='outlined' fullWidth error={Boolean(error)}>
      <InputLabel shrink={focused || valuePresent}>Card Number</InputLabel>
      <Box
        sx={{
          border: '1px solid #c4c4c4',
          borderRadius: 1,
          px: 4,
          py: 4,
          marginTop: '2px'
        }}
      >
        <CardNumberElement
          options={{ ...options, placeholder: '' }}
          onChange={handleOnChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </Box>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}

// Custom component for Expiry Date with floating label
const StripeCardExpiryField = ({ options, onChange, error }) => {
  const [focused, setFocused] = useState(false)
  const [valuePresent, setValuePresent] = useState(false)

  const handleOnChange = event => {
    onChange(event)
    setValuePresent(!event.empty)
  }

  return (
    <FormControl variant='outlined' fullWidth error={Boolean(error)}>
      <InputLabel shrink={focused || valuePresent}>EXP. Date</InputLabel>
      <Box
        sx={{
          border: '1px solid #c4c4c4',
          borderRadius: 1,
          px: 4,
          py: 4,
          marginTop: '2px'
        }}
      >
        <CardExpiryElement
          options={{ ...options, placeholder: '' }}
          onChange={handleOnChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </Box>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}

// Custom component for CVC with floating label
const StripeCardCvcField = ({ options, onChange, error }) => {
  const [focused, setFocused] = useState(false)
  const [valuePresent, setValuePresent] = useState(false)

  const handleOnChange = event => {
    onChange(event)
    setValuePresent(!event.empty)
  }

  return (
    <FormControl variant='outlined' fullWidth error={Boolean(error)}>
      <InputLabel shrink={focused || valuePresent}>CVV</InputLabel>
      <Box
        sx={{
          border: '1px solid #c4c4c4',
          borderRadius: 1,
          px: 4,
          py: 4,
          marginTop: '2px'
        }}
      >
        <CardCvcElement
          options={{ ...options, placeholder: '' }}
          onChange={handleOnChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </Box>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}

const CustomStripePaymentForm = forwardRef<
  { validateAndSubmit: () => void; resetForm: () => void },
  CustomStripePaymentFormProps
>(
  (
    {
      customerEmail,
      processing,
      errorMessage,
      commonElementOptions,
      handleCardNumberChange,
      onPayloadSubmit,
      isSmallScreen
    },
    ref
  ) => {
    // Local states for user inputs
    const [email, setEmail] = useState('')
    const [cardholderName, setCardholderName] = useState('')
    const [emailError, setEmailError] = useState('')
    const [cardholderError, setCardholderError] = useState('')

    // States for Stripe Element validations
    const [cardNumberError, setCardNumberError] = useState('')
    const [cardExpiryError, setCardExpiryError] = useState('')
    const [cardCvcError, setCardCvcError] = useState('')

    const [cardNumberComplete, setCardNumberComplete] = useState(false)
    const [cardExpiryComplete, setCardExpiryComplete] = useState(false)
    const [cardCvcComplete, setCardCvcComplete] = useState(false)

    // State to force re-mounting of Stripe elements when reset.
    const [resetKey, setResetKey] = useState(0)

    // Validate all fields before submitting.
    const validateInputs = () => {
      let valid = true
      if (!cardholderName) {
        setCardholderError('Card holder name is required.')
        valid = false
      } else {
        setCardholderError('')
      }
      if (!cardNumberComplete) {
        setCardNumberError('Card number is incomplete.')
        valid = false
      }
      if (!cardExpiryComplete) {
        setCardExpiryError('Expiry date is incomplete.')
        valid = false
      }
      if (!cardCvcComplete) {
        setCardCvcError('CVV is incomplete.')
        valid = false
      }
      return valid
    }

    // Reset all local fields and force re-render of Stripe elements.
    const handleReset = () => {
      setEmail('')
      setCardholderName('')
      setCardNumberError('')
      setCardExpiryError('')
      setCardCvcError('')
      setCardNumberComplete(false)
      setCardExpiryComplete(false)
      setCardCvcComplete(false)
      // Change the key so that the Stripe elements remount
      setResetKey(prev => prev + 1)
    }

    // This method will be called by the parent via the ref.
    const validateAndSubmit = () => {
      if (validateInputs()) {
        onPayloadSubmit({ email, cardholderName })
      } else {
        customLog('Validation failed in StripePaymentForm')
      }
    }

    // Expose both methods.
    useImperativeHandle(ref, () => ({
      validateAndSubmit,
      resetForm: handleReset
    }))

    return (
      <div>
        <Grid container spacing={5}>
          <Grid item xs={12} sm={12}>
            <TextField
              fullWidth
              id='card-holder-name'
              placeholder='John Doe'
              label='Card Holder'
              variant='outlined'
              value={cardholderName}
              onChange={e => setCardholderName(e.target.value)}
              error={Boolean(cardholderError)}
              helperText={cardholderError}
              sx={{ mt: 6 }}
            />
          </Grid>
          <Grid item xs={12}>
            <StripeCardNumberField
              options={commonElementOptions}
              onChange={e => {
                handleCardNumberChange(e)
                if (e.empty) {
                  setCardNumberError('Card number is required.')
                  setCardNumberComplete(false)
                } else if (e.error) {
                  setCardNumberError(e.error.message)
                  setCardNumberComplete(false)
                } else if (e.complete) {
                  setCardNumberError('')
                  setCardNumberComplete(true)
                } else {
                  setCardNumberError('')
                  setCardNumberComplete(false)
                }
              }}
              error={cardNumberError}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <StripeCardExpiryField
              options={commonElementOptions}
              onChange={e => {
                if (e.empty) {
                  setCardExpiryError('Expiry date is required.')
                  setCardExpiryComplete(false)
                } else if (e.error) {
                  setCardExpiryError(e.error.message)
                  setCardExpiryComplete(false)
                } else if (e.complete) {
                  setCardExpiryError('')
                  setCardExpiryComplete(true)
                } else {
                  setCardExpiryError('')
                  setCardExpiryComplete(false)
                }
              }}
              error={cardExpiryError}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <StripeCardCvcField
              options={commonElementOptions}
              onChange={e => {
                if (e.empty) {
                  setCardCvcError('CVV is required.')
                  setCardCvcComplete(false)
                } else if (e.error) {
                  setCardCvcError(e.error.message)
                  setCardCvcComplete(false)
                } else if (e.complete) {
                  setCardCvcError('')
                  setCardCvcComplete(true)
                } else {
                  setCardCvcError('')
                  setCardCvcComplete(false)
                }
              }}
              error={cardCvcError}
            />
          </Grid>
          {errorMessage && (
            <Grid item xs={12}>
              <Alert severity='error'>{errorMessage}</Alert>
            </Grid>
          )}
        </Grid>
      </div>
    )
  }
)

export default CustomStripePaymentForm
