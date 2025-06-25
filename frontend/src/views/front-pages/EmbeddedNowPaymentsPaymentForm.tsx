'use client'
import React, { useState, useEffect, useRef, useMemo, useImperativeHandle, forwardRef } from 'react'
import {
  Typography,
  Button,
  CircularProgress,
  Box,
  Tabs,
  Tab,
  IconButton,
  Divider,
  Autocomplete,
  TextField,
  Skeleton
} from '@mui/material'
import { Dialog, DialogContent, DialogTitle, DialogActions } from '@mui/material'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import { Fade } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'

import { useDispatch, useSelector } from 'react-redux'
import { setEsimOrderDetails } from '@/redux-store/slices/esimorderdetails'
import { customLog } from '@/utils/commons'
import api from '@/utils/api'
import qrcode from 'qrcode'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import dayjs from 'dayjs'
import { selectCartTotalPrice } from '@/redux-store/slices/cart'
import type { RootState } from '@/redux-store'
import { valibotResolver } from '@hookform/resolvers/valibot'
import { useForm } from 'react-hook-form'
import { object, email as emailValidator } from 'valibot'
import PaymentStatusStepper from './PaymentStatusStepper'
import { useTheme } from '@mui/material/styles'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
interface CurrencyInfo {
  id: number
  code: string
  name: string
  enable: boolean
  logo_url: string
  cg_id?: string
  network?: string | null
}

export interface NowPaymentFormRef {
  triggerSubmit: () => void
}

interface EmbeddedNowPaymentsPaymentFormProps {
  customerEmail: string
  handleNext: (updatedOrder?: any) => void
  validateEmail: () => Promise<void>
  onProcessingChange?: (processing: boolean) => void
  onStatusChange?: (status: 'waiting' | 'confirming' | 'confirmed' | null) => void
}

const ICON_BASE_URL = 'https://nowpayments.io'

// Constant with popular currency codes
const POPULAR_CURRENCY_CODES = ['USDTTRC20', 'ETH', 'BTC', 'USDC', 'SOL']

const EmbeddedNowPaymentsPaymentForm = forwardRef<NowPaymentFormRef, EmbeddedNowPaymentsPaymentFormProps>(
  ({ customerEmail, handleNext, validateEmail, onProcessingChange, onStatusChange }, ref) => {
    const theme = useTheme()
    const dispatch = useDispatch()
    const cartTotal = useSelector((state: RootState) => selectCartTotalPrice(state))
    const cartItems = useSelector((state: RootState) => state.cartReducer.plans)

    // Tabs: Step 0: Choose Asset, Step 1: Send Deposit
    const [activeTab, setActiveTab] = useState(0)

    // Full list of currencies from backend
    const [availableCurrencies, setAvailableCurrencies] = useState<CurrencyInfo[]>([])
    const [uniqueCoins, setUniqueCoins] = useState<CurrencyInfo[]>([])
    const [selectedCoin, setSelectedCoin] = useState<CurrencyInfo | null>(null)
    const [selectedNetwork, setSelectedNetwork] = useState<CurrencyInfo | null>(null)
    const [invoiceData, setInvoiceData] = useState<any>(null)
    const [qrCodeImage, setQrCodeImage] = useState<string>('')
    const [timeLeft, setTimeLeft] = useState<string>('')
    const [minAmountInfo, setMinAmountInfo] = useState<{
      currency_from: string
      currency_to: string
      min_amount: number
      fiat_equivalent?: number
    } | null>(null)

    const [showBackConfirm, setShowBackConfirm] = useState(false)

    const [cryptoEstimate, setCryptoEstimate] = useState<{
      estimated_amount: number
      currency_from: string
      currency_to: string
    } | null>(null)

    // Loading & error states
    const [createLoading, setCreateLoading] = useState(false)
    const [createError, setCreateError] = useState('')
    const [confirmLoading, setConfirmLoading] = useState(false)
    const [confirmError, setConfirmError] = useState('')
    const [currenciesLoading, setCurrenciesLoading] = useState(false)
    const [currenciesError, setCurrenciesError] = useState('')

    const emailRef = useRef<HTMLInputElement | null>(null)

    const [orderId, setOrderId] = useState<string>('')
    const [order, setOrder] = useState<any>(null)
    const [cryptoInvoiceUrl, setCryptoInvoiceUrl] = useState<string | null>(null)

    // Payment status & auto-confirm countdown
    const [currentStatus, setCurrentStatus] = useState<'waiting' | 'confirming' | 'confirmed' | null>(null)
    const [confirmCountdown, setConfirmCountdown] = useState<number>(15)

    const [stepIndex, setStepIndex] = useState(0) // 0: step info, 1: amount, 2: submit
    const steps = ['Select Currency & Network', 'Generate Payment', 'Complete']
    {
      /* Step Indicator (Readonly) */
    }
    const stepDescriptions = ['Choose your crypto & network', 'Create payment URL & QR code', 'Awaiting confirmation']
    const handleNextStep = async () => {
      if (stepIndex === 0) {
        await onSubmit({ email: customerEmail }) // trigger order creation
        setStepIndex(1)
      } else if (stepIndex === 1) {
        // already showing invoice and polling
        setStepIndex(2)
      } else {
        await handleConfirmPayment() // Final confirmation (optional)
      }
    }

    const handleBack = () => {
      if (stepIndex > 0) {
        setStepIndex(stepIndex - 1)
      }
    }

    // Switch tabs handler
    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
      setActiveTab(newValue)
    }

    // Validation schema for email
    const checkoutSchema = object({})

    const {
      control,
      handleSubmit,
      setFocus,
      formState: { errors }
    } = useForm<any>({
      resolver: valibotResolver(checkoutSchema),
      defaultValues: { email: '' }
    })

    // Focus on the first field with an error.
    const onError = (errors: any) => {
      if (errors.email) {
        setFocus('email')
        emailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }

    // Fetch available currencies
    useEffect(() => {
      const fetchCurrencies = async () => {
        setCurrenciesLoading(true)
        setCurrenciesError('')
        try {
          const response = await api.get('/payment/full-currencies')
          const currencies: CurrencyInfo[] = response.data.currencies || []
          setAvailableCurrencies(currencies)
          const unique = Array.from(new Map(currencies.map(item => [item.cg_id || item.code, item])).values())
          setUniqueCoins(unique)
          if (!selectedCoin && unique.length > 0) {
            // Try to find USDTTRC20 as default
            const defaultCoin = unique.find(item => item.code === 'USDTTRC20')
            setSelectedCoin(defaultCoin || unique[0])
          }
        } catch (error) {
          console.error('Error fetching full currencies:', error)
          setCurrenciesError('Failed to load currencies.')
        } finally {
          setCurrenciesLoading(false)
        }
      }
      fetchCurrencies()
    }, [])

    useEffect(() => {
      const fetchMinAmount = async () => {
        if (!selectedCoin || !selectedNetwork) return

        try {
          const params = {
            currency_from: selectedCoin.code.toLowerCase(),
            currency_to: selectedNetwork.network?.toLowerCase() || '',
            fiat_equivalent: 'usd' // Always a string here
          }

          const res = await api.get('/payment/min-amount', { params })
          customLog('Minimum payment amount:', res.data)
          setMinAmountInfo(res.data)
        } catch (err) {
          customLog('Error fetching min amount:', err)
        }
      }

      fetchMinAmount()
    }, [selectedCoin, selectedNetwork])

    useEffect(() => {
      const fetchEstimate = async () => {
        if (!selectedCoin || !selectedNetwork || !cartTotal) return

        try {
          const params = {
            amount: parseFloat(cartTotal),
            currency_to: selectedCoin.code.toLowerCase()
          }
          const res = await api.get('/payment/estimate-price', { params })
          setCryptoEstimate(res.data)
        } catch (err) {
          customLog('Error fetching estimate:', err)
          setCryptoEstimate(null)
        }
      }

      fetchEstimate()
    }, [selectedCoin, selectedNetwork, cartTotal])

    // Update selected network when selected coin changes.
    useEffect(() => {
      if (selectedCoin) {
        const coinGroup = availableCurrencies.filter(
          item => (item.cg_id || item.code) === (selectedCoin.cg_id || selectedCoin.code)
        )
        const uniqueNetworkOptions = Array.from(new Map(coinGroup.map(item => [item.id, item])).values())
        // Try to find a network with "trx" (case-insensitive)
        const trxNetwork = uniqueNetworkOptions.find(item => item.network && item.network.toLowerCase() === 'trx')
        if (trxNetwork) {
          setSelectedNetwork(trxNetwork)
        } else {
          setSelectedNetwork(uniqueNetworkOptions.length > 0 ? uniqueNetworkOptions[0] : null)
        }
      }
    }, [selectedCoin, availableCurrencies])

    // Memoize network options for the network Autocomplete.
    const networkOptions = useMemo(() => {
      if (!selectedCoin) return []
      const coinGroup = availableCurrencies.filter(
        item => (item.cg_id || item.code) === (selectedCoin.cg_id || selectedCoin.code)
      )
      return Array.from(new Map(coinGroup.map(item => [item.id, item])).values())
    }, [availableCurrencies, selectedCoin])

    // Derive popular currencies from the available currencies using the constant list.
    const popularCurrencies = useMemo(() => {
      return POPULAR_CURRENCY_CODES.map(code => availableCurrencies.find(currency => currency.code === code)).filter(
        Boolean
      ) as CurrencyInfo[]
    }, [availableCurrencies])

    // Handle order creation.
    const onSubmit = async (formData: { email: string }) => {
      customLog('submitting cypto form')
      onProcessingChange && onProcessingChange(true)

      await validateEmail() // This will scroll to the email field if invalid.

      setCreateLoading(true)
      setCreateError('')
      const payload = {
        customerEmail: customerEmail,
        plans: cartItems,
        totalPrice: parseFloat(cartTotal),
        paymentMethod: 'crypto'
      }
      try {
        customLog('creating new cypto order.., payload: ', payload)
        const response = await api.post('/order-test/order', payload)
        const { invoice_url, invoiceData } = response.data
        const { order } = response.data
        customLog('NowPayments invoice URL:', invoice_url)
        customLog('Order:', order)
        setOrder(order)
        setCryptoInvoiceUrl(invoice_url)
        setInvoiceData(invoiceData)
        const price_currency = 'usd'
        const pay_currency = selectedCoin?.code || selectedNetwork?.network || 'btc'
        const paymentResponse = await api.post('/payment/createnowpaymentpay', {
          price_amount: order.totalPrice,
          price_currency,
          pay_currency,
          order_id: order._id,
          order_description: `Order ${orderId}`
        })
        if (!paymentResponse?.data?.success) {
          customLog('failed paymentResponse: ', paymentResponse)
          toast.error(paymentResponse?.data?.message || '!')

          return
        }
        setInvoiceData(paymentResponse.data)
        // init status with 'waiting'
        setCurrentStatus('waiting')
        setActiveTab(1)
      } catch (error) {
        console.error('Error creating NowPayment:', error)
        setCreateError(`Failed to create crypto payment. Please try again.`)
      } finally {
        setCreateLoading(false)
        onProcessingChange && onProcessingChange(false)
      }
    }

    // Confirm payment status.
    const handleConfirmPayment = async () => {
      if (!invoiceData) {
        setConfirmError('Invoice identifier is not available.')
        return
      }
      const paymentId = invoiceData.payment_id
      if (!paymentId) {
        setConfirmError('Payment ID is missing.')
        return
      }
      setConfirmLoading(true)
      setConfirmError('')
      try {
        customLog('Handle now payment status:', order._id, paymentId)
        const response = await api.post('/payment/handle-status', {
          orderId: order._id,
          paymentId
        })
        customLog('Handle now payment status response:', response.data)
        const { success, orderData, message, status } = response.data
        setCurrentStatus(status)

        if (success) {
          dispatch(setEsimOrderDetails(orderData))
          handleNext(orderData)
        } else {
          setConfirmError(message || 'Payment not successful. Please try again.')
        }
      } catch (error) {
        console.error('Error handling payment status:', error)
        setConfirmError('Unable to verify payment at this time. Please try again later.')
      } finally {
        setConfirmLoading(false)
      }
    }

    // Manual confirmation resets countdown.
    const manualConfirmPayment = async () => {
      setConfirmCountdown(10)
      await handleConfirmPayment()
    }

    // Generate QR code.
    useEffect(() => {
      if (invoiceData?.pay_address) {
        qrcode.toDataURL(invoiceData.pay_address, { width: 150, margin: 1 }, (err, url) => {
          if (err) {
            console.error('Failed to generate QR Code', err)
            setQrCodeImage('')
          } else {
            setQrCodeImage(url)
          }
        })
      }
    }, [invoiceData])

    // Countdown timer for invoice expiration.
    useEffect(() => {
      if (invoiceData?.expiration_estimate_date) {
        const expiry = dayjs(invoiceData.expiration_estimate_date)
        const timer = setInterval(() => {
          const now = dayjs()
          const diff = expiry.diff(now, 'second')
          if (diff <= 0) {
            setTimeLeft('Expired')
            clearInterval(timer)
          } else {
            const minutes = Math.floor(diff / 60)
            const seconds = diff % 60
            setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`)
          }
        }, 1000)
        return () => clearInterval(timer)
      }
    }, [invoiceData])

    // Auto-call confirmation.
    useEffect(() => {
      if (activeTab !== 1 || !invoiceData) return
      if (confirmLoading) return

      const intervalId = setInterval(() => {
        setConfirmCountdown(prev => {
          if (prev <= 1) {
            if (!confirmLoading) {
              handleConfirmPayment()
            }
            return 10
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(intervalId)
    }, [activeTab, invoiceData, confirmLoading])

    // Copy deposit address.
    const handleCopyAddress = () => {
      if (invoiceData?.pay_address) {
        navigator.clipboard.writeText(invoiceData.pay_address)
      }
    }

    useImperativeHandle(ref, () => ({
      triggerSubmit() {
        // For simplicity, we call onSubmit with a dummy object:
        onSubmit({ email: customerEmail })
      }
    }))

    const formatCurrencyCode = (currency: CurrencyInfo) => (currency.code === 'USDTTRC20' ? 'USDT' : currency.code)

    useEffect(() => {
      customLog('changing to currentStatus:  ', currentStatus)
      if (onStatusChange) {
        onStatusChange(currentStatus)
      }
    }, [currentStatus, onStatusChange])

    const minUsd = minAmountInfo?.fiat_equivalent ?? 0
    const isBelowMin = cartTotal < minUsd
    return (
      <>
        <Box sx={{ p: { xs: 2, md: 3 }, backgroundColor: 'background.default' }}>
          <Box display='flex' justifyContent='space-between' alignItems='center' mb={4}>
            {steps.map((label, index) => {
              const isActive = index <= stepIndex
              return (
                <Box key={index} sx={{ flex: 1, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      mx: 'auto',
                      mb: 1,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: isActive ? 'primary.main' : 'transparent',
                      border: `2px solid ${isActive ? theme.palette.primary.main : theme.palette.divider}`,
                      color: isActive ? '#fff' : theme.palette.text.secondary,
                      fontWeight: 'bold'
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography
                    variant='caption'
                    color={isActive ? 'primary.main' : 'text.secondary'}
                    fontWeight={'bold'}
                  >
                    {label}
                  </Typography>
                  <Typography
                    variant='body2'
                    sx={{ color: 'text.secondary', fontWeight: '300', fontSize: '0.7rem', mt: '0.5', ml: 1 }}
                  >
                    {stepDescriptions[index]}
                  </Typography>
                </Box>
              )
            })}
          </Box>
          {/* Step 1: Select Coin & Network */}

          {stepIndex === 0 && (
            <>
              <Box sx={{ mt: 10 }}>
                <Typography variant='body2'>Order Total: ${cartTotal.toFixed(2)} USD</Typography>
              </Box>
              {/* Estimated Total */}
              <Box
                mt={5}
                px={3}
                borderRadius={3}
                bgcolor={theme.palette.mode === 'dark' ? 'background.paper' : '#fafafa'}
                textAlign='center'
                minHeight={50}
              >
                {cryptoEstimate ? (
                  <Typography variant='body2' color='text.secondary' fontWeight={500}>
                    You’ll pay{' '}
                    <strong style={{ color: theme.palette.primary.main }}>
                      {parseFloat(cryptoEstimate.estimated_amount).toFixed(6)}{' '}
                      {cryptoEstimate.currency_to.toUpperCase()}
                    </strong>{' '}
                    for your order of{' '}
                    <strong style={{ color: theme.palette.primary.main }}>
                      ${parseFloat(cartTotal).toFixed(2)} USD
                    </strong>{' '}
                    (all fees included).
                  </Typography>
                ) : (
                  <Skeleton variant='text' width='80%' height={'auto'} sx={{ mx: 'auto' }} />
                )}
              </Box>

              {/* Info notice */}
              <Box
                sx={{
                  border: `1px solid ${theme.palette.info.main}`,
                  color: theme.palette.info.main,
                  borderRadius: 1.5,
                  p: 3,
                  mb: 5
                }}
              >
                <Box display='flex' alignItems='flex-start'>
                  <InfoOutlinedIcon />
                  <Typography variant='body2' sx={{ color: theme.palette.info.main, pl: 1, py: 0.5 }}>
                    The minimum recharge amount is <strong>15€</strong> for most payment methods, while{' '}
                    <strong>BTC</strong> and <strong>USDT-TRC20</strong> require <strong>40€</strong>.
                  </Typography>
                </Box>
              </Box>
              {/* Minimum Amount */}
              {/* {minAmountInfo && (
                  <Box mt={2} px={2} py={1.5} border={`1px solid ${theme.palette.divider}`} borderRadius={2}>
                    <Box display='flex' justifyContent='space-between' alignItems='center'>
                      <Typography variant='body2' color='text.secondary'>
                        Minimum required to proceed
                      </Typography>
                      <Box textAlign='right'>
                        <Typography variant='h6' color='text.primary'>
                          {minAmountInfo.min_amount} {minAmountInfo.currency_from.toUpperCase()}
                        </Typography>
                        {minAmountInfo.fiat_equivalent && (
                          <Typography variant='caption' color='text.secondary'>
                            ≈ ${minAmountInfo.fiat_equivalent.toFixed(2)} USD
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </Box>
                )} */}

              {/* Network Fee */}
              {minAmountInfo?.network_fee !== undefined && (
                <Box mt={2} px={2} py={1.5} border={`1px solid ${theme.palette.divider}`} borderRadius={2}>
                  <Box display='flex' justifyContent='space-between' alignItems='center'>
                    <Typography variant='body2' color='text.secondary'>
                      Network fee
                    </Typography>
                    <Typography variant='h6' color='text.secondary'>
                      {minAmountInfo.network_fee} {minAmountInfo.currency_from.toUpperCase()}
                    </Typography>
                  </Box>
                </Box>
              )}

              {/* Popular coins display */}
              {popularCurrencies.length > 0 && (
                <Box display='flex' gap={2} flexWrap='wrap' justifyContent='start' mb={6}>
                  {popularCurrencies.map(currency => (
                    <Box
                      key={currency.id}
                      onClick={() => {
                        if (!isBelowMin) setSelectedCoin(currency)
                      }}
                      sx={{
                        cursor: isBelowMin ? 'not-allowed' : 'pointer',
                        px: 3,
                        py: 1.5,
                        backgroundColor: '#fff',
                        opacity: isBelowMin ? 0.5 : 1,

                        borderRadius: selectedCoin?.code === currency.code ? 1 : 3,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        boxShadow:
                          selectedCoin?.code === currency.code
                            ? `0 0 0 2px ${theme.palette.primary.main}`
                            : `0 0 0 1px ${theme.palette.divider}`
                      }}
                    >
                      <img
                        src={`${ICON_BASE_URL}${currency.logo_url}`}
                        alt={currency.name}
                        style={{ width: 28, height: 28 }}
                      />
                      <Box sx={{ px: 1 }}>
                        <Typography sx={{ color: 'black', fontWeight: '900', fontSize: 18 }}>
                          {formatCurrencyCode(currency)}
                        </Typography>
                        <Typography sx={{ color: 'black', fontSize: 11 }}>*BitCall.io</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              )}

              {/* Coin/Network Autocompletes (optional fallback) */}
              <Autocomplete
                options={uniqueCoins}
                value={selectedCoin}
                onChange={(e, v) => setSelectedCoin(v)}
                getOptionLabel={option => option.name}
                renderOption={(props, option) => (
                  <Box component='li' {...props} display='flex' alignItems='center'>
                    <img
                      src={`${ICON_BASE_URL}${option.logo_url}`}
                      alt={option.code}
                      style={{ width: 22, height: 22, marginRight: 10 }}
                    />
                    <Typography color='text.primary' fontWeight='bold'>
                      {option.name} ({formatCurrencyCode(option)})
                    </Typography>
                  </Box>
                )}
                renderInput={params => <TextField {...params} label='Select Coin' fullWidth />}
                renderTags={(value, getTagProps) =>
                  value ? (
                    <Box display='flex' alignItems='center' gap={1}>
                      <img
                        src={`${ICON_BASE_URL}${value.logo_url}`}
                        alt={value.code}
                        style={{ width: 20, height: 20 }}
                      />
                      <Typography fontWeight='bold'>{value.name}</Typography>
                    </Box>
                  ) : null
                }
                isOptionEqualToValue={(option, value) => option.id === value.id}
                sx={{ mb: 3 }}
              />

              {selectedCoin && (
                <Autocomplete
                  options={networkOptions}
                  getOptionLabel={option => option.network?.toUpperCase() || 'Default'}
                  value={selectedNetwork}
                  onChange={(e, v) => setSelectedNetwork(v)}
                  renderInput={params => <TextField {...params} label='Select Network' fullWidth />}
                />
              )}
            </>
          )}
          {/* Step 2: Show readonly Amount */}
          {/* {stepIndex === 1 && (
              <Box>
                <Typography variant='h6' gutterBottom>
                  Review Payment Amount
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant='body1' sx={{ mb: 1 }}>
                  Total Amount to Pay:
                </Typography>
                <Typography variant='h5' color='primary'>
                  {parseFloat(cartTotal).toFixed(2)} USD
                </Typography>
              </Box>
            )} */}
          {/* Step 3: Show QR Code & Invoice Info */}
          {stepIndex === 1 && invoiceData && (
            <Box display='flex' flexDirection={{ xs: 'column', md: 'row' }} gap={{ xs: 4, md: 6 }} mt={2}>
              {/* QR Code */}
              <Box flexShrink={0} display='flex' justifyContent='center' alignItems='center'>
                <img src={qrCodeImage} alt='QR Code' width={180} height={180} />
              </Box>

              {/* Payment Details */}
              <Box flex={1}>
                {/* Status row */}
                <Box mb={3} sx={{ mt: 4 }} display='flex' alignItems='center' gap={2}>
                  <Box
                    sx={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      px: 2,
                      py: 1,
                      borderRadius: 999,
                      bgcolor: theme.palette.warning.light,
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.8rem'
                    }}
                  >
                    <InfoOutlinedIcon fontSize='small' sx={{ mr: 1 }} />
                    Waiting
                  </Box>
                  <Box display='flex' alignItems='center' gap={1}>
                    <CircularProgress size={16} color='primary' />
                    <Typography variant='body2' color='text.secondary'>
                      updating in {confirmCountdown}s
                    </Typography>
                  </Box>
                </Box>

                {/* Amount */}
                <Box mb={2}>
                  <Typography variant='body1' sx={{ fontWeight: 600, fontSize: '1.25rem', color: 'primary.main' }}>
                    {invoiceData.pay_amount} {invoiceData.pay_currency?.toUpperCase()}
                  </Typography>
                </Box>

                {/* Wallet Address */}
                <Box mb={2}>
                  <Typography variant='body1' sx={{ wordBreak: 'break-all', fontWeight: 'bold', fontSize: '1rem' }}>
                    Wallet address:
                  </Typography>
                  <Box
                    display='flex'
                    alignItems='center'
                    justifyContent='space-between'
                    px={2}
                    py={1}
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 2,
                      backgroundColor: theme.palette.background.paper
                    }}
                  >
                    <Typography variant='body2' sx={{ wordBreak: 'break-all' }}>
                      {invoiceData.pay_address}
                    </Typography>
                    <Box
                      display='flex'
                      alignItems='center'
                      sx={{ mr: 1, cursor: 'pointer' }}
                      onClick={() => {
                        navigator.clipboard.writeText(invoiceData.pay_address)
                        toast.success('Copied!')
                      }}
                    >
                      <IconButton size='small'>
                        <ContentCopyIcon fontSize='small' />
                      </IconButton>
                      <Typography variant='body2' sx={{ ml: 0.5 }}>
                        Copy
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Invoice URL */}
                <Box mb={2}>
                  <Box mb={2}>
                    <Typography variant='body1' sx={{ wordBreak: 'break-all', fontWeight: 'bold', fontSize: '1rem' }}>
                      Invoice URL:
                    </Typography>
                    <Box
                      display='flex'
                      alignItems='center'
                      justifyContent='space-between'
                      px={2}
                      py={1}
                      sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                        backgroundColor: theme.palette.background.paper
                      }}
                    >
                      <Typography variant='body2' sx={{ wordBreak: 'break-all' }}>
                        {cryptoInvoiceUrl}
                      </Typography>
                      <Box
                        display='flex'
                        alignItems='center'
                        sx={{ cursor: 'pointer', ml: 1 }}
                        onClick={() => {
                          navigator.clipboard.writeText(cryptoInvoiceUrl || '')
                          toast.success('Copied!')
                        }}
                      >
                        <IconButton size='small'>
                          <ContentCopyIcon fontSize='small' />
                        </IconButton>
                        <Typography variant='body2' sx={{ ml: 0.5 }}>
                          Copy
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>

                {/* Network */}
                <Box mb={2}>
                  <Typography variant='body2' color='text.secondary'>
                    <strong>Network:</strong>{' '}
                    {invoiceData.network?.toUpperCase() || selectedNetwork?.network?.toUpperCase()}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant='body2' color='text.secondary'>
                    <strong>Expires in:</strong> {timeLeft}
                  </Typography>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </>
    )
  }
)

export default EmbeddedNowPaymentsPaymentForm
